<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('auth_otps') && ! Schema::hasColumn('auth_otps', 'consumed_at')) {
            Schema::table('auth_otps', function (Blueprint $table): void {
                $table->timestamp('consumed_at')->nullable()->after('verified_at');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('auth_otps') && Schema::hasColumn('auth_otps', 'consumed_at')) {
            Schema::table('auth_otps', function (Blueprint $table): void {
                $table->dropColumn('consumed_at');
            });
        }
    }
};

