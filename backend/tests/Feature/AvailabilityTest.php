<?php

namespace Tests\Feature;

use App\Domain\Availability\Availability;
use App\Domain\Property\Property;
use App\Domain\Reservation\Reservation;
use App\Domain\User\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AvailabilityTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private string $token;
    private Property $property;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->token = $this->user->createToken('test')->plainTextToken;

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

    private function pastDate(int $daysAgo = 10): string
    {
        return Carbon::now()->subDays($daysAgo)->format('Y-m-d');
    }

    // ─── Auth ─────────────────────────────────────────────────────

    public function test_unauthenticated_user_cannot_access_availabilities(): void
    {
        $response = $this->getJson('/api/availabilities');

        $response->assertStatus(401);
    }

    public function test_unauthenticated_user_cannot_check_availability(): void
    {
        $response = $this->getJson('/api/availabilities/check');

        $response->assertStatus(401);
    }

    // ─── List ─────────────────────────────────────────────────────

    public function test_can_list_availabilities(): void
    {
        Availability::factory()->count(3)->create();

        $response = $this->withAuth()->getJson('/api/availabilities');

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'meta']);
    }

    public function test_can_filter_availabilities_by_property(): void
    {
        $otherProperty = Property::factory()->create();
        Availability::factory()->create(['property_id' => $this->property->id]);
        Availability::factory()->create(['property_id' => $otherProperty->id]);

        $response = $this->withAuth()->getJson('/api/availabilities?property_id=' . $this->property->id);

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_can_filter_availabilities_by_is_available(): void
    {
        Availability::factory()->available()->create(['property_id' => $this->property->id]);
        Availability::factory()->blocked()->create(['property_id' => $this->property->id]);

        $response = $this->withAuth()->getJson('/api/availabilities?is_available=1&property_id=' . $this->property->id);

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
        $this->assertTrue($response->json('data')[0]['is_available']);
    }

    // ─── Show ─────────────────────────────────────────────────────

    public function test_can_show_availability(): void
    {
        $availability = Availability::factory()->create();

        $response = $this->withAuth()->getJson("/api/availabilities/{$availability->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $availability->id]);
    }

    public function test_returns_error_for_nonexistent_availability(): void
    {
        $response = $this->withAuth()->getJson('/api/availabilities/99999');

        $response->assertStatus(500);
    }

    // ─── Create ───────────────────────────────────────────────────

    public function test_can_create_availability(): void
    {
        $startDate = $this->futureDate(10);
        $endDate = $this->futureDate(15);

        $response = $this->withAuth()->postJson('/api/availabilities', [
            'property_id' => $this->property->id,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'is_available' => false,
            'price' => 750.00,
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'property_id' => $this->property->id,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'is_available' => false,
            ]);

        $this->assertEquals('750.00', $response->json('price'));

        $this->assertDatabaseHas('availabilities', ['property_id' => $this->property->id]);
    }

    public function test_auto_sets_is_available_true_when_omitted(): void
    {
        $startDate = $this->futureDate(10);
        $endDate = $this->futureDate(15);

        $response = $this->withAuth()->postJson('/api/availabilities', [
            'property_id' => $this->property->id,
            'start_date' => $startDate,
            'end_date' => $endDate,
        ]);

        $response->assertStatus(201);
        $this->assertTrue($response->json('is_available'));
    }

    public function test_rejects_availability_for_nonexistent_property(): void
    {
        $response = $this->withAuth()->postJson('/api/availabilities', [
            'property_id' => 99999,
            'start_date' => $this->futureDate(10),
            'end_date' => $this->futureDate(15),
        ]);

        $response->assertStatus(422);
    }

    public function test_rejects_availability_with_start_after_end(): void
    {
        $response = $this->withAuth()->postJson('/api/availabilities', [
            'property_id' => $this->property->id,
            'start_date' => $this->futureDate(15),
            'end_date' => $this->futureDate(10),
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['end_date']);
    }

    // ─── Update ───────────────────────────────────────────────────

    public function test_can_update_availability(): void
    {
        $availability = Availability::factory()->create([
            'property_id' => $this->property->id,
        ]);

        $response = $this->withAuth()->putJson("/api/availabilities/{$availability->id}", [
            'is_available' => false,
            'price' => 999.99,
        ]);

        $response->assertStatus(200);
        $this->assertFalse($response->json('is_available'));
        $this->assertEquals('999.99', $response->json('price'));
    }

    public function test_can_update_partial_availability_fields(): void
    {
        $availability = Availability::factory()->create([
            'property_id' => $this->property->id,
            'is_available' => true,
            'price' => null,
        ]);

        $response = $this->withAuth()->putJson("/api/availabilities/{$availability->id}", [
            'price' => 850.00,
        ]);

        $response->assertStatus(200);
        $this->assertEquals(850.00, (float) $response->json('price'));
        $this->assertTrue($response->json('is_available'));
    }

    // ─── Delete ───────────────────────────────────────────────────

    public function test_can_delete_availability(): void
    {
        $availability = Availability::factory()->create([
            'property_id' => $this->property->id,
        ]);

        $response = $this->withAuth()->deleteJson("/api/availabilities/{$availability->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('availabilities', ['id' => $availability->id]);
    }

    // ─── Check Availability ───────────────────────────────────────

    public function test_check_returns_available_when_no_conflicts(): void
    {
        $startDate = $this->futureDate(20);
        $endDate = $this->futureDate(25);

        Availability::factory()->available()->create([
            'property_id' => $this->property->id,
            'start_date' => $this->futureDate(10),
            'end_date' => $this->futureDate(15),
        ]);

        $response = $this->withAuth()->getJson('/api/availabilities/check?' . http_build_query([
            'property_id' => $this->property->id,
            'start_date' => $startDate,
            'end_date' => $endDate,
        ]));

        $response->assertStatus(200);
        $this->assertTrue($response->json('data.is_available'));
        $this->assertEmpty($response->json('data.blocking_availability'));
        $this->assertFalse($response->json('data.has_reservation_overlap'));
    }

    public function test_check_returns_unavailable_when_blocked(): void
    {
        $startDate = $this->futureDate(10);
        $endDate = $this->futureDate(15);

        Availability::factory()->blocked()->create([
            'property_id' => $this->property->id,
            'start_date' => $startDate,
            'end_date' => $endDate,
        ]);

        $response = $this->withAuth()->getJson('/api/availabilities/check?' . http_build_query([
            'property_id' => $this->property->id,
            'start_date' => $this->futureDate(12),
            'end_date' => $this->futureDate(18),
        ]));

        $response->assertStatus(200);
        $this->assertFalse($response->json('data.is_available'));
        $this->assertNotEmpty($response->json('data.blocking_availability'));
    }

    public function test_check_returns_unavailable_when_reservation_overlaps(): void
    {
        $startDate = $this->futureDate(10);
        $endDate = $this->futureDate(15);

        Reservation::factory()->confirmed()->create([
            'property_id' => $this->property->id,
            'check_in' => $startDate,
            'check_out' => $endDate,
        ]);

        $response = $this->withAuth()->getJson('/api/availabilities/check?' . http_build_query([
            'property_id' => $this->property->id,
            'start_date' => $this->futureDate(12),
            'end_date' => $this->futureDate(18),
        ]));

        $response->assertStatus(200);
        $this->assertFalse($response->json('data.is_available'));
        $this->assertTrue($response->json('data.has_reservation_overlap'));
    }

    public function test_check_rejects_invalid_dates(): void
    {
        $response = $this->withAuth()->getJson('/api/availabilities/check?' . http_build_query([
            'property_id' => $this->property->id,
            'start_date' => $this->futureDate(15),
            'end_date' => $this->futureDate(10),
        ]));

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['end_date']);
    }

    public function test_check_validates_required_fields(): void
    {
        $response = $this->withAuth()->getJson('/api/availabilities/check');

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['property_id', 'start_date', 'end_date']);
    }

    // ─── Validation ───────────────────────────────────────────────

    public function test_store_validates_required_fields(): void
    {
        $response = $this->withAuth()->postJson('/api/availabilities', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['property_id', 'start_date', 'end_date']);
    }

    public function test_store_validates_property_exists(): void
    {
        $response = $this->withAuth()->postJson('/api/availabilities', [
            'property_id' => 99999,
            'start_date' => $this->futureDate(10),
            'end_date' => $this->futureDate(15),
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['property_id']);
    }
}
