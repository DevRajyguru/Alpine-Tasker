<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('categories', 'name')) {
            Schema::table('categories', function (Blueprint $table): void {
                $table->string('name')->nullable()->after('id');
                $table->string('slug')->nullable()->after('name');
                $table->boolean('is_active')->default(true)->after('slug');
            });
        }

        if (! Schema::hasColumn('tasker_profiles', 'user_id')) {
            Schema::table('tasker_profiles', function (Blueprint $table): void {
                $table->foreignId('user_id')->nullable()->after('id')->constrained('users')->cascadeOnDelete();
                $table->text('bio')->nullable();
                $table->unsignedInteger('experience_years')->default(0);
                $table->text('skills_text')->nullable();
                $table->text('availability_text')->nullable();
                $table->decimal('hourly_rate', 10, 2)->nullable();
            });
        }

        if (! Schema::hasColumn('background_checks', 'tasker_id')) {
            Schema::table('background_checks', function (Blueprint $table): void {
                $table->foreignId('tasker_id')->nullable()->after('id')->constrained('users')->cascadeOnDelete();
                $table->string('provider')->default('certn');
                $table->string('status')->default('pending');
                $table->json('raw_response')->nullable();
                $table->timestamp('requested_at')->nullable();
                $table->timestamp('completed_at')->nullable();
            });
        }

        if (! Schema::hasColumn('tasks', 'customer_id')) {
            Schema::table('tasks', function (Blueprint $table): void {
                $table->foreignId('customer_id')->nullable()->after('id')->constrained('users')->cascadeOnDelete();
                $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
                $table->string('title')->nullable();
                $table->text('description')->nullable();
                $table->decimal('budget_estimate', 10, 2)->nullable();
                $table->timestamp('scheduled_at')->nullable();
                $table->string('address')->nullable();
                $table->string('city')->nullable();
                $table->string('status')->default('open')->index();
                $table->foreignId('selected_tasker_id')->nullable()->constrained('users')->nullOnDelete();
            });
        }

        if (! Schema::hasColumn('task_applications', 'task_id')) {
            Schema::table('task_applications', function (Blueprint $table): void {
                $table->foreignId('task_id')->nullable()->after('id')->constrained('tasks')->cascadeOnDelete();
                $table->foreignId('tasker_id')->nullable()->constrained('users')->cascadeOnDelete();
                $table->decimal('offer_price', 10, 2)->nullable();
                $table->text('message')->nullable();
                $table->string('status')->default('pending');
            });
        }

        if (! Schema::hasColumn('task_assignments', 'task_id')) {
            Schema::table('task_assignments', function (Blueprint $table): void {
                $table->foreignId('task_id')->nullable()->after('id')->constrained('tasks')->cascadeOnDelete();
                $table->foreignId('customer_id')->nullable()->constrained('users')->cascadeOnDelete();
                $table->foreignId('tasker_id')->nullable()->constrained('users')->cascadeOnDelete();
                $table->decimal('assigned_price', 10, 2)->nullable();
                $table->timestamp('assigned_at')->nullable();
                $table->timestamp('started_at')->nullable();
                $table->timestamp('completed_at')->nullable();
                $table->timestamp('closed_at')->nullable();
            });
        }

        if (! Schema::hasColumn('task_status_histories', 'task_id')) {
            Schema::table('task_status_histories', function (Blueprint $table): void {
                $table->foreignId('task_id')->nullable()->after('id')->constrained('tasks')->cascadeOnDelete();
                $table->string('from_status')->nullable();
                $table->string('to_status');
                $table->foreignId('changed_by')->nullable()->constrained('users')->nullOnDelete();
                $table->text('note')->nullable();
            });
        }
    }

    public function down(): void
    {
        // Intentionally left empty to avoid destructive rollback on live data.
    }
};

