<?php

namespace App\Interfaces\Http\Controllers\Api;

use App\Application\User\Services\SettingsService;
use App\Interfaces\Http\Requests\Settings\UpdateNotificationSettingsRequest;
use App\Interfaces\Http\Requests\Settings\UpdatePayoutSettingsRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class SettingsController
{
    public function __construct(
        private readonly SettingsService $settingsService,
    ) {}

    public function index(): JsonResponse
    {
        $settings = $this->settingsService->getSettings(
            Auth::id(),
        );

        return response()->json($settings);
    }

    public function updateNotifications(UpdateNotificationSettingsRequest $request): JsonResponse
    {
        $settings = $this->settingsService->updateNotificationSettings(
            Auth::id(),
            $request->validated(),
        );

        return response()->json($settings);
    }

    public function updatePayout(UpdatePayoutSettingsRequest $request): JsonResponse
    {
        $settings = $this->settingsService->updatePayoutSettings(
            Auth::id(),
            $request->validated(),
        );

        return response()->json($settings);
    }
}
