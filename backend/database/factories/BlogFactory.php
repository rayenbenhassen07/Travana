<?php

namespace Database\Factories;

use App\Models\Blog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class BlogFactory extends Factory
{
    protected $model = Blog::class;

    public function definition(): array
    {
        $title = $this->faker->sentence(6);
        
        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'excerpt' => $this->faker->paragraph(2),
            'content' => $this->faker->paragraphs(5, true),
            'featured_image' => null,
            'gallery' => null,
            'author_id' => User::factory(),
            'meta_title' => $title,
            'meta_description' => $this->faker->sentence(10),
            'meta_keywords' => implode(',', $this->faker->words(5)),
            'canonical_url' => null,
            'og_image' => null,
            'status' => $this->faker->randomElement(['draft', 'published', 'scheduled']),
            'published_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'scheduled_at' => null,
            'views_count' => $this->faker->numberBetween(0, 10000),
            'reading_time' => $this->faker->numberBetween(1, 15),
            'is_featured' => $this->faker->boolean(20),
            'allow_comments' => $this->faker->boolean(80),
            'order' => $this->faker->numberBetween(0, 100),
        ];
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'published_at' => now()->subDays(rand(1, 30)),
        ]);
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
            'published_at' => null,
        ]);
    }

    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }
}
