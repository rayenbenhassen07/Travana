<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed in order due to foreign key dependencies
        $this->call([
            // 1. Users first (required for listings and blogs)
            UserSeeder::class,
            
            // 2. Listing-related tables
            CategorySeeder::class,
            CitySeeder::class,
            FacilitySeeder::class,
            
            // 3. Listings (depends on users, categories, cities)
            ListingSeeder::class,
            
            // 4. Alerts (depends on listings)
            AlertSeeder::class,
            
            // 5. Reservations (depends on users and listings)
            ReservationSeeder::class,
            
            // 6. Blog-related tables
            BlogCategorySeeder::class,
            BlogTagSeeder::class,
            
            // 7. Blogs (depends on users, blog categories, blog tags)
            BlogSeeder::class,
            
            // 8. Blog comments (depends on blogs and users)
            BlogCommentSeeder::class,
            
            // 9. Blog likes (depends on blogs, comments, and users)
            BlogLikeSeeder::class,
        ]);

        $this->command->info('Database seeded successfully! 🎉');
        $this->command->info('Admin credentials: admin@travana.com / password');
        $this->command->info('---');
        $this->command->info('✓ Users, Categories, Cities, Facilities');
        $this->command->info('✓ Listings with Alerts');
        $this->command->info('✓ Reservations (past, current, future, and blocked dates)');
        $this->command->info('✓ Blog Categories, Tags, and Posts');
        $this->command->info('✓ Blog Comments and Likes');
    }
}
