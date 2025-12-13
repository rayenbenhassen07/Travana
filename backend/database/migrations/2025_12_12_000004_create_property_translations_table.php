<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('property_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained('properties')->onDelete('cascade');
            $table->foreignId('language_id')->constrained('languages')->onDelete('cascade');
            $table->string('name');
            $table->text('short_description')->nullable();
            $table->text('long_description')->nullable();
            
            $table->unique(['property_id', 'language_id'], 'property_lang_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('property_translations');
    }
};
