<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BlogLikeController extends Controller
{
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

    public function checkLike($blogId)
    {
        $blog = Blog::findOrFail($blogId);
        
        $liked = $blog->isLikedBy(Auth::id());
        
        return response()->json([
            'liked' => $liked,
            'likes_count' => $blog->likes()->count()
        ]);
    }

    public function getLikes($blogId)
    {
        $blog = Blog::findOrFail($blogId);
        
        $likes = $blog->likes()->with('user')->latest()->paginate(20);
        
        return response()->json($likes);
    }
}
