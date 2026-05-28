<?php

namespace Tests\Feature;

use App\Domain\Property\Property;
use App\Domain\User\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PropertyTest extends TestCase
{
    use RefreshDatabase;

    // ─── Auth ─────────────────────────────────────────────────────

    public function test_guest_can_browse_properties(): void
    {
        Property::factory()->count(3)->create();

        $response = $this->getJson('/api/properties');

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'meta']);
    }

    // ─── List ─────────────────────────────────────────────────────

    public function test_can_list_properties(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        Property::factory()->count(3)->create();

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/properties');

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'meta']);
    }

    public function test_can_filter_properties_by_city(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        Property::factory()->create(['city' => 'Rio de Janeiro']);
        Property::factory()->create(['city' => 'São Paulo']);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/properties?city=Rio de Janeiro');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    // ─── Show ─────────────────────────────────────────────────────

    public function test_can_show_property(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $property = Property::factory()->create();

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson("/api/properties/{$property->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['title' => $property->title]);
    }

    public function test_returns_error_for_nonexistent_property(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/properties/99999');

        $response->assertStatus(500);
    }

    // ─── Create ───────────────────────────────────────────────────

    public function test_host_can_create_property(): void
    {
        $host = User::factory()->host()->create();
        $token = $host->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/properties', [
                'title' => 'Minha Casa na Praia',
                'description' => 'Casa maravilhosa pertinho da praia.',
                'property_type' => 'house',
                'price_per_night' => 500.00,
                'max_guests' => 6,
                'bedrooms' => 3,
                'bathrooms' => 2,
            ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['title' => 'Minha Casa na Praia']);

        $this->assertDatabaseHas('properties', ['title' => 'Minha Casa na Praia']);
    }

    // ─── Update ───────────────────────────────────────────────────

    public function test_can_update_property(): void
    {
        $host = User::factory()->host()->create();
        $token = $host->createToken('test')->plainTextToken;

        $property = Property::factory()->create(['host_id' => $host->id, 'title' => 'Nome Antigo']);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->putJson("/api/properties/{$property->id}", [
                'title' => 'Nome Novo',
            ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['title' => 'Nome Novo']);

        $this->assertDatabaseHas('properties', ['id' => $property->id, 'title' => 'Nome Novo']);
    }

    // ─── Delete ───────────────────────────────────────────────────

    public function test_can_delete_property(): void
    {
        $host = User::factory()->host()->create();
        $token = $host->createToken('test')->plainTextToken;

        $property = Property::factory()->create(['host_id' => $host->id]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->deleteJson("/api/properties/{$property->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('properties', ['id' => $property->id]);
    }

    // ─── Validation ───────────────────────────────────────────────

    public function test_store_validates_required_fields(): void
    {
        $host = User::factory()->host()->create();
        $token = $host->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/properties', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'description', 'property_type', 'price_per_night', 'max_guests', 'bedrooms', 'bathrooms']);
    }

    public function test_store_validates_unique_slug(): void
    {
        $host = User::factory()->host()->create();
        $token = $host->createToken('test')->plainTextToken;

        Property::factory()->create(['slug' => 'casa-na-praia']);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/properties', [
                'title' => 'Casa na Praia',
                'slug' => 'casa-na-praia',
                'description' => 'Descrição qualquer.',
                'property_type' => 'house',
                'price_per_night' => 300,
                'max_guests' => 4,
                'bedrooms' => 2,
                'bathrooms' => 1,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['slug']);
    }
}
