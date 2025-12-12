<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Language extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'is_default',
        'is_active',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function cityTranslations()
    {
        return $this->hasMany(CityTranslation::class);
    }

    public function currencyTranslations()
    {
        return $this->hasMany(CurrencyTranslation::class);
    }

    public function users()
    {
        return $this->hasMany(User::class, 'language_id');
    }
}
