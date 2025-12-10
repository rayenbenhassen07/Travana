<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('short_description')->nullable();
            $table->text('long_description')->nullable();
            $table->jsonb('images')->nullable();
            $table->foreignId('category_id')->constrained('categories')->onDelete('restrict');
            $table->integer('room_count')->default(1);
            $table->integer('bathroom_count')->default(1);
            $table->integer('guest_count')->default(1);
            $table->integer('bed_count')->default(1);
            $table->foreignId('city_id')->constrained('cities')->onDelete('restrict');
            $table->string('adresse')->nullable();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->float('price');
            $table->float('lat')->nullable();
            $table->float('long')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};