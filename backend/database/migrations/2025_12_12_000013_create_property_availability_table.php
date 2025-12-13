<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('property_availability', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained('properties')->onDelete('cascade');
            $table->date('date');
            $table->boolean('is_available')->default(true);
            $table->decimal('custom_price', 10, 2)->nullable()->comment('Override daily price for this date');
            $table->string('notes', 500)->nullable();
            
            $table->unique(['property_id', 'date'], 'property_date_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('property_availability');
    }
};
