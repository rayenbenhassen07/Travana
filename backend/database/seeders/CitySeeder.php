<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cities = [
            'Tunis',
            'Sfax',
            'Sousse',
            'Kairouan',
            'Bizerte',
            'Gabès',
            'Ariana',
            'Gafsa',
            'Monastir',
            'Ben Arous',
            'Kasserine',
            'Médenine',
            'Nabeul',
            'Tataouine',
            'Béja',
            'Jendouba',
            'Mahdia',
            'Sidi Bouzid',
            'Tozeur',
            'Kef',
            'Kebili',
            'Siliana',
            'Zaghouan',
            'Manouba',
        ];

        foreach ($cities as $city) {
            City::create([
                'name' => $city,
                'slug' => Str::slug($city),
            ]);
        }
    }
}
