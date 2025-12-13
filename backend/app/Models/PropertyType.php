<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PropertyType extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'icon',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($propertyType) {
            if (empty($propertyType->slug)) {
                $propertyType->slug = Str::slug($propertyType->name ?? 'property-type');
            }
        });
    }

    // Relationships
    public function translations()
    {
        return $this->hasMany(PropertyTypeTranslation::class);
    }

    public function properties()
    {
        return $this->hasMany(Property::class);
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
