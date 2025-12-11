<?php

namespace Database\Seeders;

use App\Models\Language;
use Illuminate\Database\Seeder;

class LanguageSeeder extends Seeder
{
    public function run(): void
    {
        $languages = [
            [
                'code' => 'en',
                'name' => 'English',
                'is_default' => true,
                'is_active' => true,
            ],
            [
                'code' => 'fr',
                'name' => 'Français',
                'is_default' => false,
                'is_active' => true,
            ],
            [
                'code' => 'ar',
                'name' => 'العربية',
                'is_default' => false,
                'is_active' => true,
            ],
        ];

        foreach ($languages as $language) {
            Language::updateOrCreate(
                ['code' => $language['code']],
                $language
            );
        }
    }
}
