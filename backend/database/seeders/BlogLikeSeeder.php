<?php

namespace Database\Seeders;

use App\Models\BlogLike;
use App\Models\Blog;
use App\Models\BlogComment;
use App\Models\User;
use Illuminate\Database\Seeder;

class BlogLikeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $blogs = Blog::published()->get();
        $comments = BlogComment::where('status', 'approved')->get();

        if ($blogs->isEmpty()) {
            $this->command->warn('No published blogs found. Skipping blog likes seeding.');
            return;
        }

        // Create likes for blog posts
        foreach ($blogs as $blog) {
            // Random number of likes per blog (10-100 likes)
            $likeCount = rand(10, 100);
            $likedUsers = $users->random(min($likeCount, $users->count()));
            
            foreach ($likedUsers as $user) {
                BlogLike::create([
                    'user_id' => $user->id,
                    'blog_id' => $blog->id,
                ]);
            }
        }

        // Note: Comment likes are handled by BlogCommentLike model now
        // Create likes for comments using BlogCommentLike instead
        if ($comments->isNotEmpty()) {
            foreach ($comments as $comment) {
                // Some comments get likes (60% chance)
                if (fake()->boolean(60)) {
                    $likeCount = rand(1, min(15, $users->count()));
                    $likedUsers = $users->random($likeCount);
                    
                    foreach ($likedUsers as $user) {
                        // Don't let users like their own comments
                        if ($user->id === $comment->user_id) {
                            continue;
                        }
                        
                        \App\Models\BlogCommentLike::create([
                            'user_id' => $user->id,
                            'blog_comment_id' => $comment->id,
                        ]);
                    }
                }
            }
        }

        $this->command->info('Blog likes seeded successfully!');
    }
}
