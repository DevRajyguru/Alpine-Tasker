<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\SearchEventStoreRequest;
use App\Models\SearchEvent;
use Illuminate\Http\JsonResponse;

class SearchEventController extends Controller
{
    public function store(SearchEventStoreRequest $request): JsonResponse
    {
        $event = SearchEvent::create([
            'user_id' => $request->user()?->id,
            'guest_token' => $request->user() ? null : $request->validated('guest_token'),
            'category' => $request->validated('category'),
            'location' => $request->validated('location'),
            'source' => $request->validated('source', 'home_search'),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'searched_at' => now(),
        ]);

        return response()->json([
            'message' => 'Search event saved.',
            'search_event' => $event,
        ], 201);
    }
}

