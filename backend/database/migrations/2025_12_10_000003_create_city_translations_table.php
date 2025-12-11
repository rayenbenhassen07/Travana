<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('city_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('city_id')->constrained('cities')->onDelete('cascade');
            $table->foreignId('language_id')->constrained('languages')->onDelete('cascade');
            $table->string('name');
            
            // Unique constraint to ensure one translation per language per city
            $table->unique(['city_id', 'language_id'], 'city_lang_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('city_translations');
    }
};
