<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class TaskAssignment extends Model
{
    protected $fillable = [
        'task_id',
        'customer_id',
        'tasker_id',
        'assigned_price',
        'actual_cost',
        'actual_cost_note',
        'actual_cost_submitted_at',
        'actual_cost_approved_at',
        'actual_cost_approved_by_customer',
        'event_type',
        'service_level',
        'preferred_date',
        'preferred_time',
        'booking_description',
        'payment_option',
        'customer_otp',
        'customer_otp_expires_at',
        'customer_otp_verified_at',
        'otp_attempts',
        'assigned_at',
        'started_at',
        'completed_at',
        'closed_at',
    ];

    protected function casts(): array
    {
        return [
            'assigned_price' => 'decimal:2',
            'actual_cost' => 'decimal:2',
            'actual_cost_approved_by_customer' => 'boolean',
            'preferred_date' => 'date',
            'customer_otp_expires_at' => 'datetime',
            'customer_otp_verified_at' => 'datetime',
            'assigned_at' => 'datetime',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
            'closed_at' => 'datetime',
            'actual_cost_submitted_at' => 'datetime',
            'actual_cost_approved_at' => 'datetime',
        ];
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }
}
