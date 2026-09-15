<?php

namespace Database\Seeders;

use App\Models\Client;
use Illuminate\Database\Seeder;

class ClientsTableSeeder extends Seeder
{
    public function run(): void
    {
        Client::create([            'name' => 'Juan Pérez González',
            'rut' => '12.345.678-9',
            'street' => 'Av. Siempre Viva',
            'number' => '123',
            'commune' => 'Providencia',
            'region' => 'Metropolitana',
            'occupation' => 'Ingeniero',
            'marital_status' => 'soltero',
            'phone' => '+56 9 1234 5678',
            'email' => 'juan.perez@example.com',
            'nationality' => 'Chileno',
        ]);

        Client::create([
            'name' => 'María García López',
            'rut' => '98.765.432-1',
            'street' => 'Calle Falsa',
            'number' => '456',
            'commune' => 'Las Condes',
            'region' => 'Metropolitana',
            'occupation' => 'Arquitecta',
            'marital_status' => 'casada',
            'phone' => '+56 9 8765 4321',
            'email' => 'maria.garcia@example.com',
            'nationality' => 'Chilena',
        ]);
    }
}
