<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\TaskerProfileUpsertRequest;
use App\Models\BackgroundCheck;
use App\Models\TaskerProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\Response;

class TaskerProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'tasker') {
            return response()->json(['message' => 'Only taskers can access this resource.'], Response::HTTP_FORBIDDEN);
        }

        $profile = TaskerProfile::firstOrCreate(['user_id' => $user->id]);
        $backgroundCheck = BackgroundCheck::firstOrCreate(
            ['tasker_id' => $user->id],
            ['provider' => 'certn', 'status' => 'pending', 'requested_at' => now()]
        );

        return response()->json([
            'profile' => $profile,
            'background_check' => $backgroundCheck,
        ]);
    }

    public function upsert(TaskerProfileUpsertRequest $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'tasker') {
            return response()->json(['message' => 'Only taskers can update profile.'], Response::HTTP_FORBIDDEN);
        }

        $profile = TaskerProfile::updateOrCreate(
            ['user_id' => $user->id],
            $request->validated()
        );

        $backgroundCheck = BackgroundCheck::firstOrCreate(
            ['tasker_id' => $user->id],
            ['provider' => 'certn', 'status' => 'pending', 'requested_at' => now()]
        );

        return response()->json([
            'message' => 'Profile saved successfully.',
            'profile' => $profile,
            'background_check' => $backgroundCheck,
        ]);
    }

    public function createStripeConnectAccount(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user->role !== 'tasker') {
            return response()->json(['message' => 'Only taskers can connect payout account.'], Response::HTTP_FORBIDDEN);
        }

        $payload = $request->validate([
            'account_type' => ['nullable', 'in:standard,express'],
        ]);

        $secret = (string) config('services.stripe.secret');
        if ($secret === '') {
            return response()->json(['message' => 'STRIPE_SECRET is not configured.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $profile = TaskerProfile::firstOrCreate(['user_id' => $user->id]);
        $accountType = (string) ($payload['account_type'] ?? $profile->stripe_account_type ?? 'express');

        if (! $profile->stripe_account_id) {
            $accountResponse = Http::asForm()
                ->withToken($secret)
                ->post('https://api.stripe.com/v1/accounts', [
                    'type' => $accountType,
                    'country' => 'US',
                    'email' => $user->email,
                    'business_type' => 'individual',
                    'capabilities[card_payments][requested]' => 'true',
                    'capabilities[transfers][requested]' => 'true',
                ]);

            if (! $accountResponse->successful()) {
                return response()->json([
                    'message' => 'Failed to create Stripe Connect account.',
                    'details' => $accountResponse->json(),
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $profile->update([
                'stripe_account_id' => (string) data_get($accountResponse->json(), 'id'),
                'stripe_account_type' => $accountType,
            ]);
        }

        $refreshUrl = (string) env('STRIPE_CONNECT_REFRESH_URL', rtrim((string) config('app.url'), '/').'/tasker/dashboard');
        $returnUrl = (string) env('STRIPE_CONNECT_RETURN_URL', rtrim((string) config('app.url'), '/').'/tasker/dashboard');

        $linkResponse = Http::asForm()
            ->withToken($secret)
            ->post('https://api.stripe.com/v1/account_links', [
                'account' => $profile->stripe_account_id,
                'refresh_url' => $refreshUrl,
                'return_url' => $returnUrl,
                'type' => 'account_onboarding',
            ]);

        if (! $linkResponse->successful()) {
            return response()->json([
                'message' => 'Failed to create Stripe onboarding link.',
                'details' => $linkResponse->json(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response()->json([
            'message' => 'Stripe onboarding link created.',
            'account_id' => $profile->stripe_account_id,
            'account_type' => $profile->stripe_account_type,
            'onboarding_url' => (string) data_get($linkResponse->json(), 'url'),
            'expires_at' => data_get($linkResponse->json(), 'expires_at'),
        ]);
    }

    public function refreshStripeConnectStatus(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user->role !== 'tasker') {
            return response()->json(['message' => 'Only taskers can access this resource.'], Response::HTTP_FORBIDDEN);
        }

        $profile = TaskerProfile::firstOrCreate(['user_id' => $user->id]);
        if (! $profile->stripe_account_id) {
            return response()->json(['message' => 'Stripe account not connected yet.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $secret = (string) config('services.stripe.secret');
        if ($secret === '') {
            return response()->json(['message' => 'STRIPE_SECRET is not configured.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $response = Http::withToken($secret)->get("https://api.stripe.com/v1/accounts/{$profile->stripe_account_id}");
        if (! $response->successful()) {
            return response()->json([
                'message' => 'Failed to fetch Stripe account status.',
                'details' => $response->json(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $stripe = $response->json();
        $chargesEnabled = (bool) data_get($stripe, 'charges_enabled', false);
        $payoutsEnabled = (bool) data_get($stripe, 'payouts_enabled', false);

        $profile->update([
            'stripe_charges_enabled' => $chargesEnabled,
            'stripe_payouts_enabled' => $payoutsEnabled,
            'stripe_onboarded_at' => ($chargesEnabled && $payoutsEnabled) ? now() : null,
        ]);

        return response()->json([
            'message' => 'Stripe account status refreshed.',
            'profile' => $profile->fresh(),
        ]);
    }
}
