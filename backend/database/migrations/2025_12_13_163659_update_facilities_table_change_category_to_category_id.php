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
        Schema::table('facilities', function (Blueprint $table) {
            // Drop the old category enum column
            $table->dropColumn('category');
            
            // Add the new category_id foreign key column
            $table->foreignId('category_id')->nullable()->after('icon')->constrained('facility_categories')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('facilities', function (Blueprint $table) {
            // Drop the foreign key and column
            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');
            
            // Re-add the old category enum column
            $table->enum('category', ['basic', 'safety', 'entertainment', 'outdoor', 'kitchen', 'bathroom', 'other'])->default('basic')->after('icon');
        });
    }
};
