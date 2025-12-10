<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BlogLikeController extends Controller
{
    /**
     * @OA\Post(
     *     path="/blogs/{blogId}/like",
     *     summary="Toggle like on a blog",
     *     operationId="toggleBlogLike",
     *     tags={"Blog Likes"},
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(name="blogId", in="path", required=true, @OA\Schema(type="integer")),
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
     *     @OA\Response(response=404, description="Blog not found", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     *
     * Toggle like on a blog
     */
    public function toggle(Request $request, $blogId)
    {
        $blog = Blog::findOrFail($blogId);
        
        $liked = $blog->toggleLike(Auth::id());
        
        return response()->json([
            'message' => $liked ? 'Blog liked' : 'Blog unliked',
            'liked' => $liked,
            'likes_count' => $blog->likes()->count()
        ]);
    }

    /**
     * @OA\Get(
     *     path="/blogs/{blogId}/like/check",
     *     summary="Check if user liked a blog",
     *     operationId="checkBlogLike",
     *     tags={"Blog Likes"},
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(name="blogId", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(
     *         response=200,
     *         description="Like status",
     *         @OA\JsonContent(
     *             @OA\Property(property="liked", type="boolean"),
     *             @OA\Property(property="likes_count", type="integer")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=404, description="Blog not found", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     *
     * Check if user liked a blog
     */
    public function checkLike($blogId)
    {
        $blog = Blog::findOrFail($blogId);
        
        $liked = $blog->isLikedBy(Auth::id());
        
        return response()->json([
            'liked' => $liked,
            'likes_count' => $blog->likes()->count()
        ]);
    }

    /**
     * @OA\Get(
     *     path="/blogs/{blogId}/likes",
     *     summary="Get users who liked a blog",
     *     operationId="getBlogLikes",
     *     tags={"Blog Likes"},
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(name="blogId", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="List of likes with users", @OA\JsonContent(type="object")),
     *     @OA\Response(response=401, description="Unauthenticated", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=404, description="Blog not found", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     *
     * Get users who liked a blog
     */
    public function getLikes($blogId)
    {
        $blog = Blog::findOrFail($blogId);
        
        $likes = $blog->likes()->with('user')->latest()->paginate(20);
        
        return response()->json($likes);
    }
}
