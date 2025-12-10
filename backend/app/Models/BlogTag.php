<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class BlogTag extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'color',
        'usage_count',
    ];

    protected $casts = [
        'usage_count' => 'integer',
    ];

    /**
     * Boot function to auto-generate slug
     */
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($tag) {
            if (empty($tag->slug)) {
                $tag->slug = Str::slug($tag->name);
            }
        });
    }

    // Relationships
    public function blogs()
    {
        return $this->belongsToMany(Blog::class, 'blog_blog_tag');
    }

    // Increment usage count
    public function incrementUsage()
    {
        $this->increment('usage_count');
    }

    // Decrement usage count
    public function decrementUsage()
    {
        $this->decrement('usage_count');
    }
}
