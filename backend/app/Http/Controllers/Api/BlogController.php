<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BlogController extends Controller
{
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
