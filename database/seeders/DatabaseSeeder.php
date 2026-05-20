<?php

namespace Database\Seeders;

use App\Domain\User\User;
use App\Models\Property;
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

        Property::factory()->count(2)->create([
            'host_id' => $host->id,
        ]);
    }
}
