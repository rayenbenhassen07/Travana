<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CityTranslation extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'city_id',
        'language_id',
        'name',
    ];

    // Relationships
    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function language()
    {
        return $this->belongsTo(Language::class);
    }
}
