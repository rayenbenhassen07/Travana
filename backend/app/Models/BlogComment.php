<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BlogComment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'blog_id',
        'user_id',
        'parent_id',
        'content',
        'status',
        'user_ip',
        'user_agent',
        'likes_count',
        'is_edited',
        'edited_at',
    ];

    protected $casts = [
        'is_edited' => 'boolean',
        'edited_at' => 'datetime',
        'likes_count' => 'integer',
    ];

    protected $dates = ['deleted_at'];

    protected $with = ['user']; // Always load user with comments

    /**
     * Relationships
     */
    public function blog()
    {
        return $this->belongsTo(Blog::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function parent()
    {
        return $this->belongsTo(BlogComment::class, 'parent_id');
    }

    public function replies()
    {
        return $this->hasMany(BlogComment::class, 'parent_id')->with('replies', 'likes');
    }

    public function likes()
    {
        return $this->hasMany(BlogCommentLike::class);
    }

    /**
     * Scopes
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeParentOnly($query)
    {
        return $query->whereNull('parent_id');
    }

    /**
     * Check if comment is liked by user
     */
    public function isLikedBy($userId)
    {
        if (!$userId) {
            return false;
        }
        
        // If likes are already loaded, use the collection
        if ($this->relationLoaded('likes')) {
            return $this->likes->contains('user_id', $userId);
        }
        
        // Otherwise, query the database
        return $this->likes()->where('user_id', $userId)->exists();
    }

    /**
     * Toggle like
     */
    public function toggleLike($userId)
    {
        $like = $this->likes()->where('user_id', $userId)->first();
        
        if ($like) {
            $like->delete();
            $this->decrement('likes_count');
            return false; // unliked
        } else {
            $this->likes()->create(['user_id' => $userId]);
            $this->increment('likes_count');
            return true; // liked
        }
    }
}
