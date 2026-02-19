<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'is_active',
        'license_not_required',
        'skill_not_required',
        'hazardous_work_not_allowed',
        'no_medical_childcare_electrical_work',
        'custom_warning_message',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'license_not_required' => 'boolean',
            'skill_not_required' => 'boolean',
            'hazardous_work_not_allowed' => 'boolean',
            'no_medical_childcare_electrical_work' => 'boolean',
        ];
    }

    public function fields(): HasMany
    {
        return $this->hasMany(ServiceField::class)->orderBy('sort_order');
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
}
