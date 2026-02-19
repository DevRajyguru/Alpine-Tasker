<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('services', 'license_not_required')) {
            Schema::table('services', function (Blueprint $table): void {
                $table->boolean('license_not_required')->default(false)->after('is_active');
                $table->boolean('skill_not_required')->default(false)->after('license_not_required');
                $table->boolean('hazardous_work_not_allowed')->default(true)->after('skill_not_required');
                $table->boolean('no_medical_childcare_electrical_work')->default(true)->after('hazardous_work_not_allowed');
                $table->string('custom_warning_message')->nullable()->after('no_medical_childcare_electrical_work');
            });
        }
    }

    public function down(): void
    {
        // Non-destructive rollback intentionally omitted.
    }
};

