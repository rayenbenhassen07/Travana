<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\BlogTag;
use Illuminate\Foundation\Testing\RefreshDatabase;

class BlogTagTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    /** @test */
    public function it_can_list_blog_tags()
    {
        BlogTag::factory()->count(10)->create();

        $response = $this->getJson('/api/blog-tags');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'slug', 'usage_count']
                ]
            ]);
    }

    /** @test */
    public function it_can_create_a_tag()
    {
        $tagData = [
            'name' => 'Beach',
            'description' => 'Beach related content',
            'color' => '#00BFFF',
        ];

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/blog-tags', $tagData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'tag' => ['id', 'name', 'slug']
            ]);

        $this->assertDatabaseHas('blog_tags', [
            'name' => 'Beach',
            'slug' => 'beach',
        ]);
    }

    /** @test */
    public function it_can_show_a_tag_by_id()
    {
        $tag = BlogTag::factory()->create();

        $response = $this->getJson("/api/blog-tags/{$tag->id}");

        $response->assertStatus(200)
            ->assertJson([
                'id' => $tag->id,
                'name' => $tag->name,
            ]);
    }

    /** @test */
    public function it_can_show_a_tag_by_slug()
    {
        $tag = BlogTag::factory()->create(['slug' => 'mountain']);

        $response = $this->getJson("/api/blog-tags/mountain");

        $response->assertStatus(200)
            ->assertJson([
                'slug' => 'mountain',
            ]);
    }

    /** @test */
    public function it_can_update_a_tag()
    {
        $tag = BlogTag::factory()->create();

        $updateData = [
            'name' => 'Updated Tag Name',
            'description' => 'Updated description',
        ];

        $response = $this->actingAs($this->user, 'sanctum')
            ->putJson("/api/blog-tags/{$tag->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Blog tag updated successfully',
            ]);

        $this->assertDatabaseHas('blog_tags', [
            'id' => $tag->id,
            'name' => 'Updated Tag Name',
        ]);
    }

    /** @test */
    public function it_can_delete_a_tag_without_blogs()
    {
        $tag = BlogTag::factory()->create();

        $response = $this->actingAs($this->user, 'sanctum')
            ->deleteJson("/api/blog-tags/{$tag->id}");

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Blog tag deleted successfully',
            ]);

        $this->assertDatabaseMissing('blog_tags', [
            'id' => $tag->id,
        ]);
    }

    /** @test */
    public function it_can_get_popular_tags()
    {
        BlogTag::factory()->create(['usage_count' => 100]);
        BlogTag::factory()->create(['usage_count' => 50]);
        BlogTag::factory()->create(['usage_count' => 25]);

        $response = $this->getJson('/api/blog-tags/popular/list?limit=2');

        $response->assertStatus(200)
            ->assertJsonCount(2);
    }

    /** @test */
    public function it_can_search_tags()
    {
        BlogTag::factory()->create(['name' => 'Mountain Hiking']);
        BlogTag::factory()->create(['name' => 'Beach Resort']);

        $response = $this->getJson('/api/blog-tags?search=Mountain');

        $response->assertStatus(200)
            ->assertJsonFragment(['name' => 'Mountain Hiking']);
    }

    /** @test */
    public function it_auto_generates_slug_from_name()
    {
        $tagData = [
            'name' => 'Solo Travel',
        ];

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/blog-tags', $tagData);

        $response->assertStatus(201);

        $this->assertDatabaseHas('blog_tags', [
            'slug' => 'solo-travel',
        ]);
    }

    /** @test */
    public function it_requires_authentication_to_create_tag()
    {
        $tagData = [
            'name' => 'Test Tag',
        ];

        $response = $this->postJson('/api/blog-tags', $tagData);

        $response->assertStatus(401);
    }
}
