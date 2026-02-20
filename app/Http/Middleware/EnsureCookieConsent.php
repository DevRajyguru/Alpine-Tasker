<?php

namespace App\Http\Middleware;

use App\Models\CookieConsent;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCookieConsent
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (! $user) {
            return $next($request);
        }

        $accepted = CookieConsent::where('user_id', $user->id)
            ->whereNotNull('accepted_at')
            ->exists();

        if (! $accepted) {
            return response()->json([
                'message' => 'Cookie consent is required before using this feature.',
            ], Response::HTTP_PRECONDITION_REQUIRED);
        }

        return $next($request);
    }
}

