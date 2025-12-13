<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->foreignId('property_type_id')->constrained('property_types')->onDelete('restrict');
            $table->foreignId('user_id')->comment('Owner/Agent')->constrained('users')->onDelete('cascade');
            $table->foreignId('city_id')->constrained('cities')->onDelete('restrict');
            $table->string('address', 500)->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            
            // Property specifications
            $table->integer('room_count')->default(1);
            $table->integer('bedroom_count')->default(1);
            $table->integer('bathroom_count')->default(1);
            $table->integer('guest_capacity')->default(1);
            $table->integer('bed_count')->default(1);
            $table->decimal('area_sqm', 10, 2)->nullable()->comment('Area in square meters');
            $table->integer('floor_number')->nullable();
            $table->integer('total_floors')->nullable();
            
            // Listing type and pricing
            $table->enum('listing_type', ['sale', 'rent', 'both'])->default('rent');
            $table->decimal('sale_price', 12, 2)->nullable();
            $table->decimal('rent_price_daily', 10, 2)->nullable();
            $table->decimal('rent_price_weekly', 10, 2)->nullable();
            $table->decimal('rent_price_monthly', 10, 2)->nullable();
            $table->foreignId('currency_id')->constrained('currencies')->onDelete('restrict');
            
            // Media
            $table->json('images')->nullable()->comment('Array of image URLs');
            $table->string('video_url', 500)->nullable();
            
            // Additional info
            $table->year('year_built')->nullable();
            $table->year('last_renovated')->nullable();
            
            // Status and visibility
            $table->boolean('is_verified')->default(false);
            $table->enum('status', ['active', 'inactive', 'sold', 'rented'])->default('active');
            
            $table->timestamps();
            
            // Indexes
            $table->index('user_id');
            $table->index('city_id');
            $table->index('property_type_id');
            $table->index('status');
            $table->index('listing_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
