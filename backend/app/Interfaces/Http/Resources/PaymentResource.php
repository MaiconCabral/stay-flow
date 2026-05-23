<?php

namespace App\Interfaces\Http\Resources;

use App\Domain\Payment\Payment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Payment */
class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reservation_id' => $this->reservation_id,
            'amount' => $this->amount,
            'payment_method' => $this->payment_method?->value,
            'payment_method_label' => $this->payment_method?->label(),
            'status' => $this->status?->value,
            'status_label' => $this->status?->label(),
            'payment_date' => $this->payment_date?->toISOString(),
            'transaction_id' => $this->transaction_id,
            'gateway_response' => $this->gateway_response,
            'reservation' => $this->whenLoaded('reservation', fn () => [
                'id' => $this->reservation->id,
                'check_in' => $this->reservation->check_in?->toDateString(),
                'check_out' => $this->reservation->check_out?->toDateString(),
                'total_price' => $this->reservation->total_price,
                'status' => $this->reservation->status?->value,
                'guest_name' => $this->reservation->guest?->name,
                'property_title' => $this->reservation->property?->title,
            ]),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
