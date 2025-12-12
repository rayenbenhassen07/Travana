<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Notifications\CustomVerifyEmail;
use App\Notifications\CustomResetPassword;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'date_of_birth',
        'profile_photo',
        'bio',
        'user_type',
        'is_verified',
        'is_active',
        'language_id',
        'currency_id',
        'last_login_at',
        'password_changed_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'date_of_birth' => 'date',
            'is_verified' => 'boolean',
            'is_active' => 'boolean',
            'last_login_at' => 'datetime',
            'password_changed_at' => 'datetime',
        ];
    }

    public function blogs()
    {
        return $this->hasMany(Blog::class, 'author_id');
    }

    public function preferredLanguage()
    {
        return $this->belongsTo(Language::class, 'language_id');
    }

    public function preferredCurrency()
    {
        return $this->belongsTo(Currency::class, 'currency_id');
    }

    // Helper methods
    public function isAdmin()
    {
        return $this->user_type === 'admin';
    }

    public function isUser()
    {
        return $this->user_type === 'user';
    }

    public function updateLastLogin()
    {
        $this->update(['last_login_at' => now()]);
    }

    public function needsPasswordChange()
    {
        // User needs to change password if they've never changed it
        return is_null($this->password_changed_at);
    }

    public function markPasswordAsChanged()
    {
        $this->update(['password_changed_at' => now()]);
    }

    /**
     * Send the email verification notification.
     */
    public function sendEmailVerificationNotification()
    {
        $this->notify(new CustomVerifyEmail);
    }

    /**
     * Send the password reset notification.
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new CustomResetPassword($token));
    }
}
