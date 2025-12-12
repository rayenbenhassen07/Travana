<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Seed the users table.
     */
    public function run(): void
    {
        // Get default language and currency
        $defaultLanguage = \App\Models\Language::where('is_default', true)->first();
        $defaultCurrency = \App\Models\Currency::where('is_default', true)->first();

        // Create Admin User
        User::updateOrCreate(
            ['email' => 'admin@travana.tn'],
            [
                'name' => 'Admin User',
                'email' => 'admin@travana.tn',
                'password' => Hash::make('admin@travana.tn'),
                'user_type' => 'admin',
                'phone' => '+216 20 123 456',
                'date_of_birth' => '1990-01-15',
                'bio' => 'System administrator',
                'is_verified' => true,
                'is_active' => true,
                'language_id' => $defaultLanguage?->id,
                'currency_id' => $defaultCurrency?->id,
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('✅ Admin user created: admin@travana.tn / admin@travana.tn');

        // Create Regular User
        User::updateOrCreate(
            ['email' => 'user@travana.tn'],
            [
                'name' => 'John Doe',
                'email' => 'user@travana.tn',
                'password' => Hash::make('user@travana.tn'),
                'user_type' => 'user',
                'phone' => '+216 21 234 567',
                'date_of_birth' => '1995-05-20',
                'bio' => 'Travel enthusiast and explorer',
                'is_verified' => true,
                'is_active' => true,
                'language_id' => $defaultLanguage?->id,
                'currency_id' => $defaultCurrency?->id,
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('✅ Regular user created: user@travana.tn / user@travana.tn');

        // Summary
        $this->command->info('');
        $this->command->info('📊 Users Summary:');
        $this->command->info('   Admin: admin@travana.tn');
        $this->command->info('   User: user@travana.tn');
        $this->command->info('');
        $this->command->info('🔑 Default password format: same as email');
    }
}
