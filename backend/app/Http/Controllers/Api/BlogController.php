<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    /**
     * @OA\Get(
     *     path="/blogs",
     *     summary="Get all blogs",
     *     description="Retrieve a paginated list of blogs with filtering, search and sorting",
     *     operationId="getBlogs",
     *     tags={"Blogs"},
     *     @OA\Parameter(name="search", in="query", description="Search in title, excerpt, content", @OA\Schema(type="string")),
     *     @OA\Parameter(name="status", in="query", description="Filter by status", @OA\Schema(type="string", enum={"published", "draft", "scheduled"})),
     *     @OA\Parameter(name="category", in="query", description="Filter by category slug", @OA\Schema(type="string")),
     *     @OA\Parameter(name="tag", in="query", description="Filter by tag slug", @OA\Schema(type="string")),
     *     @OA\Parameter(name="author_id", in="query", description="Filter by author ID", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="featured", in="query", description="Filter featured only", @OA\Schema(type="boolean")),
     *     @OA\Parameter(name="sort_by", in="query", description="Sort field", @OA\Schema(type="string", default="published_at")),
     *     @OA\Parameter(name="sort_order", in="query", description="Sort direction", @OA\Schema(type="string", enum={"asc", "desc"}, default="desc")),
     *     @OA\Parameter(name="per_page", in="query", description="Items per page", @OA\Schema(type="integer", default=15)),
     *     @OA\Response(
     *         response=200,
     *         description="Paginated list of blogs",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Blog")),
     *             @OA\Property(property="current_page", type="integer"),
     *             @OA\Property(property="last_page", type="integer"),
     *             @OA\Property(property="per_page", type="integer"),
     *             @OA\Property(property="total", type="integer")
     *         )
     *     )
     * )
     *
     * Display a listing of blogs with filtering, pagination and search
     */
    public function index(Request $request)
    {
        $query = Blog::with(['author', 'categories', 'tags'])->withCount('likes');

        // Search by title, excerpt, or content
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        // Filter by publishing status
        if ($request->has('status')) {
            switch ($request->status) {
                case 'published':
                    $query->published();
                    break;
                case 'draft':
                    $query->draft();
                    break;
                case 'scheduled':
                    $query->scheduled();
                    break;
            }
        }

        // Filter by category
        if ($request->has('category')) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Filter by tag
        if ($request->has('tag')) {
            $query->whereHas('tags', function ($q) use ($request) {
                $q->where('slug', $request->tag);
            });
        }

        // Filter by author
        if ($request->has('author_id')) {
            $query->where('author_id', $request->author_id);
        }

        // Filter featured
        if ($request->has('featured')) {
            $query->featured();
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'published_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $blogs = $query->paginate($perPage);

        return response()->json($blogs);
    }

    /**
     * @OA\Post(
     *     path="/blogs",
     *     summary="Create a new blog",
     *     description="Create a new blog post (requires authentication)",
     *     operationId="createBlog",
     *     tags={"Blogs"},
     *     security={{"sanctum": {}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"title", "content", "author_id"},
     *                 @OA\Property(property="title", type="string", maxLength=255),
     *                 @OA\Property(property="slug", type="string", description="Auto-generated if not provided"),
     *                 @OA\Property(property="excerpt", type="string"),
     *                 @OA\Property(property="content", type="string"),
     *                 @OA\Property(property="main_image", type="string", format="binary", description="Max 5MB"),
     *                 @OA\Property(property="thumbnail", type="string", format="binary", description="Max 2MB"),
     *                 @OA\Property(property="author_id", type="integer"),
     *                 @OA\Property(property="category_ids[]", type="array", @OA\Items(type="integer")),
     *                 @OA\Property(property="tag_ids[]", type="array", @OA\Items(type="integer")),
     *                 @OA\Property(property="meta_title", type="string", maxLength=255),
     *                 @OA\Property(property="meta_description", type="string", maxLength=500),
     *                 @OA\Property(property="meta_keywords", type="string"),
     *                 @OA\Property(property="published_at", type="string", format="date-time", description="NULL=draft, future=scheduled, past=published"),
     *                 @OA\Property(property="is_featured", type="boolean"),
     *                 @OA\Property(property="allow_comments", type="boolean"),
     *                 @OA\Property(property="order", type="integer")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Blog created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="blog", ref="#/components/schemas/Blog")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ValidationError"))
     * )
     *
     * Store a newly created blog
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:blogs,slug',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'main_image' => 'nullable|image|max:5120', // 5MB
            'thumbnail' => 'nullable|image|max:2048', // 2MB
            'author_id' => 'required|exists:users,id',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:blog_categories,id',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:blog_tags,id',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'meta_keywords' => 'nullable|string',
            'published_at' => 'nullable|date', // NULL = draft, future = scheduled, past/now = published
            'is_featured' => 'nullable|boolean',
            'allow_comments' => 'nullable|boolean',
            'order' => 'nullable|integer',
        ]);

        // Handle main image upload
        if ($request->hasFile('main_image')) {
            $validated['main_image'] = $request->file('main_image')
                ->store('blogs/images', 'public');
        }

        // Handle thumbnail upload
        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')
                ->store('blogs/thumbnails', 'public');
        }

        // Auto-generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        // Create blog
        $blog = Blog::create($validated);

        // Attach categories
        if (!empty($validated['category_ids'])) {
            $blog->categories()->sync($validated['category_ids']);
        }

        // Attach tags
        if (!empty($validated['tag_ids'])) {
            $blog->tags()->sync($validated['tag_ids']);
        }

        return response()->json([
            'message' => 'Blog created successfully',
            'blog' => $blog->load(['author', 'categories', 'tags'])
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/blogs/{identifier}",
     *     summary="Get a specific blog",
     *     description="Retrieve a single blog by ID or slug. Increments view count.",
     *     operationId="getBlog",
     *     tags={"Blogs"},
     *     @OA\Parameter(name="identifier", in="path", required=true, description="Blog ID or slug", @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="Blog details", @OA\JsonContent(ref="#/components/schemas/Blog")),
     *     @OA\Response(response=404, description="Blog not found", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     *
     * Display the specified blog by slug or ID
     */
    public function show(string $identifier)
    {
        $blog = Blog::with(['author', 'categories', 'tags'])
            ->withCount('likes')
            ->where(function ($query) use ($identifier) {
                // Try to find by ID if numeric, otherwise by slug
                if (is_numeric($identifier)) {
                    $query->where('id', $identifier);
                } else {
                    $query->where('slug', $identifier);
                }
            })
            ->firstOrFail();

        // Increment views
        $blog->incrementViews();

        return response()->json($blog);
    }

    /**
     * @OA\Put(
     *     path="/blogs/{id}",
     *     summary="Update a blog",
     *     description="Update an existing blog (requires authentication). Also supports POST with _method.",
     *     operationId="updateBlog",
     *     tags={"Blogs"},
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 @OA\Property(property="title", type="string"),
     *                 @OA\Property(property="slug", type="string"),
     *                 @OA\Property(property="excerpt", type="string"),
     *                 @OA\Property(property="content", type="string"),
     *                 @OA\Property(property="main_image", type="string", format="binary"),
     *                 @OA\Property(property="thumbnail", type="string", format="binary"),
     *                 @OA\Property(property="author_id", type="integer"),
     *                 @OA\Property(property="category_ids[]", type="array", @OA\Items(type="integer")),
     *                 @OA\Property(property="tag_ids[]", type="array", @OA\Items(type="integer")),
     *                 @OA\Property(property="meta_title", type="string"),
     *                 @OA\Property(property="meta_description", type="string"),
     *                 @OA\Property(property="meta_keywords", type="string"),
     *                 @OA\Property(property="published_at", type="string", format="date-time"),
     *                 @OA\Property(property="is_featured", type="boolean"),
     *                 @OA\Property(property="allow_comments", type="boolean"),
     *                 @OA\Property(property="order", type="integer")
     *             )
     *         )
     *     ),
     *     @OA\Response(response=200, description="Blog updated", @OA\JsonContent(@OA\Property(property="message", type="string"), @OA\Property(property="blog", ref="#/components/schemas/Blog"))),
     *     @OA\Response(response=401, description="Unauthenticated", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=404, description="Blog not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ValidationError"))
     * )
     *
     * Update the specified blog
     */
    public function update(Request $request, string $id)
    {
        $blog = Blog::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|unique:blogs,slug,' . $id,
            'excerpt' => 'nullable|string',
            'content' => 'sometimes|string',
            'main_image' => 'nullable|image|max:5120',
            'thumbnail' => 'nullable|image|max:2048',
            'author_id' => 'sometimes|exists:users,id',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:blog_categories,id',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:blog_tags,id',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'meta_keywords' => 'nullable|string',
            'published_at' => 'nullable|date',
            'is_featured' => 'nullable|boolean',
            'allow_comments' => 'nullable|boolean',
            'order' => 'nullable|integer',
        ]);

        // Handle main image upload
        if ($request->hasFile('main_image')) {
            // Delete old image
            if ($blog->main_image) {
                Storage::disk('public')->delete($blog->main_image);
            }
            $validated['main_image'] = $request->file('main_image')
                ->store('blogs/images', 'public');
        }

        // Handle thumbnail upload
        if ($request->hasFile('thumbnail')) {
            if ($blog->thumbnail) {
                Storage::disk('public')->delete($blog->thumbnail);
            }
            $validated['thumbnail'] = $request->file('thumbnail')
                ->store('blogs/thumbnails', 'public');
        }

        // Update blog
        $blog->update($validated);

        // Sync categories
        if (isset($validated['category_ids'])) {
            $blog->categories()->sync($validated['category_ids']);
        }

        // Sync tags
        if (isset($validated['tag_ids'])) {
            $blog->tags()->sync($validated['tag_ids']);
        }

        return response()->json([
            'message' => 'Blog updated successfully',
            'blog' => $blog->fresh(['author', 'categories', 'tags'])
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/blogs/{id}",
     *     summary="Delete a blog",
     *     description="Delete a blog post (requires authentication)",
     *     operationId="deleteBlog",
     *     tags={"Blogs"},
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Blog deleted", @OA\JsonContent(@OA\Property(property="message", type="string"))),
     *     @OA\Response(response=401, description="Unauthenticated", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=404, description="Blog not found", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     *
     * Remove the specified blog
     */
    public function destroy(string $id)
    {
        $blog = Blog::findOrFail($id);

        // Delete associated images
        if ($blog->main_image) {
            Storage::disk('public')->delete($blog->main_image);
        }
        if ($blog->thumbnail) {
            Storage::disk('public')->delete($blog->thumbnail);
        }

        $blog->delete();

        return response()->json([
            'message' => 'Blog deleted successfully'
        ]);
    }

    /**
     * @OA\Get(
     *     path="/blogs/popular/list",
     *     summary="Get popular blogs",
     *     description="Get trending/popular blogs based on view count",
     *     operationId="getPopularBlogs",
     *     tags={"Blogs"},
     *     @OA\Parameter(name="limit", in="query", description="Number of blogs to return", @OA\Schema(type="integer", default=10)),
     *     @OA\Parameter(name="days", in="query", description="Filter to last N days", @OA\Schema(type="integer", default=30)),
     *     @OA\Response(response=200, description="List of popular blogs", @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/Blog")))
     * )
     *
     * Get popular/trending blogs based on views
     */
    public function popular(Request $request)
    {
        $limit = $request->get('limit', 10);
        $days = $request->get('days', 30); // Last 30 days by default

        $blogs = Blog::published()
            ->with(['author', 'categories', 'tags'])
            ->withCount('likes')
            ->where('published_at', '>=', now()->subDays($days))
            ->orderBy('views_count', 'desc')
            ->limit($limit)
            ->get();

        return response()->json($blogs);
    }

    /**
     * @OA\Get(
     *     path="/blogs/{identifier}/related",
     *     summary="Get related blogs",
     *     description="Get blogs related to the specified blog based on categories and tags",
     *     operationId="getRelatedBlogs",
     *     tags={"Blogs"},
     *     @OA\Parameter(name="identifier", in="path", required=true, description="Blog ID or slug", @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="List of related blogs", @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/Blog"))),
     *     @OA\Response(response=404, description="Blog not found", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     *
     * Get related blogs based on categories and tags
     */
    public function related(string $identifier)
    {
        $blog = Blog::where('id', $identifier)
            ->orWhere('slug', $identifier)
            ->firstOrFail();

        $categoryIds = $blog->categories->pluck('id');
        $tagIds = $blog->tags->pluck('id');

        $related = Blog::published()
            ->with(['author', 'categories', 'tags'])
            ->withCount('likes')
            ->where('id', '!=', $blog->id)
            ->where(function ($query) use ($categoryIds, $tagIds) {
                if ($categoryIds->isNotEmpty()) {
                    $query->whereHas('categories', function ($q) use ($categoryIds) {
                        $q->whereIn('blog_categories.id', $categoryIds);
                    });
                }
                if ($tagIds->isNotEmpty()) {
                    $query->orWhereHas('tags', function ($q) use ($tagIds) {
                        $q->whereIn('blog_tags.id', $tagIds);
                    });
                }
            })
            ->limit(5)
            ->get();

        return response()->json($related);
    }

    /**
     * @OA\Get(
     *     path="/blogs/category/{categorySlug}",
     *     summary="Get blogs by category",
     *     description="Get published blogs filtered by category slug",
     *     operationId="getBlogsByCategory",
     *     tags={"Blogs"},
     *     @OA\Parameter(name="categorySlug", in="path", required=true, @OA\Schema(type="string")),
     *     @OA\Parameter(name="sort_by", in="query", @OA\Schema(type="string", default="published_at")),
     *     @OA\Parameter(name="sort_order", in="query", @OA\Schema(type="string", enum={"asc", "desc"}, default="desc")),
     *     @OA\Parameter(name="per_page", in="query", @OA\Schema(type="integer", default=15)),
     *     @OA\Response(response=200, description="Paginated blogs", @OA\JsonContent(type="object"))
     * )
     *
     * Get blogs by specific category slug
     */
    public function byCategory(string $categorySlug, Request $request)
    {
        $query = Blog::published()
            ->with(['author', 'categories', 'tags'])
            ->withCount('likes')
            ->whereHas('categories', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });

        // Sorting
        $sortBy = $request->get('sort_by', 'published_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->get('per_page', 15);
        $blogs = $query->paginate($perPage);

        return response()->json($blogs);
    }

    /**
     * @OA\Get(
     *     path="/blogs/tag/{tagSlug}",
     *     summary="Get blogs by tag",
     *     description="Get published blogs filtered by tag slug",
     *     operationId="getBlogsByTag",
     *     tags={"Blogs"},
     *     @OA\Parameter(name="tagSlug", in="path", required=true, @OA\Schema(type="string")),
     *     @OA\Parameter(name="sort_by", in="query", @OA\Schema(type="string", default="published_at")),
     *     @OA\Parameter(name="sort_order", in="query", @OA\Schema(type="string", enum={"asc", "desc"}, default="desc")),
     *     @OA\Parameter(name="per_page", in="query", @OA\Schema(type="integer", default=15)),
     *     @OA\Response(response=200, description="Paginated blogs", @OA\JsonContent(type="object"))
     * )
     *
     * Get blogs by specific tag slug
     */
    public function byTag(string $tagSlug, Request $request)
    {
        $query = Blog::published()
            ->with(['author', 'categories', 'tags'])
            ->withCount('likes')
            ->whereHas('tags', function ($q) use ($tagSlug) {
                $q->where('slug', $tagSlug);
            });

        // Sorting
        $sortBy = $request->get('sort_by', 'published_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->get('per_page', 15);
        $blogs = $query->paginate($perPage);

        return response()->json($blogs);
    }

    /**
     * @OA\Get(
     *     path="/blogs/author/{authorId}",
     *     summary="Get blogs by author",
     *     description="Get published blogs filtered by author ID",
     *     operationId="getBlogsByAuthor",
     *     tags={"Blogs"},
     *     @OA\Parameter(name="authorId", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Parameter(name="sort_by", in="query", @OA\Schema(type="string", default="published_at")),
     *     @OA\Parameter(name="sort_order", in="query", @OA\Schema(type="string", enum={"asc", "desc"}, default="desc")),
     *     @OA\Parameter(name="per_page", in="query", @OA\Schema(type="integer", default=15)),
     *     @OA\Response(response=200, description="Paginated blogs", @OA\JsonContent(type="object"))
     * )
     *
     * Get blogs by specific author
     */
    public function byAuthor($authorId, Request $request)
    {
        $query = Blog::published()
            ->with(['author', 'categories', 'tags'])
            ->withCount('likes')
            ->where('author_id', $authorId);

        // Sorting
        $sortBy = $request->get('sort_by', 'published_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->get('per_page', 15);
        $blogs = $query->paginate($perPage);

        return response()->json($blogs);
    }

    /**
     * @OA\Get(
     *     path="/blogs/search/query",
     *     summary="Search blogs",
     *     description="Search blogs with advanced filters including date range",
     *     operationId="searchBlogs",
     *     tags={"Blogs"},
     *     @OA\Parameter(name="q", in="query", description="Search query", @OA\Schema(type="string")),
     *     @OA\Parameter(name="date_from", in="query", description="Start date", @OA\Schema(type="string", format="date")),
     *     @OA\Parameter(name="date_to", in="query", description="End date", @OA\Schema(type="string", format="date")),
     *     @OA\Parameter(name="sort_by", in="query", @OA\Schema(type="string", default="published_at")),
     *     @OA\Parameter(name="sort_order", in="query", @OA\Schema(type="string", enum={"asc", "desc"}, default="desc")),
     *     @OA\Parameter(name="per_page", in="query", @OA\Schema(type="integer", default=15)),
     *     @OA\Response(response=200, description="Search results", @OA\JsonContent(type="object"))
     * )
     *
     * Search blogs with advanced filters
     */
    public function search(Request $request)
    {
        $query = Blog::published()->with(['author', 'categories', 'tags'])->withCount('likes');

        // Search term
        if ($request->has('q')) {
            $search = $request->q;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%")
                  ->orWhere('meta_keywords', 'like', "%{$search}%");
            });
        }

        // Date range
        if ($request->has('date_from')) {
            $query->where('published_at', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $query->where('published_at', '<=', $request->date_to);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'published_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->get('per_page', 15);
        $blogs = $query->paginate($perPage);

        return response()->json($blogs);
    }
}
