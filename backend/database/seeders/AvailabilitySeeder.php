<?php

namespace Database\Seeders;

use App\Domain\Availability\Availability;
use App\Domain\Property\Property;
use Illuminate\Database\Seeder;

class AvailabilitySeeder extends Seeder
{
    public function run(): void
    {
        $properties = Property::all();

        foreach ($properties as $property) {
            // Generate 6 sequential date ranges per property, each in a different month/period
            $periods = [
                ['months' => '-6:-5', 'type' => 'blocked'],
                ['months' => '-3:-2', 'type' => 'available'],
                ['months' => '0:1', 'type' => 'available'],
                ['months' => '1:2', 'type' => 'blocked'],
                ['months' => '2:3', 'type' => 'available', 'custom_price' => true],
                ['months' => '3:4', 'type' => 'available'],
            ];

            foreach ($periods as $period) {
                [$startOffset, $endOffset] = explode(':', $period['months']);
                $startOffset = (int) $startOffset;
                $endOffset = (int) $endOffset;

                $start = now()->addMonths($startOffset)->addDays(fake()->numberBetween(1, 15));
                $end = (clone $start)->addDays(fake()->numberBetween(2, 10));

                $isAvailable = $period['type'] === 'available';
                $price = null;

                if (! empty($period['custom_price'])) {
                    $price = $property->price_per_night * 1.5;
                }

                Availability::create([
                    'property_id' => $property->id,
                    'start_date' => $start->format('Y-m-d'),
                    'end_date' => $end->format('Y-m-d'),
                    'is_available' => $isAvailable,
                    'price' => $price,
                ]);
            }
        }
    }
}
