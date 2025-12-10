<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogTag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogTagController extends Controller
{
    /**
     * @OA\Get(
     *     path="/blog-tags",
     *     summary="Get all blog tags",
     *     operationId="getBlogTags",
     *     tags={"Blog Tags"},
     *     @OA\Parameter(name="search", in="query", description="Search by name", @OA\Schema(type="string")),
     *     @OA\Parameter(name="sort_by", in="query", @OA\Schema(type="string", default="usage_count")),
     *     @OA\Parameter(name="sort_order", in="query", @OA\Schema(type="string", enum={"asc", "desc"}, default="desc")),
     *     @OA\Parameter(name="all", in="query", description="Return all (no pagination)", @OA\Schema(type="boolean")),
     *     @OA\Parameter(name="per_page", in="query", @OA\Schema(type="integer", default=50)),
     *     @OA\Response(response=200, description="List of blog tags", @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/BlogTag")))
     * )
     *
     * Display a listing of blog tags
     */
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

    /**
     * @OA\Post(
     *     path="/blog-tags",
     *     summary="Create a new blog tag",
     *     operationId="createBlogTag",
     *     tags={"Blog Tags"},
     *     security={{"sanctum": {}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name"},
     *             @OA\Property(property="name", type="string", maxLength=255),
     *             @OA\Property(property="slug", type="string"),
     *             @OA\Property(property="description", type="string"),
     *             @OA\Property(property="color", type="string", maxLength=7, example="#e74c3c")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Tag created", @OA\JsonContent(@OA\Property(property="message", type="string"), @OA\Property(property="tag", ref="#/components/schemas/BlogTag"))),
     *     @OA\Response(response=401, description="Unauthenticated", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ValidationError"))
     * )
     *
     * Store a newly created tag
     */
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

    /**
     * @OA\Get(
     *     path="/blog-tags/{identifier}",
     *     summary="Get a specific blog tag",
     *     operationId="getBlogTag",
     *     tags={"Blog Tags"},
     *     @OA\Parameter(name="identifier", in="path", required=true, description="Tag ID or slug", @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="Tag details", @OA\JsonContent(ref="#/components/schemas/BlogTag")),
     *     @OA\Response(response=404, description="Tag not found", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     *
     * Display the specified tag
     */
    public function show(string $identifier)
    {
        $tag = BlogTag::withCount('blogs')
            ->where('id', $identifier)
            ->orWhere('slug', $identifier)
            ->firstOrFail();

        return response()->json($tag);
    }

    /**
     * @OA\Put(
     *     path="/blog-tags/{id}",
     *     summary="Update a blog tag",
     *     operationId="updateBlogTag",
     *     tags={"Blog Tags"},
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(@OA\JsonContent(
     *         @OA\Property(property="name", type="string"),
     *         @OA\Property(property="slug", type="string"),
     *         @OA\Property(property="description", type="string"),
     *         @OA\Property(property="color", type="string")
     *     )),
     *     @OA\Response(response=200, description="Tag updated", @OA\JsonContent(@OA\Property(property="message", type="string"), @OA\Property(property="tag", ref="#/components/schemas/BlogTag"))),
     *     @OA\Response(response=401, description="Unauthenticated", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=404, description="Tag not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ValidationError"))
     * )
     *
     * Update the specified tag
     */
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

    /**
     * @OA\Delete(
     *     path="/blog-tags/{id}",
     *     summary="Delete a blog tag",
     *     operationId="deleteBlogTag",
     *     tags={"Blog Tags"},
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Tag deleted", @OA\JsonContent(@OA\Property(property="message", type="string"))),
     *     @OA\Response(response=401, description="Unauthenticated", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=404, description="Tag not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=422, description="Cannot delete - has blogs", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     *
     * Remove the specified tag
     */
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

    /**
     * @OA\Get(
     *     path="/blog-tags/popular/list",
     *     summary="Get popular tags",
     *     operationId="getPopularBlogTags",
     *     tags={"Blog Tags"},
     *     @OA\Parameter(name="limit", in="query", @OA\Schema(type="integer", default=10)),
     *     @OA\Response(response=200, description="List of popular tags", @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/BlogTag")))
     * )
     *
     * Get popular tags
     */
    public function popular(Request $request)
    {
        $limit = $request->get('limit', 10);
        $tags = BlogTag::orderBy('usage_count', 'desc')
            ->limit($limit)
            ->get();

        return response()->json($tags);
    }
}
