<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class CertnService
{
    public function submitBackgroundCheck(array $payload): array
    {
        $baseUrl = rtrim((string) config('services.certn.base_url'), '/');
        $apiKey = (string) config('services.certn.api_key');

        if ($apiKey === '') {
            return [
                'success' => false,
                'message' => 'CERTN_API_KEY missing.',
                'data' => null,
            ];
        }

        $response = Http::withToken($apiKey)
            ->acceptJson()
            ->post("{$baseUrl}/v1/checks", $payload);

        if (! $response->successful()) {
            return [
                'success' => false,
                'message' => 'Certn request failed.',
                'data' => $response->json(),
            ];
        }

        return [
            'success' => true,
            'message' => 'Check submitted.',
            'data' => $response->json(),
        ];
    }
}

