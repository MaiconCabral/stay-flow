<?php

namespace Database\Seeders;

use App\Domain\Lead\Lead;
use App\Domain\Property\Property;
use App\Domain\Reservation\Reservation;
use Illuminate\Database\Seeder;

class LeadSeeder extends Seeder
{
    public function run(): void
    {
        $properties = Property::all();

        if ($properties->isEmpty()) {
            $this->command->warn('No properties found. Skipping LeadSeeder.');
            return;
        }

        $convertedReservations = Reservation::where('status', 'completed')->get();

        // New leads
        for ($i = 0; $i < 20; $i++) {
            Lead::factory()->create([
                'property_id' => $properties->random()->id,
            ]);
        }

        // Contacted leads
        for ($i = 0; $i < 15; $i++) {
            Lead::factory()->contacted()->create([
                'property_id' => $properties->random()->id,
            ]);
        }

        // Converted leads (linked to completed reservations)
        for ($i = 0; $i < 10; $i++) {
            $reservation = $convertedReservations->random();
            Lead::factory()->converted()->create([
                'property_id' => $reservation->property_id,
                'converted_to_reservation_id' => $reservation->id,
                'message' => 'Quero fazer uma reserva para as datas informadas.',
            ]);
        }

        // Lost leads
        for ($i = 0; $i < 5; $i++) {
            Lead::factory()->lost()->create([
                'property_id' => $properties->random()->id,
            ]);
        }
    }
}
