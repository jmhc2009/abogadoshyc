<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Abogado extends Model
{
    protected $table = 'abogados';

    protected $fillable = [
        'nombres',
        'apellidos',
        'rut',
        'email',
        'telefono',
        'especialidad',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'rut_formatted',
    ];

    public function getFullNameAttribute(): string
    {
        return trim($this->nombres.' '.$this->apellidos);
    }

    public function getRutFormattedAttribute(): string
    {
        $rut = preg_replace('/[^0-9kK]/', '', $this->rut ?? '');
        $verifier = strtoupper(substr($rut, -1));
        $number = substr($rut, 0, -1);

        return $number
            ? number_format((float) $number, 0, '.', '').'-'.$verifier
            : $this->rut;
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}