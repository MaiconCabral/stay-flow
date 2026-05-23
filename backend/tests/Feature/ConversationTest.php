<?php

namespace Tests\Feature;

use App\Domain\Message\Conversation;
use App\Domain\Property\Property;
use App\Domain\User\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ConversationTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private string $token;
    private User $host;
    private Property $property;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->token = $this->user->createToken('test')->plainTextToken;
        $this->host = User::factory()->create();
        $this->property = Property::factory()->create(['host_id' => $this->host->id]);
    }

    private function withAuth(): self
    {
        return $this->withHeader('Authorization', "Bearer {$this->token}");
    }

    // ─── Auth ─────────────────────────────────────────────────────

    public function test_unauthenticated_user_cannot_access_conversations(): void
    {
        $response = $this->getJson('/api/conversations');

        $response->assertStatus(401);
    }

    // ─── List ─────────────────────────────────────────────────────

    public function test_can_list_conversations(): void
    {
        Conversation::factory()->count(3)->create([
            'guest_id' => $this->user->id,
            'host_id' => $this->host->id,
            'property_id' => $this->property->id,
        ]);

        $response = $this->withAuth()->getJson('/api/conversations');

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'meta']);
    }

    public function test_conversations_list_returns_data_with_meta(): void
    {
        Conversation::factory()->create([
            'guest_id' => $this->user->id,
            'host_id' => $this->host->id,
            'property_id' => $this->property->id,
        ]);

        $response = $this->withAuth()->getJson('/api/conversations');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
        $this->assertArrayHasKey('meta', $response->json());
    }

    public function test_lists_only_user_conversations(): void
    {
        Conversation::factory()->create([
            'guest_id' => $this->user->id,
            'host_id' => $this->host->id,
            'property_id' => $this->property->id,
        ]);

        $otherUser = User::factory()->create();
        Conversation::factory()->create([
            'guest_id' => $otherUser->id,
            'host_id' => $this->host->id,
            'property_id' => $this->property->id,
        ]);

        $response = $this->withAuth()->getJson('/api/conversations');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    // ─── Show ─────────────────────────────────────────────────────

    public function test_can_show_conversation(): void
    {
        $conversation = Conversation::factory()->create([
            'guest_id' => $this->user->id,
            'host_id' => $this->host->id,
            'property_id' => $this->property->id,
        ]);

        $response = $this->withAuth()->getJson("/api/conversations/{$conversation->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $conversation->id]);
    }

    public function test_cannot_view_conversation_of_another_user(): void
    {
        $otherUser = User::factory()->create();
        $conversation = Conversation::factory()->create([
            'guest_id' => $otherUser->id,
            'host_id' => User::factory()->create(),
            'property_id' => Property::factory()->create()->id,
        ]);

        $response = $this->withAuth()->getJson("/api/conversations/{$conversation->id}");

        $response->assertStatus(500);
    }

    // ─── Create ───────────────────────────────────────────────────

    public function test_can_start_conversation(): void
    {
        $response = $this->withAuth()->postJson('/api/conversations', [
            'property_id' => $this->property->id,
            'content' => 'Olá, tenho interesse na sua propriedade!',
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['property_id' => $this->property->id])
            ->assertJsonFragment(['guest_id' => $this->user->id]);

        $this->assertDatabaseHas('conversations', [
            'property_id' => $this->property->id,
            'guest_id' => $this->user->id,
            'host_id' => $this->host->id,
        ]);
    }

    public function test_returns_existing_conversation_if_already_exists(): void
    {
        $conversation = Conversation::factory()->create([
            'guest_id' => $this->user->id,
            'host_id' => $this->host->id,
            'property_id' => $this->property->id,
        ]);

        $response = $this->withAuth()->postJson('/api/conversations', [
            'property_id' => $this->property->id,
            'content' => 'Outra mensagem',
        ]);

        $response->assertStatus(201);
        $this->assertEquals($conversation->id, $response->json('id'));
    }

    public function test_start_conversation_creates_first_message(): void
    {
        $response = $this->withAuth()->postJson('/api/conversations', [
            'property_id' => $this->property->id,
            'content' => 'Primeira mensagem da conversa',
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('messages', [
            'sender_id' => $this->user->id,
            'content' => 'Primeira mensagem da conversa',
        ]);
    }

    public function test_cannot_start_conversation_for_nonexistent_property(): void
    {
        $response = $this->withAuth()->postJson('/api/conversations', [
            'property_id' => 99999,
            'content' => 'Teste',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['property_id']);
    }

    // ─── Validation ───────────────────────────────────────────────

    public function test_store_validates_required_fields(): void
    {
        $response = $this->withAuth()->postJson('/api/conversations', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['property_id', 'content']);
    }
}
