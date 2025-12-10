<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->foreignId('listing_id')->constrained('listings')->onDelete('cascade');
            $table->date('start_date');
            $table->date('end_date');
            $table->json('prices')->nullable();
            $table->boolean('is_blocked')->default(false);
            $table->json('guest_details')->nullable();
            $table->json('contact')->nullable();
            $table->integer('guest_count')->nullable();
            $table->text('details')->nullable();
            $table->enum('client_type', ['family', 'group', 'one'])->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};