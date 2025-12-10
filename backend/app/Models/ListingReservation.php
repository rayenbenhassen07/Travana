<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ListingReservation extends Model
{
    use HasFactory;

    protected $table = 'listings_reservations';

    protected $fillable = [
        'ref',
        'start_date',
        'end_date',
        'is_blocked',
        'name',
        'phone',
        'email',
        'sex',
        'client_type',
        'nights',
        'total',
        'subtotal',
        'per_night',
        'service_fee',
        'currency_id',
        'listing_id',
        'user_id',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_blocked' => 'boolean',
        'nights' => 'integer',
        'total' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'per_night' => 'decimal:2',
        'service_fee' => 'decimal:2',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($reservation) {
            if (empty($reservation->ref)) {
                $reservation->ref = self::generateRef();
            }
        });
    }

    /**
     * Generate a unique reference code.
     */
    public static function generateRef(): string
    {
        do {
            $ref = 'RES-' . strtoupper(Str::random(8));
        } while (self::where('ref', $ref)->exists());

        return $ref;
    }

    /**
     * Get validation rules based on is_blocked status.
     */
    public static function validationRules(bool $isBlocked = false): array
    {
        if ($isBlocked) {
            // When blocked, only these fields are required
            return [
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
                'is_blocked' => 'required|boolean',
                'listing_id' => 'required|exists:listings,id',
                'user_id' => 'nullable|exists:users,id',
                'nights' => 'required|integer|min:1',
                'name' => 'nullable|string|max:255',
                'phone' => 'nullable|string|max:50',
                'email' => 'nullable|email|max:255',
                'sex' => 'nullable|in:male,female',
                'client_type' => 'nullable|in:family,group,one',
                'total' => 'nullable|numeric|min:0',
                'subtotal' => 'nullable|numeric|min:0',
                'per_night' => 'nullable|numeric|min:0',
                'service_fee' => 'nullable|numeric|min:0',
                'currency_id' => 'nullable|exists:currencies,id',
            ];
        }

        // When not blocked, all fields are required
        return [
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'is_blocked' => 'required|boolean',
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:50',
            'email' => 'required|email|max:255',
            'sex' => 'required|in:male,female',
            'client_type' => 'required|in:family,group,one',
            'nights' => 'required|integer|min:1',
            'total' => 'required|numeric|min:0',
            'subtotal' => 'required|numeric|min:0',
            'per_night' => 'required|numeric|min:0',
            'service_fee' => 'required|numeric|min:0',
            'currency_id' => 'required|exists:currencies,id',
            'listing_id' => 'required|exists:listings,id',
            'user_id' => 'nullable|exists:users,id',
        ];
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }

    public function currency()
    {
        return $this->belongsTo(Currency::class);
    }
}
