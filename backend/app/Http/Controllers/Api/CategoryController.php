<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    /**
     * @OA\Get(
     *     path="/categories",
     *     summary="Get all categories",
     *     description="Retrieve a list of all categories with their listings count",
     *     operationId="getCategories",
     *     tags={"Categories"},
     *     @OA\Response(
     *         response=200,
     *         description="List of categories",
     *         @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/Category"))
     *     ),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function index()
    {
        try {
            $categories = Category::withCount('listings')->get();
            return response()->json($categories);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch categories'], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/categories",
     *     summary="Create a new category",
     *     description="Create a new listing category with optional logo upload",
     *     operationId="createCategory",
     *     tags={"Categories"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"title"},
     *                 @OA\Property(property="title", type="string", maxLength=255, example="Apartments"),
     *                 @OA\Property(property="description", type="string", nullable=true, example="Comfortable apartments"),
     *                 @OA\Property(property="logo", type="string", format="binary", description="Logo image file (jpeg,jpg,png,gif,svg, max 2MB)")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Category created successfully",
     *         @OA\JsonContent(ref="#/components/schemas/Category")
     *     ),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ValidationError")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255|unique:categories,title',
                'description' => 'nullable|string',
                'logo' => 'nullable|file|mimes:jpeg,jpg,png,gif,svg|max:2048',
            ]);

            $data = [
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
            ];

            // Handle logo upload
            if ($request->hasFile('logo')) {
                $logo = $request->file('logo');
                $filename = time() . '_' . $logo->getClientOriginalName();
                $path = $logo->storeAs('uploads/categories', $filename, 'public');
                $data['logo'] = $path;
            }

            $category = Category::create($data);
            $category->loadCount('listings');

            return response()->json($category, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create category'], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/categories/{id}",
     *     summary="Get a specific category",
     *     description="Retrieve a single category by ID",
     *     operationId="getCategory",
     *     tags={"Categories"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Category ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Category details",
     *         @OA\JsonContent(ref="#/components/schemas/Category")
     *     ),
     *     @OA\Response(response=404, description="Category not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function show($id)
    {
        try {
            $category = Category::withCount('listings')->findOrFail($id);
            return response()->json($category);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Category not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch category'], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/categories/{id}",
     *     summary="Update a category",
     *     description="Update an existing category (also supports POST with _method for file uploads)",
     *     operationId="updateCategory",
     *     tags={"Categories"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Category ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 @OA\Property(property="title", type="string", maxLength=255),
     *                 @OA\Property(property="description", type="string", nullable=true),
     *                 @OA\Property(property="logo", type="string", format="binary", description="New logo image")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Category updated successfully",
     *         @OA\JsonContent(ref="#/components/schemas/Category")
     *     ),
     *     @OA\Response(response=404, description="Category not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ValidationError")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function update(Request $request, $id)
    {
        try {
            $category = Category::findOrFail($id);

            $validated = $request->validate([
                'title' => [
                    'sometimes',
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('categories', 'title')->ignore($id),
                ],
                'description' => 'nullable|string',
                'logo' => 'nullable|file|mimes:jpeg,jpg,png,gif,svg|max:2048',
            ]);

            $data = [];
            
            if (isset($validated['title'])) {
                $data['title'] = $validated['title'];
            }
            
            if ($request->has('description')) {
                $data['description'] = $validated['description'] ?? null;
            }

            // Handle logo upload
            if ($request->hasFile('logo')) {
                // Delete old logo if exists
                if ($category->logo && Storage::disk('public')->exists($category->logo)) {
                    Storage::disk('public')->delete($category->logo);
                }

                $logo = $request->file('logo');
                $filename = time() . '_' . $logo->getClientOriginalName();
                $path = $logo->storeAs('uploads/categories', $filename, 'public');
                $data['logo'] = $path;
            }

            $category->update($data);
            $category->loadCount('listings');

            return response()->json($category);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Category not found'], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update category'], 500);
        }
    }

    /**
     * @OA\Delete(
     *     path="/categories/{id}",
     *     summary="Delete a category",
     *     description="Delete a category (only if no listings are associated)",
     *     operationId="deleteCategory",
     *     tags={"Categories"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Category ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Category deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Category deleted successfully")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Category not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=409, description="Cannot delete - has listings", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function destroy($id)
    {
        try {
            $category = Category::findOrFail($id);
            
            // Check if category is used by any listings
            $listingsCount = $category->listings()->count();
            if ($listingsCount > 0) {
                return response()->json([
                    'error' => "Cannot delete category with {$listingsCount} existing listing(s)"
                ], 409);
            }

            // Delete logo if exists
            if ($category->logo && Storage::disk('public')->exists($category->logo)) {
                Storage::disk('public')->delete($category->logo);
            }

            $category->delete();
            return response()->json(['message' => 'Category deleted successfully']);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Category not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete category'], 500);
        }
    }
}