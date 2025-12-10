<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Drop the old reservations table
        Schema::dropIfExists('reservations');

        // Create the new listings_reservations table
        Schema::create('listings_reservations', function (Blueprint $table) {
            $table->id();
            $table->string('ref')->unique();
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('is_blocked')->default(false);
            $table->string('name')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->enum('sex', ['male', 'female'])->nullable();
            $table->enum('client_type', ['family', 'group', 'one'])->nullable();
            $table->integer('nights');
            $table->decimal('total', 12, 2)->nullable();
            $table->decimal('subtotal', 12, 2)->nullable();
            $table->decimal('per_night', 12, 2)->nullable();
            $table->decimal('service_fee', 12, 2)->nullable();
            $table->foreignId('currency_id')->nullable()->constrained('currencies')->onDelete('set null');
            $table->foreignId('listing_id')->constrained('listings')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('listings_reservations');

        // Recreate the old reservations table
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
};
