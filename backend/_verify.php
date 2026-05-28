<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$users = App\Domain\User\User::all();
echo "=== USUARIOS ===\n";
foreach ($users as $u) {
    printf("#%d %s | %s | role: %s | is_host: %s\n", $u->id, $u->name, $u->email, $u->role->value, $u->is_host ? 'true' : 'false');
}

echo "\n=== IMOVEIS POR HOST ===\n";
$hosts = App\Domain\User\User::where('role', 'host')->get();
foreach ($hosts as $h) {
    $count = $h->properties()->count();
    printf("%s: %d imoveis\n", $h->name, $count);
    foreach ($h->properties as $p) {
        printf("  - %s (R$ %.2f)\n", $p->title, $p->price_per_night);
    }
}

echo "\n=== TOTAIS ===\n";
printf("Usuarios: %d\n", App\Domain\User\User::count());
printf("Imoveis: %d\n", App\Domain\Property\Property::count());
printf("Reservas: %d\n", App\Domain\Reservation\Reservation::count());
echo "\n";
