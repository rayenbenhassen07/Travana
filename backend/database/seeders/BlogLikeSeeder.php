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
                    'likeable_type' => Blog::class,
                    'likeable_id' => $blog->id,
                    'reaction_type' => fake()->randomElement(['like', 'like', 'like', 'love', 'insightful', 'fire']), // Mostly "like"
                ]);
            }
        }

        // Create likes for comments
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
                        
                        BlogLike::create([
                            'user_id' => $user->id,
                            'likeable_type' => BlogComment::class,
                            'likeable_id' => $comment->id,
                            'reaction_type' => fake()->randomElement(['like', 'like', 'insightful']),
                        ]);
                    }
                    
                    // Update comment likes count
                    $actualLikes = $comment->likes()->count();
                    $comment->update(['likes_count' => $actualLikes]);
                }
            }
        }

        $this->command->info('Blog likes seeded successfully!');
    }
}
