<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('search_events', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('guest_token', 120)->nullable()->index();
            $table->string('category', 120);
            $table->string('location', 120);
            $table->string('source', 80)->default('home_search');
            $table->ipAddress('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('searched_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('search_events');
    }
};

