<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'task_id',
        'customer_id',
        'tasker_id',
        'gateway',
        'gateway_payment_id',
        'currency',
        'task_amount',
        'authorized_amount',
        'captured_amount',
        'coupon_id',
        'discount_amount',
        'commission_amount',
        'gateway_fee',
        'tasker_net_amount',
        'status',
        'authorized_at',
        'captured_at',
    ];

    protected function casts(): array
    {
        return [
            'task_amount' => 'decimal:2',
            'authorized_amount' => 'decimal:2',
            'captured_amount' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'commission_amount' => 'decimal:2',
            'gateway_fee' => 'decimal:2',
            'tasker_net_amount' => 'decimal:2',
            'authorized_at' => 'datetime',
            'captured_at' => 'datetime',
        ];
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function tasker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tasker_id');
    }

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    public function redemptions(): HasMany
    {
        return $this->hasMany(CouponRedemption::class);
    }

    public function payout(): HasOne
    {
        return $this->hasOne(Payout::class);
    }

    public function refunds(): HasMany
    {
        return $this->hasMany(Refund::class);
    }
}
