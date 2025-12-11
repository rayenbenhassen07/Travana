<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('currency_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('currency_id')->constrained('currencies')->onDelete('cascade');
            $table->foreignId('language_id')->constrained('languages')->onDelete('cascade');
            $table->string('name')->comment('US Dollar, Euro, Dinar Tunisien');
            
            // Unique constraint to ensure one translation per language per currency
            $table->unique(['currency_id', 'language_id'], 'currency_lang_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('currency_translations');
    }
};
