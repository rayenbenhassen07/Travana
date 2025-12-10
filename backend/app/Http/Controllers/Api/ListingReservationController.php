<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ListingReservation;
use App\Mail\ReservationConfirmation;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Mail;

class ListingReservationController extends Controller
{
    /**
     * @OA\Get(
     *     path="/listing-reservations",
     *     summary="Get all listing reservations",
     *     description="Retrieve a list of all reservations with optional date range filtering",
     *     operationId="getListingReservations",
     *     tags={"Listing Reservations"},
     *     @OA\Parameter(name="listing_id", in="query", description="Filter by listing ID", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="start_date", in="query", description="Start date for filtering (YYYY-MM-DD)", @OA\Schema(type="string", format="date")),
     *     @OA\Parameter(name="end_date", in="query", description="End date for filtering (YYYY-MM-DD)", @OA\Schema(type="string", format="date")),
     *     @OA\Parameter(name="is_blocked", in="query", description="Filter by blocked status", @OA\Schema(type="boolean")),
     *     @OA\Response(
     *         response=200,
     *         description="List of reservations",
     *         @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/ListingReservation"))
     *     ),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function index(Request $request)
    {
        try {
            $query = ListingReservation::with(['user', 'listing', 'currency'])->orderBy('start_date', 'desc');
            
            // Filter by listing_id
            if ($request->has('listing_id')) {
                $query->where('listing_id', $request->input('listing_id'));
            }

            // Filter by is_blocked
            if ($request->has('is_blocked')) {
                $query->where('is_blocked', filter_var($request->input('is_blocked'), FILTER_VALIDATE_BOOLEAN));
            }
            
            // Optional date range filtering for calendar view
            if ($request->has('start_date') && $request->has('end_date')) {
                $startDate = $request->input('start_date');
                $endDate = $request->input('end_date');
                
                // Get reservations that overlap with the requested date range
                $query->where(function ($q) use ($startDate, $endDate) {
                    $q->where(function ($subQ) use ($startDate, $endDate) {
                        // Reservation starts within the range
                        $subQ->whereBetween('start_date', [$startDate, $endDate]);
                    })
                    ->orWhere(function ($subQ) use ($startDate, $endDate) {
                        // Reservation ends within the range
                        $subQ->whereBetween('end_date', [$startDate, $endDate]);
                    })
                    ->orWhere(function ($subQ) use ($startDate, $endDate) {
                        // Reservation spans the entire range
                        $subQ->where('start_date', '<=', $startDate)
                            ->where('end_date', '>=', $endDate);
                    });
                });
            }
            
            $reservations = $query->get();
            return response()->json($reservations);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch reservations'], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/listing-reservations",
     *     summary="Create a new listing reservation",
     *     description="Create a new booking reservation with overlap checking. When is_blocked is true, only listing_id, user_id, start_date, end_date, and nights are required.",
     *     operationId="createListingReservation",
     *     tags={"Listing Reservations"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"listing_id", "user_id", "start_date", "end_date", "nights"},
     *             @OA\Property(property="listing_id", type="integer", example=1),
     *             @OA\Property(property="user_id", type="integer", example=1),
     *             @OA\Property(property="start_date", type="string", format="date", example="2025-12-01"),
     *             @OA\Property(property="end_date", type="string", format="date", example="2025-12-07"),
     *             @OA\Property(property="is_blocked", type="boolean", example=false, description="If true, only listing_id, user_id, start_date, end_date, nights are required"),
     *             @OA\Property(property="name", type="string", example="John Doe", description="Required when is_blocked is false"),
     *             @OA\Property(property="phone", type="string", example="+1234567890", description="Required when is_blocked is false"),
     *             @OA\Property(property="email", type="string", format="email", example="john@example.com", description="Required when is_blocked is false"),
     *             @OA\Property(property="sex", type="string", enum={"male", "female"}, example="male", description="Required when is_blocked is false"),
     *             @OA\Property(property="client_type", type="string", enum={"family", "group", "one"}, example="family", description="Required when is_blocked is false"),
     *             @OA\Property(property="nights", type="integer", example=6),
     *             @OA\Property(property="total", type="number", format="float", example=750.00, description="Required when is_blocked is false"),
     *             @OA\Property(property="subtotal", type="number", format="float", example=700.00, description="Required when is_blocked is false"),
     *             @OA\Property(property="per_night", type="number", format="float", example=116.67, description="Required when is_blocked is false"),
     *             @OA\Property(property="service_fee", type="number", format="float", example=50.00, description="Required when is_blocked is false"),
     *             @OA\Property(property="currency_id", type="integer", example=1, description="Required when is_blocked is false")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Reservation created", @OA\JsonContent(ref="#/components/schemas/ListingReservation")),
     *     @OA\Response(response=422, description="Validation error or date overlap", @OA\JsonContent(ref="#/components/schemas/ValidationError")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function store(Request $request)
    {
        try {
            $isBlocked = filter_var($request->input('is_blocked', false), FILTER_VALIDATE_BOOLEAN);
            
            // Use dynamic validation rules based on is_blocked
            $rules = ListingReservation::validationRules($isBlocked);
            
            // Add additional validation for store (new records)
            if (!$isBlocked) {
                $rules['start_date'] = 'required|date|after_or_equal:today';
            }
            
            $validated = $request->validate($rules);

            // Check for overlapping reservations
            $overlapping = ListingReservation::where('listing_id', $validated['listing_id'])
                ->where(function ($query) use ($validated) {
                    $query->where(function ($q) use ($validated) {
                        $q->where('start_date', '<=', $validated['start_date'])
                          ->where('end_date', '>', $validated['start_date']);
                    })
                    ->orWhere(function ($q) use ($validated) {
                        $q->where('start_date', '<', $validated['end_date'])
                          ->where('end_date', '>=', $validated['end_date']);
                    })
                    ->orWhere(function ($q) use ($validated) {
                        $q->where('start_date', '>=', $validated['start_date'])
                          ->where('end_date', '<=', $validated['end_date']);
                    });
                })
                ->exists();

            if ($overlapping) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => [
                        'start_date' => ['These dates overlap with an existing reservation']
                    ]
                ], 422);
            }

            $reservation = ListingReservation::create($validated);
            $reservation->load(['user', 'listing', 'currency', 'listing.city']);
            
            // Send confirmation email
            try {
                Mail::to($reservation->email)->send(new ReservationConfirmation($reservation));
            } catch (\Exception $e) {
                // Log the error but don't fail the reservation
                \Log::error('Failed to send reservation confirmation email: ' . $e->getMessage());
            }
            
            return response()->json($reservation, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create reservation: ' . $e->getMessage()], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/listing-reservations/{id}",
     *     summary="Get a specific reservation",
     *     operationId="getListingReservation",
     *     tags={"Listing Reservations"},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Reservation details", @OA\JsonContent(ref="#/components/schemas/ListingReservation")),
     *     @OA\Response(response=404, description="Reservation not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function show($id)
    {
        try {
            $reservation = ListingReservation::with(['user', 'listing', 'currency'])->findOrFail($id);
            return response()->json($reservation);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Reservation not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch reservation'], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/listing-reservations/ref/{ref}",
     *     summary="Get a reservation by reference code",
     *     operationId="getListingReservationByRef",
     *     tags={"Listing Reservations"},
     *     @OA\Parameter(name="ref", in="path", required=true, description="Reservation reference code (e.g., RES-A1B2C3D4)", @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="Reservation details", @OA\JsonContent(ref="#/components/schemas/ListingReservation")),
     *     @OA\Response(response=404, description="Reservation not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function showByRef($ref)
    {
        try {
            $reservation = ListingReservation::with(['user', 'listing', 'currency'])
                ->where('ref', $ref)
                ->firstOrFail();
            return response()->json($reservation);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Reservation not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch reservation'], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/listing-reservations/{id}",
     *     summary="Update a reservation",
     *     description="Update an existing reservation with overlap checking",
     *     operationId="updateListingReservation",
     *     tags={"Listing Reservations"},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         @OA\JsonContent(
     *             @OA\Property(property="listing_id", type="integer"),
     *             @OA\Property(property="user_id", type="integer"),
     *             @OA\Property(property="start_date", type="string", format="date"),
     *             @OA\Property(property="end_date", type="string", format="date"),
     *             @OA\Property(property="is_blocked", type="boolean"),
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="phone", type="string"),
     *             @OA\Property(property="email", type="string", format="email"),
     *             @OA\Property(property="sex", type="string", enum={"male", "female"}),
     *             @OA\Property(property="client_type", type="string", enum={"family", "group", "one"}),
     *             @OA\Property(property="nights", type="integer"),
     *             @OA\Property(property="total", type="number", format="float"),
     *             @OA\Property(property="subtotal", type="number", format="float"),
     *             @OA\Property(property="per_night", type="number", format="float"),
     *             @OA\Property(property="service_fee", type="number", format="float"),
     *             @OA\Property(property="currency_id", type="integer")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Reservation updated", @OA\JsonContent(ref="#/components/schemas/ListingReservation")),
     *     @OA\Response(response=404, description="Reservation not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=422, description="Validation error or date overlap", @OA\JsonContent(ref="#/components/schemas/ValidationError")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function update(Request $request, $id)
    {
        try {
            $reservation = ListingReservation::findOrFail($id);
            
            // Determine is_blocked status (use request value or existing)
            $isBlocked = filter_var(
                $request->input('is_blocked', $reservation->is_blocked), 
                FILTER_VALIDATE_BOOLEAN
            );

            // Build update validation rules
            $validated = $request->validate([
                'listing_id' => 'sometimes|required|exists:listings,id',
                'user_id' => 'sometimes|required|exists:users,id',
                'start_date' => 'sometimes|required|date',
                'end_date' => 'sometimes|required|date|after_or_equal:start_date',
                'is_blocked' => 'sometimes|boolean',
                'name' => $isBlocked ? 'nullable|string|max:255' : 'sometimes|required|string|max:255',
                'phone' => $isBlocked ? 'nullable|string|max:50' : 'sometimes|required|string|max:50',
                'email' => $isBlocked ? 'nullable|email|max:255' : 'sometimes|required|email|max:255',
                'sex' => $isBlocked ? 'nullable|in:male,female' : 'sometimes|required|in:male,female',
                'client_type' => $isBlocked ? 'nullable|in:family,group,one' : 'sometimes|required|in:family,group,one',
                'nights' => 'sometimes|required|integer|min:1',
                'total' => $isBlocked ? 'nullable|numeric|min:0' : 'sometimes|required|numeric|min:0',
                'subtotal' => $isBlocked ? 'nullable|numeric|min:0' : 'sometimes|required|numeric|min:0',
                'per_night' => $isBlocked ? 'nullable|numeric|min:0' : 'sometimes|required|numeric|min:0',
                'service_fee' => $isBlocked ? 'nullable|numeric|min:0' : 'sometimes|required|numeric|min:0',
                'currency_id' => $isBlocked ? 'nullable|exists:currencies,id' : 'sometimes|required|exists:currencies,id',
            ]);

            // Check for overlapping reservations (excluding current one)
            if (isset($validated['start_date']) || isset($validated['end_date']) || isset($validated['listing_id'])) {
                $startDate = $validated['start_date'] ?? $reservation->start_date;
                $endDate = $validated['end_date'] ?? $reservation->end_date;
                $listingId = $validated['listing_id'] ?? $reservation->listing_id;

                $overlapping = ListingReservation::where('listing_id', $listingId)
                    ->where('id', '!=', $id)
                    ->where(function ($query) use ($startDate, $endDate) {
                        $query->where(function ($q) use ($startDate, $endDate) {
                            $q->where('start_date', '<=', $startDate)
                              ->where('end_date', '>', $startDate);
                        })
                        ->orWhere(function ($q) use ($startDate, $endDate) {
                            $q->where('start_date', '<', $endDate)
                              ->where('end_date', '>=', $endDate);
                        })
                        ->orWhere(function ($q) use ($startDate, $endDate) {
                            $q->where('start_date', '>=', $startDate)
                              ->where('end_date', '<=', $endDate);
                        });
                    })
                    ->exists();

                if ($overlapping) {
                    return response()->json([
                        'message' => 'Validation failed',
                        'errors' => [
                            'start_date' => ['These dates overlap with an existing reservation']
                        ]
                    ], 422);
                }
            }

            $reservation->update($validated);
            return response()->json($reservation->load(['user', 'listing', 'currency']));
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Reservation not found'], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update reservation'], 500);
        }
    }

    /**
     * @OA\Delete(
     *     path="/listing-reservations/{id}",
     *     summary="Delete a reservation",
     *     operationId="deleteListingReservation",
     *     tags={"Listing Reservations"},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Reservation deleted", @OA\JsonContent(@OA\Property(property="message", type="string"))),
     *     @OA\Response(response=404, description="Reservation not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function destroy($id)
    {
        try {
            $reservation = ListingReservation::findOrFail($id);
            $reservation->delete();
            return response()->json(['message' => 'Reservation deleted successfully']);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Reservation not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete reservation'], 500);
        }
    }
}
