<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AbogadoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $abogadoId = $this->route('abogado');

        return [
            'nombres' => ['required', 'string', 'max:120'],
            'apellidos' => ['required', 'string', 'max:120'],
            'rut' => [
                'required',
                'string',
                'max:20',
                Rule::unique('abogados', 'rut')->ignore($abogadoId),
                function ($attribute, $value, $fail) {
                    if (! $this->validateRut($value)) {
                        $fail('El RUT ingresado no es válido.');
                    }
                },
            ],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('abogados', 'email')->ignore($abogadoId),
            ],
            'telefono' => ['nullable', 'string', 'max:30'],
            'especialidad' => ['nullable', 'string', 'max:120'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nombres.required' => 'El nombre es obligatorio.',
            'apellidos.required' => 'El apellido es obligatorio.',
            'rut.required' => 'El RUT es obligatorio.',
            'rut.unique' => 'El RUT ya está registrado.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'El correo electrónico no es válido.',
            'email.unique' => 'El correo electrónico ya está registrado.',
        ];
    }

    /**
     * Validate a Chilean RUT.
     */
    protected function validateRut(string $rut): bool
    {
        $rut = preg_replace('/[^0-9kK]/', '', $rut);
        if (strlen($rut) < 2) {
            return false;
        }

        $body = substr($rut, 0, -1);
        $verifier = strtolower(substr($rut, -1));

        if (! ctype_digit($body)) {
            return false;
        }

        $sum = 0;
        $factor = 2;
        for ($i = strlen($body) - 1; $i >= 0; $i--) {
            $sum += (int) $body[$i] * $factor;
            $factor = $factor < 7 ? $factor + 1 : 2;
        }

        $rest = 11 - ($sum % 11);
        $expected = match ($rest) {
            11 => '0',
            10 => 'k',
            default => (string) $rest,
        };

        return $verifier === $expected;
    }
}