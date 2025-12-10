<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'title' => 'Villa',
                'description' => 'Luxurious villas with premium amenities',
                'logo' => '🏡',
            ],
            [
                'title' => 'Apartment',
                'description' => 'Comfortable apartments in the city',
                'logo' => '🏢',
            ],
            [
                'title' => 'House',
                'description' => 'Cozy houses for family stays',
                'logo' => '🏠',
            ],
            [
                'title' => 'Studio',
                'description' => 'Compact studios perfect for solo travelers',
                'logo' => '🏘️',
            ],
            [
                'title' => 'Cottage',
                'description' => 'Charming cottages in scenic locations',
                'logo' => '🛖',
            ],
            [
                'title' => 'Penthouse',
                'description' => 'Exclusive penthouses with panoramic views',
                'logo' => '🏙️',
            ],
            [
                'title' => 'Beach House',
                'description' => 'Beachfront properties with ocean views',
                'logo' => '🏖️',
            ],
            [
                'title' => 'Cabin',
                'description' => 'Rustic cabins in nature',
                'logo' => '🏔️',
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
