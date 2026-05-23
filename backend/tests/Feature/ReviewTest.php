<?php

namespace Tests\Feature;

use App\Domain\Property\Property;
use App\Domain\Review\Review;
use App\Domain\User\User;
use App\Domain\Reservation\Reservation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewTest extends TestCase
{
    use RefreshDatabase;

    // ─── Auth ─────────────────────────────────────────────────────

    public function test_unauthenticated_cannot_access_reviews(): void
    {
        $response = $this->getJson('/api/properties/1/reviews');

        $response->assertStatus(401);
    }

    // ─── List ─────────────────────────────────────────────────────

    public function test_can_list_reviews_for_property(): void
    {
        $property = Property::factory()->create();
        $guest = User::factory()->create();
        $token = $guest->createToken('test')->plainTextToken;

        Review::factory()->count(3)->create([
            'property_id' => $property->id,
            'guest_id' => $guest->id,
            'reservation_id' => Reservation::factory()->create([
                'property_id' => $property->id,
                'guest_id' => $guest->id,
                'status' => 'completed',
            ]),
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson("/api/properties/{$property->id}/reviews");

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'meta']);
    }

    // ─── Create ───────────────────────────────────────────────────

    public function test_guest_can_review_completed_reservation(): void
    {
        $property = Property::factory()->create();
        $guest = User::factory()->create();
        $token = $guest->createToken('test')->plainTextToken;

        $reservation = Reservation::factory()->create([
            'property_id' => $property->id,
            'guest_id' => $guest->id,
            'status' => 'completed',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson("/api/properties/{$property->id}/reviews", [
                'reservation_id' => $reservation->id,
                'rating' => 5,
                'comment' => 'Estadia incrível! Local muito bonito e aconchegante.',
            ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['rating' => 5]);
    }

    public function test_cannot_review_non_completed_reservation(): void
    {
        $property = Property::factory()->create();
        $guest = User::factory()->create();
        $token = $guest->createToken('test')->plainTextToken;

        $reservation = Reservation::factory()->create([
            'property_id' => $property->id,
            'guest_id' => $guest->id,
            'status' => 'pending',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson("/api/properties/{$property->id}/reviews", [
                'reservation_id' => $reservation->id,
                'rating' => 5,
                'comment' => 'Estadia incrível! Local muito bonito e aconchegante.',
            ]);

        $response->assertStatus(500);
    }

    public function test_cannot_review_others_reservation(): void
    {
        $property = Property::factory()->create();
        $guest = User::factory()->create();
        $otherGuest = User::factory()->create();
        $token = $guest->createToken('test')->plainTextToken;

        $reservation = Reservation::factory()->create([
            'property_id' => $property->id,
            'guest_id' => $otherGuest->id,
            'status' => 'completed',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson("/api/properties/{$property->id}/reviews", [
                'reservation_id' => $reservation->id,
                'rating' => 5,
                'comment' => 'Estadia incrível! Local muito bonito e aconchegante.',
            ]);

        $response->assertStatus(500);
    }

    public function test_cannot_review_same_reservation_twice(): void
    {
        $property = Property::factory()->create();
        $guest = User::factory()->create();
        $token = $guest->createToken('test')->plainTextToken;

        $reservation = Reservation::factory()->create([
            'property_id' => $property->id,
            'guest_id' => $guest->id,
            'status' => 'completed',
        ]);

        Review::factory()->create([
            'property_id' => $property->id,
            'guest_id' => $guest->id,
            'reservation_id' => $reservation->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson("/api/properties/{$property->id}/reviews", [
                'reservation_id' => $reservation->id,
                'rating' => 5,
                'comment' => 'Estadia incrível! Local muito bonito e aconchegante.',
            ]);

        $response->assertStatus(500);
    }

    // ─── Show ─────────────────────────────────────────────────────

    public function test_can_show_review(): void
    {
        $guest = User::factory()->create();
        $token = $guest->createToken('test')->plainTextToken;

        $review = Review::factory()->create([
            'guest_id' => $guest->id,
            'reservation_id' => Reservation::factory()->create([
                'guest_id' => $guest->id,
                'status' => 'completed',
            ]),
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson("/api/reviews/{$review->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['rating' => $review->rating]);
    }

    public function test_returns_error_for_nonexistent_review(): void
    {
        $guest = User::factory()->create();
        $token = $guest->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/reviews/99999');

        $response->assertStatus(500);
    }

    // ─── Update ───────────────────────────────────────────────────

    public function test_author_can_update_review(): void
    {
        $guest = User::factory()->create();
        $token = $guest->createToken('test')->plainTextToken;

        $review = Review::factory()->create([
            'guest_id' => $guest->id,
            'rating' => 3,
            'reservation_id' => Reservation::factory()->create([
                'guest_id' => $guest->id,
                'status' => 'completed',
            ]),
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->putJson("/api/reviews/{$review->id}", [
                'rating' => 5,
                'comment' => 'Comentário atualizado muito melhor do que antes.',
            ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['rating' => 5]);
    }

    // ─── Delete ───────────────────────────────────────────────────

    public function test_author_can_delete_review(): void
    {
        $guest = User::factory()->create();
        $token = $guest->createToken('test')->plainTextToken;

        $review = Review::factory()->create([
            'guest_id' => $guest->id,
            'reservation_id' => Reservation::factory()->create([
                'guest_id' => $guest->id,
                'status' => 'completed',
            ]),
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->deleteJson("/api/reviews/{$review->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('reviews', ['id' => $review->id]);
    }

    // ─── Validation ───────────────────────────────────────────────

    public function test_store_validates_rating_range(): void
    {
        $property = Property::factory()->create();
        $guest = User::factory()->create();
        $token = $guest->createToken('test')->plainTextToken;

        $reservation = Reservation::factory()->create([
            'property_id' => $property->id,
            'guest_id' => $guest->id,
            'status' => 'completed',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson("/api/properties/{$property->id}/reviews", [
                'reservation_id' => $reservation->id,
                'rating' => 6,
                'comment' => 'Comentário válido com mais de 10 caracteres.',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['rating']);
    }

    public function test_store_validates_comment_min_length(): void
    {
        $property = Property::factory()->create();
        $guest = User::factory()->create();
        $token = $guest->createToken('test')->plainTextToken;

        $reservation = Reservation::factory()->create([
            'property_id' => $property->id,
            'guest_id' => $guest->id,
            'status' => 'completed',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson("/api/properties/{$property->id}/reviews", [
                'reservation_id' => $reservation->id,
                'rating' => 5,
                'comment' => 'Curto!',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['comment']);
    }
}
