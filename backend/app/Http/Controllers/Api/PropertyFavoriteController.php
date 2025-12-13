<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PropertyFavorite;
use Illuminate\Http\Request;

class PropertyFavoriteController extends Controller
{
    public function index(Request $request)
    {
        try {
            $userId = $request->user()->id;
            
            $favorites = PropertyFavorite::with(['property.translations', 'property.city', 'property.propertyType'])
                ->where('user_id', $userId)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($favorites);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch favorites: ' . $e->getMessage()], 500);
        }
    }

    public function toggle(Request $request)
    {
        try {
            $validated = $request->validate([
                'property_id' => 'required|exists:properties,id',
            ]);

            $userId = $request->user()->id;
            
            $favorite = PropertyFavorite::where('property_id', $validated['property_id'])
                ->where('user_id', $userId)
                ->first();

            if ($favorite) {
                $favorite->delete();
                return response()->json([
                    'message' => 'Property removed from favorites',
                    'is_favorited' => false
                ]);
            } else {
                PropertyFavorite::create([
                    'property_id' => $validated['property_id'],
                    'user_id' => $userId,
                    'created_at' => now(),
                ]);
                return response()->json([
                    'message' => 'Property added to favorites',
                    'is_favorited' => true
                ], 201);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to toggle favorite: ' . $e->getMessage()], 500);
        }
    }

    public function check(Request $request, $propertyId)
    {
        try {
            $userId = $request->user()->id;
            
            $isFavorited = PropertyFavorite::where('property_id', $propertyId)
                ->where('user_id', $userId)
                ->exists();

            return response()->json(['is_favorited' => $isFavorited]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to check favorite status: ' . $e->getMessage()], 500);
        }
    }
}
