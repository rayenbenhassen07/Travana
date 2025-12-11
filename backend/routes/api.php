<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CityController;
use App\Http\Controllers\Api\AlertController;
use App\Http\Controllers\Api\FacilityController;
use App\Http\Controllers\Api\ListingController;
use App\Http\Controllers\Api\ListingReservationController;
use App\Http\Controllers\Api\CurrencyController;
use App\Http\Controllers\Api\LanguageController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\BlogCategoryController;
use App\Http\Controllers\Api\BlogTagController;
use App\Http\Controllers\Api\BlogCommentController;
use App\Http\Controllers\Api\BlogLikeController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});


// Categories
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::post('/categories/{category}', [CategoryController::class, 'update']); // For file upload with _method
Route::put('/categories/{category}', [CategoryController::class, 'update']);
Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

// Languages (Public routes - for getting available languages)
Route::get('/languages', [LanguageController::class, 'index']); // Active languages only
Route::get('/languages/all', [LanguageController::class, 'all']); // All languages (including inactive)
Route::get('/languages/default', [LanguageController::class, 'getDefault']); // Get default language
Route::get('/languages/{id}', [LanguageController::class, 'show']);

// Cities (with language support via ?lang=en parameter)
Route::get('/cities', [CityController::class, 'index']);
Route::get('/cities/{city}', [CityController::class, 'show']);
Route::post('/cities', [CityController::class, 'store']);
Route::put('/cities/{city}', [CityController::class, 'update']);
Route::delete('/cities/{city}', [CityController::class, 'destroy']);

// Currencies (with language support via ?lang=en parameter)
Route::get('/currencies', [CurrencyController::class, 'index']);
Route::get('/currencies/{currency}', [CurrencyController::class, 'show']);
Route::post('/currencies', [CurrencyController::class, 'store']);
Route::put('/currencies/{currency}', [CurrencyController::class, 'update']);
Route::delete('/currencies/{currency}', [CurrencyController::class, 'destroy']);

// Users
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

// Alerts
Route::get('/alerts', [AlertController::class, 'index']);
Route::get('/alerts/{alert}', [AlertController::class, 'show']);
Route::post('/alerts', [AlertController::class, 'store']);
Route::post('/alerts/{alert}', [AlertController::class, 'update']); // For file upload with _method
Route::put('/alerts/{alert}', [AlertController::class, 'update']);
Route::delete('/alerts/{alert}', [AlertController::class, 'destroy']);

// Facilities
Route::get('/facilities', [FacilityController::class, 'index']);
Route::get('/facilities/{facility}', [FacilityController::class, 'show']);
Route::post('/facilities', [FacilityController::class, 'store']);
Route::post('/facilities/{facility}', [FacilityController::class, 'update']); // For file upload with _method
Route::put('/facilities/{facility}', [FacilityController::class, 'update']);
Route::delete('/facilities/{facility}', [FacilityController::class, 'destroy']);

// Listings
Route::get('/listings', [ListingController::class, 'index']);
Route::get('/listings/{listing}', [ListingController::class, 'show']);
Route::post('/listings', [ListingController::class, 'store']);
Route::post('/listings/{listing}', [ListingController::class, 'update']); // For file upload with _method
Route::put('/listings/{listing}', [ListingController::class, 'update']);
Route::delete('/listings/{listing}', [ListingController::class, 'destroy']);

// Listing Reservations
Route::get('/listing-reservations', [ListingReservationController::class, 'index']);
Route::get('/listing-reservations/ref/{ref}', [ListingReservationController::class, 'showByRef']);
Route::get('/listing-reservations/{reservation}', [ListingReservationController::class, 'show']);
Route::post('/listing-reservations', [ListingReservationController::class, 'store']);
Route::put('/listing-reservations/{reservation}', [ListingReservationController::class, 'update']);
Route::delete('/listing-reservations/{reservation}', [ListingReservationController::class, 'destroy']);

// Blog Categories (Public routes)
Route::get('/blog-categories', [BlogCategoryController::class, 'index']);
Route::get('/blog-categories/{identifier}', [BlogCategoryController::class, 'show']);

// Blog Tags (Public routes)
Route::get('/blog-tags', [BlogTagController::class, 'index']);
Route::get('/blog-tags/{identifier}', [BlogTagController::class, 'show']);
Route::get('/blog-tags/popular/list', [BlogTagController::class, 'popular']);

// Blogs (Public routes)
Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/blogs/popular/list', [BlogController::class, 'popular']);
Route::get('/blogs/search/query', [BlogController::class, 'search']);
Route::get('/blogs/category/{categorySlug}', [BlogController::class, 'byCategory']);
Route::get('/blogs/tag/{tagSlug}', [BlogController::class, 'byTag']);
Route::get('/blogs/author/{authorId}', [BlogController::class, 'byAuthor']);
Route::get('/blogs/{identifier}', [BlogController::class, 'show']);
Route::get('/blogs/{identifier}/related', [BlogController::class, 'related']);

// Blog Comments (Public - Read, with optional auth for user_liked)
Route::get('/blogs/{blogId}/comments', [BlogCommentController::class, 'index']);

// Blog Admin routes (Protected)
Route::middleware(['auth:sanctum'])->group(function () {
    // Language Management (Admin only)
    Route::post('/languages', [LanguageController::class, 'store']);
    Route::put('/languages/{id}', [LanguageController::class, 'update']);
    Route::delete('/languages/{id}', [LanguageController::class, 'destroy']);
    Route::post('/languages/{id}/set-default', [LanguageController::class, 'setDefault']);
    
    // Blog Management
    Route::post('/blogs', [BlogController::class, 'store']);
    Route::post('/blogs/{id}', [BlogController::class, 'update']); // For file upload with _method
    Route::put('/blogs/{id}', [BlogController::class, 'update']);
    Route::delete('/blogs/{id}', [BlogController::class, 'destroy']);
    
    // Blog Category Management
    Route::post('/blog-categories', [BlogCategoryController::class, 'store']);
    Route::put('/blog-categories/{id}', [BlogCategoryController::class, 'update']);
    Route::delete('/blog-categories/{id}', [BlogCategoryController::class, 'destroy']);
    
    // Blog Tag Management
    Route::post('/blog-tags', [BlogTagController::class, 'store']);
    Route::put('/blog-tags/{id}', [BlogTagController::class, 'update']);
    Route::delete('/blog-tags/{id}', [BlogTagController::class, 'destroy']);
    
    // Blog Comments Management
    Route::post('/blogs/{blogId}/comments', [BlogCommentController::class, 'store']);
    Route::put('/blogs/{blogId}/comments/{id}', [BlogCommentController::class, 'update']);
    Route::delete('/blogs/{blogId}/comments/{id}', [BlogCommentController::class, 'destroy']);
    Route::post('/blogs/{blogId}/comments/{id}/like', [BlogCommentController::class, 'toggleLike']);
    
    // Blog Likes
    Route::post('/blogs/{blogId}/like', [BlogLikeController::class, 'toggle']);
    Route::get('/blogs/{blogId}/like/check', [BlogLikeController::class, 'checkLike']);
    Route::get('/blogs/{blogId}/likes', [BlogLikeController::class, 'getLikes']);
    
    // Admin: All Comments
    Route::get('/admin/comments', [BlogCommentController::class, 'all']);
    Route::patch('/admin/comments/{id}/status', [BlogCommentController::class, 'updateStatus']);
});
