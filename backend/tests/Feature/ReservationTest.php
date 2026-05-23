<?php

namespace Tests\Feature;

use App\Domain\Property\Property;
use App\Domain\Reservation\Reservation;
use App\Domain\User\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationTest extends TestCase
{
    use RefreshDatabase;

    private User $guest;
    private string $token;
    private Property $property;

    protected function setUp(): void
    {
        parent::setUp();

        $this->guest = User::factory()->create();
        $this->token = $this->guest->createToken('test')->plainTextToken;

        $this->property = Property::factory()->create([
            'price_per_night' => 500,
            'cleaning_fee' => 100,
            'max_guests' => 6,
        ]);
    }

    private function withAuth(): self
    {
        return $this->withHeader('Authorization', "Bearer {$this->token}");
    }

    private function futureDate(int $daysFromNow = 10): string
    {
        return Carbon::now()->addDays($daysFromNow)->format('Y-m-d');
    }

    // ─── Auth ─────────────────────────────────────────────────────

    public function test_unauthenticated_user_cannot_access_reservations(): void
    {
        $response = $this->getJson('/api/reservations');

        $response->assertStatus(401);
    }

    // ─── List ─────────────────────────────────────────────────────

    public function test_can_list_reservations(): void
    {
        Reservation::factory()->count(3)->create();

        $response = $this->withAuth()->getJson('/api/reservations');

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'meta']);
    }

    public function test_can_filter_reservations_by_status(): void
    {
        Reservation::factory()->count(2)->create(['property_id' => $this->property->id]);
        Reservation::factory()->cancelled()->create(['property_id' => $this->property->id]);

        $response = $this->withAuth()->getJson('/api/reservations?status=cancelled');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_can_filter_reservations_by_property(): void
    {
        $otherProperty = Property::factory()->create();
        Reservation::factory()->create(['property_id' => $this->property->id]);
        Reservation::factory()->create(['property_id' => $otherProperty->id]);

        $response = $this->withAuth()->getJson('/api/reservations?property_id=' . $this->property->id);

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    // ─── Show ─────────────────────────────────────────────────────

    public function test_can_show_reservation(): void
    {
        $reservation = Reservation::factory()->create();

        $response = $this->withAuth()->getJson("/api/reservations/{$reservation->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $reservation->id]);
    }

    public function test_returns_error_for_nonexistent_reservation(): void
    {
        $response = $this->withAuth()->getJson('/api/reservations/99999');

        $response->assertStatus(500);
    }

    // ─── Create ───────────────────────────────────────────────────

    public function test_guest_can_create_reservation(): void
    {
        $checkIn = $this->futureDate(10);
        $checkOut = $this->futureDate(13);
        $nights = 3;
        $subtotal = $this->property->price_per_night * $nights;
        $serviceFee = round($subtotal * 0.10, 2);
        $cleaningFee = $this->property->cleaning_fee;
        $total = $subtotal + $serviceFee + $cleaningFee;

        $response = $this->withAuth()->postJson('/api/reservations', [
            'property_id' => $this->property->id,
            'check_in' => $checkIn,
            'check_out' => $checkOut,
            'total_guests' => 2,
            'subtotal' => $subtotal,
            'service_fee' => $serviceFee,
            'cleaning_fee' => $cleaningFee,
            'total_price' => $total,
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['property_id' => $this->property->id]);

        $this->assertDatabaseHas('reservations', ['guest_id' => $this->guest->id]);
    }

    public function test_auto_calculates_prices_when_omitted(): void
    {
        $checkIn = $this->futureDate(10);
        $checkOut = $this->futureDate(12);

        $response = $this->withAuth()->postJson('/api/reservations', [
            'property_id' => $this->property->id,
            'check_in' => $checkIn,
            'check_out' => $checkOut,
            'total_guests' => 2,
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure(['id', 'subtotal', 'service_fee', 'total_price']);

        $this->assertEquals(1000, (float) $response->json('subtotal'));
        $this->assertEquals(100, (float) $response->json('service_fee'));
        $this->assertEquals(1200, (float) $response->json('total_price'));
    }

    public function test_rejects_reservation_for_unavailable_dates(): void
    {
        $checkIn = $this->futureDate(10);
        $checkOut = $this->futureDate(13);

        Reservation::factory()->confirmed()->create([
            'property_id' => $this->property->id,
            'check_in' => $checkIn,
            'check_out' => $checkOut,
        ]);

        $response = $this->withAuth()->postJson('/api/reservations', [
            'property_id' => $this->property->id,
            'check_in' => $this->futureDate(11),
            'check_out' => $this->futureDate(14),
            'total_guests' => 2,
        ]);

        $response->assertStatus(500);
    }

    public function test_rejects_reservation_exceeding_max_guests(): void
    {
        $response = $this->withAuth()->postJson('/api/reservations', [
            'property_id' => $this->property->id,
            'check_in' => $this->futureDate(10),
            'check_out' => $this->futureDate(13),
            'total_guests' => 10,
        ]);

        $response->assertStatus(500);
    }

    // ─── Update ───────────────────────────────────────────────────

    public function test_can_update_reservation(): void
    {
        $reservation = Reservation::factory()->create([
            'property_id' => $this->property->id,
            'guest_id' => $this->guest->id,
            'total_guests' => 2,
        ]);

        $response = $this->withAuth()->putJson("/api/reservations/{$reservation->id}", [
            'total_guests' => 4,
            'notes' => 'Alterei a quantidade de hóspedes.',
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['total_guests' => 4]);
    }

    public function test_cannot_update_cancelled_reservation(): void
    {
        $reservation = Reservation::factory()->cancelled()->create([
            'property_id' => $this->property->id,
            'guest_id' => $this->guest->id,
        ]);

        $response = $this->withAuth()->putJson("/api/reservations/{$reservation->id}", [
            'notes' => 'Tentando alterar.',
        ]);

        $response->assertStatus(500);
    }

    // ─── Cancel ───────────────────────────────────────────────────

    public function test_can_cancel_reservation(): void
    {
        $reservation = Reservation::factory()->confirmed()->create([
            'property_id' => $this->property->id,
            'guest_id' => $this->guest->id,
        ]);

        $response = $this->withAuth()->postJson("/api/reservations/{$reservation->id}/cancel", [
            'reason' => 'Mudança de planos.',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('reservations', [
            'id' => $reservation->id,
            'status' => 'cancelled',
            'cancelled_reason' => 'Mudança de planos.',
        ]);
    }

    public function test_cannot_cancel_already_cancelled_reservation(): void
    {
        $reservation = Reservation::factory()->cancelled()->create([
            'property_id' => $this->property->id,
            'guest_id' => $this->guest->id,
        ]);

        $response = $this->withAuth()->postJson("/api/reservations/{$reservation->id}/cancel", [
            'reason' => 'Tentando cancelar de novo.',
        ]);

        $response->assertStatus(500);
    }

    // ─── Delete ───────────────────────────────────────────────────

    public function test_can_delete_reservation(): void
    {
        $reservation = Reservation::factory()->create([
            'property_id' => $this->property->id,
            'guest_id' => $this->guest->id,
        ]);

        $response = $this->withAuth()->deleteJson("/api/reservations/{$reservation->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('reservations', ['id' => $reservation->id]);
    }

    // ─── Validation ───────────────────────────────────────────────

    public function test_store_validates_required_fields(): void
    {
        $response = $this->withAuth()->postJson('/api/reservations', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['property_id', 'check_in', 'check_out', 'total_guests']);
    }

    public function test_store_validates_check_out_after_check_in(): void
    {
        $response = $this->withAuth()->postJson('/api/reservations', [
            'property_id' => $this->property->id,
            'check_in' => $this->futureDate(10),
            'check_out' => $this->futureDate(8),
            'total_guests' => 2,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['check_out']);
    }

    public function test_store_validates_check_in_not_in_past(): void
    {
        $response = $this->withAuth()->postJson('/api/reservations', [
            'property_id' => $this->property->id,
            'check_in' => Carbon::now()->subDays(5)->format('Y-m-d'),
            'check_out' => $this->futureDate(5),
            'total_guests' => 2,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['check_in']);
    }

    public function test_cancel_validates_reason_required(): void
    {
        $reservation = Reservation::factory()->create([
            'property_id' => $this->property->id,
            'guest_id' => $this->guest->id,
        ]);

        $response = $this->withAuth()->postJson("/api/reservations/{$reservation->id}/cancel", []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['reason']);
    }
}
