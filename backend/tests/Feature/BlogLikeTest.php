<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Blog;
use Illuminate\Foundation\Testing\RefreshDatabase;

class BlogLikeTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $blog;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->blog = Blog::factory()->create([
            'status' => 'published',
            'published_at' => now()
        ]);
    }

    /** @test */
    public function it_can_like_a_blog()
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/blogs/{$this->blog->id}/like");

        $response->assertStatus(200)
            ->assertJson([
                'liked' => true,
                'message' => 'Blog liked',
            ]);

        $this->assertDatabaseHas('blog_likes', [
            'user_id' => $this->user->id,
            'likeable_id' => $this->blog->id,
            'likeable_type' => 'App\Models\Blog',
        ]);
    }

    /** @test */
    public function it_can_unlike_a_blog()
    {
        // First like the blog
        $this->blog->likes()->create([
            'user_id' => $this->user->id,
            'reaction_type' => 'like'
        ]);

        // Then unlike
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/blogs/{$this->blog->id}/like");

        $response->assertStatus(200)
            ->assertJson([
                'liked' => false,
                'message' => 'Blog unliked',
            ]);

        $this->assertDatabaseMissing('blog_likes', [
            'user_id' => $this->user->id,
            'likeable_id' => $this->blog->id,
        ]);
    }

    /** @test */
    public function it_can_check_if_user_liked_a_blog()
    {
        $this->blog->likes()->create([
            'user_id' => $this->user->id,
            'reaction_type' => 'like'
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson("/api/blogs/{$this->blog->id}/like/check");

        $response->assertStatus(200)
            ->assertJson([
                'liked' => true,
            ]);
    }

    /** @test */
    public function it_can_get_list_of_users_who_liked_a_blog()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $this->blog->likes()->create(['user_id' => $user1->id]);
        $this->blog->likes()->create(['user_id' => $user2->id]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson("/api/blogs/{$this->blog->id}/likes");

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    /** @test */
    public function it_can_like_with_different_reaction_types()
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/blogs/{$this->blog->id}/like", [
                'reaction_type' => 'love'
            ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('blog_likes', [
            'user_id' => $this->user->id,
            'likeable_id' => $this->blog->id,
            'reaction_type' => 'love',
        ]);
    }

    /** @test */
    public function it_requires_authentication_to_like()
    {
        $response = $this->postJson("/api/blogs/{$this->blog->id}/like");

        $response->assertStatus(401);
    }

    /** @test */
    public function user_can_only_like_once()
    {
        // Like twice
        $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/blogs/{$this->blog->id}/like");
        
        $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/blogs/{$this->blog->id}/like");

        // Should only have 0 likes after toggling twice (like then unlike)
        $likeCount = $this->blog->likes()->where('user_id', $this->user->id)->count();
        $this->assertEquals(0, $likeCount);
    }
}
