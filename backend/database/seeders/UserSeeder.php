<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@travana.tn',
            'password' => Hash::make('admin@travana.tn'),
            'type' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Create regular test user
        User::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => Hash::make('password'),
            'type' => 'user',
            'email_verified_at' => now(),
        ]);

        // Create property owners (regular users who will have listings)
        User::create([
            'name' => 'Sarah Johnson',
            'email' => 'sarah@example.com',
            'password' => Hash::make('password'),
            'type' => 'user',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Michael Brown',
            'email' => 'michael@example.com',
            'password' => Hash::make('password'),
            'type' => 'user',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Emily Davis',
            'email' => 'emily@example.com',
            'password' => Hash::make('password'),
            'type' => 'user',
            'email_verified_at' => now(),
        ]);

        // Create additional random users
        User::factory(10)->create();
    }
}
