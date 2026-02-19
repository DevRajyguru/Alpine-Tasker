<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('task_assignments') && ! Schema::hasColumn('task_assignments', 'actual_cost')) {
            Schema::table('task_assignments', function (Blueprint $table): void {
                $table->decimal('actual_cost', 10, 2)->nullable()->after('assigned_price');
                $table->text('actual_cost_note')->nullable()->after('actual_cost');
                $table->timestamp('actual_cost_submitted_at')->nullable()->after('actual_cost_note');
                $table->timestamp('actual_cost_approved_at')->nullable()->after('actual_cost_submitted_at');
                $table->boolean('actual_cost_approved_by_customer')->default(false)->after('actual_cost_approved_at');
            });
        }
    }

    public function down(): void
    {
        // Non-destructive rollback intentionally omitted.
    }
};

