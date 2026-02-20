<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('services')) {
            Schema::create('services', function (Blueprint $table): void {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->text('description')->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        if (! Schema::hasColumn('tasks', 'service_id')) {
            Schema::table('tasks', function (Blueprint $table): void {
                $table->foreignId('service_id')->nullable()->after('category_id')->constrained('services')->nullOnDelete();
            });
        }

        if (! Schema::hasTable('service_fields')) {
            Schema::create('service_fields', function (Blueprint $table): void {
                $table->id();
                $table->foreignId('service_id')->constrained('services')->cascadeOnDelete();
                $table->string('label');
                $table->string('key');
                $table->string('type');
                $table->boolean('is_required')->default(false);
                $table->string('placeholder')->nullable();
                $table->string('help_text')->nullable();
                $table->unsignedInteger('sort_order')->default(0);
                $table->json('config_json')->nullable();
                $table->timestamps();
                $table->unique(['service_id', 'key']);
            });
        }

        if (! Schema::hasTable('service_field_options')) {
            Schema::create('service_field_options', function (Blueprint $table): void {
                $table->id();
                $table->foreignId('service_field_id')->constrained('service_fields')->cascadeOnDelete();
                $table->string('label');
                $table->string('value');
                $table->unsignedInteger('sort_order')->default(0);
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('task_field_values')) {
            Schema::create('task_field_values', function (Blueprint $table): void {
                $table->id();
                $table->foreignId('task_id')->constrained('tasks')->cascadeOnDelete();
                $table->foreignId('service_field_id')->constrained('service_fields')->cascadeOnDelete();
                $table->text('value_text')->nullable();
                $table->decimal('value_number', 12, 2)->nullable();
                $table->boolean('value_bool')->nullable();
                $table->json('value_json')->nullable();
                $table->string('file_path')->nullable();
                $table->timestamps();
                $table->unique(['task_id', 'service_field_id']);
            });
        }
    }

    public function down(): void
    {
        // Non-destructive rollback intentionally omitted.
    }
};

