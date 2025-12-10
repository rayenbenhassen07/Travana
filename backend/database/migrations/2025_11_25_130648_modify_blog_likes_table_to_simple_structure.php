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
        Schema::table('blog_likes', function (Blueprint $table) {
            // Drop old polymorphic columns and reaction_type
            $table->dropMorphs('likeable');
            $table->dropColumn('reaction_type');
            
            // Add new simple structure
            $table->foreignId('blog_id')->after('user_id')->constrained('blogs')->onDelete('cascade');
            
            // Add unique constraint
            $table->unique(['user_id', 'blog_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('blog_likes', function (Blueprint $table) {
            // Drop new columns
            $table->dropUnique(['user_id', 'blog_id']);
            $table->dropForeign(['blog_id']);
            $table->dropColumn('blog_id');
            
            // Restore old structure
            $table->morphs('likeable');
            $table->enum('reaction_type', ['like', 'love', 'insightful', 'fire'])->default('like');
            $table->unique(['user_id', 'likeable_id', 'likeable_type']);
        });
    }
};
