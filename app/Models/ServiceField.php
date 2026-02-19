<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServiceField extends Model
{
    public const TYPES = [
        'text_input',
        'number_input',
        'dropdown',
        'checkbox',
        'location_picker',
        'date_time_picker',
        'duration_selector',
        'image_upload',
        'weight_selector',
        'quantity_selector',
    ];

    protected $fillable = [
        'service_id',
        'label',
        'key',
        'type',
        'is_required',
        'min_value',
        'max_value',
        'placeholder',
        'help_text',
        'visibility_json',
        'conditional_json',
        'warning_message',
        'sort_order',
        'config_json',
    ];

    protected function casts(): array
    {
        return [
            'is_required' => 'boolean',
            'min_value' => 'decimal:2',
            'max_value' => 'decimal:2',
            'visibility_json' => 'array',
            'conditional_json' => 'array',
            'config_json' => 'array',
        ];
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function options(): HasMany
    {
        return $this->hasMany(ServiceFieldOption::class)->orderBy('sort_order');
    }
}
