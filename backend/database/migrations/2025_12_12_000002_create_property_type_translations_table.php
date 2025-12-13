<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('property_type_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_type_id')->constrained('property_types')->onDelete('cascade');
            $table->foreignId('language_id')->constrained('languages')->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            
            $table->unique(['property_type_id', 'language_id'], 'property_type_lang_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('property_type_translations');
    }
};
