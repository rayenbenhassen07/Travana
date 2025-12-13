<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FacilityTranslation extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'facility_id',
        'language_id',
        'name',
        'description',
    ];

    // Relationships
    public function facility()
    {
        return $this->belongsTo(Facility::class);
    }

    public function language()
    {
        return $this->belongsTo(Language::class);
    }
}
