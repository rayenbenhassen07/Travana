<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogTag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogTagController extends Controller
{
    public function index(Request $request)
    {
        $query = BlogTag::withCount('blogs');

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%");
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'usage_count');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination or all
        if ($request->get('all', false)) {
            $tags = $query->get();
        } else {
            $perPage = $request->get('per_page', 50);
            $tags = $query->paginate($perPage);
        }

        return response()->json($tags);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:blog_tags,slug',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:7', // Hex color
        ]);

        // Auto-generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $tag = BlogTag::create($validated);

        return response()->json([
            'message' => 'Blog tag created successfully',
            'tag' => $tag
        ], 201);
    }

    public function show(string $identifier)
    {
        $tag = BlogTag::withCount('blogs')
            ->where('id', $identifier)
            ->orWhere('slug', $identifier)
            ->firstOrFail();

        return response()->json($tag);
    }

    public function update(Request $request, string $id)
    {
        $tag = BlogTag::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|unique:blog_tags,slug,' . $id,
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:7',
        ]);

        $tag->update($validated);

        return response()->json([
            'message' => 'Blog tag updated successfully',
            'tag' => $tag
        ]);
    }

    public function destroy(string $id)
    {
        $tag = BlogTag::findOrFail($id);
        
        // Check if tag has blogs
        if ($tag->blogs()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete tag with associated blogs'
            ], 422);
        }

        $tag->delete();

        return response()->json([
            'message' => 'Blog tag deleted successfully'
        ]);
    }

    public function popular(Request $request)
    {
        $limit = $request->get('limit', 10);
        $tags = BlogTag::orderBy('usage_count', 'desc')
            ->limit($limit)
            ->get();

        return response()->json($tags);
    }
}
