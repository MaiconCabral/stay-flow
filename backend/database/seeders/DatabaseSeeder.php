<?php

namespace Database\Seeders;

use App\Domain\User\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $hosts = collect();

        $hosts->push(User::factory()->host()->create([
            'name' => 'João Anfitrião',
            'email' => 'host1@stayflow.com',
            'phone' => '(11) 99999-0001',
        ]));

        $hosts->push(User::factory()->host()->create([
            'name' => 'Maria Anfitriã',
            'email' => 'host2@stayflow.com',
            'phone' => '(11) 99999-0003',
        ]));

        $hosts->push(User::factory()->host()->create([
            'name' => 'Carlos Anfitrião',
            'email' => 'host3@stayflow.com',
            'phone' => '(11) 99999-0004',
        ]));

        $hosts->push(User::factory()->host()->create([
            'name' => 'Ana Anfitriã',
            'email' => 'host4@stayflow.com',
            'phone' => '(11) 99999-0005',
        ]));

        User::factory()->guest()->create([
            'name' => 'Pedro Hóspede',
            'email' => 'guest1@stayflow.com',
            'phone' => '(11) 99999-0006',
        ]);

        User::factory()->guest()->create([
            'name' => 'Sofia Hóspede',
            'email' => 'guest2@stayflow.com',
            'phone' => '(11) 99999-0007',
        ]);

        User::factory()->admin()->create([
            'name' => 'Admin StayFlow',
            'email' => 'admin@stayflow.com',
            'phone' => '(11) 99999-0002',
        ]);

        $this->callWith(PropertySeeder::class, ['hosts' => $hosts]);
        $this->call(ReservationSeeder::class);
        $this->call(LeadSeeder::class);
        $this->call(PaymentSeeder::class);
        $this->call(AvailabilitySeeder::class);
    }
}
