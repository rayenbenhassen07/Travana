<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use Illuminate\Http\Request;

class CurrencyController extends Controller
{
    public function index()
    {
        try {
            $currencies = Currency::orderBy('name')->get();
            return response()->json($currencies);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch currencies'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'label' => 'required|string|max:10|unique:currencies,label',
                'symbol' => 'required|string|max:10',
                'exchange_rate' => 'required|numeric|min:0',
            ]);

            $currency = Currency::create($validated);
            return response()->json($currency, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create currency'], 500);
        }
    }

    public function show($id)
    {
        try {
            $currency = Currency::findOrFail($id);
            return response()->json($currency);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Currency not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch currency'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $currency = Currency::findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'label' => 'sometimes|required|string|max:10|unique:currencies,label,' . $id,
                'symbol' => 'sometimes|required|string|max:10',
                'exchange_rate' => 'sometimes|required|numeric|min:0',
            ]);

            $currency->update($validated);
            return response()->json($currency);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Currency not found'], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update currency'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $currency = Currency::findOrFail($id);
            $currency->delete();
            return response()->json(['message' => 'Currency deleted successfully']);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Currency not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete currency'], 500);
        }
    }
}
