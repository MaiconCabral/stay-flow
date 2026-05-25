<?php

namespace App\Providers;

use App\Domain\Availability\Repositories\AvailabilityRepositoryInterface;
use App\Domain\Lead\Repositories\LeadRepositoryInterface;
use App\Domain\Message\Repositories\ConversationRepositoryInterface;
use App\Domain\Message\Repositories\MessageRepositoryInterface;
use App\Domain\Notification\Repositories\NotificationRepositoryInterface;
use App\Domain\Payment\Contracts\PaymentGatewayInterface;
use App\Domain\Payment\Repositories\PaymentRepositoryInterface;
use App\Domain\Property\Repositories\PropertyRepositoryInterface;
use App\Domain\Review\Repositories\ReviewRepositoryInterface;
use App\Domain\Reservation\Repositories\ReservationRepositoryInterface;
use App\Domain\User\Repositories\UserRepositoryInterface;
use App\Domain\Wishlist\Repositories\WishlistRepositoryInterface;
use App\Infrastructure\Persistence\Repositories\EloquentAvailabilityRepository;
use App\Infrastructure\PaymentGateways\FakePaymentGateway;
use App\Infrastructure\Persistence\Repositories\EloquentConversationRepository;
use App\Infrastructure\Persistence\Repositories\EloquentLeadRepository;
use App\Infrastructure\Persistence\Repositories\EloquentMessageRepository;
use App\Infrastructure\Persistence\Repositories\EloquentNotificationRepository;
use App\Infrastructure\Persistence\Repositories\EloquentPaymentRepository;
use App\Infrastructure\Persistence\Repositories\EloquentPropertyRepository;
use App\Infrastructure\Persistence\Repositories\EloquentReservationRepository;
use App\Infrastructure\Persistence\Repositories\EloquentReviewRepository;
use App\Infrastructure\Persistence\Repositories\EloquentUserRepository;
use App\Infrastructure\Persistence\Repositories\EloquentWishlistRepository;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            UserRepositoryInterface::class,
            EloquentUserRepository::class,
        );

        $this->app->bind(
            PropertyRepositoryInterface::class,
            EloquentPropertyRepository::class,
        );

        $this->app->bind(
            ReservationRepositoryInterface::class,
            EloquentReservationRepository::class,
        );

        $this->app->bind(
            LeadRepositoryInterface::class,
            EloquentLeadRepository::class,
        );

        $this->app->bind(
            PaymentRepositoryInterface::class,
            EloquentPaymentRepository::class,
        );

        $this->app->bind(
            AvailabilityRepositoryInterface::class,
            EloquentAvailabilityRepository::class,
        );

        $this->app->bind(
            PaymentGatewayInterface::class,
            FakePaymentGateway::class,
        );

        $this->app->bind(
            ReviewRepositoryInterface::class,
            EloquentReviewRepository::class,
        );

        $this->app->bind(
            WishlistRepositoryInterface::class,
            EloquentWishlistRepository::class,
        );

        $this->app->bind(
            ConversationRepositoryInterface::class,
            EloquentConversationRepository::class,
        );

        $this->app->bind(
            MessageRepositoryInterface::class,
            EloquentMessageRepository::class,
        );

        $this->app->bind(
            NotificationRepositoryInterface::class,
            EloquentNotificationRepository::class,
        );
    }

    public function boot(): void
    {
        //
    }
}
