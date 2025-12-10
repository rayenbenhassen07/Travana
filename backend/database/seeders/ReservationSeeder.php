<?php

namespace Database\Seeders;

use App\Models\Reservation;
use App\Models\User;
use App\Models\Listing;
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

        // Create past reservations
        for ($i = 0; $i < 20; $i++) {
            $listing = $listings->random();
            $user = $users->random();
            $guestCount = rand(1, $listing->guest_count);
            
            $startDate = Carbon::now()->subDays(rand(30, 180));
            $duration = rand(2, 14); // 2 to 14 days
            $endDate = $startDate->copy()->addDays($duration);
            
            $totalPrice = $listing->price * $duration;
            $cleaningFee = round($listing->price * 0.15, 2);
            $serviceFee = round($totalPrice * 0.10, 2);
            $taxes = round($totalPrice * 0.08, 2);
            
            Reservation::create([
                'user_id' => $user->id,
                'listing_id' => $listing->id,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'prices' => [
                    'nightly_rate' => $listing->price,
                    'nights' => $duration,
                    'subtotal' => $totalPrice,
                    'cleaning_fee' => $cleaningFee,
                    'service_fee' => $serviceFee,
                    'taxes' => $taxes,
                    'total' => $totalPrice + $cleaningFee + $serviceFee + $taxes,
                ],
                'is_blocked' => false,
                'guest_details' => [
                    'first_name' => fake()->firstName(),
                    'last_name' => fake()->lastName(),
                    'email' => $user->email,
                    'phone' => fake()->phoneNumber(),
                ],
                'contact' => [
                    'email' => $user->email,
                    'phone' => fake()->phoneNumber(),
                    'preferred_contact' => fake()->randomElement(['email', 'phone', 'both']),
                ],
                'guest_count' => $guestCount,
                'details' => fake()->optional()->paragraph(),
                'client_type' => fake()->randomElement(['family', 'group', 'one']),
            ]);
        }

        // Create current/ongoing reservations
        for ($i = 0; $i < 5; $i++) {
            $listing = $listings->random();
            $user = $users->random();
            $guestCount = rand(1, $listing->guest_count);
            
            $startDate = Carbon::now()->subDays(rand(1, 5));
            $duration = rand(5, 14);
            $endDate = $startDate->copy()->addDays($duration);
            
            $totalPrice = $listing->price * $duration;
            $cleaningFee = round($listing->price * 0.15, 2);
            $serviceFee = round($totalPrice * 0.10, 2);
            $taxes = round($totalPrice * 0.08, 2);
            
            Reservation::create([
                'user_id' => $user->id,
                'listing_id' => $listing->id,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'prices' => [
                    'nightly_rate' => $listing->price,
                    'nights' => $duration,
                    'subtotal' => $totalPrice,
                    'cleaning_fee' => $cleaningFee,
                    'service_fee' => $serviceFee,
                    'taxes' => $taxes,
                    'total' => $totalPrice + $cleaningFee + $serviceFee + $taxes,
                ],
                'is_blocked' => false,
                'guest_details' => [
                    'first_name' => fake()->firstName(),
                    'last_name' => fake()->lastName(),
                    'email' => $user->email,
                    'phone' => fake()->phoneNumber(),
                ],
                'contact' => [
                    'email' => $user->email,
                    'phone' => fake()->phoneNumber(),
                    'preferred_contact' => fake()->randomElement(['email', 'phone', 'both']),
                ],
                'guest_count' => $guestCount,
                'details' => fake()->optional()->paragraph(),
                'client_type' => fake()->randomElement(['family', 'group', 'one']),
            ]);
        }

        // Create future reservations
        for ($i = 0; $i < 15; $i++) {
            $listing = $listings->random();
            $user = $users->random();
            $guestCount = rand(1, $listing->guest_count);
            
            $startDate = Carbon::now()->addDays(rand(1, 90));
            $duration = rand(3, 21);
            $endDate = $startDate->copy()->addDays($duration);
            
            $totalPrice = $listing->price * $duration;
            $cleaningFee = round($listing->price * 0.15, 2);
            $serviceFee = round($totalPrice * 0.10, 2);
            $taxes = round($totalPrice * 0.08, 2);
            
            Reservation::create([
                'user_id' => $user->id,
                'listing_id' => $listing->id,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'prices' => [
                    'nightly_rate' => $listing->price,
                    'nights' => $duration,
                    'subtotal' => $totalPrice,
                    'cleaning_fee' => $cleaningFee,
                    'service_fee' => $serviceFee,
                    'taxes' => $taxes,
                    'total' => $totalPrice + $cleaningFee + $serviceFee + $taxes,
                ],
                'is_blocked' => false,
                'guest_details' => [
                    'first_name' => fake()->firstName(),
                    'last_name' => fake()->lastName(),
                    'email' => $user->email,
                    'phone' => fake()->phoneNumber(),
                ],
                'contact' => [
                    'email' => $user->email,
                    'phone' => fake()->phoneNumber(),
                    'preferred_contact' => fake()->randomElement(['email', 'phone', 'both']),
                ],
                'guest_count' => $guestCount,
                'details' => fake()->optional()->paragraph(),
                'client_type' => fake()->randomElement(['family', 'group', 'one']),
            ]);
        }

        // Create a few blocked dates (maintenance, owner use, etc.)
        for ($i = 0; $i < 5; $i++) {
            $listing = $listings->random();
            
            $startDate = Carbon::now()->addDays(rand(10, 60));
            $duration = rand(3, 10);
            $endDate = $startDate->copy()->addDays($duration);
            
            Reservation::create([
                'user_id' => null, // No user for blocked dates
                'listing_id' => $listing->id,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'prices' => null,
                'is_blocked' => true,
                'guest_details' => null,
                'contact' => null,
                'guest_count' => 0,
                'details' => fake()->randomElement([
                    'Property maintenance',
                    'Owner personal use',
                    'Renovation work',
                    'Deep cleaning',
                    'Property inspection',
                ]),
                'client_type' => null,
            ]);
        }
    }
}
