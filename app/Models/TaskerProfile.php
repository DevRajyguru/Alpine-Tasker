<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class TaskerProfile extends Model
{
    protected $fillable = [
        'user_id',
        'bio',
        'experience_years',
        'skills_text',
        'availability_text',
        'hourly_rate',
        'stripe_account_id',
        'stripe_account_type',
        'stripe_charges_enabled',
        'stripe_payouts_enabled',
        'stripe_onboarded_at',
    ];

    protected function casts(): array
    {
        return [
            'hourly_rate' => 'decimal:2',
            'stripe_charges_enabled' => 'boolean',
            'stripe_payouts_enabled' => 'boolean',
            'stripe_onboarded_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
