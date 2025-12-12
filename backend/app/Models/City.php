<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'latitude',
        'longitude',
        'is_active',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function translations()
    {
        return $this->hasMany(CityTranslation::class);
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
}