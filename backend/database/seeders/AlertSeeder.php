<?php

namespace Database\Seeders;

use App\Models\Alert;
use App\Models\Listing;
use Illuminate\Database\Seeder;

class AlertSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $alerts = [
            [
                'title' => 'Beachfront',
                'description' => 'Direct access to the beach',
                'logo' => '🏖️',
            ],
            [
                'title' => 'Mountain View',
                'description' => 'Stunning mountain views',
                'logo' => '⛰️',
            ],
            [
                'title' => 'City Center',
                'description' => 'Located in the heart of the city',
                'logo' => '🏙️',
            ],
            [
                'title' => 'Waterfront',
                'description' => 'Located on the waterfront',
                'logo' => '🌊',
            ],
            [
                'title' => 'Historic District',
                'description' => 'In a historic neighborhood',
                'logo' => '🏛️',
            ],
            [
                'title' => 'Quiet Area',
                'description' => 'Peaceful and quiet location',
                'logo' => '🤫',
            ],
            [
                'title' => 'Near Transit',
                'description' => 'Close to public transportation',
                'logo' => '🚇',
            ],
            [
                'title' => 'Pet Friendly',
                'description' => 'Pets are welcome',
                'logo' => '🐾',
            ],
            [
                'title' => 'Family Friendly',
                'description' => 'Great for families with children',
                'logo' => '👨‍👩‍👧‍👦',
            ],
            [
                'title' => 'Romantic Getaway',
                'description' => 'Perfect for couples',
                'logo' => '💑',
            ],
            [
                'title' => 'Eco-Friendly',
                'description' => 'Sustainable and eco-conscious property',
                'logo' => '♻️',
            ],
            [
                'title' => 'Luxury',
                'description' => 'High-end luxury accommodation',
                'logo' => '💎',
            ],
            [
                'title' => 'Budget Friendly',
                'description' => 'Affordable accommodation',
                'logo' => '💰',
            ],
            [
                'title' => 'Long Term Stay',
                'description' => 'Suitable for extended stays',
                'logo' => '📅',
            ],
            [
                'title' => 'Business Travel',
                'description' => 'Ideal for business travelers',
                'logo' => '💼',
            ],
        ];

        $createdAlerts = [];
        foreach ($alerts as $alert) {
            $createdAlerts[] = Alert::create($alert);
        }

        // Attach random alerts to listings (2-5 alerts per listing)
        $listings = Listing::all();
        foreach ($listings as $listing) {
            $randomAlerts = collect($createdAlerts)->random(rand(2, 5));
            $listing->alerts()->attach($randomAlerts->pluck('id'));
        }
    }
}
