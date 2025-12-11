<?php

namespace Database\Seeders;

use App\Models\Currency;
use App\Models\Language;
use Illuminate\Database\Seeder;

class CurrencySeeder extends Seeder
{
    /**
     * Seed sample currencies with multilingual support.
     */
    public function run(): void
    {
        $languages = Language::all()->keyBy('code');
        
        if ($languages->isEmpty()) {
            $this->command->error('No languages found. Please run LanguageSeeder first.');
            return;
        }

        $currencies = [
            [
                'code' => 'TND',
                'symbol' => 'د.ت',
                'exchange_rate' => 1.000000,
                'is_default' => true,
                'is_active' => true,
                'translations' => [
                    'en' => 'Tunisian Dinar',
                    'fr' => 'Dinar Tunisien',
                    'ar' => 'دينار تونسي',
                ],
            ],
            [
                'code' => 'USD',
                'symbol' => '$',
                'exchange_rate' => 0.320000,
                'is_default' => false,
                'is_active' => true,
                'translations' => [
                    'en' => 'US Dollar',
                    'fr' => 'Dollar Américain',
                    'ar' => 'دولار أمريكي',
                ],
            ],
            [
                'code' => 'EUR',
                'symbol' => '€',
                'exchange_rate' => 0.300000,
                'is_default' => false,
                'is_active' => true,
                'translations' => [
                    'en' => 'Euro',
                    'fr' => 'Euro',
                    'ar' => 'يورو',
                ],
            ],
            [
                'code' => 'GBP',
                'symbol' => '£',
                'exchange_rate' => 0.260000,
                'is_default' => false,
                'is_active' => true,
                'translations' => [
                    'en' => 'British Pound',
                    'fr' => 'Livre Sterling',
                    'ar' => 'جنيه إسترليني',
                ],
            ],
            [
                'code' => 'MAD',
                'symbol' => 'د.م.',
                'exchange_rate' => 3.200000,
                'is_default' => false,
                'is_active' => true,
                'translations' => [
                    'en' => 'Moroccan Dirham',
                    'fr' => 'Dirham Marocain',
                    'ar' => 'درهم مغربي',
                ],
            ],
            [
                'code' => 'SAR',
                'symbol' => 'ر.س',
                'exchange_rate' => 1.200000,
                'is_default' => false,
                'is_active' => true,
                'translations' => [
                    'en' => 'Saudi Riyal',
                    'fr' => 'Riyal Saoudien',
                    'ar' => 'ريال سعودي',
                ],
            ],
            [
                'code' => 'AED',
                'symbol' => 'د.إ',
                'exchange_rate' => 1.180000,
                'is_default' => false,
                'is_active' => true,
                'translations' => [
                    'en' => 'UAE Dirham',
                    'fr' => 'Dirham des Émirats',
                    'ar' => 'درهم إماراتي',
                ],
            ],
        ];

        foreach ($currencies as $currencyData) {
            $currency = Currency::updateOrCreate(
                ['code' => $currencyData['code']],
                [
                    'symbol' => $currencyData['symbol'],
                    'exchange_rate' => $currencyData['exchange_rate'],
                    'is_default' => $currencyData['is_default'],
                    'is_active' => $currencyData['is_active'],
                ]
            );

            // Add translations
            foreach ($currencyData['translations'] as $langCode => $name) {
                if (isset($languages[$langCode])) {
                    $currency->translations()->updateOrCreate(
                        ['language_id' => $languages[$langCode]->id],
                        ['name' => $name]
                    );
                }
            }

            $this->command->info("Currency '{$currencyData['code']}' seeded successfully.");
        }
    }
}
