<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogCategoryController extends Controller
{
    /**
     * @OA\Get(
     *     path="/blog-categories",
     *     summary="Get all blog categories",
     *     operationId="getBlogCategories",
     *     tags={"Blog Categories"},
     *     @OA\Parameter(name="active_only", in="query", description="Filter active only", @OA\Schema(type="boolean")),
     *     @OA\Parameter(name="all", in="query", description="Return all (no pagination)", @OA\Schema(type="boolean")),
     *     @OA\Parameter(name="per_page", in="query", @OA\Schema(type="integer", default=20)),
     *     @OA\Response(response=200, description="List of blog categories", @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/BlogCategory")))
     * )
     *
     * Display a listing of blog categories
     */
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

    /**
     * @OA\Post(
     *     path="/blog-categories",
     *     summary="Create a new blog category",
     *     operationId="createBlogCategory",
     *     tags={"Blog Categories"},
     *     security={{"sanctum": {}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name"},
     *             @OA\Property(property="name", type="string", maxLength=255),
     *             @OA\Property(property="slug", type="string", description="Auto-generated if not provided"),
     *             @OA\Property(property="description", type="string", nullable=true),
     *             @OA\Property(property="icon", type="string", maxLength=100),
     *             @OA\Property(property="color", type="string", maxLength=7, example="#3498db"),
     *             @OA\Property(property="meta_title", type="string", maxLength=255),
     *             @OA\Property(property="meta_description", type="string", maxLength=500),
     *             @OA\Property(property="is_active", type="boolean"),
     *             @OA\Property(property="order", type="integer")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Category created", @OA\JsonContent(@OA\Property(property="message", type="string"), @OA\Property(property="category", ref="#/components/schemas/BlogCategory"))),
     *     @OA\Response(response=401, description="Unauthenticated", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ValidationError"))
     * )
     *
     * Store a newly created category
     */
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

    /**
     * @OA\Get(
     *     path="/blog-categories/{identifier}",
     *     summary="Get a specific blog category",
     *     operationId="getBlogCategory",
     *     tags={"Blog Categories"},
     *     @OA\Parameter(name="identifier", in="path", required=true, description="Category ID or slug", @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="Category details", @OA\JsonContent(ref="#/components/schemas/BlogCategory")),
     *     @OA\Response(response=404, description="Category not found", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     *
     * Display the specified category
     */
    public function show(string $identifier)
    {
        $category = BlogCategory::withCount('blogs')
            ->where('id', $identifier)
            ->orWhere('slug', $identifier)
            ->firstOrFail();

        return response()->json($category);
    }

    /**
     * @OA\Put(
     *     path="/blog-categories/{id}",
     *     summary="Update a blog category",
     *     operationId="updateBlogCategory",
     *     tags={"Blog Categories"},
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(@OA\JsonContent(
     *         @OA\Property(property="name", type="string"),
     *         @OA\Property(property="slug", type="string"),
     *         @OA\Property(property="description", type="string"),
     *         @OA\Property(property="icon", type="string"),
     *         @OA\Property(property="color", type="string"),
     *         @OA\Property(property="meta_title", type="string"),
     *         @OA\Property(property="meta_description", type="string"),
     *         @OA\Property(property="is_active", type="boolean"),
     *         @OA\Property(property="order", type="integer")
     *     )),
     *     @OA\Response(response=200, description="Category updated", @OA\JsonContent(@OA\Property(property="message", type="string"), @OA\Property(property="category", ref="#/components/schemas/BlogCategory"))),
     *     @OA\Response(response=401, description="Unauthenticated", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=404, description="Category not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ValidationError"))
     * )
     *
     * Update the specified category
     */
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

    /**
     * @OA\Delete(
     *     path="/blog-categories/{id}",
     *     summary="Delete a blog category",
     *     operationId="deleteBlogCategory",
     *     tags={"Blog Categories"},
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Category deleted", @OA\JsonContent(@OA\Property(property="message", type="string"))),
     *     @OA\Response(response=401, description="Unauthenticated", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=404, description="Category not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=422, description="Cannot delete - has blogs", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     *
     * Remove the specified category
     */
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
