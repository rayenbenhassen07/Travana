<?php

namespace App\Http\Controllers\Api\Swagger;

/**
 * @OA\Schema(
 *     schema="User",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="John Doe"),
 *     @OA\Property(property="email", type="string", format="email", example="john@example.com"),
 *     @OA\Property(property="type", type="string", enum={"user", "admin"}, example="user"),
 *     @OA\Property(property="email_verified_at", type="string", format="date-time", nullable=true),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="Category",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="title", type="string", example="Apartments"),
 *     @OA\Property(property="description", type="string", nullable=true, example="Comfortable apartments for rent"),
 *     @OA\Property(property="logo", type="string", nullable=true, example="uploads/categories/apartment.png"),
 *     @OA\Property(property="listings_count", type="integer", example=15),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="City",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Paris"),
 *     @OA\Property(property="slug", type="string", example="paris"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="Facility",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="title", type="string", example="WiFi"),
 *     @OA\Property(property="description", type="string", nullable=true, example="Free high-speed internet"),
 *     @OA\Property(property="logo", type="string", nullable=true, example="uploads/facilities/wifi.svg"),
 *     @OA\Property(property="listings_count", type="integer", example=25),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="Alert",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="title", type="string", example="No Smoking"),
 *     @OA\Property(property="description", type="string", nullable=true, example="Smoking is not allowed inside the property"),
 *     @OA\Property(property="logo", type="string", nullable=true, example="uploads/alerts/no-smoking.svg"),
 *     @OA\Property(property="listings_count", type="integer", example=10),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="Listing",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="title", type="string", example="Beautiful Beach House"),
 *     @OA\Property(property="short_description", type="string", nullable=true, example="A stunning beach house with ocean views"),
 *     @OA\Property(property="long_description", type="string", nullable=true, example="Full description of the property..."),
 *     @OA\Property(property="images", type="array", @OA\Items(type="string"), example={"uploads/listings/image1.jpg", "uploads/listings/image2.jpg"}),
 *     @OA\Property(property="category_id", type="integer", example=1),
 *     @OA\Property(property="room_count", type="integer", nullable=true, example=3),
 *     @OA\Property(property="bathroom_count", type="integer", nullable=true, example=2),
 *     @OA\Property(property="guest_count", type="integer", nullable=true, example=6),
 *     @OA\Property(property="bed_count", type="integer", nullable=true, example=4),
 *     @OA\Property(property="city_id", type="integer", example=1),
 *     @OA\Property(property="adresse", type="string", nullable=true, example="123 Beach Road"),
 *     @OA\Property(property="user_id", type="integer", example=1),
 *     @OA\Property(property="price", type="number", format="float", example=150.00),
 *     @OA\Property(property="lat", type="number", format="float", nullable=true, example=48.8566),
 *     @OA\Property(property="long", type="number", format="float", nullable=true, example=2.3522),
 *     @OA\Property(property="user", ref="#/components/schemas/User"),
 *     @OA\Property(property="category", ref="#/components/schemas/Category"),
 *     @OA\Property(property="city", ref="#/components/schemas/City"),
 *     @OA\Property(property="facilities", type="array", @OA\Items(ref="#/components/schemas/Facility")),
 *     @OA\Property(property="alerts", type="array", @OA\Items(ref="#/components/schemas/Alert")),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="Reservation",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="user_id", type="integer", nullable=true, example=1),
 *     @OA\Property(property="listing_id", type="integer", example=1),
 *     @OA\Property(property="start_date", type="string", format="date", example="2025-12-01"),
 *     @OA\Property(property="end_date", type="string", format="date", example="2025-12-07"),
 *     @OA\Property(property="prices", type="object", nullable=true, example={"nightly": 150, "total": 900}),
 *     @OA\Property(property="is_blocked", type="boolean", example=false),
 *     @OA\Property(property="guest_details", type="object", nullable=true, example={"name": "Jane Doe", "email": "jane@example.com"}),
 *     @OA\Property(property="contact", type="object", nullable=true, example={"phone": "+1234567890"}),
 *     @OA\Property(property="guest_count", type="integer", nullable=true, example=4),
 *     @OA\Property(property="details", type="string", nullable=true, example="Special requests..."),
 *     @OA\Property(property="client_type", type="string", enum={"family", "group", "one"}, nullable=true, example="family"),
 *     @OA\Property(property="user", ref="#/components/schemas/User"),
 *     @OA\Property(property="listing", ref="#/components/schemas/Listing"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="Blog",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="title", type="string", example="Top 10 Travel Destinations"),
 *     @OA\Property(property="slug", type="string", example="top-10-travel-destinations"),
 *     @OA\Property(property="excerpt", type="string", nullable=true, example="Discover the best places to visit..."),
 *     @OA\Property(property="content", type="string", example="Full blog content here..."),
 *     @OA\Property(property="main_image", type="string", nullable=true, example="blogs/images/main.jpg"),
 *     @OA\Property(property="thumbnail", type="string", nullable=true, example="blogs/thumbnails/thumb.jpg"),
 *     @OA\Property(property="author_id", type="integer", example=1),
 *     @OA\Property(property="meta_title", type="string", nullable=true, example="SEO Title"),
 *     @OA\Property(property="meta_description", type="string", nullable=true, example="SEO Description"),
 *     @OA\Property(property="meta_keywords", type="string", nullable=true, example="travel, destinations"),
 *     @OA\Property(property="published_at", type="string", format="date-time", nullable=true),
 *     @OA\Property(property="views_count", type="integer", example=1500),
 *     @OA\Property(property="reading_time", type="integer", example=5),
 *     @OA\Property(property="is_featured", type="boolean", example=true),
 *     @OA\Property(property="allow_comments", type="boolean", example=true),
 *     @OA\Property(property="order", type="integer", nullable=true, example=1),
 *     @OA\Property(property="likes_count", type="integer", example=42),
 *     @OA\Property(property="author", ref="#/components/schemas/User"),
 *     @OA\Property(property="categories", type="array", @OA\Items(ref="#/components/schemas/BlogCategory")),
 *     @OA\Property(property="tags", type="array", @OA\Items(ref="#/components/schemas/BlogTag")),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="BlogCategory",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Travel Tips"),
 *     @OA\Property(property="slug", type="string", example="travel-tips"),
 *     @OA\Property(property="description", type="string", nullable=true, example="Helpful travel advice"),
 *     @OA\Property(property="icon", type="string", nullable=true, example="fa-plane"),
 *     @OA\Property(property="color", type="string", nullable=true, example="#3498db"),
 *     @OA\Property(property="meta_title", type="string", nullable=true),
 *     @OA\Property(property="meta_description", type="string", nullable=true),
 *     @OA\Property(property="is_active", type="boolean", example=true),
 *     @OA\Property(property="order", type="integer", nullable=true, example=1),
 *     @OA\Property(property="blogs_count", type="integer", example=12),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="BlogTag",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Adventure"),
 *     @OA\Property(property="slug", type="string", example="adventure"),
 *     @OA\Property(property="description", type="string", nullable=true),
 *     @OA\Property(property="color", type="string", nullable=true, example="#e74c3c"),
 *     @OA\Property(property="usage_count", type="integer", example=25),
 *     @OA\Property(property="blogs_count", type="integer", example=8),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="BlogComment",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="blog_id", type="integer", example=1),
 *     @OA\Property(property="user_id", type="integer", example=1),
 *     @OA\Property(property="parent_id", type="integer", nullable=true),
 *     @OA\Property(property="content", type="string", example="Great article!"),
 *     @OA\Property(property="status", type="string", enum={"pending", "approved", "rejected", "spam"}, example="approved"),
 *     @OA\Property(property="likes_count", type="integer", example=5),
 *     @OA\Property(property="is_edited", type="boolean", example=false),
 *     @OA\Property(property="edited_at", type="string", format="date-time", nullable=true),
 *     @OA\Property(property="user_liked", type="boolean", example=false),
 *     @OA\Property(property="user", ref="#/components/schemas/User"),
 *     @OA\Property(property="replies", type="array", @OA\Items(ref="#/components/schemas/BlogComment")),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 */
class Schemas
{
    // This class only contains Swagger schema definitions
}
