<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CausaRequest extends FormRequest
{
    public static function estados(): array
    {
        return [
            'Tramitación',
            'Tramitación pendiente',
            'Suspendida',
            'Cumplimiento',
            'Concluida',
            'Con sentencia',
            'Archivada',
            'Abandono del procedimiento',
        ];
    }

    public function rules(): array
    {
        return [
            'identificador' => ['required', 'string', 'max:100'],
            'tipo_identificador' => ['required', Rule::in(['ROL', 'RIT', 'RUC'])],
            'numero_identificador' => ['required', 'string', 'max:100'],
            'caratula' => ['required', 'string', 'max:255'],
            'fecha_ingreso' => ['required', 'date'],
            'tribunal' => ['required', 'string', 'max:255'],
            'asunto' => ['nullable', 'string'],
            'representado_ids' => ['required', 'array', 'min:1'],
            'representado_ids.*' => ['integer', 'distinct', 'exists:clients,id'],
            'intervinientes_representado' => ['nullable', 'string', 'max:255'],
            'intervinientes_contraparte' => ['nullable', 'string', 'max:255'],
            'estado' => ['required', Rule::in(self::estados())],
            'fecha_termino' => ['nullable', 'date', 'after_or_equal:fecha_ingreso'],
            'observaciones' => ['nullable', 'string'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $tipo = trim((string) $this->input('tipo_identificador', ''));
        $numero = trim((string) $this->input('numero_identificador', ''));

        $this->merge([
            'identificador' => trim($tipo.' '.$numero),
        ]);
    }

    public function messages(): array
    {
        return [
            'tipo_identificador.required' => 'Selecciona el tipo de identificador.',
            'tipo_identificador.in' => 'Selecciona un tipo de identificador válido.',
            'numero_identificador.required' => 'El número o código es obligatorio.',
            'caratula.required' => 'La carátula es obligatoria.',
            'fecha_ingreso.required' => 'La fecha de ingreso es obligatoria.',
            'fecha_ingreso.date' => 'La fecha de ingreso no es válida.',
            'tribunal.required' => 'El tribunal es obligatorio.',
            'representado_ids.required' => 'Selecciona al menos un representado.',
            'representado_ids.array' => 'Los representados seleccionados no son válidos.',
            'representado_ids.min' => 'Selecciona al menos un representado.',
            'representado_ids.*.exists' => 'Uno de los clientes seleccionados no existe.',
            'estado.required' => 'El estado es obligatorio.',
            'estado.in' => 'Selecciona un estado válido.',
            'fecha_termino.date' => 'La fecha de término no es válida.',
            'fecha_termino.after_or_equal' => 'La fecha de término debe ser posterior o igual a la fecha de ingreso.',
        ];
    }
}