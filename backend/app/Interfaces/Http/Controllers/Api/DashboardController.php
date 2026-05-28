<?php

namespace App\Interfaces\Http\Controllers\Api;

use App\Domain\Property\Property;
use App\Domain\Reservation\Reservation;
use App\Domain\Review\Review;
use App\Domain\Wishlist\Wishlist;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController
{
    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();
        $now = Carbon::now();

        if ($user->isHost()) {
            $propertyIds = Property::where('host_id', $user->id)->pluck('id');

            $activeReservations = Reservation::whereIn('property_id', $propertyIds)
                ->where('status', 'confirmed')
                ->where('check_out', '>=', $now)
                ->count();

            $totalRevenue = Reservation::whereIn('property_id', $propertyIds)
                ->whereIn('status', ['confirmed', 'completed'])
                ->sum('total_price');

            $totalProperties = $propertyIds->count();
            $activeProperties = Property::where('host_id', $user->id)
                ->where('status', 'available')
                ->count();

            $upcomingCheckIns = Reservation::with('property', 'guest')
                ->whereIn('property_id', $propertyIds)
                ->where('status', 'confirmed')
                ->where('check_in', '>=', $now)
                ->where('check_in', '<=', $now->copy()->addDays(30))
                ->orderBy('check_in')
                ->take(5)
                ->get()
                ->map(fn ($r) => [
                    'id' => $r->id,
                    'guest_name' => $r->guest?->name,
                    'property_title' => $r->property?->title,
                    'check_in' => $r->check_in->toDateString(),
                    'check_out' => $r->check_out->toDateString(),
                    'status' => $r->status->value,
                ]);

            // Occupancy (next 30 days)
            $totalDays = $activeProperties * 30;
            $bookedDays = 0;
            if ($totalDays > 0) {
                $bookings = Reservation::whereIn('property_id', $propertyIds)
                    ->where('status', 'confirmed')
                    ->where('check_in', '<', $now->copy()->addDays(30))
                    ->where('check_out', '>', $now)
                    ->get();

                foreach ($bookings as $b) {
                    $start = $b->check_in->greaterThan($now) ? $b->check_in : $now;
                    $end = $b->check_out->greaterThan($now->copy()->addDays(30)) ? $now->copy()->addDays(30) : $b->check_out;
                    $bookedDays += $start->diffInDays($end);
                }
            }
            $occupancyRate = $totalDays > 0 ? round(($bookedDays / $totalDays) * 100, 1) : 0;

            return response()->json([
                'role' => 'host',
                'stats' => [
                    'total_revenue' => (float) $totalRevenue,
                    'active_reservations' => $activeReservations,
                    'occupancy_rate' => $occupancyRate,
                    'total_properties' => $totalProperties,
                    'active_properties' => $activeProperties,
                ],
                'upcoming_check_ins' => $upcomingCheckIns,
            ]);
        }

        // Guest stats
        $upcomingTrips = Reservation::with('property')
            ->where('guest_id', $user->id)
            ->where('status', 'confirmed')
            ->where('check_in', '>=', $now)
            ->orderBy('check_in')
            ->take(5)
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'property_title' => $r->property?->title,
                'property_city' => $r->property?->city,
                'property_image' => $r->property?->images?->first()?->url,
                'check_in' => $r->check_in->toDateString(),
                'check_out' => $r->check_out->toDateString(),
                'status' => $r->status->value,
            ]);

        $pastTripsCount = Reservation::where('guest_id', $user->id)
            ->whereIn('status', ['completed', 'cancelled'])
            ->count();

        $activeReservations = Reservation::where('guest_id', $user->id)
            ->where('status', 'confirmed')
            ->where('check_out', '>=', $now)
            ->count();

        $pendingReviews = Reservation::with('property')
            ->where('guest_id', $user->id)
            ->where('status', 'completed')
            ->whereDoesntHave('review')
            ->count();

        $wishlistCount = Wishlist::where('user_id', $user->id)->count();

        return response()->json([
            'role' => 'guest',
            'stats' => [
                'upcoming_trips' => $upcomingTrips->count(),
                'active_reservations' => $activeReservations,
                'past_trips' => $pastTripsCount,
                'pending_reviews' => $pendingReviews,
                'wishlist_count' => $wishlistCount,
            ],
            'upcoming_trips' => $upcomingTrips,
        ]);
    }
}
