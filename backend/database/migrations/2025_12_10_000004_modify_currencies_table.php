<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('currencies', function (Blueprint $table) {
            // Remove columns that will be in translations
            $table->dropColumn(['name', 'label']);
            
            // Add new columns
            $table->string('code', 10)->unique()->after('id')->comment('USD, EUR, TND');
            $table->boolean('is_default')->default(false)->after('exchange_rate');
            $table->boolean('is_active')->default(true)->after('is_default');
        });
    }

    public function down(): void
    {
        Schema::table('currencies', function (Blueprint $table) {
            // Restore the removed columns
            $table->string('name')->after('id');
            $table->string('label')->after('name');
            
            // Remove the added columns
            $table->dropUnique(['code']);
            $table->dropColumn(['code', 'is_default', 'is_active']);
        });
    }
};
