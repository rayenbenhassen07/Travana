<?php

namespace Database\Factories;

use App\Models\BlogComment;
use App\Models\Blog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class BlogCommentFactory extends Factory
{
    protected $model = BlogComment::class;

    public function definition(): array
    {
        return [
            'blog_id' => Blog::factory(),
            'user_id' => User::factory(),
            'parent_id' => null,
            'content' => $this->faker->paragraph(3),
            'status' => $this->faker->randomElement(['pending', 'approved', 'rejected']),
            'user_ip' => $this->faker->ipv4(),
            'user_agent' => $this->faker->userAgent(),
            'likes_count' => $this->faker->numberBetween(0, 100),
            'is_edited' => false,
            'edited_at' => null,
        ];
    }

    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
        ]);
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    public function reply($parentId): static
    {
        return $this->state(fn (array $attributes) => [
            'parent_id' => $parentId,
        ]);
    }
}
