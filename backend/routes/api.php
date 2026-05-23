<?php

use App\Interfaces\Http\Controllers\Api\AuthController;
use App\Interfaces\Http\Controllers\Api\AvailabilityController;
use App\Interfaces\Http\Controllers\Api\ConversationController;
use App\Interfaces\Http\Controllers\Api\LeadController;
use App\Interfaces\Http\Controllers\Api\MessageController;
use App\Interfaces\Http\Controllers\Api\PaymentController;
use App\Interfaces\Http\Controllers\Api\PropertyController;
use App\Interfaces\Http\Controllers\Api\ReservationController;
use App\Interfaces\Http\Controllers\Api\ReviewController;
use App\Interfaces\Http\Controllers\Api\UserController;
use App\Interfaces\Http\Controllers\Api\WishlistController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    Route::get('/availabilities/check', [AvailabilityController::class, 'check']);
    Route::apiResource('availabilities', AvailabilityController::class);

    Route::apiResource('users', UserController::class);
    Route::apiResource('properties', PropertyController::class);
    Route::get('properties/{property}/reviews', [ReviewController::class, 'index']);
    Route::post('properties/{property}/reviews', [ReviewController::class, 'store']);
    Route::get('reviews/{review}', [ReviewController::class, 'show']);
    Route::put('reviews/{review}', [ReviewController::class, 'update']);
    Route::delete('reviews/{review}', [ReviewController::class, 'destroy']);
    Route::apiResource('reservations', ReservationController::class);
    Route::apiResource('leads', LeadController::class);
    Route::apiResource('payments', PaymentController::class);

    Route::post('/reservations/{reservation}/cancel', [ReservationController::class, 'cancel']);
    Route::post('/leads/{lead}/convert', [LeadController::class, 'convert']);
    Route::post('/payments/{payment}/process', [PaymentController::class, 'process']);
    Route::post('/payments/{payment}/refund', [PaymentController::class, 'refund']);

    Route::get('/wishlists', [WishlistController::class, 'index']);
    Route::post('/wishlists', [WishlistController::class, 'store']);
    Route::delete('/wishlists/{property}', [WishlistController::class, 'destroy']);

    // Message Domain
    Route::apiResource('conversations', ConversationController::class)->only([
        'index', 'show', 'store',
    ]);
    Route::get('conversations/{conversation}/messages', [MessageController::class, 'index']);
    Route::post('conversations/{conversation}/messages', [MessageController::class, 'store']);
    Route::post('messages/{message}/read', [MessageController::class, 'markAsRead']);
    Route::post('conversations/{conversation}/read', [MessageController::class, 'markConversationAsRead']);
    Route::get('messages/unread-count', [MessageController::class, 'unreadCount']);
});
