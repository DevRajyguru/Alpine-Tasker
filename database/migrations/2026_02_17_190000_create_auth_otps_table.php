<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('auth_otps')) {
            Schema::create('auth_otps', function (Blueprint $table): void {
                $table->id();
                $table->string('email')->index();
                $table->string('purpose', 30)->default('register')->index();
                $table->string('otp_hash');
                $table->unsignedTinyInteger('attempts')->default(0);
                $table->timestamp('expires_at');
                $table->timestamp('verified_at')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('auth_otps');
    }
};

