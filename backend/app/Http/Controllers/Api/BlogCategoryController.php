<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogCategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = BlogCategory::withCount('blogs');

        // Filter active only
        if ($request->get('active_only', false)) {
            $query->active();
        }

        // Sorting
        $query->ordered();

        // Pagination or all
        if ($request->get('all', false)) {
            $categories = $query->get();
        } else {
            $perPage = $request->get('per_page', 20);
            $categories = $query->paginate($perPage);
        }

        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:blog_categories,slug',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:100',
            'color' => 'nullable|string|max:7', // Hex color
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer',
        ]);

        // Auto-generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $category = BlogCategory::create($validated);

        return response()->json([
            'message' => 'Blog category created successfully',
            'category' => $category
        ], 201);
    }

    public function show(string $identifier)
    {
        $category = BlogCategory::withCount('blogs')
            ->where('id', $identifier)
            ->orWhere('slug', $identifier)
            ->firstOrFail();

        return response()->json($category);
    }

    public function update(Request $request, string $id)
    {
        $category = BlogCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|unique:blog_categories,slug,' . $id,
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:100',
            'color' => 'nullable|string|max:7',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer',
        ]);

        $category->update($validated);

        return response()->json([
            'message' => 'Blog category updated successfully',
            'category' => $category
        ]);
    }

    public function destroy(string $id)
    {
        $category = BlogCategory::findOrFail($id);
        
        // Check if category has blogs
        if ($category->blogs()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete category with associated blogs'
            ], 422);
        }

        $category->delete();

        return response()->json([
            'message' => 'Blog category deleted successfully'
        ]);
    }
}
