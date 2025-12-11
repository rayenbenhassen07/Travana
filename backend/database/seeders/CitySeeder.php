<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Language;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    /**
     * Seed sample cities with multilingual support.
     */
    public function run(): void
    {
        $languages = Language::all()->keyBy('code');
        
        if ($languages->isEmpty()) {
            $this->command->error('No languages found. Please run LanguageSeeder first.');
            return;
        }

        $cities = [
            [
                'slug' => 'tunis',
                'latitude' => 36.8065,
                'longitude' => 10.1815,
                'is_active' => true,
                'translations' => [
                    'en' => 'Tunis',
                    'fr' => 'Tunis',
                    'ar' => 'تونس',
                ],
            ],
            [
                'slug' => 'sfax',
                'latitude' => 34.7406,
                'longitude' => 10.7603,
                'is_active' => true,
                'translations' => [
                    'en' => 'Sfax',
                    'fr' => 'Sfax',
                    'ar' => 'صفاقس',
                ],
            ],
            [
                'slug' => 'sousse',
                'latitude' => 35.8256,
                'longitude' => 10.6369,
                'is_active' => true,
                'translations' => [
                    'en' => 'Sousse',
                    'fr' => 'Sousse',
                    'ar' => 'سوسة',
                ],
            ],
            [
                'slug' => 'hammamet',
                'latitude' => 36.4,
                'longitude' => 10.6167,
                'is_active' => true,
                'translations' => [
                    'en' => 'Hammamet',
                    'fr' => 'Hammamet',
                    'ar' => 'الحمامات',
                ],
            ],
            [
                'slug' => 'djerba',
                'latitude' => 33.8076,
                'longitude' => 10.8451,
                'is_active' => true,
                'translations' => [
                    'en' => 'Djerba',
                    'fr' => 'Djerba',
                    'ar' => 'جربة',
                ],
            ],
            [
                'slug' => 'bizerte',
                'latitude' => 37.2744,
                'longitude' => 9.8739,
                'is_active' => true,
                'translations' => [
                    'en' => 'Bizerte',
                    'fr' => 'Bizerte',
                    'ar' => 'بنزرت',
                ],
            ],
            [
                'slug' => 'gabes',
                'latitude' => 33.8815,
                'longitude' => 10.0982,
                'is_active' => true,
                'translations' => [
                    'en' => 'Gabes',
                    'fr' => 'Gabès',
                    'ar' => 'قابس',
                ],
            ],
            [
                'slug' => 'kairouan',
                'latitude' => 35.6781,
                'longitude' => 10.0963,
                'is_active' => true,
                'translations' => [
                    'en' => 'Kairouan',
                    'fr' => 'Kairouan',
                    'ar' => 'القيروان',
                ],
            ],
        ];

        foreach ($cities as $cityData) {
            $city = City::updateOrCreate(
                ['slug' => $cityData['slug']],
                [
                    'latitude' => $cityData['latitude'],
                    'longitude' => $cityData['longitude'],
                    'is_active' => $cityData['is_active'],
                ]
            );

            // Add translations
            foreach ($cityData['translations'] as $langCode => $name) {
                if (isset($languages[$langCode])) {
                    $city->translations()->updateOrCreate(
                        ['language_id' => $languages[$langCode]->id],
                        ['name' => $name]
                    );
                }
            }

            $this->command->info("City '{$cityData['slug']}' seeded successfully.");
        }
    }
}
