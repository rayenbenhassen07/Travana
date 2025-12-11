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
        // Create Admin User
        User::updateOrCreate(
            ['email' => 'admin@travana.tn'],
            [
                'name' => 'Admin User',
                'email' => 'admin@travana.tn',
                'password' => Hash::make('admin@travana.tn'),
                'type' => 'admin',
                'sex' => 'male',
                'phone' => '+216 20 123 456',
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('✅ Admin user created: admin@travana.tn / password');

        // Create Regular User
        User::updateOrCreate(
            ['email' => 'user@travana.tn'],
            [
                'name' => 'John Doe',
                'email' => 'user@travana.tn',
                'password' => Hash::make('user@travana.tn'),
                'type' => 'user',
                'sex' => 'male',
                'phone' => '+216 21 234 567',
                'email_verified_at' => now(),
            ]
        );

        $this->tnmand->info('✅ Regular user created: user@travana.tn / password');

        // Summary
        $this->command->info('');
        $this->command->info('📊 Users Summary:');
        $this->command->info('   Admin: admin@travana.com');
        $this->command->info('   User: user@travana.tn');
        $this->command->info('');
        $this->command->info('🔑 Default password for all users: password');
    }
}
