<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed languages first (required for translations)
        $this->call([
            LanguageSeeder::class,
            CitySeeder::class,
            CurrencySeeder::class,
        ]);
        
        $this->command->info('✅ All seeders completed successfully!');
        $this->command->info('📍 Cities seeded with multilingual support');
        $this->command->info('💰 Currencies seeded with multilingual support');
        $this->command->info('🌍 Languages: English (default), French, Arabic');
    }
}
