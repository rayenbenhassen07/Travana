<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable(); // Short description for SEO and previews
            $table->longText('content'); // WYSIWYG editor content (HTML)
            $table->string('main_image')->nullable();
            $table->string('thumbnail')->nullable();
            $table->foreignId('author_id')->constrained('users')->onDelete('cascade');
            
            // SEO fields
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('meta_keywords')->nullable();
            
            // Publishing controls
            $table->timestamp('published_at')->nullable();
            
            // Engagement metrics
            $table->integer('views_count')->default(0);
            $table->integer('reading_time')->nullable(); // Estimated reading time in minutes
            
            // Additional features
            $table->boolean('is_featured')->default(false);
            $table->boolean('allow_comments')->default(true);
            $table->integer('order')->default(0); // For manual ordering
            
            $table->timestamps();
            $table->softDeletes(); // Soft delete for archived content
            
            // Indexes for better performance
            $table->index('published_at');
            $table->index('author_id');
            $table->index('is_featured');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blogs');
    }
};
