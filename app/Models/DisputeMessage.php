<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

class DisputeMessage extends Model
{
    protected $fillable = [
        'dispute_id',
        'sender_id',
        'message',
        'is_internal',
    ];

    protected function casts(): array
    {
        return [
            'is_internal' => 'boolean',
        ];
    }

    public function dispute(): BelongsTo
    {
        return $this->belongsTo(Dispute::class);
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(DisputeAttachment::class);
    }
}
