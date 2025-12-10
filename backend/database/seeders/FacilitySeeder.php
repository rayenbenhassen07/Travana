<?php

namespace Database\Seeders;

use App\Models\Facility;
use Illuminate\Database\Seeder;

class FacilitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $facilities = [
            [
                'title' => 'WiFi',
                'description' => 'High-speed wireless internet',
                'logo' => '📶',
            ],
            [
                'title' => 'Swimming Pool',
                'description' => 'Private or shared swimming pool',
                'logo' => '🏊',
            ],
            [
                'title' => 'Parking',
                'description' => 'Free parking on premises',
                'logo' => '🅿️',
            ],
            [
                'title' => 'Air Conditioning',
                'description' => 'Climate control system',
                'logo' => '❄️',
            ],
            [
                'title' => 'Kitchen',
                'description' => 'Fully equipped kitchen',
                'logo' => '🍳',
            ],
            [
                'title' => 'Gym',
                'description' => 'Fitness center or equipment',
                'logo' => '💪',
            ],
            [
                'title' => 'TV',
                'description' => 'Television with cable/streaming',
                'logo' => '📺',
            ],
            [
                'title' => 'Washing Machine',
                'description' => 'In-unit laundry',
                'logo' => '🧺',
            ],
            [
                'title' => 'Pet Friendly',
                'description' => 'Pets allowed',
                'logo' => '🐕',
            ],
            [
                'title' => 'Balcony',
                'description' => 'Private balcony or terrace',
                'logo' => '🌅',
            ],
            [
                'title' => 'Beach Access',
                'description' => 'Direct access to beach',
                'logo' => '🏖️',
            ],
            [
                'title' => 'BBQ Grill',
                'description' => 'Outdoor grilling area',
                'logo' => '🍖',
            ],
            [
                'title' => 'Hot Tub',
                'description' => 'Jacuzzi or hot tub',
                'logo' => '♨️',
            ],
            [
                'title' => 'Fireplace',
                'description' => 'Indoor fireplace',
                'logo' => '🔥',
            ],
            [
                'title' => 'Garden',
                'description' => 'Private garden or yard',
                'logo' => '🌳',
            ],
            [
                'title' => 'Work Space',
                'description' => 'Dedicated workspace with desk',
                'logo' => '💼',
            ],
            [
                'title' => 'Security System',
                'description' => '24/7 security',
                'logo' => '🔒',
            ],
            [
                'title' => 'Elevator',
                'description' => 'Elevator access',
                'logo' => '🛗',
            ],
            [
                'title' => 'Wheelchair Accessible',
                'description' => 'Accessible facilities',
                'logo' => '♿',
            ],
            [
                'title' => 'Heating',
                'description' => 'Central heating system',
                'logo' => '🌡️',
            ],
        ];

        foreach ($facilities as $facility) {
            Facility::create($facility);
        }
    }
}
