<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AlertTranslation extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'alert_id',
        'language_id',
        'name',
        'description',
    ];

    // Relationships
    public function alert()
    {
        return $this->belongsTo(Alert::class);
    }

    public function language()
    {
        return $this->belongsTo(Language::class);
    }
}
