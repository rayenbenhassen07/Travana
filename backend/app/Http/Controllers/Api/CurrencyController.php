<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use Illuminate\Http\Request;

class CurrencyController extends Controller
{
    /**
     * @OA\Get(
     *     path="/currencies",
     *     summary="Get all currencies",
     *     description="Retrieve a list of all available currencies",
     *     operationId="getCurrencies",
     *     tags={"Currencies"},
     *     @OA\Response(
     *         response=200,
     *         description="List of currencies",
     *         @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/Currency"))
     *     ),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function index()
    {
        try {
            $currencies = Currency::orderBy('name')->get();
            return response()->json($currencies);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch currencies'], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/currencies",
     *     summary="Create a new currency",
     *     description="Create a new currency with exchange rate",
     *     operationId="createCurrency",
     *     tags={"Currencies"},
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name", "label", "symbol", "exchange_rate"},
     *             @OA\Property(property="name", type="string", example="US Dollar"),
     *             @OA\Property(property="label", type="string", example="USD"),
     *             @OA\Property(property="symbol", type="string", example="$"),
     *             @OA\Property(property="exchange_rate", type="number", format="float", example=1.000000)
     *         )
     *     ),
     *     @OA\Response(response=201, description="Currency created", @OA\JsonContent(ref="#/components/schemas/Currency")),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ValidationError")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
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

    /**
     * @OA\Get(
     *     path="/currencies/{id}",
     *     summary="Get a specific currency",
     *     operationId="getCurrency",
     *     tags={"Currencies"},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Currency details", @OA\JsonContent(ref="#/components/schemas/Currency")),
     *     @OA\Response(response=404, description="Currency not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
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

    /**
     * @OA\Put(
     *     path="/currencies/{id}",
     *     summary="Update a currency",
     *     description="Update an existing currency",
     *     operationId="updateCurrency",
     *     tags={"Currencies"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string", example="US Dollar"),
     *             @OA\Property(property="label", type="string", example="USD"),
     *             @OA\Property(property="symbol", type="string", example="$"),
     *             @OA\Property(property="exchange_rate", type="number", format="float", example=1.000000)
     *         )
     *     ),
     *     @OA\Response(response=200, description="Currency updated", @OA\JsonContent(ref="#/components/schemas/Currency")),
     *     @OA\Response(response=404, description="Currency not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ValidationError")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
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

    /**
     * @OA\Delete(
     *     path="/currencies/{id}",
     *     summary="Delete a currency",
     *     operationId="deleteCurrency",
     *     tags={"Currencies"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Currency deleted", @OA\JsonContent(@OA\Property(property="message", type="string"))),
     *     @OA\Response(response=404, description="Currency not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
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
