<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['tipo', 'fecha', 'hora', 'tribunal', 'comparecencia', 'observaciones'])]
class Audiencia extends Model
{
    protected $casts = [
        'fecha' => 'date:Y-m-d',
    ];
}