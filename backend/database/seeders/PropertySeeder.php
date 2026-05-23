<?php

namespace Database\Seeders;

use App\Domain\Property\Property;
use App\Domain\User\User;
use App\Models\PropertyImage;
use Illuminate\Database\Seeder;

class PropertySeeder extends Seeder
{
    private array $properties = [
        [
            'title' => 'Cobertura Luxo com Vista para o Mar',
            'type' => 'entire_place',
            'description' => 'Deslumbrante cobertura com vista panorâmica para o mar de Copacabana. Ambientes amplos e sofisticados, piscina privativa e acabamento de alto padrão. Perfeita para quem busca luxo e conforto.',
            'address' => 'Av. Atlântica, 1500',
            'city' => 'Rio de Janeiro',
            'state' => 'RJ',
            'property_type' => 'apartment',
            'price_per_night' => 1200.00,
            'cleaning_fee' => 250.00,
            'max_guests' => 6,
            'bedrooms' => 3,
            'bathrooms' => 3,
            'latitude' => -22.9711,
            'longitude' => -43.1823,
            'images' => ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'],
        ],
        [
            'title' => 'Chalé Aconchegante na Serra',
            'type' => 'entire_place',
            'description' => 'Chalé rústico rodeado pela natureza da Serra da Mantiqueira. Lareira a lenha, hidromassagem externa e café colonial incluso. Ideal para casais em busca de romance e tranquilidade.',
            'address' => 'Estrada do Pico, Km 12',
            'city' => 'Campos do Jordão',
            'state' => 'SP',
            'property_type' => 'cabin',
            'price_per_night' => 580.00,
            'cleaning_fee' => 120.00,
            'max_guests' => 4,
            'bedrooms' => 2,
            'bathrooms' => 1,
            'latitude' => -22.7392,
            'longitude' => -45.5914,
            'images' => ['https://images.unsplash.com/photo-1518780664697-55e3ad937233', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'],
        ],
        [
            'title' => 'Apartamento Moderno no Centro',
            'type' => 'entire_place',
            'description' => 'Apartamento totalmente reformado no coração da Av. Paulista. Próximo a restaurantes, museus e estações de metrô. Internet de alta velocidade e home office preparado.',
            'address' => 'Av. Paulista, 1000',
            'city' => 'São Paulo',
            'state' => 'SP',
            'property_type' => 'apartment',
            'price_per_night' => 350.00,
            'cleaning_fee' => 80.00,
            'max_guests' => 3,
            'bedrooms' => 2,
            'bathrooms' => 1,
            'latitude' => -23.5614,
            'longitude' => -46.6561,
            'images' => ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'],
        ],
        [
            'title' => 'Casa com Piscina em Condomínio',
            'type' => 'entire_place',
            'description' => 'Casa ampla em condomínio fechado com segurança 24h. Piscina, churrasqueira e área de lazer completa. Perfeita para famílias e grupos de amigos.',
            'address' => 'Rua das Flores, 500',
            'city' => 'Florianópolis',
            'state' => 'SC',
            'property_type' => 'house',
            'price_per_night' => 780.00,
            'cleaning_fee' => 180.00,
            'max_guests' => 10,
            'bedrooms' => 4,
            'bathrooms' => 3,
            'latitude' => -27.5969,
            'longitude' => -48.5495,
            'images' => ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750'],
        ],
        [
            'title' => 'Studio Pé na Areia em Porto de Galinhas',
            'type' => 'entire_place',
            'description' => 'Studio completo bem em frente à praia de Porto de Galinhas. Varanda com rede, cozinha compacta e ar condicionado. O melhor custo-benefício para curtir o litoral pernambucano.',
            'address' => 'Rodovia PE-09, s/n',
            'city' => 'Ipojuca',
            'state' => 'PE',
            'property_type' => 'studio',
            'price_per_night' => 420.00,
            'cleaning_fee' => 90.00,
            'max_guests' => 2,
            'bedrooms' => 1,
            'bathrooms' => 1,
            'latitude' => -8.5034,
            'longitude' => -35.0028,
            'images' => ['https://images.unsplash.com/photo-1596394516093-501ba68a0ba6', 'https://images.unsplash.com/photo-1566073771259-6a8506099945'],
        ],
        [
            'title' => 'Villa Climatizada com Vistas Incríveis',
            'type' => 'entire_place',
            'description' => 'Villa contemporânea com design assinado, piscina de borda infinita e vista deslumbrante para as montanhas. 4 suítes, adega climatizada e serviço de mordomo disponível.',
            'address' => 'Rua das Paineiras, 200',
            'city' => 'Brotas',
            'state' => 'SP',
            'property_type' => 'villa',
            'price_per_night' => 1500.00,
            'cleaning_fee' => 350.00,
            'max_guests' => 8,
            'bedrooms' => 4,
            'bathrooms' => 4,
            'latitude' => -22.2848,
            'longitude' => -48.1271,
            'images' => ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'],
        ],
        [
            'title' => 'Quarto Privativo em Casa Compartilhada',
            'type' => 'private_room',
            'description' => 'Quarto privativo em casa compartilhada no bairro boêmio da Vila Madalena. Ideal para nômade digital com espaços de coworking, café da manhã incluso e convivência com moradores locais.',
            'address' => 'Rua Harmonia, 123',
            'city' => 'São Paulo',
            'state' => 'SP',
            'property_type' => 'house',
            'price_per_night' => 120.00,
            'cleaning_fee' => 30.00,
            'max_guests' => 2,
            'bedrooms' => 1,
            'bathrooms' => 1,
            'latitude' => -23.5531,
            'longitude' => -46.6944,
            'images' => ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'],
        ],
        [
            'title' => 'Loft Industrial com Mezanino',
            'type' => 'entire_place',
            'description' => 'Loft decorado em estilo industrial no bairro de Santa Teresa. Pés-direito duplo, mezanino com cama king-size e vista para o Centro do Rio. Experiência única de hospedagem.',
            'address' => 'Rua do Curvelo, 50',
            'city' => 'Rio de Janeiro',
            'state' => 'RJ',
            'property_type' => 'loft',
            'price_per_night' => 490.00,
            'cleaning_fee' => 100.00,
            'max_guests' => 3,
            'bedrooms' => 1,
            'bathrooms' => 1,
            'latitude' => -22.9193,
            'longitude' => -43.1882,
            'images' => ['https://images.unsplash.com/photo-1536376072261-38c75010e6c9', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d'],
        ],
        [
            'title' => 'Casa Colonial Histórica em Paraty',
            'type' => 'entire_place',
            'description' => 'Casa colonial do século XVIII totalmente restaurada no centro histórico de Paraty. Pátio interno com fontes, jardim tropical e decoração de época combinada com conforto moderno.',
            'address' => 'Rua do Comércio, 80',
            'city' => 'Paraty',
            'state' => 'RJ',
            'property_type' => 'house',
            'price_per_night' => 650.00,
            'cleaning_fee' => 140.00,
            'max_guests' => 6,
            'bedrooms' => 3,
            'bathrooms' => 2,
            'latitude' => -23.2226,
            'longitude' => -44.7175,
            'images' => ['https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3'],
        ],
        [
            'title' => 'Bangalô com Rede na Praia do Rosa',
            'type' => 'entire_place',
            'description' => 'Bangalô ecológico a 100m da Praia do Rosa. Construído com materiais sustentáveis, energia solar e captação de água da chuva. Café da manhã orgânico incluso.',
            'address' => 'Estrada Geral da Praia do Rosa, s/n',
            'city' => 'Imbituba',
            'state' => 'SC',
            'property_type' => 'cottage',
            'price_per_night' => 520.00,
            'cleaning_fee' => 110.00,
            'max_guests' => 4,
            'bedrooms' => 2,
            'bathrooms' => 1,
            'latitude' => -28.1353,
            'longitude' => -48.6542,
            'images' => ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9'],
        ],
    ];

    public function run(): void
    {
        $host = User::where('email', 'host@stayflow.com')->first();

        if ($host === null) {
            $host = User::factory()->host()->create([
                'name' => 'João Anfitrião',
                'email' => 'host@stayflow.com',
            ]);
        }

        foreach ($this->properties as $data) {
            $images = $data['images'];
            unset($data['images']);

            $slug = str($data['title'])->slug()->append('-' . fake()->unique()->randomNumber(4));

            $property = Property::factory()->create(
                array_merge($data, [
                    'host_id' => $host->id,
                    'slug' => $slug->value(),
                    'status' => 'available',
                    'check_in_time' => '14:00:00',
                    'check_out_time' => '11:00:00',
                ])
            );

            foreach ($images as $i => $imageUrl) {
                PropertyImage::factory()->create([
                    'property_id' => $property->id,
                    'image_url' => $imageUrl . '?w=800&h=600&fit=crop',
                    'is_cover' => $i === 0,
                    'order' => $i,
                ]);
            }
        }
    }
}
