<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Controllers\Controller;
use App\Jobs\RequestTaskerBackgroundCheckJob;
use App\Models\AuthOtp;
use App\Models\BackgroundCheck;
use App\Models\TaskerProfile;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        if (
            $this->isRegistrationOtpRequired()
            && in_array($validated['role'], ['customer', 'tasker'], true)
            && ! $this->hasRecentVerifiedOtp((string) $validated['email'], 'register')
        ) {
            return response()->json([
                'message' => 'Please verify your email with OTP before registration.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if ($validated['role'] === 'admin') {
            $expectedKey = (string) env('ADMIN_SIGNUP_KEY', '');
            $providedKey = (string) ($validated['admin_signup_key'] ?? '');
            if ($expectedKey === '' || ! hash_equals($expectedKey, $providedKey)) {
                return response()->json([
                    'message' => 'Invalid admin signup key.',
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }
        }

        $user = DB::transaction(function () use ($validated) {
            $newUser = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password'],
                'role' => $validated['role'],
                'is_active' => $validated['role'] !== 'tasker',
            ]);

            if ($validated['role'] === 'tasker') {
                TaskerProfile::create([
                    'user_id' => $newUser->id,
                ]);

                BackgroundCheck::create([
                    'tasker_id' => $newUser->id,
                    'provider' => 'certn',
                    'status' => 'pending',
                    'requested_at' => now(),
                ]);

                RequestTaskerBackgroundCheckJob::dispatch($newUser->id);
            }

            return $newUser;
        });

        $token = $user->createToken($request->userAgent() ?? 'api-token')->plainTextToken;

        return response()->json([
            'message' => 'Registered successfully.',
            'token' => $token,
            'user' => $user,
        ], Response::HTTP_CREATED);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials.',
            ], Response::HTTP_UNAUTHORIZED);
        }

        if ($this->isLoginOtpRequired() && ! $this->consumeRecentVerifiedOtp((string) $user->email, 'login')) {
            return response()->json([
                'message' => 'Please verify login OTP before logging in.',
            ], Response::HTTP_FORBIDDEN);
        }

        if (! $user->is_active) {
            return response()->json([
                'message' => 'Your account is pending activation.',
            ], Response::HTTP_FORBIDDEN);
        }

        $token = $user->createToken($validated['device_name'] ?? ($request->userAgent() ?? 'api-token'))->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }

    private function isRegistrationOtpRequired(): bool
    {
        return filter_var(env('AUTH_REQUIRE_REGISTER_OTP', false), FILTER_VALIDATE_BOOLEAN);
    }

    private function isLoginOtpRequired(): bool
    {
        return filter_var(env('AUTH_REQUIRE_LOGIN_OTP', false), FILTER_VALIDATE_BOOLEAN);
    }

    private function hasRecentVerifiedOtp(string $email, string $purpose): bool
    {
        return AuthOtp::where('email', strtolower($email))
            ->where('purpose', $purpose)
            ->whereNotNull('verified_at')
            ->whereNull('consumed_at')
            ->where('expires_at', '>', now())
            ->where('verified_at', '>=', now()->subMinutes(30))
            ->exists();
    }

    private function consumeRecentVerifiedOtp(string $email, string $purpose): bool
    {
        $record = AuthOtp::where('email', strtolower($email))
            ->where('purpose', $purpose)
            ->whereNotNull('verified_at')
            ->whereNull('consumed_at')
            ->where('expires_at', '>', now())
            ->latest('verified_at')
            ->first();

        if (! $record) {
            return false;
        }

        $record->update([
            'consumed_at' => now(),
        ]);

        return true;
    }
}
