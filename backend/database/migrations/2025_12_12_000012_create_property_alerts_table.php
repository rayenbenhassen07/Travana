<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('property_alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained('properties')->onDelete('cascade');
            $table->foreignId('alert_id')->constrained('alerts')->onDelete('cascade');
            
            $table->unique(['property_id', 'alert_id'], 'property_alert_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('property_alerts');
    }
};
