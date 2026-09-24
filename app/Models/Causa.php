<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'identificador',
    'tipo_identificador',
    'numero_identificador',
    'caratula',
    'fecha_ingreso',
    'tribunal',
    'asunto',
    'intervinientes_representado',
    'intervinientes_contraparte',
    'estado',
    'fecha_termino',
    'observaciones',
])]
class Causa extends Model
{
    protected $casts = [
        'fecha_ingreso' => 'date:Y-m-d',
        'fecha_termino' => 'date:Y-m-d',
    ];

    public function representados(): BelongsToMany
    {
        return $this->belongsToMany(Client::class, 'causa_cliente');
    }
}