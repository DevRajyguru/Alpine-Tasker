<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SearchEvent extends Model
{
    protected $fillable = [
        'user_id',
        'guest_token',
        'category',
        'location',
        'source',
        'ip_address',
        'user_agent',
        'searched_at',
    ];

    protected function casts(): array
    {
        return [
            'searched_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

