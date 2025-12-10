<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Blog;
use App\Models\BlogComment;
use Illuminate\Foundation\Testing\RefreshDatabase;

class BlogCommentTest extends TestCase
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
            'published_at' => now(),
            'allow_comments' => true
        ]);
    }

    /** @test */
    public function it_can_list_comments_for_a_blog()
    {
        BlogComment::factory()->count(3)->create([
            'blog_id' => $this->blog->id,
            'status' => 'approved'
        ]);

        $response = $this->getJson("/api/blogs/{$this->blog->id}/comments");

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    /** @test */
    public function it_can_create_a_comment()
    {
        $commentData = [
            'content' => 'This is a test comment.',
        ];

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/blogs/{$this->blog->id}/comments", $commentData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'comment' => ['id', 'content', 'user']
            ]);

        $this->assertDatabaseHas('blog_comments', [
            'blog_id' => $this->blog->id,
            'user_id' => $this->user->id,
            'content' => 'This is a test comment.',
        ]);
    }

    /** @test */
    public function it_can_create_a_nested_comment()
    {
        $parentComment = BlogComment::factory()->create([
            'blog_id' => $this->blog->id,
            'status' => 'approved'
        ]);

        $replyData = [
            'content' => 'This is a reply to the comment.',
            'parent_id' => $parentComment->id,
        ];

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/blogs/{$this->blog->id}/comments", $replyData);

        $response->assertStatus(201);

        $this->assertDatabaseHas('blog_comments', [
            'blog_id' => $this->blog->id,
            'parent_id' => $parentComment->id,
            'content' => 'This is a reply to the comment.',
        ]);
    }

    /** @test */
    public function it_can_update_a_comment()
    {
        $comment = BlogComment::factory()->create([
            'blog_id' => $this->blog->id,
            'user_id' => $this->user->id,
        ]);

        $updateData = [
            'content' => 'Updated comment content',
        ];

        $response = $this->actingAs($this->user, 'sanctum')
            ->putJson("/api/blogs/{$this->blog->id}/comments/{$comment->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Comment updated successfully',
            ]);

        $this->assertDatabaseHas('blog_comments', [
            'id' => $comment->id,
            'content' => 'Updated comment content',
            'is_edited' => true,
        ]);
    }

    /** @test */
    public function it_cannot_update_another_users_comment()
    {
        $otherUser = User::factory()->create();
        $comment = BlogComment::factory()->create([
            'blog_id' => $this->blog->id,
            'user_id' => $otherUser->id,
        ]);

        $updateData = [
            'content' => 'Trying to update',
        ];

        $response = $this->actingAs($this->user, 'sanctum')
            ->putJson("/api/blogs/{$this->blog->id}/comments/{$comment->id}", $updateData);

        $response->assertStatus(403);
    }

    /** @test */
    public function it_can_delete_a_comment()
    {
        $comment = BlogComment::factory()->create([
            'blog_id' => $this->blog->id,
            'user_id' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->deleteJson("/api/blogs/{$this->blog->id}/comments/{$comment->id}");

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Comment deleted successfully',
            ]);

        $this->assertSoftDeleted('blog_comments', [
            'id' => $comment->id,
        ]);
    }

    /** @test */
    public function it_cannot_delete_another_users_comment()
    {
        $otherUser = User::factory()->create();
        $comment = BlogComment::factory()->create([
            'blog_id' => $this->blog->id,
            'user_id' => $otherUser->id,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->deleteJson("/api/blogs/{$this->blog->id}/comments/{$comment->id}");

        $response->assertStatus(403);
    }

    /** @test */
    public function it_can_like_a_comment()
    {
        $comment = BlogComment::factory()->create([
            'blog_id' => $this->blog->id,
            'status' => 'approved'
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/blogs/{$this->blog->id}/comments/{$comment->id}/like");

        $response->assertStatus(200)
            ->assertJson([
                'liked' => true,
            ]);

        $this->assertDatabaseHas('blog_likes', [
            'user_id' => $this->user->id,
            'likeable_id' => $comment->id,
            'likeable_type' => 'App\Models\BlogComment',
        ]);
    }

    /** @test */
    public function it_can_unlike_a_comment()
    {
        $comment = BlogComment::factory()->create([
            'blog_id' => $this->blog->id,
            'status' => 'approved'
        ]);

        // First like
        $comment->toggleLike($this->user->id);

        // Then unlike
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/blogs/{$this->blog->id}/comments/{$comment->id}/like");

        $response->assertStatus(200)
            ->assertJson([
                'liked' => false,
            ]);
    }

    /** @test */
    public function it_cannot_comment_on_blog_with_comments_disabled()
    {
        $blogWithoutComments = Blog::factory()->create([
            'status' => 'published',
            'published_at' => now(),
            'allow_comments' => false
        ]);

        $commentData = [
            'content' => 'Trying to comment',
        ];

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/blogs/{$blogWithoutComments->id}/comments", $commentData);

        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Comments are disabled for this blog',
            ]);
    }

    /** @test */
    public function it_requires_authentication_to_comment()
    {
        $commentData = [
            'content' => 'Test comment',
        ];

        $response = $this->postJson("/api/blogs/{$this->blog->id}/comments", $commentData);

        $response->assertStatus(401);
    }
}
