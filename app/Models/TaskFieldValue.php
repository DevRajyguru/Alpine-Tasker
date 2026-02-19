<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskFieldValue extends Model
{
    protected $fillable = [
        'task_id',
        'service_field_id',
        'value_text',
        'value_number',
        'value_bool',
        'value_json',
        'file_path',
    ];

    protected function casts(): array
    {
        return [
            'value_number' => 'decimal:2',
            'value_bool' => 'boolean',
            'value_json' => 'array',
        ];
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function field(): BelongsTo
    {
        return $this->belongsTo(ServiceField::class, 'service_field_id');
    }
}

