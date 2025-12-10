<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    public function index()
    {
        try {
            $categories = Category::withCount('listings')->get();
            return response()->json($categories);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch categories'], 500);
        }
    }

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
