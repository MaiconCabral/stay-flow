<?php

namespace App\Application\Message\UseCases;

use App\Application\Message\DTOs\StartConversationData;
use App\Domain\Message\Conversation;
use App\Domain\Message\Message;
use App\Domain\Message\Repositories\ConversationRepositoryInterface;
use App\Domain\Message\Repositories\MessageRepositoryInterface;
use App\Domain\Property\Repositories\PropertyRepositoryInterface;
use App\Domain\User\Repositories\UserRepositoryInterface;
use RuntimeException;

class StartConversationUseCase
{
    public function __construct(
        private readonly ConversationRepositoryInterface $conversationRepository,
        private readonly MessageRepositoryInterface $messageRepository,
        private readonly PropertyRepositoryInterface $propertyRepository,
        private readonly UserRepositoryInterface $userRepository,
    ) {}

    public function execute(StartConversationData $data): Conversation
    {
        $property = $this->propertyRepository->findById($data->propertyId);

        if ($property === null) {
            throw new RuntimeException('Property not found.');
        }

        $guest = $this->userRepository->findById($data->guestId);

        if ($guest === null) {
            throw new RuntimeException('Guest not found.');
        }

        $hostId = $property->host_id;

        $existing = $this->conversationRepository->findExisting($data->propertyId, $data->guestId, $hostId);

        if ($existing !== null) {
            if ($data->content !== '') {
                $message = new Message();
                $message->conversation_id = $existing->id;
                $message->sender_id = $data->guestId;
                $message->content = $data->content;

                $this->messageRepository->save($message);

                $existing->last_message_at = $message->created_at;
                $existing->last_message_preview = mb_substr($data->content, 0, 255);
                $this->conversationRepository->save($existing);
            }

            return $existing->load(['property', 'guest', 'host', 'lastMessage']);
        }

        $conversation = new Conversation();
        $conversation->property_id = $data->propertyId;
        $conversation->guest_id = $data->guestId;
        $conversation->host_id = $hostId;
        $conversation->reservation_id = $data->reservationId;
        $conversation->status = 'active';

        $this->conversationRepository->save($conversation);

        if ($data->content !== '') {
            $message = new Message();
            $message->conversation_id = $conversation->id;
            $message->sender_id = $data->guestId;
            $message->content = $data->content;

            $this->messageRepository->save($message);

            $conversation->last_message_at = $message->created_at;
            $conversation->last_message_preview = mb_substr($data->content, 0, 255);
            $this->conversationRepository->save($conversation);
        }

        return $conversation->load(['property', 'guest', 'host', 'lastMessage']);
    }
}
