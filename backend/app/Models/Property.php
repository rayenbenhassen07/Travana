<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'property_type_id',
        'user_id',
        'city_id',
        'address',
        'latitude',
        'longitude',
        'room_count',
        'bedroom_count',
        'bathroom_count',
        'guest_capacity',
        'bed_count',
        'area_sqm',
        'floor_number',
        'total_floors',
        'listing_type',
        'sale_price',
        'rent_price_daily',
        'rent_price_weekly',
        'rent_price_monthly',
        'currency_id',
        'images',
        'video_url',
        'year_built',
        'last_renovated',
        'is_verified',
        'status',
    ];

    protected $casts = [
        'images' => 'array',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'area_sqm' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'rent_price_daily' => 'decimal:2',
        'rent_price_weekly' => 'decimal:2',
        'rent_price_monthly' => 'decimal:2',
        'room_count' => 'integer',
        'bedroom_count' => 'integer',
        'bathroom_count' => 'integer',
        'guest_capacity' => 'integer',
        'bed_count' => 'integer',
        'floor_number' => 'integer',
        'total_floors' => 'integer',
        'is_verified' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($property) {
            if (empty($property->slug)) {
                $property->slug = Str::slug(Str::random(10));
            }
        });
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function propertyType()
    {
        return $this->belongsTo(PropertyType::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function currency()
    {
        return $this->belongsTo(Currency::class);
    }

    public function translations()
    {
        return $this->hasMany(PropertyTranslation::class);
    }

    public function facilities()
    {
        return $this->belongsToMany(Facility::class, 'property_facilities');
    }

    public function alerts()
    {
        return $this->belongsToMany(Alert::class, 'property_alerts');
    }

    public function availability()
    {
        return $this->hasMany(PropertyAvailability::class);
    }

    public function favorites()
    {
        return $this->hasMany(PropertyFavorite::class);
    }

    // Helper method to get translation for a specific language
    public function translation($languageCode = 'en')
    {
        return $this->translations()
            ->whereHas('language', function ($query) use ($languageCode) {
                $query->where('code', $languageCode);
            })
            ->first();
    }

    // Helper method to get translated name
    public function getTranslatedName($languageCode = 'en')
    {
        $translation = $this->translation($languageCode);
        return $translation ? $translation->name : null;
    }

    // Check if property is favorited by a user
    public function isFavoritedBy($userId)
    {
        return $this->favorites()->where('user_id', $userId)->exists();
    }
}
