<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AudienciaRequest extends FormRequest
{
    public static function tipos(): array
    {
        return [
            'Preparatoria',
            'Continuación de preparatoria',
            'De juicio',
            'Continuación de juicio',
            'Revisión de medidas',
        ];
    }

    public static function comparecencias(): array
    {
        return ['Presencial', 'Zoom'];
    }

    public function rules(): array
    {
        return [
            'tipo' => ['required', Rule::in(self::tipos())],
            'fecha' => ['required', 'date'],
            'hora' => ['required', 'date_format:H:i'],
            'tribunal' => ['required', 'string', 'max:255'],
            'comparecencia' => ['required', Rule::in(self::comparecencias())],
            'observaciones' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'tipo.required' => 'El tipo de audiencia es obligatorio.',
            'tipo.in' => 'Selecciona un tipo de audiencia válido.',
            'fecha.required' => 'La fecha es obligatoria.',
            'fecha.date' => 'La fecha no es válida.',
            'hora.required' => 'La hora es obligatoria.',
            'hora.date_format' => 'La hora debe tener el formato HH:MM.',
            'tribunal.required' => 'El tribunal es obligatorio.',
            'comparecencia.required' => 'La comparecencia es obligatoria.',
            'comparecencia.in' => 'Selecciona una comparecencia válida.',
        ];
    }
}