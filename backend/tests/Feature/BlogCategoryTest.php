<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\BlogCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;

class BlogCategoryTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    /** @test */
    public function it_can_list_blog_categories()
    {
        BlogCategory::factory()->count(5)->create();

        $response = $this->getJson('/api/blog-categories');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'slug', 'description']
                ]
            ]);
    }

    /** @test */
    public function it_can_create_a_category()
    {
        $categoryData = [
            'name' => 'Travel Tips',
            'description' => 'Tips for traveling',
            'icon' => 'fa-plane',
            'color' => '#FF5733',
            'is_active' => true,
        ];

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/blog-categories', $categoryData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'category' => ['id', 'name', 'slug']
            ]);

        $this->assertDatabaseHas('blog_categories', [
            'name' => 'Travel Tips',
            'slug' => 'travel-tips',
        ]);
    }

    /** @test */
    public function it_can_show_a_category_by_id()
    {
        $category = BlogCategory::factory()->create();

        $response = $this->getJson("/api/blog-categories/{$category->id}");

        $response->assertStatus(200)
            ->assertJson([
                'id' => $category->id,
                'name' => $category->name,
            ]);
    }

    /** @test */
    public function it_can_show_a_category_by_slug()
    {
        $category = BlogCategory::factory()->create(['slug' => 'adventure']);

        $response = $this->getJson("/api/blog-categories/adventure");

        $response->assertStatus(200)
            ->assertJson([
                'slug' => 'adventure',
            ]);
    }

    /** @test */
    public function it_can_update_a_category()
    {
        $category = BlogCategory::factory()->create();

        $updateData = [
            'name' => 'Updated Category Name',
            'description' => 'Updated description',
        ];

        $response = $this->actingAs($this->user, 'sanctum')
            ->putJson("/api/blog-categories/{$category->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Blog category updated successfully',
            ]);

        $this->assertDatabaseHas('blog_categories', [
            'id' => $category->id,
            'name' => 'Updated Category Name',
        ]);
    }

    /** @test */
    public function it_can_delete_a_category_without_blogs()
    {
        $category = BlogCategory::factory()->create();

        $response = $this->actingAs($this->user, 'sanctum')
            ->deleteJson("/api/blog-categories/{$category->id}");

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Blog category deleted successfully',
            ]);

        $this->assertDatabaseMissing('blog_categories', [
            'id' => $category->id,
        ]);
    }

    /** @test */
    public function it_auto_generates_slug_from_name()
    {
        $categoryData = [
            'name' => 'Food and Dining',
            'is_active' => true,
        ];

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/blog-categories', $categoryData);

        $response->assertStatus(201);

        $this->assertDatabaseHas('blog_categories', [
            'slug' => 'food-and-dining',
        ]);
    }

    /** @test */
    public function it_can_filter_active_categories()
    {
        BlogCategory::factory()->create(['is_active' => true]);
        BlogCategory::factory()->create(['is_active' => false]);

        $response = $this->getJson('/api/blog-categories?active_only=1');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    /** @test */
    public function it_requires_authentication_to_create_category()
    {
        $categoryData = [
            'name' => 'Test Category',
        ];

        $response = $this->postJson('/api/blog-categories', $categoryData);

        $response->assertStatus(401);
    }
}
