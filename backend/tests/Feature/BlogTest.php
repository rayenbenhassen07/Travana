<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Blog;
use App\Models\BlogCategory;
use App\Models\BlogTag;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class BlogTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        Storage::fake('public');
    }

    /** @test */
    public function it_can_list_blogs()
    {
        Blog::factory()->count(5)->create(['status' => 'published', 'published_at' => now()]);

        $response = $this->getJson('/api/blogs');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'title', 'slug', 'excerpt', 'content', 'author', 'categories', 'tags']
                ]
            ]);
    }

    /** @test */
    public function it_can_create_a_blog()
    {
        $category = BlogCategory::factory()->create();
        $tag = BlogTag::factory()->create();

        $blogData = [
            'title' => 'Test Blog Post',
            'content' => 'This is the content of the test blog post.',
            'excerpt' => 'Test excerpt',
            'author_id' => $this->user->id,
            'category_ids' => [$category->id],
            'tag_ids' => [$tag->id],
            'status' => 'published',
            'published_at' => now()->toDateTimeString(),
            'is_featured' => true,
            'allow_comments' => true,
        ];

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/blogs', $blogData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'blog' => ['id', 'title', 'slug', 'content']
            ]);

        $this->assertDatabaseHas('blogs', [
            'title' => 'Test Blog Post',
            'slug' => 'test-blog-post',
        ]);
    }

    /** @test */
    public function it_can_show_a_blog_by_id()
    {
        $blog = Blog::factory()->create(['status' => 'published', 'published_at' => now()]);

        $response = $this->getJson("/api/blogs/{$blog->id}");

        $response->assertStatus(200)
            ->assertJson([
                'id' => $blog->id,
                'title' => $blog->title,
            ]);
    }

    /** @test */
    public function it_can_show_a_blog_by_slug()
    {
        $blog = Blog::factory()->create([
            'slug' => 'my-test-blog',
            'status' => 'published',
            'published_at' => now()
        ]);

        $response = $this->getJson("/api/blogs/my-test-blog");

        $response->assertStatus(200)
            ->assertJson([
                'slug' => 'my-test-blog',
            ]);
    }

    /** @test */
    public function it_can_update_a_blog()
    {
        $blog = Blog::factory()->create(['author_id' => $this->user->id]);

        $updateData = [
            'title' => 'Updated Blog Title',
            'content' => 'Updated content',
        ];

        $response = $this->actingAs($this->user, 'sanctum')
            ->putJson("/api/blogs/{$blog->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Blog updated successfully',
            ]);

        $this->assertDatabaseHas('blogs', [
            'id' => $blog->id,
            'title' => 'Updated Blog Title',
        ]);
    }

    /** @test */
    public function it_can_delete_a_blog()
    {
        $blog = Blog::factory()->create(['author_id' => $this->user->id]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->deleteJson("/api/blogs/{$blog->id}");

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Blog deleted successfully',
            ]);

        $this->assertSoftDeleted('blogs', [
            'id' => $blog->id,
        ]);
    }

    /** @test */
    public function it_can_filter_blogs_by_category()
    {
        $category = BlogCategory::factory()->create(['slug' => 'travel']);
        $blog = Blog::factory()->create(['status' => 'published', 'published_at' => now()]);
        $blog->categories()->attach($category->id);

        $response = $this->getJson('/api/blogs?category=travel');

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $blog->id]);
    }

    /** @test */
    public function it_can_filter_blogs_by_tag()
    {
        $tag = BlogTag::factory()->create(['slug' => 'adventure']);
        $blog = Blog::factory()->create(['status' => 'published', 'published_at' => now()]);
        $blog->tags()->attach($tag->id);

        $response = $this->getJson('/api/blogs?tag=adventure');

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $blog->id]);
    }

    /** @test */
    public function it_can_search_blogs()
    {
        Blog::factory()->create([
            'title' => 'Amazing Travel Guide',
            'status' => 'published',
            'published_at' => now()
        ]);

        $response = $this->getJson('/api/blogs?search=Amazing');

        $response->assertStatus(200)
            ->assertJsonFragment(['title' => 'Amazing Travel Guide']);
    }

    /** @test */
    public function it_can_get_popular_blogs()
    {
        Blog::factory()->create([
            'views_count' => 1000,
            'status' => 'published',
            'published_at' => now()
        ]);
        Blog::factory()->create([
            'views_count' => 500,
            'status' => 'published',
            'published_at' => now()
        ]);

        $response = $this->getJson('/api/blogs/popular/list?limit=5');

        $response->assertStatus(200)
            ->assertJsonCount(2);
    }

    /** @test */
    public function it_can_get_blogs_by_category_slug()
    {
        $category = BlogCategory::factory()->create(['slug' => 'technology']);
        $blog = Blog::factory()->create(['status' => 'published', 'published_at' => now()]);
        $blog->categories()->attach($category->id);

        $response = $this->getJson('/api/blogs/category/technology');

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $blog->id]);
    }

    /** @test */
    public function it_can_get_blogs_by_tag_slug()
    {
        $tag = BlogTag::factory()->create(['slug' => 'coding']);
        $blog = Blog::factory()->create(['status' => 'published', 'published_at' => now()]);
        $blog->tags()->attach($tag->id);

        $response = $this->getJson('/api/blogs/tag/coding');

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $blog->id]);
    }

    /** @test */
    public function it_can_get_related_blogs()
    {
        $category = BlogCategory::factory()->create();
        $blog1 = Blog::factory()->create(['status' => 'published', 'published_at' => now()]);
        $blog2 = Blog::factory()->create(['status' => 'published', 'published_at' => now()]);
        
        $blog1->categories()->attach($category->id);
        $blog2->categories()->attach($category->id);

        $response = $this->getJson("/api/blogs/{$blog1->id}/related");

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $blog2->id]);
    }

    /** @test */
    public function it_increments_view_count_when_blog_is_viewed()
    {
        $blog = Blog::factory()->create(['status' => 'published', 'published_at' => now()]);
        $initialViews = $blog->views_count;

        $this->getJson("/api/blogs/{$blog->id}");

        $blog->refresh();
        $this->assertEquals($initialViews + 1, $blog->views_count);
    }

    /** @test */
    public function it_auto_generates_slug_from_title()
    {
        $blogData = [
            'title' => 'This is My Test Blog',
            'content' => 'Content here',
            'author_id' => $this->user->id,
            'status' => 'published',
        ];

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/blogs', $blogData);

        $response->assertStatus(201);
        
        $this->assertDatabaseHas('blogs', [
            'slug' => 'this-is-my-test-blog',
        ]);
    }
}
