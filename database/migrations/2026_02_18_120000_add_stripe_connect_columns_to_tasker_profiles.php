<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('tasker_profiles', 'stripe_account_id')) {
            Schema::table('tasker_profiles', function (Blueprint $table): void {
                $table->string('stripe_account_id')->nullable()->after('hourly_rate');
                $table->string('stripe_account_type')->nullable()->after('stripe_account_id');
                $table->boolean('stripe_charges_enabled')->default(false)->after('stripe_account_type');
                $table->boolean('stripe_payouts_enabled')->default(false)->after('stripe_charges_enabled');
                $table->timestamp('stripe_onboarded_at')->nullable()->after('stripe_payouts_enabled');
            });
        }
    }

    public function down(): void
    {
        // Non-destructive rollback intentionally omitted.
    }
};
