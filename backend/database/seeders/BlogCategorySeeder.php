<?php

namespace Database\Seeders;

use App\Models\BlogCategory;
use Illuminate\Database\Seeder;

class BlogCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Locations en Tunisie',
                'description' => 'Articles sur les meilleures maisons, villas et hébergements à louer partout en Tunisie.',
                'icon' => 'house',
                'color' => '#4F46E5',
                'meta_title' => 'Locations en Tunisie – Maisons, appartements et villas',
                'meta_description' => 'Découvrez les meilleures locations en Tunisie : Hammamet, Sousse, Tunis, Djerba…',
                'is_active' => true,
                'order' => 1,
            ],
            [
                'name' => 'Hôtels & Hébergements',
                'description' => 'Guides des meilleurs hôtels en Tunisie pour tous les budgets.',
                'icon' => 'hotel',
                'color' => '#0EA5E9',
                'meta_title' => 'Hôtels en Tunisie – Top adresses 2025',
                'meta_description' => 'Trouvez les meilleurs hôtels en Tunisie : luxe, budget, familles, couples…',
                'is_active' => true,
                'order' => 2,
            ],
            [
                'name' => 'Excursions & Activités',
                'description' => 'Découvertes, désert, bateau pirate, quad, aventures…',
                'icon' => 'map',
                'color' => '#10B981',
                'meta_title' => 'Excursions & Activités en Tunisie',
                'meta_description' => 'Explorez les meilleures excursions en Tunisie : désert, mer, visites guidées…',
                'is_active' => true,
                'order' => 3,
            ],
            [
                'name' => 'Guides de Voyage',
                'description' => 'Conseils, itinéraires, budgets et informations pratiques pour voyager en Tunisie.',
                'icon' => 'book-open',
                'color' => '#F59E0B',
                'meta_title' => 'Guides de Voyage Tunisie',
                'meta_description' => 'Conseils de voyage, budgets, itinéraires et astuces pour visiter la Tunisie.',
                'is_active' => true,
                'order' => 4,
            ],
            [
                'name' => 'Promotions & Bons Plans',
                'description' => 'Offres spéciales, réductions, vols pas chers et deals exclusifs Travana.',
                'icon' => 'gift',
                'color' => '#EF4444',
                'meta_title' => 'Bons Plans Tunisie',
                'meta_description' => 'Offres spéciales, promotions et bons plans pour voyager moins cher.',
                'is_active' => true,
                'order' => 5,
            ],
            [
                'name' => 'Culture & Découvertes',
                'description' => 'Histoire, culture, gastronomie et lieux à visiter en Tunisie.',
                'icon' => 'sparkles',
                'color' => '#8B5CF6',
                'meta_title' => 'Culture & Découvertes en Tunisie',
                'meta_description' => 'Explorez la culture tunisienne, les traditions et les lieux incontournables.',
                'is_active' => true,
                'order' => 6,
            ],
        ];

        foreach ($categories as $category) {
            BlogCategory::create($category);
        }
    }
}
