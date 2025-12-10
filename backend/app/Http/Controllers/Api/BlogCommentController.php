<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogComment;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;

class BlogCommentController extends Controller
{
    /**
     * @OA\Get(
     *     path="/blogs/{blogId}/comments",
     *     summary="Get comments for a blog",
     *     description="Retrieve approved comments for a specific blog (optionally includes user_liked if authenticated)",
     *     operationId="getBlogComments",
     *     tags={"Blog Comments"},
     *     @OA\Parameter(name="blogId", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Parameter(name="sort_by", in="query", @OA\Schema(type="string", default="created_at")),
     *     @OA\Parameter(name="sort_order", in="query", @OA\Schema(type="string", enum={"asc", "desc"}, default="desc")),
     *     @OA\Parameter(name="all", in="query", @OA\Schema(type="boolean")),
     *     @OA\Parameter(name="per_page", in="query", @OA\Schema(type="integer", default=20)),
     *     @OA\Response(response=200, description="List of comments", @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/BlogComment"))),
     *     @OA\Response(response=404, description="Blog not found", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     *
     * Get comments for a specific blog
     */
    public function index(Request $request, $blogId)
    {
        $blog = Blog::findOrFail($blogId);
        
        $query = $blog->comments()->approved()->with('likes');

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination or all
        if ($request->get('all', false)) {
            $comments = $query->get();
        } else {
            $perPage = $request->get('per_page', 20);
            $comments = $query->paginate($perPage);
        }

        // Try to get user ID from Bearer token (optional auth)
        $userId = $this->getAuthenticatedUserId($request);
        
        // Transform comments to include user_liked
        $isPaginated = $comments instanceof \Illuminate\Pagination\LengthAwarePaginator;
        
        if ($isPaginated) {
            $items = $comments->getCollection()->map(function ($comment) use ($userId) {
                return $this->transformComment($comment, $userId);
            });
            $comments->setCollection($items);
        } else {
            $comments = $comments->map(function ($comment) use ($userId) {
                return $this->transformComment($comment, $userId);
            });
        }

        return response()->json($comments);
    }

    /**
     * Get authenticated user ID from Bearer token without requiring auth middleware
     */
    private function getAuthenticatedUserId(Request $request)
    {
        // First check if already authenticated via middleware
        if (Auth::check()) {
            return Auth::id();
        }

        // Otherwise, try to authenticate from Bearer token
        $bearerToken = $request->bearerToken();
        if (!$bearerToken) {
            return null;
        }

        $token = PersonalAccessToken::findToken($bearerToken);
        if (!$token) {
            return null;
        }

        return $token->tokenable_id;
    }

    /**
     * Transform comment to include user_liked attribute
     */
    private function transformComment($comment, $userId)
    {
        $commentArray = $comment->toArray();
        $commentArray['user_liked'] = $comment->isLikedBy($userId);
        
        // Recursively transform replies
        if (isset($commentArray['replies']) && !empty($commentArray['replies'])) {
            $commentArray['replies'] = collect($comment->replies)->map(function ($reply) use ($userId) {
                return $this->transformComment($reply, $userId);
            })->toArray();
        }
        
        return $commentArray;
    }



    /**
     * @OA\Post(
     *     path="/blogs/{blogId}/comments",
     *     summary="Create a new comment",
     *     description="Post a comment on a blog (requires authentication)",
     *     operationId="createBlogComment",
     *     tags={"Blog Comments"},
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(name="blogId", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"content"},
     *             @OA\Property(property="content", type="string", minLength=3, maxLength=2000),
     *             @OA\Property(property="parent_id", type="integer", nullable=true, description="Reply to comment ID")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Comment created", @OA\JsonContent(@OA\Property(property="message", type="string"), @OA\Property(property="comment", ref="#/components/schemas/BlogComment"))),
     *     @OA\Response(response=401, description="Unauthenticated", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=403, description="Comments disabled", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=404, description="Blog not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ValidationError"))
     * )
     *
     * Store a new comment
     */
    public function store(Request $request, $blogId)
    {
        $blog = Blog::findOrFail($blogId);

        // Check if blog allows comments
        if (!$blog->allow_comments) {
            return response()->json([
                'message' => 'Comments are disabled for this blog'
            ], 403);
        }

        $validated = $request->validate([
            'content' => 'required|string|min:3|max:2000',
            'parent_id' => 'nullable|exists:blog_comments,id',
        ]);

        // If parent_id provided, verify it belongs to the same blog
        if (!empty($validated['parent_id'])) {
            $parentComment = BlogComment::find($validated['parent_id']);
            if ($parentComment->blog_id != $blogId) {
                return response()->json([
                    'message' => 'Invalid parent comment'
                ], 422);
            }
        }

        $comment = $blog->comments()->create([
            'user_id' => Auth::id(),
            'content' => $validated['content'],
            'parent_id' => $validated['parent_id'] ?? null,
            'user_ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'status' => 'approved', // Auto-approve for authenticated users
        ]);

        $comment->load('user', 'replies');
        
        // Transform comment to include user_liked
        $transformedComment = $this->transformComment($comment, Auth::id());

        return response()->json([
            'message' => 'Comment posted successfully',
            'comment' => $transformedComment
        ], 201);
    }

    /**
     * @OA\Put(
     *     path="/blogs/{blogId}/comments/{id}",
     *     summary="Update a comment",
     *     description="Update your own comment (requires authentication)",
     *     operationId="updateBlogComment",
     *     tags={"Blog Comments"},
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(name="blogId", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"content"},
     *             @OA\Property(property="content", type="string", minLength=3, maxLength=2000)
     *         )
     *     ),
     *     @OA\Response(response=200, description="Comment updated", @OA\JsonContent(@OA\Property(property="message", type="string"), @OA\Property(property="comment", ref="#/components/schemas/BlogComment"))),
     *     @OA\Response(response=401, description="Unauthenticated", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=403, description="Unauthorized", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=404, description="Comment not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ValidationError"))
     * )
     *
     * Update a comment
     */
    public function update(Request $request, $blogId, $id)
    {
        $comment = BlogComment::where('blog_id', $blogId)->findOrFail($id);

        // Check if user owns the comment
        if ($comment->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized to update this comment'
            ], 403);
        }

        $validated = $request->validate([
            'content' => 'required|string|min:3|max:2000',
        ]);

        $comment->update([
            'content' => $validated['content'],
            'is_edited' => true,
            'edited_at' => now(),
        ]);

        $comment->load('user', 'replies');
        
        // Transform comment to include user_liked
        $transformedComment = $this->transformComment($comment, Auth::id());

        return response()->json([
            'message' => 'Comment updated successfully',
            'comment' => $transformedComment
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/blogs/{blogId}/comments/{id}",
     *     summary="Delete a comment",
     *     description="Delete your own comment (requires authentication)",
     *     operationId="deleteBlogComment",
     *     tags={"Blog Comments"},
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(name="blogId", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Comment deleted", @OA\JsonContent(@OA\Property(property="message", type="string"))),
     *     @OA\Response(response=401, description="Unauthenticated", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=403, description="Unauthorized", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=404, description="Comment not found", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     *
     * Delete a comment
     */
    public function destroy($blogId, $id)
    {
        $comment = BlogComment::where('blog_id', $blogId)->findOrFail($id);

        // Check if user owns the comment
        if ($comment->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized to delete this comment'
            ], 403);
        }

        $comment->delete();

        return response()->json([
            'message' => 'Comment deleted successfully'
        ]);
    }

    /**
     * @OA\Post(
     *     path="/blogs/{blogId}/comments/{id}/like",
     *     summary="Toggle like on a comment",
     *     operationId="toggleCommentLike",
     *     tags={"Blog Comments"},
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(name="blogId", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(
     *         response=200,
     *         description="Like toggled",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="liked", type="boolean"),
     *             @OA\Property(property="likes_count", type="integer")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=404, description="Comment not found", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     *
     * Toggle like on a comment
     */
    public function toggleLike(Request $request, $blogId, $id)
    {
        $comment = BlogComment::where('blog_id', $blogId)->findOrFail($id);

        $liked = $comment->toggleLike(Auth::id());

        return response()->json([
            'message' => $liked ? 'Comment liked' : 'Comment unliked',
            'liked' => $liked,
            'likes_count' => $comment->fresh()->likes_count
        ]);
    }

    /**
     * @OA\Get(
     *     path="/admin/comments",
     *     summary="Get all comments (Admin)",
     *     description="Get all comments with filters (requires authentication)",
     *     operationId="getAllComments",
     *     tags={"Blog Comments"},
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(name="status", in="query", @OA\Schema(type="string", enum={"pending", "approved", "rejected", "spam"})),
     *     @OA\Parameter(name="blog_id", in="query", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="sort_by", in="query", @OA\Schema(type="string", default="created_at")),
     *     @OA\Parameter(name="sort_order", in="query", @OA\Schema(type="string", enum={"asc", "desc"}, default="desc")),
     *     @OA\Parameter(name="per_page", in="query", @OA\Schema(type="integer", default=20)),
     *     @OA\Response(response=200, description="List of comments", @OA\JsonContent(type="object")),
     *     @OA\Response(response=401, description="Unauthenticated", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     *
     * Get all comments (admin)
     */
    public function all(Request $request)
    {
        $query = BlogComment::with(['user', 'blog']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by blog
        if ($request->has('blog_id')) {
            $query->where('blog_id', $request->blog_id);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->get('per_page', 20);
        $comments = $query->paginate($perPage);

        return response()->json($comments);
    }

    /**
     * @OA\Patch(
     *     path="/admin/comments/{id}/status",
     *     summary="Update comment status (Admin)",
     *     operationId="updateCommentStatus",
     *     tags={"Blog Comments"},
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"status"},
     *             @OA\Property(property="status", type="string", enum={"pending", "approved", "rejected", "spam"})
     *         )
     *     ),
     *     @OA\Response(response=200, description="Status updated", @OA\JsonContent(@OA\Property(property="message", type="string"), @OA\Property(property="comment", ref="#/components/schemas/BlogComment"))),
     *     @OA\Response(response=401, description="Unauthenticated", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=404, description="Comment not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ValidationError"))
     * )
     *
     * Update comment status (admin)
     */
    public function updateStatus(Request $request, $id)
    {
        $comment = BlogComment::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected,spam',
        ]);

        $comment->update(['status' => $validated['status']]);

        return response()->json([
            'message' => 'Comment status updated successfully',
            'comment' => $comment
        ]);
    }
}
