<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ListingController extends Controller
{
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