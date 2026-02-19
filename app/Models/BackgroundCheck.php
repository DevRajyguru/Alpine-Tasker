<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class BackgroundCheck extends Model
{
    protected $fillable = [
        'tasker_id',
        'provider',
        'provider_case_id',
        'status',
        'report_url',
        'raw_response',
        'requested_at',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'raw_response' => 'array',
            'requested_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function tasker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tasker_id');
    }
}
