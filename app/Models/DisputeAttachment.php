<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class DisputeAttachment extends Model
{
    protected $fillable = [
        'dispute_message_id',
        'file_path',
        'mime_type',
        'file_size',
    ];

    public function message(): BelongsTo
    {
        return $this->belongsTo(DisputeMessage::class, 'dispute_message_id');
    }
}
