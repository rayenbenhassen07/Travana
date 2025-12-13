<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PropertyAvailability;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PropertyAvailabilityController extends Controller
{
    public function index(Request $request, $propertyId)
    {
        try {
            $validated = $request->validate([
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
            ]);

            $availability = PropertyAvailability::where('property_id', $propertyId)
                ->whereBetween('date', [$validated['start_date'], $validated['end_date']])
                ->get();

            return response()->json($availability);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch availability: ' . $e->getMessage()], 500);
        }
    }

    public function store(Request $request, $propertyId)
    {
        try {
            $validated = $request->validate([
                'date' => 'required|date',
                'is_available' => 'required|boolean',
                'custom_price' => 'nullable|numeric',
                'notes' => 'nullable|string|max:500',
            ]);

            $availability = PropertyAvailability::updateOrCreate(
                [
                    'property_id' => $propertyId,
                    'date' => $validated['date'],
                ],
                [
                    'is_available' => $validated['is_available'],
                    'custom_price' => $validated['custom_price'] ?? null,
                    'notes' => $validated['notes'] ?? null,
                ]
            );

            return response()->json($availability, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to set availability: ' . $e->getMessage()], 500);
        }
    }

    public function bulkStore(Request $request, $propertyId)
    {
        try {
            $validated = $request->validate([
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
                'is_available' => 'required|boolean',
                'custom_price' => 'nullable|numeric',
                'notes' => 'nullable|string|max:500',
            ]);

            DB::beginTransaction();

            $startDate = Carbon::parse($validated['start_date']);
            $endDate = Carbon::parse($validated['end_date']);

            $dates = [];
            for ($date = $startDate; $date->lte($endDate); $date->addDay()) {
                $dates[] = [
                    'property_id' => $propertyId,
                    'date' => $date->format('Y-m-d'),
                    'is_available' => $validated['is_available'],
                    'custom_price' => $validated['custom_price'] ?? null,
                    'notes' => $validated['notes'] ?? null,
                ];
            }

            // Delete existing records for these dates
            PropertyAvailability::where('property_id', $propertyId)
                ->whereBetween('date', [$validated['start_date'], $validated['end_date']])
                ->delete();

            // Insert new records
            PropertyAvailability::insert($dates);

            DB::commit();

            return response()->json([
                'message' => 'Availability set successfully for date range',
                'count' => count($dates)
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to set bulk availability: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($propertyId, $date)
    {
        try {
            PropertyAvailability::where('property_id', $propertyId)
                ->where('date', $date)
                ->delete();

            return response()->json(['message' => 'Availability deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete availability: ' . $e->getMessage()], 500);
        }
    }
}
