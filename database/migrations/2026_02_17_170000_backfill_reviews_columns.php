<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('reviews', 'task_id')) {
            Schema::table('reviews', function (Blueprint $table): void {
                $table->foreignId('task_id')->nullable()->after('id')->constrained('tasks')->cascadeOnDelete();
                $table->foreignId('customer_id')->nullable()->after('task_id')->constrained('users')->nullOnDelete();
                $table->foreignId('tasker_id')->nullable()->after('customer_id')->constrained('users')->nullOnDelete();
                $table->unsignedTinyInteger('rating')->default(5)->after('tasker_id');
                $table->text('comment')->nullable()->after('rating');
                $table->unique('task_id');
                $table->index('tasker_id');
                $table->index('customer_id');
            });
        }
    }

    public function down(): void
    {
        // Non-destructive rollback intentionally omitted.
    }
};

