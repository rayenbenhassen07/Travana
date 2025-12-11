<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Currency extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'symbol',
        'exchange_rate',
        'is_default',
        'is_active',
    ];

    protected $casts = [
        'exchange_rate' => 'decimal:6',
        'is_default' => 'boolean',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function translations()
    {
        return $this->hasMany(CurrencyTranslation::class);
    }

    public function listingReservations()
    {
        return $this->hasMany(ListingReservation::class);
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
