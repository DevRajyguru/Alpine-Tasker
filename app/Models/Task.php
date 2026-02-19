<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'customer_id',
        'category_id',
        'service_id',
        'title',
        'description',
        'budget_estimate',
        'scheduled_at',
        'address',
        'city',
        'status',
        'selected_tasker_id',
    ];

    protected function casts(): array
    {
        return [
            'budget_estimate' => 'decimal:2',
            'scheduled_at' => 'datetime',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function selectedTasker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'selected_tasker_id');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(TaskApplication::class);
    }

    public function assignment(): HasOne
    {
        return $this->hasOne(TaskAssignment::class);
    }

    public function statusHistory(): HasMany
    {
        return $this->hasMany(TaskStatusHistory::class);
    }

    public function photos(): HasMany
    {
        return $this->hasMany(TaskPhoto::class);
    }

    public function disputes(): HasMany
    {
        return $this->hasMany(Dispute::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }

    public function fieldValues(): HasMany
    {
        return $this->hasMany(TaskFieldValue::class);
    }

    public function review(): HasOne
    {
        return $this->hasOne(Review::class);
    }
}
