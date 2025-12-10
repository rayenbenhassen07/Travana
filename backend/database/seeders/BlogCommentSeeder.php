<?php

namespace Database\Seeders;

use App\Models\BlogComment;
use App\Models\Blog;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class BlogCommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $blogs = Blog::published()->get();

        if ($blogs->isEmpty()) {
            $this->command->warn('No published blogs found. Skipping comment seeding.');
            return;
        }

        $sampleComments = [
            'Great article! Very informative and helpful.',
            'Thanks for sharing this. I learned a lot!',
            'This is exactly what I was looking for. Bookmarking this!',
            'Amazing tips! Can\'t wait to try these on my next trip.',
            'Very well written and detailed. Thank you!',
            'I\'ve been to this place and it\'s absolutely stunning!',
            'This destination is now on my bucket list.',
            'Do you have any recommendations for budget accommodations?',
            'What\'s the best time of year to visit?',
            'I love your blog! Keep up the great work.',
            'These photos are breathtaking!',
            'Have you been there recently? Any updates?',
            'This is such valuable information for travelers.',
            'I wish I had read this before my trip!',
            'Perfect timing! Planning to go there next month.',
            'Your writing style is so engaging and easy to read.',
            'The level of detail in this post is impressive.',
            'Thanks for the insider tips!',
            'This makes me want to pack my bags right now!',
            'Really appreciate the honest review.',
        ];

        $replies = [
            'Thank you so much! Glad you found it helpful.',
            'Thanks for reading! Happy to help.',
            'You\'re welcome! Enjoy your trip!',
            'That\'s great to hear! Let me know how it goes.',
            'I appreciate your kind words!',
            'Yes! It\'s definitely worth visiting.',
            'Absolutely! You won\'t regret it.',
            'I recommend checking out local guesthouses or Airbnb.',
            'Spring and fall are usually the best seasons to visit.',
            'Thank you for your support!',
            'Thanks! I try to capture the essence of each place.',
            'Yes, visited last month. Still amazing!',
            'Glad you found it useful!',
            'Better late than never! There\'s always next time.',
            'Have a wonderful trip! Feel free to ask if you need any tips.',
            'Thank you! That means a lot to me.',
            'I believe in providing comprehensive guides.',
            'My pleasure! Happy travels!',
            'Go for it! Life is short.',
            'Thank you! I always try to be honest in my reviews.',
        ];

        foreach ($blogs as $blog) {
            // Number of comments per blog (0-8 comments)
            $commentCount = rand(0, 8);
            
            for ($i = 0; $i < $commentCount; $i++) {
                $user = $users->random();
                $createdAt = Carbon::parse($blog->published_at)->addDays(rand(0, 30));
                
                // Create parent comment
                $parentComment = BlogComment::create([
                    'blog_id' => $blog->id,
                    'user_id' => $user->id,
                    'parent_id' => null,
                    'content' => fake()->randomElement($sampleComments),
                    'status' => fake()->randomElement(['approved', 'approved', 'approved', 'approved', 'pending']), // 80% approved
                    'user_ip' => fake()->ipv4(),
                    'user_agent' => fake()->userAgent(),
                    'likes_count' => rand(0, 25),
                    'is_edited' => false,
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ]);

                // Sometimes add replies (40% chance)
                if (fake()->boolean(40)) {
                    $replyCount = rand(1, 3);
                    
                    for ($j = 0; $j < $replyCount; $j++) {
                        $replyUser = $users->random();
                        $replyCreatedAt = $createdAt->copy()->addHours(rand(1, 48));
                        
                        BlogComment::create([
                            'blog_id' => $blog->id,
                            'user_id' => $replyUser->id,
                            'parent_id' => $parentComment->id,
                            'content' => fake()->randomElement($replies),
                            'status' => 'approved',
                            'user_ip' => fake()->ipv4(),
                            'user_agent' => fake()->userAgent(),
                            'likes_count' => rand(0, 10),
                            'is_edited' => false,
                            'created_at' => $replyCreatedAt,
                            'updated_at' => $replyCreatedAt,
                        ]);
                    }
                }
            }
        }

        // Create some edited comments
        $editedComments = BlogComment::inRandomOrder()->limit(5)->get();
        foreach ($editedComments as $comment) {
            $comment->update([
                'is_edited' => true,
                'edited_at' => $comment->created_at->copy()->addHours(rand(1, 72)),
            ]);
        }

        $this->command->info('Blog comments seeded successfully!');
    }
}
