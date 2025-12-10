<?php

namespace Database\Seeders;

use App\Models\Listing;
use App\Models\User;
use App\Models\Category;
use App\Models\City;
use App\Models\Facility;
use Illuminate\Database\Seeder;

class ListingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::where('type', 'user')->get();
        $categories = Category::all();
        $cities = City::all();
        $facilities = Facility::all();

        // Sample listings
        $listings = [
            [
                'title' => 'Luxury Beachfront Villa in Miami',
                'short_description' => 'Stunning oceanfront villa with private beach access',
                'long_description' => 'Experience the ultimate luxury in this breathtaking beachfront villa. Features include panoramic ocean views, infinity pool, modern kitchen, spacious living areas, and direct beach access. Perfect for families or groups seeking an unforgettable vacation.',
                'images' => ['villa1.jpg', 'villa2.jpg', 'villa3.jpg'],
                'room_count' => 5,
                'bathroom_count' => 4,
                'guest_count' => 10,
                'bed_count' => 5,
                'price' => 850.00,
                'lat' => 25.7617,
                'long' => -80.1918,
                'adresse' => '123 Ocean Drive, Miami Beach',
            ],
            [
                'title' => 'Modern Downtown Apartment in New York',
                'short_description' => 'Stylish apartment in the heart of Manhattan',
                'long_description' => 'This contemporary apartment offers the perfect urban retreat. Located in prime Manhattan, walking distance to major attractions, restaurants, and shopping. Features modern amenities, city views, and professional decor.',
                'images' => ['apt1.jpg', 'apt2.jpg'],
                'room_count' => 2,
                'bathroom_count' => 2,
                'guest_count' => 4,
                'bed_count' => 2,
                'price' => 320.00,
                'lat' => 40.7580,
                'long' => -73.9855,
                'adresse' => '456 Broadway, New York',
            ],
            [
                'title' => 'Charming Parisian Studio',
                'short_description' => 'Cozy studio in the Latin Quarter',
                'long_description' => 'Authentic Parisian experience in this charming studio. Located in the historic Latin Quarter, close to Notre-Dame and the Seine. Perfect for couples seeking a romantic getaway.',
                'images' => ['paris1.jpg'],
                'room_count' => 1,
                'bathroom_count' => 1,
                'guest_count' => 2,
                'bed_count' => 1,
                'price' => 150.00,
                'lat' => 48.8566,
                'long' => 2.3522,
                'adresse' => '78 Rue Mouffetard, Paris',
            ],
            [
                'title' => 'Spacious Family House in London',
                'short_description' => 'Beautiful Victorian house near Hyde Park',
                'long_description' => 'Elegant Victorian house perfect for families. Features traditional architecture with modern conveniences. Close to Hyde Park, museums, and excellent transport links.',
                'images' => ['london1.jpg', 'london2.jpg', 'london3.jpg', 'london4.jpg'],
                'room_count' => 4,
                'bathroom_count' => 3,
                'guest_count' => 8,
                'bed_count' => 4,
                'price' => 450.00,
                'lat' => 51.5074,
                'long' => -0.1278,
                'adresse' => '22 Queensway, London',
            ],
            [
                'title' => 'Mountain Cabin in Barcelona',
                'short_description' => 'Peaceful retreat with mountain views',
                'long_description' => 'Escape to nature in this rustic mountain cabin. Surrounded by hiking trails and stunning views, yet only 30 minutes from Barcelona city center. Perfect for nature lovers.',
                'images' => ['cabin1.jpg', 'cabin2.jpg'],
                'room_count' => 3,
                'bathroom_count' => 2,
                'guest_count' => 6,
                'bed_count' => 3,
                'price' => 200.00,
                'lat' => 41.3851,
                'long' => 2.1734,
                'adresse' => 'Collserola Natural Park, Barcelona',
            ],
            [
                'title' => 'Penthouse Suite in Dubai',
                'short_description' => 'Ultra-luxury penthouse with Burj Khalifa views',
                'long_description' => 'Experience unparalleled luxury in this stunning penthouse. Floor-to-ceiling windows showcase views of the Burj Khalifa and Dubai skyline. Features include private elevator, rooftop terrace, infinity pool, and five-star amenities.',
                'images' => ['dubai1.jpg', 'dubai2.jpg', 'dubai3.jpg'],
                'room_count' => 4,
                'bathroom_count' => 5,
                'guest_count' => 8,
                'bed_count' => 4,
                'price' => 1200.00,
                'lat' => 25.2048,
                'long' => 55.2708,
                'adresse' => 'Downtown Dubai, Burj Khalifa District',
            ],
            [
                'title' => 'Cozy Studio in Tokyo',
                'short_description' => 'Compact studio in vibrant Shibuya',
                'long_description' => 'Experience Tokyo like a local in this efficient studio apartment. Located in the bustling Shibuya district, close to shopping, dining, and nightlife. Traditional Japanese touches with modern convenience.',
                'images' => ['tokyo1.jpg'],
                'room_count' => 1,
                'bathroom_count' => 1,
                'guest_count' => 2,
                'bed_count' => 1,
                'price' => 120.00,
                'lat' => 35.6762,
                'long' => 139.6503,
                'adresse' => 'Shibuya-ku, Tokyo',
            ],
            [
                'title' => 'Mediterranean Villa in Rome',
                'short_description' => 'Historic villa with garden near Colosseum',
                'long_description' => 'Stay in a beautifully restored Roman villa. Original architecture blended with modern luxury. Private garden with lemon trees, walking distance to the Colosseum and Roman Forum.',
                'images' => ['rome1.jpg', 'rome2.jpg', 'rome3.jpg'],
                'room_count' => 6,
                'bathroom_count' => 4,
                'guest_count' => 12,
                'bed_count' => 6,
                'price' => 680.00,
                'lat' => 41.9028,
                'long' => 12.4964,
                'adresse' => 'Via Labicana, Rome',
            ],
        ];

        foreach ($listings as $listingData) {
            // Create listing
            $listing = Listing::create([
                'title' => $listingData['title'],
                'short_description' => $listingData['short_description'],
                'long_description' => $listingData['long_description'],
                'images' => $listingData['images'],
                'room_count' => $listingData['room_count'],
                'bathroom_count' => $listingData['bathroom_count'],
                'guest_count' => $listingData['guest_count'],
                'bed_count' => $listingData['bed_count'],
                'price' => $listingData['price'],
                'lat' => $listingData['lat'],
                'long' => $listingData['long'],
                'adresse' => $listingData['adresse'],
                'user_id' => $users->random()->id,
                'category_id' => $categories->random()->id,
                'city_id' => $cities->random()->id,
            ]);

            // Attach random facilities (3-8 facilities per listing)
            $randomFacilities = $facilities->random(rand(3, 8));
            $listing->facilities()->attach($randomFacilities->pluck('id'));
        }

        // Create 15 more random listings
        for ($i = 0; $i < 15; $i++) {
            $listing = Listing::create([
                'title' => fake()->sentence(6),
                'short_description' => fake()->sentence(10),
                'long_description' => fake()->paragraphs(3, true),
                'images' => [fake()->imageUrl(), fake()->imageUrl()],
                'room_count' => rand(1, 6),
                'bathroom_count' => rand(1, 4),
                'guest_count' => rand(2, 12),
                'bed_count' => rand(1, 6),
                'price' => rand(80, 1000),
                'lat' => fake()->latitude(),
                'long' => fake()->longitude(),
                'adresse' => fake()->address(),
                'user_id' => $users->random()->id,
                'category_id' => $categories->random()->id,
                'city_id' => $cities->random()->id,
            ]);

            $randomFacilities = $facilities->random(rand(3, 10));
            $listing->facilities()->attach($randomFacilities->pluck('id'));
        }
    }
}
