<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ListingController extends Controller
{
    /**
     * @OA\Get(
     *     path="/listings",
     *     summary="Get all listings",
     *     description="Retrieve a paginated list of listings with filters",
     *     operationId="getListings",
     *     tags={"Listings"},
     *     @OA\Parameter(name="search", in="query", description="Search in title, description, address", @OA\Schema(type="string")),
     *     @OA\Parameter(name="city_id", in="query", description="Filter by city ID", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="city", in="query", description="Filter by city name", @OA\Schema(type="string")),
     *     @OA\Parameter(name="category_id", in="query", description="Filter by category", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="user_id", in="query", description="Filter by owner", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="min_price", in="query", description="Minimum price", @OA\Schema(type="number")),
     *     @OA\Parameter(name="max_price", in="query", description="Maximum price", @OA\Schema(type="number")),
     *     @OA\Parameter(name="guests", in="query", description="Minimum guest capacity", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="page", in="query", description="Page number", @OA\Schema(type="integer", default=1)),
     *     @OA\Parameter(name="limit", in="query", description="Items per page", @OA\Schema(type="integer", default=10)),
     *     @OA\Response(
     *         response=200,
     *         description="Paginated list of listings",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Listing")),
     *             @OA\Property(
     *                 property="pagination",
     *                 type="object",
     *                 @OA\Property(property="total", type="integer"),
     *                 @OA\Property(property="currentPage", type="integer"),
     *                 @OA\Property(property="totalPages", type="integer"),
     *                 @OA\Property(property="perPage", type="integer")
     *             )
     *         )
     *     ),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function index(Request $request)
    {
        try {
            $query = Listing::with(['user', 'category', 'city', 'facilities', 'alerts'])
                ->withCount('reservations');

            // Search
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('short_description', 'like', "%{$search}%")
                      ->orWhere('adresse', 'like', "%{$search}%");
                });
            }

            // Filters
            if ($request->has('city_id') && $request->city_id) {
                $query->where('city_id', $request->city_id);
            }

            // Filter by city name (for search from hero)
            if ($request->has('city') && $request->city) {
                $query->whereHas('city', function ($q) use ($request) {
                    $q->where('name', 'like', "%{$request->city}%");
                });
            }

            if ($request->has('category_id') && $request->category_id) {
                $query->where('category_id', $request->category_id);
            }

            if ($request->has('user_id') && $request->user_id) {
                $query->where('user_id', $request->user_id);
            }

            if ($request->has('min_price') && $request->min_price) {
                $query->where('price', '>=', $request->min_price);
            }

            if ($request->has('max_price') && $request->max_price) {
                $query->where('price', '<=', $request->max_price);
            }

            // Filter by minimum guest capacity
            if ($request->has('guests') && $request->guests) {
                $query->where('guest_count', '>=', $request->guests);
            }

            // Pagination
            $page = $request->get('page', 1);
            $limit = $request->get('limit', 10);
            
            $total = $query->count();
            $listings = $query->skip(($page - 1) * $limit)
                ->take($limit)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'data' => $listings,
                'pagination' => [
                    'total' => $total,
                    'currentPage' => (int) $page,
                    'totalPages' => ceil($total / $limit),
                    'perPage' => (int) $limit,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch listings'], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/listings",
     *     summary="Create a new listing",
     *     description="Create a new property listing with images, facilities, and alerts",
     *     operationId="createListing",
     *     tags={"Listings"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"title", "category_id", "city_id", "user_id", "price"},
     *                 @OA\Property(property="title", type="string", maxLength=255, example="Beautiful Beach House"),
     *                 @OA\Property(property="short_description", type="string", maxLength=500),
     *                 @OA\Property(property="long_description", type="string"),
     *                 @OA\Property(property="images[]", type="array", @OA\Items(type="string", format="binary"), description="Property images (max 5MB each)"),
     *                 @OA\Property(property="category_id", type="integer", example=1),
     *                 @OA\Property(property="room_count", type="integer", minimum=1),
     *                 @OA\Property(property="bathroom_count", type="integer", minimum=1),
     *                 @OA\Property(property="guest_count", type="integer", minimum=1),
     *                 @OA\Property(property="bed_count", type="integer", minimum=1),
     *                 @OA\Property(property="city_id", type="integer", example=1),
     *                 @OA\Property(property="adresse", type="string"),
     *                 @OA\Property(property="user_id", type="integer", example=1),
     *                 @OA\Property(property="price", type="number", minimum=0, example=150.00),
     *                 @OA\Property(property="lat", type="number", minimum=-90, maximum=90),
     *                 @OA\Property(property="long", type="number", minimum=-180, maximum=180),
     *                 @OA\Property(property="facilities[]", type="array", @OA\Items(type="integer"), description="Array of facility IDs"),
     *                 @OA\Property(property="alerts[]", type="array", @OA\Items(type="integer"), description="Array of alert IDs")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Listing created successfully",
     *         @OA\JsonContent(ref="#/components/schemas/Listing")
     *     ),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ValidationError")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'short_description' => 'nullable|string|max:500',
                'long_description' => 'nullable|string',
                'images' => 'nullable|array',
                'images.*' => 'file|mimes:jpeg,jpg,png,gif|max:5120',
                'category_id' => 'required|exists:categories,id',
                'room_count' => 'nullable|integer|min:1',
                'bathroom_count' => 'nullable|integer|min:1',
                'guest_count' => 'nullable|integer|min:1',
                'bed_count' => 'nullable|integer|min:1',
                'city_id' => 'required|exists:cities,id',
                'adresse' => 'nullable|string',
                'user_id' => 'required|exists:users,id',
                'price' => 'required|numeric|min:0',
                'lat' => 'nullable|numeric|between:-90,90',
                'long' => 'nullable|numeric|between:-180,180',
                'facilities' => 'nullable|array',
                'facilities.*' => 'exists:facilities,id',
                'alerts' => 'nullable|array',
                'alerts.*' => 'exists:alerts,id',
            ]);

            // Handle image uploads
            $imagePaths = [];
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                    $path = $image->storeAs('uploads/listings', $filename, 'public');
                    $imagePaths[] = $path;
                }
            }

            $listingData = $validated;
            $listingData['images'] = $imagePaths;
            
            $listing = Listing::create(collect($listingData)->except(['facilities', 'alerts'])->toArray());

            // Attach facilities and alerts
            if ($request->has('facilities')) {
                $listing->facilities()->attach($request->facilities);
            }
            if ($request->has('alerts')) {
                $listing->alerts()->attach($request->alerts);
            }

            return response()->json($listing->load(['user', 'category', 'city', 'facilities', 'alerts']), 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create listing: ' . $e->getMessage()], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/listings/{id}",
     *     summary="Get a specific listing",
     *     description="Retrieve a single listing with all related data",
     *     operationId="getListing",
     *     tags={"Listings"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Listing ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Listing details",
     *         @OA\JsonContent(ref="#/components/schemas/Listing")
     *     ),
     *     @OA\Response(response=404, description="Listing not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function show($id)
    {
        try {
            $listing = Listing::with(['user', 'category', 'city', 'facilities', 'alerts', 'reservations'])->findOrFail($id);
            return response()->json($listing);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Listing not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch listing'], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/listings/{id}",
     *     summary="Update a listing",
     *     description="Update an existing listing (also supports POST with _method for file uploads)",
     *     operationId="updateListing",
     *     tags={"Listings"},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 @OA\Property(property="title", type="string", maxLength=255),
     *                 @OA\Property(property="short_description", type="string"),
     *                 @OA\Property(property="long_description", type="string"),
     *                 @OA\Property(property="images[]", type="array", @OA\Items(type="string", format="binary")),
     *                 @OA\Property(property="existing_images[]", type="array", @OA\Items(type="string"), description="Existing image paths to keep"),
     *                 @OA\Property(property="category_id", type="integer"),
     *                 @OA\Property(property="room_count", type="integer"),
     *                 @OA\Property(property="bathroom_count", type="integer"),
     *                 @OA\Property(property="guest_count", type="integer"),
     *                 @OA\Property(property="bed_count", type="integer"),
     *                 @OA\Property(property="city_id", type="integer"),
     *                 @OA\Property(property="adresse", type="string"),
     *                 @OA\Property(property="user_id", type="integer"),
     *                 @OA\Property(property="price", type="number"),
     *                 @OA\Property(property="lat", type="number"),
     *                 @OA\Property(property="long", type="number"),
     *                 @OA\Property(property="facilities[]", type="array", @OA\Items(type="integer")),
     *                 @OA\Property(property="alerts[]", type="array", @OA\Items(type="integer"))
     *             )
     *         )
     *     ),
     *     @OA\Response(response=200, description="Listing updated", @OA\JsonContent(ref="#/components/schemas/Listing")),
     *     @OA\Response(response=404, description="Listing not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ValidationError")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function update(Request $request, $id)
    {
        try {
            $listing = Listing::findOrFail($id);

            $validated = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'short_description' => 'nullable|string|max:500',
                'long_description' => 'nullable|string',
                'images' => 'nullable|array',
                'images.*' => 'file|mimes:jpeg,jpg,png,gif|max:5120',
                'existing_images' => 'nullable|array',
                'category_id' => 'sometimes|required|exists:categories,id',
                'room_count' => 'nullable|integer|min:1',
                'bathroom_count' => 'nullable|integer|min:1',
                'guest_count' => 'nullable|integer|min:1',
                'bed_count' => 'nullable|integer|min:1',
                'city_id' => 'sometimes|required|exists:cities,id',
                'adresse' => 'nullable|string',
                'user_id' => 'sometimes|required|exists:users,id',
                'price' => 'sometimes|required|numeric|min:0',
                'lat' => 'nullable|numeric|between:-90,90',
                'long' => 'nullable|numeric|between:-180,180',
                'facilities' => 'nullable|array',
                'facilities.*' => 'exists:facilities,id',
                'alerts' => 'nullable|array',
                'alerts.*' => 'exists:alerts,id',
            ]);

            // Handle image uploads
            $imagePaths = $request->get('existing_images', []);
            
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                    $path = $image->storeAs('uploads/listings', $filename, 'public');
                    $imagePaths[] = $path;
                }
            }

            // Delete removed images
            $oldImages = $listing->images ?? [];
            $removedImages = array_diff($oldImages, $imagePaths);
            foreach ($removedImages as $image) {
                if (Storage::disk('public')->exists($image)) {
                    Storage::disk('public')->delete($image);
                }
            }

            $listingData = $validated;
            $listingData['images'] = $imagePaths;

            $listing->update(collect($listingData)->except(['facilities', 'alerts', 'existing_images'])->toArray());

            // Sync facilities and alerts
            if ($request->has('facilities')) {
                $listing->facilities()->sync($request->facilities);
            }
            if ($request->has('alerts')) {
                $listing->alerts()->sync($request->alerts);
            }

            return response()->json($listing->load(['user', 'category', 'city', 'facilities', 'alerts']));
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Listing not found'], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update listing: ' . $e->getMessage()], 500);
        }
    }

    /**
     * @OA\Delete(
     *     path="/listings/{id}",
     *     summary="Delete a listing",
     *     description="Delete a listing (only if no reservations exist)",
     *     operationId="deleteListing",
     *     tags={"Listings"},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(
     *         response=200,
     *         description="Listing deleted successfully",
     *         @OA\JsonContent(@OA\Property(property="message", type="string", example="Listing deleted successfully"))
     *     ),
     *     @OA\Response(response=404, description="Listing not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=409, description="Cannot delete - has reservations", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function destroy($id)
    {
        try {
            $listing = Listing::findOrFail($id);
            
            // Check if listing has reservations
            $reservationsCount = $listing->reservations()->count();
            if ($reservationsCount > 0) {
                return response()->json([
                    'error' => "Cannot delete listing with {$reservationsCount} existing reservation(s)"
                ], 409);
            }

            // Delete images
            if ($listing->images) {
                foreach ($listing->images as $image) {
                    if (Storage::disk('public')->exists($image)) {
                        Storage::disk('public')->delete($image);
                    }
                }
            }

            $listing->delete();
            return response()->json(['message' => 'Listing deleted successfully']);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Listing not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete listing'], 500);
        }
    }
}