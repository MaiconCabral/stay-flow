<?php

namespace Database\Seeders;

use App\Domain\User\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $host = User::factory()->host()->create([
            'name' => 'João Anfitrião',
            'email' => 'host@stayflow.com',
            'phone' => '(11) 99999-0001',
        ]);

        User::factory()->admin()->create([
            'name' => 'Admin StayFlow',
            'email' => 'admin@stayflow.com',
            'phone' => '(11) 99999-0002',
        ]);

        $this->call(PropertySeeder::class);
        $this->call(ReservationSeeder::class);
        $this->call(LeadSeeder::class);
        $this->call(PaymentSeeder::class);
        $this->call(AvailabilitySeeder::class);
    }
}
