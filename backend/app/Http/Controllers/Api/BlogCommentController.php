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
