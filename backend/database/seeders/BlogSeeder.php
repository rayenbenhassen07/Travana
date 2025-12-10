<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Blog;
use App\Models\BlogCategory;
use App\Models\BlogTag;
use App\Models\User;
use Carbon\Carbon;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get admin user as author
        $author = User::where('type', 'admin')->first();

        // Get categories and tags for relationships
        $categories = BlogCategory::all();
        $tags = BlogTag::all();

        // Helper function to get category by name
        $getCategory = function($name) use ($categories) {
            return $categories->firstWhere('name', $name);
        };

        // Helper function to get tags by names
        $getTags = function($names) use ($tags) {
            return $tags->whereIn('name', $names);
        };

        // Create Sample Blogs
        $blogs = [
            [
                'title' => 'Top 10 Maisons à Louer à Hammamet (Guide 2025)',
                'excerpt' => 'Découvrez les meilleures maisons et villas à louer à Hammamet en 2025 : prix, photos, quartiers, conseils et recommandations Travana.',
                'content' => '<h2>Introduction</h2><p>Hammamet est l\'une des destinations touristiques les plus prisées de Tunisie. Entre ses plages magnifiques, sa médina historique et son ambiance festive, c\'est l\'endroit idéal pour des vacances inoubliables.</p><h2>Les Meilleurs Quartiers</h2><h3>1. Yasmine Hammamet</h3><p>Quartier moderne avec marina, restaurants et centres commerciaux. Idéal pour les familles.</p><h3>2. Médina de Hammamet</h3><p>Cœur historique avec ses maisons traditionnelles et son charme authentique.</p><h3>3. Hammamet Nord</h3><p>Zone résidentielle calme, proche des plages et des commodités.</p><h2>Types de Locations</h2><p>Villas avec piscine privée, maisons de ville, appartements en bord de mer... Il y en a pour tous les budgets et tous les besoins.</p><h2>Conseils Pratiques</h2><p>Réservez tôt pour bénéficier des meilleurs prix, vérifiez la proximité des plages et des commerces, et lisez attentivement les avis.</p><h2>Pourquoi Choisir Travana ?</h2><p>Chez Travana, nous vérifions personnellement toutes nos propriétés et offrons un support client 24/7.</p>',
                'main_image' => 'https://picsum.photos/seed/hammamet/1200/800',
                'thumbnail' => 'https://picsum.photos/seed/hammamet/400/300',
                'author_id' => $author->id,
                'meta_title' => 'Maisons à louer à Hammamet – Guide complet 2025',
                'meta_description' => 'Découvrez notre sélection des meilleures locations à Hammamet : villas, maisons pas chères, quartiers, prix et conseils.',
                'meta_keywords' => 'Hammamet, location Hammamet, villa Hammamet, maison à louer, Tunisie',
                'published_at' => Carbon::now()->subDays(10),
                'is_featured' => true,
                'views_count' => 320,
                'reading_time' => 7,
                'category_names' => ['Locations en Tunisie'],
                'tag_names' => ['Hammamet', 'Maison à louer', 'Villa', 'Tunisie'],
            ],
            [
                'title' => 'Les Meilleures Excursions à Tunis en 2025 (Désert, Bateau, Medina)',
                'excerpt' => 'Voici les excursions incontournables à Tunis : désert, Sidi Bou Saïd, Medina, croisières en mer et activités familiales.',
                'content' => '<h2>Découvrez Tunis et ses Environs</h2><p>La capitale tunisienne regorge d\'activités passionnantes pour tous les goûts.</p><h2>Top 5 des Excursions</h2><h3>1. La Médina de Tunis</h3><p>Classée au patrimoine mondial de l\'UNESCO, c\'est un labyrinthe fascinant de souks, mosquées et palais.</p><h3>2. Sidi Bou Saïd</h3><p>Village pittoresque aux maisons blanches et bleues, avec une vue spectaculaire sur la mer.</p><h3>3. Site Archéologique de Carthage</h3><p>Ruines romaines impressionnantes avec vues panoramiques.</p><h3>4. Excursion dans le Désert</h3><p>Partez à l\'aventure dans le Sahara : dunes, oasis et nuit sous les étoiles.</p><h3>5. Croisière en Bateau Pirate</h3><p>Sortie en mer idéale pour les familles, avec animations et baignade.</p><h2>Réservez avec Travana</h2><p>Toutes nos excursions sont encadrées par des guides professionnels francophones.</p>',
                'main_image' => 'https://picsum.photos/seed/tunis/1200/800',
                'thumbnail' => 'https://picsum.photos/seed/tunis/400/300',
                'author_id' => $author->id,
                'meta_title' => 'Excursions Tunis 2025 – Les meilleures activités',
                'meta_description' => 'Explorez les meilleures excursions à Tunis : désert, quad, Medina, croisières et aventures familiales.',
                'meta_keywords' => 'Tunis, excursions Tunis, Sidi Bou Said, Carthage, désert Tunisie',
                'published_at' => Carbon::now()->subDays(7),
                'is_featured' => true,
                'views_count' => 285,
                'reading_time' => 9,
                'category_names' => ['Excursions & Activités'],
                'tag_names' => ['Tunis', 'Excursion', 'Bateau pirate', 'Sahara'],
            ],
            [
                'title' => 'Top 5 Hôtels à Djerba Pour Familles (2025)',
                'excerpt' => 'Une sélection des meilleurs hôtels à Djerba pour les familles : piscines, animations, plage, services et prix.',
                'content' => '<h2>Djerba, l\'Île Paradisiaque</h2><p>Djerba est la destination familiale par excellence en Tunisie. Plages de sable fin, eaux turquoise et hôtels all-inclusive parfaits pour les enfants.</p><h2>Notre Sélection d\'Hôtels Familiaux</h2><h3>1. Hôtels avec Clubs Enfants</h3><p>Animations quotidiennes, piscines pour enfants, aires de jeux et baby-sitting.</p><h3>2. Formule All-Inclusive</h3><p>Repas, boissons et activités inclus - parfait pour maîtriser son budget.</p><h3>3. Accès Direct à la Plage</h3><p>Profitez de la plage sans avoir à prendre la voiture.</p><h2>Services et Équipements</h2><p>Piscines chauffées, terrains de sport, spa pour les parents, restaurants thématiques.</p><h2>Meilleure Période</h2><p>Avril à juin et septembre à octobre : climat parfait et tarifs avantageux.</p><h2>Réservez avec Travana</h2><p>Meilleurs prix garantis et service client francophone.</p>',
                'main_image' => 'https://picsum.photos/seed/djerba/1200/800',
                'thumbnail' => 'https://picsum.photos/seed/djerba/400/300',
                'author_id' => $author->id,
                'meta_title' => 'Hôtels Djerba Famille – Top 5',
                'meta_description' => 'Découvrez les meilleurs hôtels à Djerba pour familles en 2025 : services, piscines et accès plage.',
                'meta_keywords' => 'Djerba, hôtel Djerba, famille, vacances Tunisie, all inclusive',
                'published_at' => Carbon::now()->subDays(5),
                'is_featured' => false,
                'views_count' => 198,
                'reading_time' => 6,
                'category_names' => ['Hôtels & Hébergements'],
                'tag_names' => ['Djerba', 'Hôtel', 'Vacances', 'Famille'],
            ],
            [
                'title' => 'Guide Complet : Comment Trouver un Vol Pas Cher Depuis la Tunisie',
                'excerpt' => 'Astuces simples et efficaces pour trouver des vols pas chers depuis Tunis, Enfidha, Monastir ou Djerba.',
                'content' => '<h2>Voyager Moins Cher Depuis la Tunisie</h2><p>Quelques astuces vous permettront d\'économiser des centaines de dinars sur vos billets d\'avion.</p><h2>Les Meilleures Stratégies</h2><h3>1. Réservez au Bon Moment</h3><p>2 à 3 mois à l\'avance pour les vols internationaux, 6 semaines pour l\'Europe.</p><h3>2. Comparez les Aéroports</h3><p>Tunis-Carthage, Enfidha, Monastir, Djerba... Les prix varient énormément.</p><h3>3. Soyez Flexible sur les Dates</h3><p>Partir un mardi ou mercredi peut vous faire économiser 30% ou plus.</p><h3>4. Utilisez les Comparateurs</h3><p>Skyscanner, Google Flights, Momondo... Comparez avant de réserver.</p><h3>5. Alertes de Prix</h3><p>Configurez des alertes pour être informé des baisses de prix.</p><h2>Les Meilleures Compagnies</h2><p>Tunisair, Nouvelair pour les vols domestiques. Ryanair, easyJet pour l\'Europe à petit prix.</p><h2>Conseil Bonus</h2><p>Réservez vos hébergements via Travana pour profiter de packages vols + hôtels avantageux.</p>',
                'main_image' => 'https://picsum.photos/seed/vol/1200/800',
                'thumbnail' => 'https://picsum.photos/seed/vol/400/300',
                'author_id' => $author->id,
                'meta_title' => 'Vols pas chers Tunisie – Guide complet',
                'meta_description' => 'Découvrez les meilleures astuces pour trouver des vols pas chers depuis la Tunisie en 2025.',
                'meta_keywords' => 'vol pas cher, billet avion Tunisie, Tunis, vol Tunisie',
                'published_at' => Carbon::now()->subDays(3),
                'is_featured' => false,
                'views_count' => 156,
                'reading_time' => 8,
                'category_names' => ['Guides de Voyage'],
                'tag_names' => ['Vol pas cher', 'Tunis', 'Voyage Tunisie', 'Astuces'],
            ],
            [
                'title' => 'Que Faire à Sousse ? Top 12 Activités et Lieux à Visiter',
                'excerpt' => 'Découvrez les meilleures choses à faire à Sousse : plages, musées, médina, restaurants et activités en famille.',
                'content' => '<h2>Sousse, Perle du Sahel</h2><p>Troisième ville de Tunisie, Sousse combine parfaitement histoire, plages et vie moderne.</p><h2>Top 12 des Activités</h2><h3>Patrimoine & Culture</h3><p>1. La Médina de Sousse (UNESCO)<br>2. Le Ribat et la Grande Mosquée<br>3. Les Catacombes<br>4. Le Musée Archéologique</p><h3>Détente & Plage</h3><p>5. Plage de Boujaffar<br>6. Port El Kantaoui<br>7. Aquapark Hannibal</p><h3>Shopping & Gastronomie</h3><p>8. Souk de la Médina<br>9. Restaurants de poissons du port<br>10. Pâtisseries tunisiennes</p><h3>Vie Nocturne</h3><p>11. Cafés et bars de Port El Kantaoui<br>12. Spectacles folkloriques</p><h2>Infos Pratiques</h2><p>Sousse est accessible en train, louage ou voiture depuis Tunis. La ville est sûre et accueillante pour les touristes.</p><h2>Hébergement</h2><p>Trouvez votre hôtel ou location sur Travana - meilleurs prix garantis.</p>',
                'main_image' => 'https://picsum.photos/seed/sousse/1200/800',
                'thumbnail' => 'https://picsum.photos/seed/sousse/400/300',
                'author_id' => $author->id,
                'meta_title' => 'Que faire à Sousse ? Activités & visites',
                'meta_description' => 'Guide complet des meilleures activités à Sousse : plages, visites, restaurants et attractions.',
                'meta_keywords' => 'Sousse, visiter Sousse, activités Sousse, Tunisie, médina',
                'published_at' => Carbon::now()->subDays(1),
                'is_featured' => true,
                'views_count' => 89,
                'reading_time' => 10,
                'category_names' => ['Culture & Découvertes', 'Excursions & Activités'],
                'tag_names' => ['Sousse', 'Plage', 'Culture', 'Tunisie'],
            ],
        ];

        foreach ($blogs as $blogData) {
            // Extract category and tag names
            $categoryNames = $blogData['category_names'] ?? [];
            $tagNames = $blogData['tag_names'] ?? [];
            unset($blogData['category_names'], $blogData['tag_names']);
            
            // Create blog
            $blog = Blog::create($blogData);
            
            // Attach categories by name
            if (!empty($categoryNames)) {
                $categoryIds = $categories->whereIn('name', $categoryNames)->pluck('id');
                $blog->categories()->attach($categoryIds);
            }
            
            // Attach tags by name
            if (!empty($tagNames)) {
                $selectedTags = $tags->whereIn('name', $tagNames);
                $blog->tags()->attach($selectedTags->pluck('id'));
                
                // Update tag usage counts
                foreach ($selectedTags as $tag) {
                    $tag->incrementUsage();
                }
            }
        }

        // Create additional random blogs
        for ($i = 0; $i < 8; $i++) {
            $blog = Blog::create([
                'title' => fake()->sentence(8),
                'excerpt' => fake()->sentence(15),
                'content' => '<p>' . implode('</p><p>', fake()->paragraphs(5)) . '</p>',
                'main_image' => 'https://picsum.photos/seed/' . $i . '/1200/800',
                'thumbnail' => 'https://picsum.photos/seed/' . $i . '/400/300',
                'author_id' => $author->id,
                'meta_title' => fake()->sentence(6),
                'meta_description' => fake()->sentence(12),
                'meta_keywords' => implode(', ', fake()->words(5)),
                'published_at' => fake()->boolean(80) ? Carbon::now()->subDays(rand(1, 30)) : null,
                'is_featured' => fake()->boolean(20),
                'allow_comments' => true,
                'views_count' => rand(50, 500),
                'reading_time' => rand(3, 12),
            ]);

            $randomCategories = $categories->random(rand(1, 2));
            $blog->categories()->attach($randomCategories->pluck('id'));
            
            $randomTags = $tags->random(rand(2, 5));
            $blog->tags()->attach($randomTags->pluck('id'));
            
            foreach ($randomTags as $tag) {
                $tag->incrementUsage();
            }
        }

        $this->command->info('Blog seeder completed successfully!');
    }
}
