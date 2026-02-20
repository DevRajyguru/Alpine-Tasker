<?php

namespace App\Jobs;

use App\Models\BackgroundCheck;
use App\Models\User;
use App\Services\CertnService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class RequestTaskerBackgroundCheckJob implements ShouldQueue
{
    use Queueable;

    public function __construct(public int $taskerId)
    {
    }

    public function handle(CertnService $certn): void
    {
        $tasker = User::find($this->taskerId);
        if (! $tasker || $tasker->role !== 'tasker') {
            return;
        }

        $check = BackgroundCheck::firstOrCreate(
            ['tasker_id' => $tasker->id],
            ['provider' => 'certn', 'status' => 'pending', 'requested_at' => now()]
        );

        $result = $certn->submitBackgroundCheck([
            'external_id' => (string) $tasker->id,
            'name' => $tasker->name,
            'email' => $tasker->email,
        ]);

        if (! $result['success']) {
            $check->update([
                'status' => 'review_required',
                'raw_response' => $result['data'],
            ]);

            return;
        }

        $caseId = data_get($result['data'], 'id');

        $check->update([
            'provider_case_id' => $caseId,
            'status' => 'pending',
            'raw_response' => $result['data'],
        ]);
    }
}

