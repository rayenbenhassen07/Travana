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
        Schema::table('users', function (Blueprint $table) {
            // Drop old string columns
            $table->dropColumn(['language_preference', 'currency_preference']);
            
            // Add foreign key columns
            $table->foreignId('language_id')->nullable()->after('is_active')->constrained('languages')->onDelete('set null');
            $table->foreignId('currency_id')->nullable()->after('language_id')->constrained('currencies')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop foreign keys and columns
            $table->dropForeign(['language_id']);
            $table->dropForeign(['currency_id']);
            $table->dropColumn(['language_id', 'currency_id']);
            
            // Restore old string columns
            $table->string('language_preference', 10)->default('en')->after('is_active');
            $table->string('currency_preference', 10)->default('TND')->after('language_preference');
        });
    }
};
