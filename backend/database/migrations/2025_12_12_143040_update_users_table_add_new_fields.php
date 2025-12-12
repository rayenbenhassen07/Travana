<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop the old 'type' column if it exists
            if (Schema::hasColumn('users', 'type')) {
                $table->dropColumn('type');
            }
            
            // Drop 'sex' column if it exists (from old schema)
            if (Schema::hasColumn('users', 'sex')) {
                $table->dropColumn('sex');
            }
            
  
            $table->date('date_of_birth')->nullable()->after('phone');
            $table->string('profile_photo')->nullable()->after('date_of_birth');
            $table->text('bio')->nullable()->after('profile_photo');
            $table->enum('user_type', ['user', 'admin'])->default('user')->after('bio')->index();
            $table->boolean('is_verified')->default(false)->comment('Verified by admin/platform')->after('user_type');
            $table->boolean('is_active')->default(true)->after('is_verified')->index();
            $table->string('language_preference', 10)->default('en')->after('is_active');
            $table->string('currency_preference', 10)->default('TND')->after('language_preference');
            $table->timestamp('last_login_at')->nullable()->after('remember_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Remove new columns
            $table->dropColumn([
            
                'date_of_birth',
                'profile_photo',
                'bio',
                'user_type',
                'is_verified',
                'is_active',
                'language_preference',
                'currency_preference',
                'last_login_at'
            ]);
            
            // Restore old columns
            $table->string('sex')->nullable()->after('email');
            $table->enum('type', ['user', 'admin'])->default('user')->after('sex');
        });
    }
};
