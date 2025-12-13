<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Alert extends Model
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

    // Relationships
    public function translations()
    {
        return $this->hasMany(AlertTranslation::class);
    }

    public function properties()
    {
        return $this->belongsToMany(Property::class, 'property_alerts');
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

    // Helper method to get translated title
    public function getTranslatedTitle($languageCode = 'en')
    {
        $translation = $this->translation($languageCode);
        return $translation ? $translation->title : null;
    }
}
