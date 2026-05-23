<?php

namespace Tests\Feature;

use App\Domain\Lead\Lead;
use App\Domain\Property\Property;
use App\Domain\User\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LeadTest extends TestCase
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

        $this->property = Property::factory()->create();
    }

    private function withAuth(): self
    {
        return $this->withHeader('Authorization', "Bearer {$this->token}");
    }

    // ─── Auth ─────────────────────────────────────────────────────

    public function test_unauthenticated_user_cannot_access_leads(): void
    {
        $response = $this->getJson('/api/leads');

        $response->assertStatus(401);
    }

    // ─── List ─────────────────────────────────────────────────────

    public function test_can_list_leads(): void
    {
        Lead::factory()->count(3)->create();

        $response = $this->withAuth()->getJson('/api/leads');

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'meta']);
    }

    public function test_can_filter_leads_by_status(): void
    {
        Lead::factory()->count(2)->create();
        Lead::factory()->contacted()->create();

        $response = $this->withAuth()->getJson('/api/leads?status=contacted');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_can_filter_leads_by_property(): void
    {
        $otherProperty = Property::factory()->create();
        Lead::factory()->create(['property_id' => $this->property->id]);
        Lead::factory()->create(['property_id' => $otherProperty->id]);

        $response = $this->withAuth()->getJson('/api/leads?property_id=' . $this->property->id);

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_can_search_leads_by_name(): void
    {
        Lead::factory()->create(['name' => 'João Silva']);
        Lead::factory()->create(['name' => 'Maria Santos']);

        $response = $this->withAuth()->getJson('/api/leads?search=João');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    // ─── Show ─────────────────────────────────────────────────────

    public function test_can_show_lead(): void
    {
        $lead = Lead::factory()->create();

        $response = $this->withAuth()->getJson("/api/leads/{$lead->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $lead->id]);
    }

    public function test_returns_error_for_nonexistent_lead(): void
    {
        $response = $this->withAuth()->getJson('/api/leads/99999');

        $response->assertStatus(500);
    }

    // ─── Create ───────────────────────────────────────────────────

    public function test_can_create_lead(): void
    {
        $response = $this->withAuth()->postJson('/api/leads', [
            'property_id' => $this->property->id,
            'name' => 'Maria Oliveira',
            'email' => 'maria@exemplo.com',
            'phone' => '(11) 99999-8888',
            'message' => 'Tenho interesse na propriedade.',
            'source' => 'website',
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => 'Maria Oliveira']);

        $this->assertDatabaseHas('leads', ['email' => 'maria@exemplo.com']);
    }

    // ─── Update ───────────────────────────────────────────────────

    public function test_can_update_lead(): void
    {
        $lead = Lead::factory()->create();

        $response = $this->withAuth()->putJson("/api/leads/{$lead->id}", [
            'name' => 'Nome Atualizado',
            'status' => 'contacted',
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['name' => 'Nome Atualizado']);
    }

    // ─── Convert ──────────────────────────────────────────────────

    public function test_can_convert_lead(): void
    {
        $lead = Lead::factory()->contacted()->create();

        $response = $this->withAuth()->postJson("/api/leads/{$lead->id}/convert");

        $response->assertStatus(200);

        $this->assertDatabaseHas('leads', [
            'id' => $lead->id,
            'status' => 'converted',
        ]);
    }

    public function test_cannot_convert_already_converted_lead(): void
    {
        $lead = Lead::factory()->converted()->create();

        $response = $this->withAuth()->postJson("/api/leads/{$lead->id}/convert");

        $response->assertStatus(500);
    }

    public function test_cannot_convert_lost_lead(): void
    {
        $lead = Lead::factory()->lost()->create();

        $response = $this->withAuth()->postJson("/api/leads/{$lead->id}/convert");

        $response->assertStatus(500);
    }

    // ─── Delete ───────────────────────────────────────────────────

    public function test_can_delete_lead(): void
    {
        $lead = Lead::factory()->create();

        $response = $this->withAuth()->deleteJson("/api/leads/{$lead->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('leads', ['id' => $lead->id]);
    }

    // ─── Validation ───────────────────────────────────────────────

    public function test_store_validates_required_fields(): void
    {
        $response = $this->withAuth()->postJson('/api/leads', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['property_id', 'name', 'email']);
    }

    public function test_store_validates_email_format(): void
    {
        $response = $this->withAuth()->postJson('/api/leads', [
            'property_id' => $this->property->id,
            'name' => 'Teste',
            'email' => 'email-invalido',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_store_validates_property_exists(): void
    {
        $response = $this->withAuth()->postJson('/api/leads', [
            'property_id' => 99999,
            'name' => 'Teste',
            'email' => 'teste@exemplo.com',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['property_id']);
    }
}
