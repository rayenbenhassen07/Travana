<?php

namespace Database\Seeders;

use App\Models\Currency;
use Illuminate\Database\Seeder;

class CurrencySeeder extends Seeder
{
    public function run(): void
    {
       $currencies = [
            [
                'name' => 'Dinar tunisien',
                'label' => 'TND',
                'symbol' => 'DT',
                'exchange_rate' => 1.000000, // Base currency
            ],
            [
                'name' => 'US Dollar',
                'label' => 'USD',
                'symbol' => '$',
                'exchange_rate' => 2.9, // 1 USD ≈ 3.13 TND
            ],
            [
                'name' => 'Euro',
                'label' => 'EUR',
                'symbol' => '€',
                'exchange_rate' => 3.35, // 1 EUR ≈ 3.35 TND
            ],
        ];


        foreach ($currencies as $currency) {
            Currency::updateOrCreate(
                ['label' => $currency['label']],
                $currency
            );
        }
    }
}
