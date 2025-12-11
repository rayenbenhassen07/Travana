<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CurrencyTranslation extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'currency_id',
        'language_id',
        'name',
    ];

    // Relationships
    public function currency()
    {
        return $this->belongsTo(Currency::class);
    }

    public function language()
    {
        return $this->belongsTo(Language::class);
    }
}
