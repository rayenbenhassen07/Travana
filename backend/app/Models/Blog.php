<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Blog extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'main_image',
        'thumbnail',
        'author_id',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'published_at', // NULL = draft, future = scheduled, past = published
        'views_count',
        'reading_time', // Auto-calculated from content
        'is_featured',
        'allow_comments',
        'order',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'is_featured' => 'boolean',
        'allow_comments' => 'boolean',
        'views_count' => 'integer',
        'reading_time' => 'integer',
        'order' => 'integer',
    ];

    protected $dates = ['deleted_at'];

    /**
     * Boot function to auto-generate slug
     */
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($blog) {
            if (empty($blog->slug)) {
                $blog->slug = Str::slug($blog->title);
            }
            
            // Auto-calculate reading time based on content
            if (empty($blog->reading_time) && !empty($blog->content)) {
                $wordCount = str_word_count(strip_tags($blog->content));
                $blog->reading_time = ceil($wordCount / 200); // Average reading speed
            }
        });

        static::updating(function ($blog) {
            // Update reading time if content changes
            if ($blog->isDirty('content')) {
                $wordCount = str_word_count(strip_tags($blog->content));
                $blog->reading_time = ceil($wordCount / 200);
            }
        });
    }

    // Relationships
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function categories()
    {
        return $this->belongsToMany(BlogCategory::class, 'blog_blog_category');
    }

    public function tags()
    {
        return $this->belongsToMany(BlogTag::class, 'blog_blog_tag');
    }

    public function comments()
    {
        return $this->hasMany(BlogComment::class)->whereNull('parent_id')->with('replies');
    }

    public function allComments()
    {
        return $this->hasMany(BlogComment::class);
    }

    public function likes()
    {
        return $this->hasMany(BlogLike::class);
    }

    // Check if user liked this blog
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

    // Toggle like
    public function toggleLike($userId)
    {
        $like = $this->likes()->where('user_id', $userId)->first();
        
        if ($like) {
            $like->delete();
            return false; // unliked
        } else {
            $this->likes()->create(['user_id' => $userId]);
            return true; // liked
        }
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->whereNotNull('published_at')
                     ->where('published_at', '<=', now());
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeScheduled($query)
    {
        return $query->whereNotNull('published_at')
                     ->where('published_at', '>', now());
    }

    public function scopeDraft($query)
    {
        return $query->whereNull('published_at');
    }

    // Accessors
    public function getExcerptAttribute($value)
    {
        return $value ?: Str::limit(strip_tags($this->content), 200);
    }

    public function getReadTimeAttribute()
    {
        return $this->reading_time . ' min read';
    }

    // Increment views count
    public function incrementViews()
    {
        $this->increment('views_count');
    }
}
