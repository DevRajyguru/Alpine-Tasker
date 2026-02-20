<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class CommissionSetting extends Model
{
    protected $fillable = [
        'commission_type',
        'commission_value',
        'is_active',
        'effective_from',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'commission_value' => 'decimal:2',
            'is_active' => 'boolean',
            'effective_from' => 'datetime',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
