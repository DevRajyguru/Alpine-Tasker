<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\OtpSendRequest;
use App\Http\Requests\Auth\OtpVerifyRequest;
use App\Mail\AuthOtpMail;
use App\Models\AuthOtp;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\HttpFoundation\Response;

class AuthOtpController extends Controller
{
    public function send(OtpSendRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $email = strtolower((string) $validated['email']);
        $purpose = (string) $validated['purpose'];

        $user = User::where('email', $email)->first();
        if ($purpose === 'register' && $user) {
            return response()->json(['message' => 'Email already registered.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        if ($purpose === 'login' && ! $user) {
            return response()->json(['message' => 'Account not found for this email.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $otp = (string) random_int(100000, 999999);

        AuthOtp::where('email', $email)
            ->where('purpose', $purpose)
            ->whereNull('verified_at')
            ->delete();

        AuthOtp::create([
            'email' => $email,
            'purpose' => $purpose,
            'otp_hash' => Hash::make($otp),
            'attempts' => 0,
            'expires_at' => now()->addMinutes(10),
        ]);

        try {
            Mail::to($email)->send(new AuthOtpMail($otp, $purpose));
        } catch (\Throwable $exception) {
            return response()->json([
                'message' => 'OTP email sending failed. Check mail configuration.',
                'error' => $exception->getMessage(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response()->json([
            'message' => 'OTP sent successfully.',
            'expires_in_seconds' => 600,
        ]);
    }

    public function verify(OtpVerifyRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $email = strtolower((string) $validated['email']);
        $purpose = (string) $validated['purpose'];
        $otp = (string) $validated['otp'];

        $record = AuthOtp::where('email', $email)
            ->where('purpose', $purpose)
            ->whereNull('verified_at')
            ->latest()
            ->first();

        if (! $record || now()->gt($record->expires_at)) {
            return response()->json(['message' => 'OTP is invalid or expired.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if ($record->attempts >= 5) {
            return response()->json(['message' => 'Too many invalid attempts. Request a new OTP.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if (! Hash::check($otp, $record->otp_hash)) {
            $record->increment('attempts');
            return response()->json(['message' => 'Invalid OTP.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $record->update(['verified_at' => now()]);

        $user = User::where('email', $email)->first();
        if ($user && ! $user->email_verified_at) {
            $user->forceFill(['email_verified_at' => now()])->save();
        }

        return response()->json([
            'message' => 'OTP verified successfully.',
            'verified' => true,
        ]);
    }
}
