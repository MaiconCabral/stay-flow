<?php

namespace Database\Seeders;

use App\Domain\Property\Property;
use App\Domain\Review\Review;
use App\Domain\Review\Repositories\ReviewRepositoryInterface;
use App\Domain\User\User;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    private array $reviews = [
        [
            'comment' => 'Lugar incrível! Vista deslumbrante do mar, apartamento muito bem decorado e limpo. O anfitrião foi super atencioso e nos recebeu muito bem. Com certeza voltaremos!',
            'rating' => 5,
        ],
        [
            'comment' => 'Chalé aconchegante e romântico. A lareira a lenha fez toda a diferença nas noites frias. O café da manhã é delicioso. Único ponto negativo é o acesso por estrada de terra.',
            'rating' => 4,
        ],
        [
            'comment' => 'Apartamento moderno e bem localizado. Próximo de tudo, metrô a duas quadras. Ideal para quem está a trabalho em SP. Internet rápida e estável.',
            'rating' => 5,
        ],
        [
            'comment' => 'Casa excelente para famílias. As crianças amaram a piscina. Condomínio seguro e bem cuidado. A churrasqueira é ótima para confraternizações.',
            'rating' => 5,
        ],
        [
            'comment' => 'Studio compacto mas muito bem aproveitado. Localização perfeita, bem em frente à praia. A rede na varanda é um charme a mais. Ótimo custo-benefício.',
            'rating' => 4,
        ],
        [
            'comment' => 'Villa espetacular! A piscina de borda infinita é de tirar o fôlego. O mordomo foi muito solicito. Único porém é o preço, mas vale cada centavo para uma ocasião especial.',
            'rating' => 5,
        ],
        [
            'comment' => 'Quarto confortável e casa agradável. Conheci pessoas interessantes no café da manhã. Ótima experiência de hospedagem compartilhada. Recomendo!',
            'rating' => 4,
        ],
        [
            'comment' => 'Loft super estiloso! A decoração industrial é linda e o mezanino é bem romântico. O bairro de Santa Teresa é cheio de vida e restaurantes ótimos.',
            'rating' => 5,
        ],
        [
            'comment' => 'Casa colonial linda e cheia de história. Paraty é encantadora e a localização no centro histórico é perfeita. Único problema é o estacionamento que fica um pouco longe.',
            'rating' => 4,
        ],
        [
            'comment' => 'Bangalô ecológico e sustentável, amamos a proposta. Acordar com o som do mar é indescritível. O café orgânico é uma delícia. Voltaremos com certeza!',
            'rating' => 5,
        ],
    ];

    public function run(): void
    {
        $properties = Property::all();
        $guests = User::whereDoesntHave('properties')->get();

        if ($guests->isEmpty()) {
            $guests = User::factory()->count(3)->create();
        }

        foreach ($this->reviews as $i => $data) {
            $property = $properties->get($i % $properties->count());
            $guest = $guests->get($i % $guests->count());

            $reservation = $property->reservations()->where('guest_id', $guest->id)->first();

            if ($reservation === null) {
                $reservation = $property->reservations()->create([
                    'guest_id' => $guest->id,
                    'check_in' => now()->subDays(rand(30, 90)),
                    'check_out' => now()->subDays(rand(1, 29)),
                    'total_guests' => rand(1, 4),
                    'subtotal' => $property->price_per_night * 3,
                    'service_fee' => $property->price_per_night * 3 * 0.1,
                    'cleaning_fee' => $property->cleaning_fee,
                    'total_price' => $property->price_per_night * 3 * 1.1 + $property->cleaning_fee,
                    'status' => 'completed',
                ]);
            }

            Review::factory()->create([
                'property_id' => $property->id,
                'guest_id' => $guest->id,
                'reservation_id' => $reservation->id,
                'rating' => $data['rating'],
                'comment' => $data['comment'],
            ]);
        }
    }
}
