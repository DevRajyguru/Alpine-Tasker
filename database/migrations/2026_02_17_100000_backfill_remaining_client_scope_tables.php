<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('commission_settings', 'commission_type')) {
            Schema::table('commission_settings', function (Blueprint $table): void {
                $table->string('commission_type')->default('percent')->after('id');
                $table->decimal('commission_value', 10, 2)->default(10)->after('commission_type');
                $table->boolean('is_active')->default(true)->after('commission_value');
                $table->timestamp('effective_from')->nullable()->after('is_active');
                $table->foreignId('created_by')->nullable()->after('effective_from')->constrained('users')->nullOnDelete();
            });
        }

        if (! Schema::hasColumn('coupons', 'code')) {
            Schema::table('coupons', function (Blueprint $table): void {
                $table->string('code')->nullable()->unique()->after('id');
                $table->string('type')->default('percent')->after('code');
                $table->decimal('value', 10, 2)->default(0)->after('type');
                $table->decimal('max_discount', 10, 2)->nullable()->after('value');
                $table->decimal('min_order_amount', 10, 2)->nullable()->after('max_discount');
                $table->unsignedInteger('usage_limit')->nullable()->after('min_order_amount');
                $table->unsignedInteger('used_count')->default(0)->after('usage_limit');
                $table->timestamp('starts_at')->nullable()->after('used_count');
                $table->timestamp('expires_at')->nullable()->after('starts_at');
                $table->boolean('is_active')->default(true)->after('expires_at');
                $table->foreignId('created_by')->nullable()->after('is_active')->constrained('users')->nullOnDelete();
            });
        }

        if (! Schema::hasColumn('payments', 'task_id')) {
            Schema::table('payments', function (Blueprint $table): void {
                $table->foreignId('task_id')->nullable()->after('id')->constrained('tasks')->cascadeOnDelete();
                $table->foreignId('customer_id')->nullable()->constrained('users')->nullOnDelete();
                $table->foreignId('tasker_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('gateway')->default('stripe');
                $table->string('gateway_payment_id')->nullable();
                $table->string('currency', 3)->default('USD');
                $table->decimal('task_amount', 10, 2)->default(0);
                $table->decimal('authorized_amount', 10, 2)->default(0);
                $table->decimal('captured_amount', 10, 2)->default(0);
                $table->foreignId('coupon_id')->nullable()->constrained('coupons')->nullOnDelete();
                $table->decimal('discount_amount', 10, 2)->default(0);
                $table->decimal('commission_amount', 10, 2)->default(0);
                $table->decimal('gateway_fee', 10, 2)->default(0);
                $table->decimal('tasker_net_amount', 10, 2)->default(0);
                $table->string('status')->default('requires_payment')->index();
                $table->timestamp('authorized_at')->nullable();
                $table->timestamp('captured_at')->nullable();
            });
        }

        if (! Schema::hasColumn('coupon_redemptions', 'coupon_id')) {
            Schema::table('coupon_redemptions', function (Blueprint $table): void {
                $table->foreignId('coupon_id')->nullable()->after('id')->constrained('coupons')->cascadeOnDelete();
                $table->foreignId('payment_id')->nullable()->constrained('payments')->cascadeOnDelete();
                $table->foreignId('customer_id')->nullable()->constrained('users')->nullOnDelete();
                $table->decimal('discount_amount', 10, 2)->default(0);
            });
        }

        if (! Schema::hasColumn('payouts', 'payment_id')) {
            Schema::table('payouts', function (Blueprint $table): void {
                $table->foreignId('payment_id')->nullable()->after('id')->constrained('payments')->cascadeOnDelete();
                $table->foreignId('tasker_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('gateway_payout_id')->nullable();
                $table->decimal('amount', 10, 2)->default(0);
                $table->string('status')->default('pending');
                $table->timestamp('scheduled_for')->nullable();
                $table->timestamp('paid_at')->nullable();
            });
        }

        if (! Schema::hasColumn('refunds', 'payment_id')) {
            Schema::table('refunds', function (Blueprint $table): void {
                $table->foreignId('payment_id')->nullable()->after('id')->constrained('payments')->cascadeOnDelete();
                $table->foreignId('requested_by')->nullable()->constrained('users')->nullOnDelete();
                $table->decimal('amount', 10, 2)->default(0);
                $table->text('reason')->nullable();
                $table->string('gateway_refund_id')->nullable();
                $table->string('status')->default('pending');
                $table->timestamp('processed_at')->nullable();
            });
        }

        if (! Schema::hasColumn('disputes', 'task_id')) {
            Schema::table('disputes', function (Blueprint $table): void {
                $table->foreignId('task_id')->nullable()->after('id')->constrained('tasks')->cascadeOnDelete();
                $table->foreignId('raised_by')->nullable()->constrained('users')->nullOnDelete();
                $table->foreignId('against_user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('subject')->nullable();
                $table->text('description')->nullable();
                $table->string('status')->default('open')->index();
                $table->string('priority')->default('medium');
                $table->foreignId('resolved_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamp('resolved_at')->nullable();
            });
        }

        if (! Schema::hasColumn('dispute_messages', 'dispute_id')) {
            Schema::table('dispute_messages', function (Blueprint $table): void {
                $table->foreignId('dispute_id')->nullable()->after('id')->constrained('disputes')->cascadeOnDelete();
                $table->foreignId('sender_id')->nullable()->constrained('users')->nullOnDelete();
                $table->text('message')->nullable();
                $table->boolean('is_internal')->default(false);
            });
        }

        if (! Schema::hasColumn('dispute_attachments', 'dispute_message_id')) {
            Schema::table('dispute_attachments', function (Blueprint $table): void {
                $table->foreignId('dispute_message_id')->nullable()->after('id')->constrained('dispute_messages')->cascadeOnDelete();
                $table->string('file_path')->nullable();
                $table->string('mime_type')->nullable();
                $table->unsignedBigInteger('file_size')->nullable();
            });
        }

        if (! Schema::hasColumn('cookie_consents', 'policy_version')) {
            Schema::table('cookie_consents', function (Blueprint $table): void {
                $table->foreignId('user_id')->nullable()->after('id')->constrained('users')->nullOnDelete();
                $table->string('guest_token')->nullable()->index()->after('user_id');
                $table->string('policy_version')->default('1.0')->after('guest_token');
                $table->boolean('necessary')->default(true)->after('policy_version');
                $table->boolean('analytics')->default(false)->after('necessary');
                $table->boolean('marketing')->default(false)->after('analytics');
                $table->string('ip_address', 45)->nullable()->after('marketing');
                $table->text('user_agent')->nullable()->after('ip_address');
                $table->timestamp('accepted_at')->nullable()->after('user_agent');
            });
        }

        if (! Schema::hasColumn('background_checks', 'provider_case_id')) {
            Schema::table('background_checks', function (Blueprint $table): void {
                $table->string('provider_case_id')->nullable()->after('provider');
                $table->string('report_url')->nullable()->after('status');
            });
        }
    }

    public function down(): void
    {
        // Non-destructive rollback intentionally omitted.
    }
};

