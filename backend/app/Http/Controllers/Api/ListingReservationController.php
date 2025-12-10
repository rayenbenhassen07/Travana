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
