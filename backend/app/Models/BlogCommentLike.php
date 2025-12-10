<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogCommentLike extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'blog_comment_id',
    ];

    /**
     * Relationships
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function blogComment()
    {
        return $this->belongsTo(BlogComment::class);
    }
}
