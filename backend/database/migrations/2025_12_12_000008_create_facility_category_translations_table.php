<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facility_category_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('facility_category_id')->constrained('facility_categories')->onDelete('cascade');
            $table->foreignId('language_id')->constrained('languages')->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            
            $table->unique(['facility_category_id', 'language_id'], 'facility_category_lang_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facility_category_translations');
    }
};
