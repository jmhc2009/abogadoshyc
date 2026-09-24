<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['nombre', 'valor', 'medio_pago', 'cantidad_cuotas', 'cuota_inicial', 'observaciones'])]
class Servicio extends Model
{
    protected $table = 'servicios';

    protected $casts = [
        'valor' => 'decimal:2',
        'medio_pago' => 'string',
        'cantidad_cuotas' => 'integer',
        'cuota_inicial' => 'decimal:2',
    ];
}
