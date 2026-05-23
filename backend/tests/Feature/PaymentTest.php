<?php

namespace Tests\Feature;

use App\Domain\Payment\Payment;
use App\Domain\Property\Property;
use App\Domain\Reservation\Reservation;
use App\Domain\User\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentTest extends TestCase
{
    use RefreshDatabase;

    private User $guest;
    private string $token;
    private Property $property;
    private Reservation $reservation;

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

        $this->reservation = Reservation::factory()->create([
            'property_id' => $this->property->id,
            'guest_id' => $this->guest->id,
        ]);
    }

    private function withAuth(): self
    {
        return $this->withHeader('Authorization', "Bearer {$this->token}");
    }

    // ─── Auth ─────────────────────────────────────────────────────

    public function test_unauthenticated_user_cannot_access_payments(): void
    {
        $response = $this->getJson('/api/payments');

        $response->assertStatus(401);
    }

    // ─── List ─────────────────────────────────────────────────────

    public function test_can_list_payments(): void
    {
        Payment::factory()->count(3)->create();

        $response = $this->withAuth()->getJson('/api/payments');

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'meta']);
    }

    public function test_can_filter_payments_by_status(): void
    {
        Payment::factory()->pending()->count(2)->create();
        Payment::factory()->completed()->create();

        $response = $this->withAuth()->getJson('/api/payments?status=completed');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_can_filter_payments_by_reservation(): void
    {
        $otherReservation = Reservation::factory()->create();
        Payment::factory()->create(['reservation_id' => $this->reservation->id]);
        Payment::factory()->create(['reservation_id' => $otherReservation->id]);

        $response = $this->withAuth()->getJson('/api/payments?reservation_id=' . $this->reservation->id);

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_can_filter_payments_by_method(): void
    {
        Payment::factory()->count(2)->create(['payment_method' => 'card']);
        Payment::factory()->create(['payment_method' => 'pix']);

        $response = $this->withAuth()->getJson('/api/payments?payment_method=pix');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    // ─── Show ─────────────────────────────────────────────────────

    public function test_can_show_payment(): void
    {
        $payment = Payment::factory()->create();

        $response = $this->withAuth()->getJson("/api/payments/{$payment->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $payment->id]);
    }

    public function test_returns_error_for_nonexistent_payment(): void
    {
        $response = $this->withAuth()->getJson('/api/payments/99999');

        $response->assertStatus(500);
    }

    // ─── Create ───────────────────────────────────────────────────

    public function test_can_create_payment(): void
    {
        $response = $this->withAuth()->postJson('/api/payments', [
            'reservation_id' => $this->reservation->id,
            'amount' => 1500.00,
            'payment_method' => 'pix',
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['reservation_id' => $this->reservation->id]);

        $this->assertDatabaseHas('payments', [
            'reservation_id' => $this->reservation->id,
            'amount' => 1500.00,
        ]);
    }

    public function test_cannot_create_duplicate_payment_for_reservation(): void
    {
        Payment::factory()->create(['reservation_id' => $this->reservation->id]);

        $response = $this->withAuth()->postJson('/api/payments', [
            'reservation_id' => $this->reservation->id,
            'amount' => 500.00,
        ]);

        $response->assertStatus(500);
    }

    // ─── Update ───────────────────────────────────────────────────

    public function test_can_update_payment(): void
    {
        $payment = Payment::factory()->create([
            'reservation_id' => $this->reservation->id,
        ]);

        $response = $this->withAuth()->putJson("/api/payments/{$payment->id}", [
            'amount' => 2500.00,
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['amount' => '2500.00']);
    }

    // ─── Process ──────────────────────────────────────────────────

    public function test_can_process_pending_payment(): void
    {
        $payment = Payment::factory()->pending()->create([
            'reservation_id' => $this->reservation->id,
            'amount' => 1000.00,
        ]);

        $response = $this->withAuth()->postJson("/api/payments/{$payment->id}/process");

        $response->assertStatus(200);

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'status' => 'completed',
        ]);

        $this->assertNotNull($response->json('transaction_id'));
        $this->assertStringStartsWith('fake_', $response->json('transaction_id'));
    }

    public function test_cannot_process_non_pending_payment(): void
    {
        $payment = Payment::factory()->completed()->create([
            'reservation_id' => $this->reservation->id,
        ]);

        $response = $this->withAuth()->postJson("/api/payments/{$payment->id}/process");

        $response->assertStatus(500);
    }

    // ─── Refund ───────────────────────────────────────────────────

    public function test_can_refund_completed_payment(): void
    {
        $payment = Payment::factory()->completed()->create([
            'reservation_id' => $this->reservation->id,
        ]);

        $response = $this->withAuth()->postJson("/api/payments/{$payment->id}/refund");

        $response->assertStatus(200);

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'status' => 'refunded',
        ]);
    }

    public function test_cannot_refund_non_completed_payment(): void
    {
        $payment = Payment::factory()->pending()->create([
            'reservation_id' => $this->reservation->id,
        ]);

        $response = $this->withAuth()->postJson("/api/payments/{$payment->id}/refund");

        $response->assertStatus(500);
    }

    public function test_can_refund_with_partial_amount(): void
    {
        $payment = Payment::factory()->completed()->create([
            'reservation_id' => $this->reservation->id,
            'amount' => 1000.00,
        ]);

        $response = $this->withAuth()->postJson("/api/payments/{$payment->id}/refund", [
            'amount' => 500.00,
        ]);

        $response->assertStatus(200);
        $this->assertEquals('refunded', $response->json('status'));
    }

    // ─── Delete ───────────────────────────────────────────────────

    public function test_can_delete_payment(): void
    {
        $payment = Payment::factory()->create([
            'reservation_id' => $this->reservation->id,
        ]);

        $response = $this->withAuth()->deleteJson("/api/payments/{$payment->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('payments', ['id' => $payment->id]);
    }

    // ─── Validation ───────────────────────────────────────────────

    public function test_store_validates_required_fields(): void
    {
        $response = $this->withAuth()->postJson('/api/payments', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['reservation_id', 'amount']);
    }

    public function test_store_validates_reservation_exists(): void
    {
        $response = $this->withAuth()->postJson('/api/payments', [
            'reservation_id' => 99999,
            'amount' => 500.00,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['reservation_id']);
    }

    public function test_store_validates_payment_method(): void
    {
        $response = $this->withAuth()->postJson('/api/payments', [
            'reservation_id' => $this->reservation->id,
            'amount' => 500.00,
            'payment_method' => 'invalid_method',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['payment_method']);
    }
}
