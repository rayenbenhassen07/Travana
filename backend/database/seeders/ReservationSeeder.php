<?php

namespace Database\Seeders;

use App\Models\ListingReservation;
use App\Models\User;
use App\Models\Listing;
use App\Models\Currency;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ReservationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::where('type', 'user')->get();
        $listings = Listing::all();
        $currency = Currency::first(); // Get default currency

        // Create past reservations
        for ($i = 0; $i < 20; $i++) {
            $listing = $listings->random();
            $user = $users->random();
            
            $startDate = Carbon::now()->subDays(rand(30, 180));
            $duration = rand(2, 14); // 2 to 14 days
            $endDate = $startDate->copy()->addDays($duration);
            
            $perNight = $listing->price;
            $subtotal = $perNight * $duration;
            $serviceFee = round($subtotal * 0.10, 2);
            $total = $subtotal + $serviceFee;
            
            ListingReservation::create([
                'user_id' => $user->id,
                'listing_id' => $listing->id,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'nights' => $duration,
                'per_night' => $perNight,
                'subtotal' => $subtotal,
                'service_fee' => $serviceFee,
                'total' => $total,
                'currency_id' => $currency?->id,
                'is_blocked' => false,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => fake()->phoneNumber(),
                'sex' => fake()->randomElement(['male', 'female']),
                'client_type' => fake()->randomElement(['family', 'group', 'one']),
            ]);
        }

        // Create current/ongoing reservations
        for ($i = 0; $i < 5; $i++) {
            $listing = $listings->random();
            $user = $users->random();
            
            $startDate = Carbon::now()->subDays(rand(1, 5));
            $duration = rand(5, 14);
            $endDate = $startDate->copy()->addDays($duration);
            
            $perNight = $listing->price;
            $subtotal = $perNight * $duration;
            $serviceFee = round($subtotal * 0.10, 2);
            $total = $subtotal + $serviceFee;
            
            ListingReservation::create([
                'user_id' => $user->id,
                'listing_id' => $listing->id,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'nights' => $duration,
                'per_night' => $perNight,
                'subtotal' => $subtotal,
                'service_fee' => $serviceFee,
                'total' => $total,
                'currency_id' => $currency?->id,
                'is_blocked' => false,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => fake()->phoneNumber(),
                'sex' => fake()->randomElement(['male', 'female']),
                'client_type' => fake()->randomElement(['family', 'group', 'one']),
            ]);
        }

        // Create future reservations
        for ($i = 0; $i < 15; $i++) {
            $listing = $listings->random();
            $user = $users->random();
            
            $startDate = Carbon::now()->addDays(rand(1, 90));
            $duration = rand(3, 21);
            $endDate = $startDate->copy()->addDays($duration);
            
            $perNight = $listing->price;
            $subtotal = $perNight * $duration;
            $serviceFee = round($subtotal * 0.10, 2);
            $total = $subtotal + $serviceFee;
            
            ListingReservation::create([
                'user_id' => $user->id,
                'listing_id' => $listing->id,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'nights' => $duration,
                'per_night' => $perNight,
                'subtotal' => $subtotal,
                'service_fee' => $serviceFee,
                'total' => $total,
                'currency_id' => $currency?->id,
                'is_blocked' => false,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => fake()->phoneNumber(),
                'sex' => fake()->randomElement(['male', 'female']),
                'client_type' => fake()->randomElement(['family', 'group', 'one']),
            ]);
        }

        // Create a few blocked dates (maintenance, owner use, etc.)
        for ($i = 0; $i < 5; $i++) {
            $listing = $listings->random();
            
            $startDate = Carbon::now()->addDays(rand(10, 60));
            $duration = rand(3, 10);
            $endDate = $startDate->copy()->addDays($duration);
            
            ListingReservation::create([
                'user_id' => null,
                'listing_id' => $listing->id,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'nights' => $duration,
                'per_night' => 0,
                'subtotal' => 0,
                'service_fee' => 0,
                'total' => 0,
                'currency_id' => $currency?->id,
                'is_blocked' => true,
                'name' => null,
                'email' => null,
                'phone' => null,
                'sex' => null,
                'client_type' => null,
            ]);
        }
    }
}
