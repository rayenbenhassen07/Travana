<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\CityController;
use App\Http\Controllers\Api\CurrencyController;
use App\Http\Controllers\Api\LanguageController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\BlogCategoryController;
use App\Http\Controllers\Api\BlogTagController;
use App\Http\Controllers\Api\BlogCommentController;
use App\Http\Controllers\Api\BlogLikeController;
use App\Http\Controllers\Api\PropertyTypeController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\FacilityController;
use App\Http\Controllers\Api\AlertController;
use App\Http\Controllers\FacilityCategoryController;
use App\Http\Controllers\Api\PropertyFavoriteController;
use App\Http\Controllers\Api\PropertyAvailabilityController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});


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

// Property Types (Public routes with language support)
Route::get('/property-types', [PropertyTypeController::class, 'index']);
Route::get('/property-types/{id}', [PropertyTypeController::class, 'show']);
Route::post('/property-types', [PropertyTypeController::class, 'store']);
Route::put('/property-types/{id}', [PropertyTypeController::class, 'update']);
Route::delete('/property-types/{id}', [PropertyTypeController::class, 'destroy']);

// Properties (Public routes with language support)
Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/properties/{id}', [PropertyController::class, 'show']);
Route::post('/properties', [PropertyController::class, 'store']);
Route::post('/properties/{id}', [PropertyController::class, 'update']); // For file upload with _method
Route::put('/properties/{id}', [PropertyController::class, 'update']);
Route::delete('/properties/{id}', [PropertyController::class, 'destroy']);

// Facilities (Public routes with language support)
Route::get('/facilities', [FacilityController::class, 'index']);
Route::get('/facilities/{id}', [FacilityController::class, 'show']);
Route::post('/facilities', [FacilityController::class, 'store']);
Route::post('/facilities/{id}', [FacilityController::class, 'update']); // For file upload with _method
Route::put('/facilities/{id}', [FacilityController::class, 'update']);
Route::delete('/facilities/{id}', [FacilityController::class, 'destroy']);

// Facility Categories (Public routes with language support)
Route::get('/facility-categories', [FacilityCategoryController::class, 'index']);
Route::get('/facility-categories/{id}', [FacilityCategoryController::class, 'show']);
Route::post('/facility-categories', [FacilityCategoryController::class, 'store']);
Route::put('/facility-categories/{id}', [FacilityCategoryController::class, 'update']);
Route::delete('/facility-categories/{id}', [FacilityCategoryController::class, 'destroy']);

// Alerts (Public routes with language support)
Route::get('/alerts', [AlertController::class, 'index']);
Route::get('/alerts/{id}', [AlertController::class, 'show']);
Route::post('/alerts', [AlertController::class, 'store']);
Route::put('/alerts/{id}', [AlertController::class, 'update']);
Route::post('/alerts/{id}', [AlertController::class, 'update']); // For FormData with _method=PUT
Route::delete('/alerts/{id}', [AlertController::class, 'destroy']);

// Property Availability
Route::get('/properties/{propertyId}/availability', [PropertyAvailabilityController::class, 'index']);
Route::post('/properties/{propertyId}/availability', [PropertyAvailabilityController::class, 'store']);
Route::post('/properties/{propertyId}/availability/bulk', [PropertyAvailabilityController::class, 'bulkStore']);
Route::delete('/properties/{propertyId}/availability/{date}', [PropertyAvailabilityController::class, 'destroy']);

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
    
    // Property Favorites (Protected routes)
    Route::get('/property-favorites', [PropertyFavoriteController::class, 'index']);
    Route::post('/property-favorites/toggle', [PropertyFavoriteController::class, 'toggle']);
    Route::get('/property-favorites/check/{propertyId}', [PropertyFavoriteController::class, 'check']);
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

// Include authentication routes
require __DIR__.'/auth.php';
