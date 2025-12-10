<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facility extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'logo',
    ];

    // Relationships
    public function listings()
    {
        return $this->belongsToMany(Listing::class, 'listing_facilities');
    }
}