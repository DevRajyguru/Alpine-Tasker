<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('task_assignments', 'event_type')) {
            Schema::table('task_assignments', function (Blueprint $table): void {
                $table->string('event_type')->nullable()->after('assigned_price');
                $table->string('service_level')->nullable()->after('event_type');
                $table->date('preferred_date')->nullable()->after('service_level');
                $table->time('preferred_time')->nullable()->after('preferred_date');
                $table->text('booking_description')->nullable()->after('preferred_time');
                $table->string('payment_option')->default('pay_now')->after('booking_description');
                $table->string('customer_otp', 10)->nullable()->after('payment_option');
                $table->timestamp('customer_otp_expires_at')->nullable()->after('customer_otp');
                $table->timestamp('customer_otp_verified_at')->nullable()->after('customer_otp_expires_at');
                $table->unsignedInteger('otp_attempts')->default(0)->after('customer_otp_verified_at');
            });
        }
    }

    public function down(): void
    {
        // Non-destructive rollback intentionally omitted.
    }
};

