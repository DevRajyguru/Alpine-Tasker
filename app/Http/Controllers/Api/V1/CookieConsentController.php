<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\CookieConsentStoreRequest;
use App\Models\CookieConsent;
use Illuminate\Http\JsonResponse;

class CookieConsentController extends Controller
{
    public function store(CookieConsentStoreRequest $request): JsonResponse
    {
        $user = $request->user();

        $consent = CookieConsent::updateOrCreate(
            [
                'user_id' => $user?->id,
                'guest_token' => $user ? null : $request->validated('guest_token'),
            ],
            [
                'policy_version' => $request->validated('policy_version'),
                'necessary' => true,
                'analytics' => (bool) $request->validated('analytics', false),
                'marketing' => (bool) $request->validated('marketing', false),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'accepted_at' => now(),
            ]
        );

        return response()->json([
            'message' => 'Cookie preferences saved.',
            'cookie_consent' => $consent,
        ]);
    }
}

