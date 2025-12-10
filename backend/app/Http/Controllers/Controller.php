<?php

namespace App\Http\Controllers;

/**
 * @OA\Info(
 *     title="Travana API Documentation",
 *     version="1.0.0",
 *     description="Complete API documentation for Travana - A travel and vacation rental platform. This API provides endpoints for managing listings, reservations, users, blog content, and more.",
 *     @OA\Contact(
 *         email="support@travana.com",
 *         name="Travana Support"
 *     ),
 *     @OA\License(
 *         name="MIT",
 *         url="https://opensource.org/licenses/MIT"
 *     )
 * )
 * 
 * @OA\Server(
 *     url="http://localhost:8000/api",
 *     description="Local Development Server"
 * )
 * 
 * @OA\Server(
 *     url="https://api.travana.com/api",
 *     description="Production Server"
 * )
 * 
 * @OA\SecurityScheme(
 *     securityScheme="sanctum",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     description="Enter your Bearer token in the format: Bearer {token}"
 * )
 * 
 * @OA\Tag(name="Authentication", description="User authentication endpoints")
 * @OA\Tag(name="Users", description="User management endpoints")
 * @OA\Tag(name="Categories", description="Listing categories management")
 * @OA\Tag(name="Cities", description="City management endpoints")
 * @OA\Tag(name="Facilities", description="Listing facilities management")
 * @OA\Tag(name="Alerts", description="Listing alerts management")
 * @OA\Tag(name="Listings", description="Property listings management")
 * @OA\Tag(name="Currencies", description="Currency management endpoints")
 * @OA\Tag(name="Listing Reservations", description="Booking and reservation management")
 * @OA\Tag(name="Blogs", description="Blog posts management")
 * @OA\Tag(name="Blog Categories", description="Blog categories management")
 * @OA\Tag(name="Blog Tags", description="Blog tags management")
 * @OA\Tag(name="Blog Comments", description="Blog comments management")
 * @OA\Tag(name="Blog Likes", description="Blog likes management")
 * 
 * @OA\Schema(
 *     schema="Error",
 *     @OA\Property(property="error", type="string", example="Error message"),
 *     @OA\Property(property="message", type="string", example="Detailed error message")
 * )
 * 
 * @OA\Schema(
 *     schema="ValidationError",
 *     @OA\Property(property="message", type="string", example="Validation failed"),
 *     @OA\Property(
 *         property="errors",
 *         type="object",
 *         example={"field_name": {"The field_name is required."}}
 *     )
 * )
 * 
 * @OA\Schema(
 *     schema="Pagination",
 *     @OA\Property(property="current_page", type="integer", example=1),
 *     @OA\Property(property="last_page", type="integer", example=10),
 *     @OA\Property(property="per_page", type="integer", example=15),
 *     @OA\Property(property="total", type="integer", example=150),
 *     @OA\Property(property="from", type="integer", example=1),
 *     @OA\Property(property="to", type="integer", example=15)
 * )
 * 
 * @OA\Schema(
 *     schema="Currency",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="US Dollar"),
 *     @OA\Property(property="label", type="string", example="USD"),
 *     @OA\Property(property="symbol", type="string", example="$"),
 *     @OA\Property(property="exchange_rate", type="number", format="float", example=1.000000),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="ListingReservation",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="ref", type="string", example="RES-A1B2C3D4", description="Auto-generated unique reference code"),
 *     @OA\Property(property="start_date", type="string", format="date", example="2025-12-01"),
 *     @OA\Property(property="end_date", type="string", format="date", example="2025-12-07"),
 *     @OA\Property(property="is_blocked", type="boolean", example=false, description="If true, this is a blocked date range (not a real booking)"),
 *     @OA\Property(property="name", type="string", example="John Doe", nullable=true),
 *     @OA\Property(property="phone", type="string", example="+1234567890", nullable=true),
 *     @OA\Property(property="email", type="string", format="email", example="john@example.com", nullable=true),
 *     @OA\Property(property="sex", type="string", enum={"male", "female"}, example="male", nullable=true),
 *     @OA\Property(property="client_type", type="string", enum={"family", "group", "one"}, example="family", nullable=true),
 *     @OA\Property(property="nights", type="integer", example=6),
 *     @OA\Property(property="total", type="number", format="float", example=750.00, nullable=true),
 *     @OA\Property(property="subtotal", type="number", format="float", example=700.00, nullable=true),
 *     @OA\Property(property="per_night", type="number", format="float", example=116.67, nullable=true),
 *     @OA\Property(property="service_fee", type="number", format="float", example=50.00, nullable=true),
 *     @OA\Property(property="currency_id", type="integer", example=1, nullable=true),
 *     @OA\Property(property="listing_id", type="integer", example=1),
 *     @OA\Property(property="user_id", type="integer", example=1),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time"),
 *     @OA\Property(property="currency", ref="#/components/schemas/Currency", nullable=true),
 *     @OA\Property(property="listing", type="object", nullable=true),
 *     @OA\Property(property="user", type="object", nullable=true)
 * )
 */
abstract class Controller
{
    //
}
