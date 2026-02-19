<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class TaskApplication extends Model
{
    protected $fillable = [
        'task_id',
        'tasker_id',
        'offer_price',
        'message',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'offer_price' => 'decimal:2',
        ];
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function tasker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tasker_id');
    }
}
