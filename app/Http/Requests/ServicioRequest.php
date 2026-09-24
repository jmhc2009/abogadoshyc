<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ServicioRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'nombre' => ['required', 'string', 'max:255'],
            'valor' => ['required', 'numeric', 'gt:0'],
            'medio_pago' => [
                'required',
                Rule::in([
                    'Transferencia Bancaria',
                    'Tarjeta de Débito (Redcompra / Webpay)',
                    'Tarjeta de Crédito',
                    'Efectivo',
                    'Mercado Pago',
                    'Cheque',
                ]),
            ],
            'cantidad_cuotas' => ['required', 'integer', 'min:1'],
            'cuota_inicial' => ['nullable', 'numeric', 'min:0'],
            'observaciones' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre del servicio es obligatorio.',
            'nombre.string' => 'El nombre debe ser texto.',
            'nombre.max' => 'El nombre no puede exceder los 255 caracteres.',
            'valor.required' => 'El valor es obligatorio.',
            'valor.numeric' => 'El valor debe ser un número válido.',
            'valor.gt' => 'El valor debe ser mayor que cero.',
            'medio_pago.required' => 'El medio de pago es obligatorio.',
            'medio_pago.in' => 'Selecciona un medio de pago válido.',
            'cantidad_cuotas.required' => 'La cantidad de cuotas es obligatoria.',
            'cantidad_cuotas.integer' => 'La cantidad de cuotas debe ser un número entero.',
            'cantidad_cuotas.min' => 'La cantidad de cuotas debe ser al menos 1.',
            'cuota_inicial.numeric' => 'La cuota inicial debe ser un número válido.',
            'cuota_inicial.min' => 'La cuota inicial no puede ser negativa.',
            'observaciones.string' => 'Las observaciones deben ser texto.',
        ];
    }
}