<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('service_fields', 'min_value')) {
            Schema::table('service_fields', function (Blueprint $table): void {
                $table->decimal('min_value', 12, 2)->nullable()->after('is_required');
                $table->decimal('max_value', 12, 2)->nullable()->after('min_value');
                $table->json('visibility_json')->nullable()->after('help_text');
                $table->json('conditional_json')->nullable()->after('visibility_json');
                $table->string('warning_message')->nullable()->after('conditional_json');
            });
        }
    }

    public function down(): void
    {
        // Intentionally non-destructive.
    }
};

