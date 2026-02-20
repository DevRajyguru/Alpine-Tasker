<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class Payout extends Model
{
    protected $fillable = [
        'payment_id',
        'tasker_id',
        'gateway_payout_id',
        'amount',
        'status',
        'scheduled_for',
        'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'scheduled_for' => 'datetime',
            'paid_at' => 'datetime',
        ];
    }

    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }
}
