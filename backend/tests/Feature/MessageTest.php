<?php

namespace Tests\Feature;

use App\Domain\Message\Conversation;
use App\Domain\Message\Message;
use App\Domain\Property\Property;
use App\Domain\User\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MessageTest extends TestCase
{
    use RefreshDatabase;

    private User $guest;
    private User $host;
    private string $token;
    private Conversation $conversation;

    protected function setUp(): void
    {
        parent::setUp();

        $this->guest = User::factory()->create();
        $this->token = $this->guest->createToken('test')->plainTextToken;
        $this->host = User::factory()->create();
        $property = Property::factory()->create(['host_id' => $this->host->id]);

        $this->conversation = Conversation::factory()->create([
            'property_id' => $property->id,
            'guest_id' => $this->guest->id,
            'host_id' => $this->host->id,
        ]);
    }

    private function withAuth(): self
    {
        return $this->withHeader('Authorization', "Bearer {$this->token}");
    }

    // ─── Auth ─────────────────────────────────────────────────────

    public function test_unauthenticated_user_cannot_access_messages(): void
    {
        $response = $this->getJson("/api/conversations/{$this->conversation->id}/messages");

        $response->assertStatus(401);
    }

    // ─── List ─────────────────────────────────────────────────────

    public function test_can_list_messages(): void
    {
        Message::factory()->count(3)->create([
            'conversation_id' => $this->conversation->id,
        ]);

        $response = $this->withAuth()->getJson("/api/conversations/{$this->conversation->id}/messages");

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'meta']);
    }

    public function test_cannot_list_messages_of_non_participant(): void
    {
        $otherUser = User::factory()->create();
        $otherToken = $otherUser->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$otherToken}")
            ->getJson("/api/conversations/{$this->conversation->id}/messages");

        $response->assertStatus(500);
    }

    // ─── Send ─────────────────────────────────────────────────────

    public function test_can_send_message(): void
    {
        $response = $this->withAuth()->postJson(
            "/api/conversations/{$this->conversation->id}/messages",
            ['content' => 'Olá, tudo bem?'],
        );

        $response->assertStatus(201)
            ->assertJsonFragment(['content' => 'Olá, tudo bem?']);

        $this->assertDatabaseHas('messages', [
            'conversation_id' => $this->conversation->id,
            'sender_id' => $this->guest->id,
            'content' => 'Olá, tudo bem?',
        ]);
    }

    public function test_send_message_updates_conversation_preview(): void
    {
        $this->withAuth()->postJson(
            "/api/conversations/{$this->conversation->id}/messages",
            ['content' => 'Última mensagem'],
        );

        $this->assertDatabaseHas('conversations', [
            'id' => $this->conversation->id,
            'last_message_preview' => 'Última mensagem',
        ]);

        $this->assertNotNull($this->conversation->fresh()->last_message_at);
    }

    public function test_cannot_send_message_to_non_participant(): void
    {
        $otherUser = User::factory()->create();
        $otherToken = $otherUser->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$otherToken}")
            ->postJson(
                "/api/conversations/{$this->conversation->id}/messages",
                ['content' => 'Invadindo conversa'],
            );

        $response->assertStatus(500);
    }

    // ─── Mark as Read ─────────────────────────────────────────────

    public function test_can_mark_message_as_read(): void
    {
        $message = Message::factory()->create([
            'conversation_id' => $this->conversation->id,
            'sender_id' => $this->host->id,
        ]);

        $response = $this->withAuth()->postJson("/api/messages/{$message->id}/read");

        $response->assertStatus(200);

        $this->assertNotNull($message->fresh()->read_at);
    }

    public function test_cannot_mark_own_message_as_read(): void
    {
        $message = Message::factory()->create([
            'conversation_id' => $this->conversation->id,
            'sender_id' => $this->guest->id,
        ]);

        $response = $this->withAuth()->postJson("/api/messages/{$message->id}/read");

        $response->assertStatus(500);
    }

    // ─── Mark Conversation as Read ────────────────────────────────

    public function test_can_mark_all_messages_as_read_in_conversation(): void
    {
        Message::factory()->count(3)->create([
            'conversation_id' => $this->conversation->id,
            'sender_id' => $this->host->id,
        ]);

        $response = $this->withAuth()->postJson(
            "/api/conversations/{$this->conversation->id}/read",
        );

        $response->assertStatus(200);

        $unread = Message::where('conversation_id', $this->conversation->id)
            ->whereNull('read_at')
            ->count();

        $this->assertEquals(0, $unread);
    }

    // ─── Unread Count ─────────────────────────────────────────────

    public function test_unread_count_returns_correct_number(): void
    {
        Message::factory()->count(2)->create([
            'conversation_id' => $this->conversation->id,
            'sender_id' => $this->host->id,
        ]);

        Message::factory()->create([
            'conversation_id' => $this->conversation->id,
            'sender_id' => $this->guest->id,
        ]);

        $response = $this->withAuth()->getJson('/api/messages/unread-count');

        $response->assertStatus(200)
            ->assertJsonFragment(['unread_count' => 2]);
    }

    public function test_unread_count_zero_when_all_read(): void
    {
        Message::factory()->count(2)->create([
            'conversation_id' => $this->conversation->id,
            'sender_id' => $this->host->id,
            'read_at' => now(),
        ]);

        $response = $this->withAuth()->getJson('/api/messages/unread-count');

        $response->assertStatus(200)
            ->assertJsonFragment(['unread_count' => 0]);
    }

    // ─── Validation ───────────────────────────────────────────────

    public function test_store_validates_required_fields(): void
    {
        $response = $this->withAuth()->postJson(
            "/api/conversations/{$this->conversation->id}/messages",
            [],
        );

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['content']);
    }
}
