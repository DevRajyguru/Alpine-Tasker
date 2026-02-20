<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $adminEmail = (string) env('ADMIN_EMAIL', '');
        $adminPassword = (string) env('ADMIN_PASSWORD', '');
        $adminName = (string) env('ADMIN_NAME', 'Super Admin');

        if ($adminEmail !== '' && $adminPassword !== '') {
            User::updateOrCreate(
                ['email' => strtolower($adminEmail)],
                [
                    'name' => $adminName,
                    'password' => $adminPassword,
                    'role' => 'admin',
                    'is_active' => true,
                    'remember_token' => Str::random(10),
                ]
            );
        }
    }
}
