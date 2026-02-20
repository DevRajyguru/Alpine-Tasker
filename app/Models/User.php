<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'role',
        'is_active',
        'password',
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
            'is_active' => 'boolean',
            'password' => 'hashed',
        ];
    }

    public function taskerProfile(): HasOne
    {
        return $this->hasOne(TaskerProfile::class);
    }

    public function backgroundCheck(): HasOne
    {
        return $this->hasOne(BackgroundCheck::class, 'tasker_id');
    }

    public function customerTasks(): HasMany
    {
        return $this->hasMany(Task::class, 'customer_id');
    }

    public function raisedDisputes(): HasMany
    {
        return $this->hasMany(Dispute::class, 'raised_by');
    }

    public function givenReviews(): HasMany
    {
        return $this->hasMany(Review::class, 'customer_id');
    }

    public function receivedReviews(): HasMany
    {
        return $this->hasMany(Review::class, 'tasker_id');
    }
}
