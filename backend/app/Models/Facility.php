<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Facility extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'icon',
        'category_id',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    // Relationships
    public function translations()
    {
        return $this->hasMany(FacilityTranslation::class);
    }

    public function category()
    {
        return $this->belongsTo(FacilityCategory::class, 'category_id');
    }

    public function properties()
    {
        return $this->belongsToMany(Property::class, 'property_facilities');
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
