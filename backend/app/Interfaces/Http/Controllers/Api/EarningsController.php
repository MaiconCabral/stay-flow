<?php

namespace App\Interfaces\Http\Controllers\Api;

use App\Domain\Property\Property;
use App\Domain\Reservation\Reservation;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EarningsController
{
    public function index(Request $request): JsonResponse
    {
        $months = min(max((int) $request->input('months', 6), 1), 24);
        $propertyId = $request->input('property_id');

        $now = Carbon::now();
        $startDate = $now->copy()->subMonths($months - 1)->startOfMonth()->toDateString();

        $paidReservations = Reservation::with(['property', 'guest', 'payment'])
            ->whereIn('status', ['confirmed', 'completed'])
            ->where('check_in', '>=', $startDate)
            ->when($propertyId, fn ($q) => $q->where('property_id', $propertyId))
            ->get();

        $pendingReservations = Reservation::with(['guest', 'property'])
            ->where('status', 'pending')
            ->where('check_in', '>=', $startDate)
            ->when($propertyId, fn ($q) => $q->where('property_id', $propertyId))
            ->get();

        // --- Summary ---
        $totalRevenue = $paidReservations->sum('total_price');
        $totalFees = $paidReservations->sum(fn ($r) => $r->service_fee + $r->cleaning_fee);
        $netRevenue = $totalRevenue - $totalFees;
        $count = $paidReservations->count();
        $averageTicket = $count > 0 ? round($totalRevenue / $count, 2) : 0;
        $pendingPayouts = $pendingReservations->sum('total_price');

        $currentMonthKey = $now->format('Y-m');
        $prevMonthKey = $now->copy()->subMonth()->format('Y-m');

        $currentMonthRevenue = $paidReservations->filter(
            fn ($r) => $r->check_in->format('Y-m') === $currentMonthKey
        )->sum('total_price');

        $prevMonthRevenue = $paidReservations->filter(
            fn ($r) => $r->check_in->format('Y-m') === $prevMonthKey
        )->sum('total_price');

        $revenueChange = $prevMonthRevenue > 0
            ? round(($currentMonthRevenue - $prevMonthRevenue) / $prevMonthRevenue * 100, 1)
            : ($currentMonthRevenue > 0 ? 100 : 0);

        // --- Monthly ---
        $monthly = [];
        for ($i = $months - 1; $i >= 0; $i--) {
            $date = $now->copy()->subMonths($i);
            $monthKey = $date->format('Y-m');
            $monthReservations = $paidReservations->filter(
                fn ($r) => $r->check_in->format('Y-m') === $monthKey
            );
            $gross = $monthReservations->sum('total_price');
            $fees = $monthReservations->sum(fn ($r) => $r->service_fee + $r->cleaning_fee);
            $monthly[] = [
                'month' => (int) $date->format('n'),
                'year' => (int) $date->format('Y'),
                'gross' => $gross,
                'fees' => $fees,
                'net' => $gross - $fees,
                'booking_count' => $monthReservations->count(),
            ];
        }

        // --- By property ---
        $properties = Property::where('status', 'active')
            ->when($propertyId, fn ($q) => $q->where('id', $propertyId))
            ->get();

        $byProperty = $properties->map(function ($property) use ($paidReservations) {
            $propReservations = $paidReservations->where('property_id', $property->id);
            $gross = $propReservations->sum('total_price');
            $fees = $propReservations->sum(fn ($r) => $r->service_fee + $r->cleaning_fee);
            return [
                'property_id' => $property->id,
                'property_name' => $property->title,
                'gross' => $gross,
                'fees' => $fees,
                'net' => $gross - $fees,
                'booking_count' => $propReservations->count(),
            ];
        })
            ->filter(fn ($p) => $p['booking_count'] > 0)
            ->sortByDesc('gross')
            ->values()
            ->toArray();

        // --- Transactions ---
        $nowDate = $now->toDateString();
        $transactions = $paidReservations->map(function ($r) use ($nowDate) {
            $gross = $r->total_price;
            $fee = $r->service_fee + $r->cleaning_fee;
            $payment = $r->payment;

            if ($payment && $payment->status?->value === 'completed') {
                $txStatus = 'paid';
            } elseif ($payment && $payment->status?->value === 'refunded') {
                $txStatus = 'refunded';
            } elseif ($payment && $payment->status?->value === 'failed') {
                $txStatus = 'failed';
            } elseif ($payment && $payment->status?->value === 'pending') {
                $txStatus = 'pending';
            } elseif ($r->check_out?->toDateString() < $nowDate) {
                $txStatus = 'paid';
            } elseif ($r->status->value === 'confirmed') {
                $txStatus = 'scheduled';
            } else {
                $txStatus = 'pending';
            }

            return [
                'id' => $r->id,
                'booking_id' => 'B' . str_pad((string) $r->id, 3, '0', STR_PAD_LEFT),
                'guest_name' => $r->guest?->name ?? 'Convidado',
                'property_name' => $r->property?->title ?? 'Imóvel',
                'check_out' => $r->check_out?->toDateString(),
                'gross_amount' => $gross,
                'fee' => $fee,
                'net_amount' => $gross - $fee,
                'status' => $txStatus,
                'payment_status' => $payment?->status?->value,
            ];
        })
            ->sortByDesc('check_out')
            ->values()
            ->toArray();

        return response()->json([
            'summary' => [
                'total_revenue' => $totalRevenue,
                'net_revenue' => $netRevenue,
                'average_ticket' => $averageTicket,
                'pending_payouts' => $pendingPayouts,
                'revenue_change' => $revenueChange,
            ],
            'monthly' => $monthly,
            'by_property' => $byProperty,
            'transactions' => $transactions,
        ]);
    }
}
