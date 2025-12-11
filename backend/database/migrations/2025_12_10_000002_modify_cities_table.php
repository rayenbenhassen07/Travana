<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cities', function (Blueprint $table) {
            // Remove the name column (it will be in translations)
            $table->dropColumn('name');
            
            // Add new columns
            $table->decimal('latitude', 10, 8)->nullable()->after('slug');
            $table->decimal('longitude', 11, 8)->nullable()->after('latitude');
            $table->boolean('is_active')->default(true)->after('longitude');
        });
    }

    public function down(): void
    {
        Schema::table('cities', function (Blueprint $table) {
            // Restore the name column
            $table->string('name')->after('id');
            
            // Remove the added columns
            $table->dropColumn(['latitude', 'longitude', 'is_active']);
        });
    }
};
