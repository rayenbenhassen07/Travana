<?php

namespace Database\Seeders;

use App\Models\BlogTag;
use Illuminate\Database\Seeder;

class BlogTagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = [
            // Travel & Locations
            ['name' => 'Tunisie', 'description' => 'Voyages et tourisme en Tunisie', 'color' => '#EF4444'],
            ['name' => 'Hammamet', 'description' => 'Destination Hammamet', 'color' => '#3B82F6'],
            ['name' => 'Sousse', 'description' => 'Destination Sousse', 'color' => '#10B981'],
            ['name' => 'Djerba', 'description' => 'Destination Djerba', 'color' => '#F59E0B'],
            ['name' => 'Tunis', 'description' => 'Capitale Tunis', 'color' => '#8B5CF6'],
            ['name' => 'Monastir', 'description' => 'Destination Monastir', 'color' => '#06B6D4'],
            ['name' => 'Bizerte', 'description' => 'Destination Bizerte', 'color' => '#14B8A6'],
            ['name' => 'Sfax', 'description' => 'Destination Sfax', 'color' => '#F97316'],
            ['name' => 'Nabeul', 'description' => 'Destination Nabeul', 'color' => '#EC4899'],
            ['name' => 'Sahara', 'description' => 'Désert du Sahara', 'color' => '#F59E0B'],
            
            // Housing / Rentals
            ['name' => 'Maison à louer', 'description' => 'Location de maison', 'color' => '#4F46E5'],
            ['name' => 'Villa', 'description' => 'Location de villa', 'color' => '#8B5CF6'],
            ['name' => 'Villa avec piscine', 'description' => 'Villa avec piscine privée', 'color' => '#06B6D4'],
            ['name' => 'Airbnb Tunisie', 'description' => 'Locations Airbnb', 'color' => '#EF4444'],
            ['name' => 'Location Tunis', 'description' => 'Locations à Tunis', 'color' => '#3B82F6'],
            ['name' => 'Location Hammamet', 'description' => 'Locations à Hammamet', 'color' => '#10B981'],
            ['name' => 'Maison pas chère', 'description' => 'Location économique', 'color' => '#22C55E'],
            
            // Activities & Excursions
            ['name' => 'Excursion', 'description' => 'Excursions et activités', 'color' => '#10B981'],
            ['name' => 'Bateau pirate', 'description' => 'Croisière bateau pirate', 'color' => '#0EA5E9'],
            ['name' => 'Quad', 'description' => 'Excursion en quad', 'color' => '#F97316'],
            ['name' => 'Désert', 'description' => 'Excursion désert', 'color' => '#F59E0B'],
            ['name' => 'Chott el Jerid', 'description' => 'Lac salé Chott el Jerid', 'color' => '#EC4899'],
            ['name' => 'Tourisme', 'description' => 'Tourisme en Tunisie', 'color' => '#3B82F6'],
            ['name' => 'Aventure', 'description' => 'Activités aventure', 'color' => '#EF4444'],
            ['name' => 'Plage', 'description' => 'Plages de Tunisie', 'color' => '#06B6D4'],
            
            // Hotels
            ['name' => 'Hôtel 5 étoiles', 'description' => 'Hôtels de luxe', 'color' => '#A855F7'],
            ['name' => 'Hôtel famille', 'description' => 'Hôtels pour familles', 'color' => '#EC4899'],
            ['name' => 'Hôtel pas cher', 'description' => 'Hôtels économiques', 'color' => '#22C55E'],
            ['name' => 'Hôtel', 'description' => 'Hébergement hôtel', 'color' => '#0EA5E9'],
            
            // Travel Tips
            ['name' => 'Vol pas cher', 'description' => 'Billets d\'avion pas chers', 'color' => '#EF4444'],
            ['name' => 'Guide de voyage', 'description' => 'Guides et conseils voyage', 'color' => '#F59E0B'],
            ['name' => 'Budget Tunisie', 'description' => 'Budget voyage Tunisie', 'color' => '#22C55E'],
            ['name' => 'Transport Tunisie', 'description' => 'Transport en Tunisie', 'color' => '#3B82F6'],
            ['name' => 'Vacances', 'description' => 'Vacances en Tunisie', 'color' => '#10B981'],
            ['name' => 'Famille', 'description' => 'Voyage en famille', 'color' => '#EC4899'],
            ['name' => 'Voyage Tunisie', 'description' => 'Voyager en Tunisie', 'color' => '#8B5CF6'],
            ['name' => 'Astuces', 'description' => 'Astuces voyage', 'color' => '#F59E0B'],
            ['name' => 'Culture', 'description' => 'Culture tunisienne', 'color' => '#8B5CF6'],
        ];

        foreach ($tags as $tag) {
            BlogTag::create([
                'name' => $tag['name'],
                'description' => $tag['description'],
                'color' => $tag['color'],
                'usage_count' => 0,
            ]);
        }
    }
}
