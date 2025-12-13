<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FacilityCategoryTranslation extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'facility_category_id',
        'language_id',
        'name',
        'description',
    ];

    // Relationships
    public function facilityCategory()
    {
        return $this->belongsTo(FacilityCategory::class);
    }

    public function language()
    {
        return $this->belongsTo(Language::class);
    }
}
