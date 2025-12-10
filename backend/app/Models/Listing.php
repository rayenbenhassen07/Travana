<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Listing extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'short_description',
        'long_description',
        'images',
        'category_id',
        'room_count',
        'bathroom_count',
        'guest_count',
        'bed_count',
        'city_id',
        'adresse',
        'user_id',
        'price',
        'lat',
        'long',
    ];

    protected $casts = [
        'images' => 'array',
        'price' => 'float',
        'lat' => 'float',
        'long' => 'float',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function reservations()
    {
        return $this->hasMany(ListingReservation::class);
    }

    public function facilities()
    {
        return $this->belongsToMany(Facility::class, 'listing_facilities');
    }

    public function alerts()
    {
        return $this->belongsToMany(Alert::class, 'listing_alerts');
    }
}