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
            // Drop the old unique constraint that only has user_id
            $table->dropUnique('blog_likes_user_id_likeable_id_likeable_type_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('blog_likes', function (Blueprint $table) {
            // Recreate the old constraint if rolling back
            $table->unique(['user_id'], 'blog_likes_user_id_likeable_id_likeable_type_unique');
        });
    }
};
