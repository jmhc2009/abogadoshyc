<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rule;

class ClientRequest extends FormRequest
{
    public function rules(): array
    {
        $clientId = $this->route('client') ?? $this->route('id');

        if ($clientId instanceof Model) {
            $clientId = $clientId->getKey();
        }

        return [
            'name' => 'required|string|max:255',
            'rut' => [
                'required',
                'string',
                Rule::unique('clients', 'rut')->ignore($clientId),
            ],
            'street' => 'nullable|string|max:255',
            'number' => 'nullable|string|max:50',
            'commune' => 'nullable|string|max:100',
            'region' => 'nullable|string|max:100',
            'occupation' => 'nullable|string|max:100',
            'marital_status' => 'nullable|string|max:50',
            'phone' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:255',
            'nationality' => 'nullable|string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El campo Nombre es obligatorio.',
            'name.string' => 'El campo Nombre debe ser texto.',
            'name.max' => 'El campo Nombre no puede exceder los 255 caracteres.',
            
            'rut.required' => 'El campo RUT es obligatorio.',
            'rut.string' => 'El campo RUT debe ser texto.',
            'rut.max' => 'El campo RUT no puede exceder los 20 caracteres.',
            'rut.unique' => 'Este RUT ya se encuentra registrado.',
            
            'street.string' => 'El campo Calle debe ser texto.',
            'street.max' => 'El campo Calle no puede exceder los 255 caracteres.',
            
            'number.string' => 'El campo Número debe ser texto.',
            'number.max' => 'El campo Número no puede exceder los 50 caracteres.',
            
            'commune.string' => 'El campo Comuna debe ser texto.',
            'commune.max' => 'El campo Comuna no puede exceder los 100 caracteres.',
            
            'region.string' => 'El campo Región debe ser texto.',
            'region.max' => 'El campo Región no puede exceder los 100 caracteres.',
            
            'occupation.string' => 'El campo Ocupación debe ser texto.',
            'occupation.max' => 'El campo Ocupación no puede exceder los 100 caracteres.',
            
            'marital_status.string' => 'El campo Estado civil debe ser texto.',
            'marital_status.max' => 'El campo Estado civil no puede exceder los 50 caracteres.',
            
            'phone.string' => 'El campo Teléfono debe ser texto.',
            'phone.max' => 'El campo Teléfono no puede exceder los 30 caracteres.',
            
            'email.email' => 'Debe ingresar un correo electrónico válido.',
            'email.max' => 'El campo Email no puede exceder los 255 caracteres.',
            
            'nationality.string' => 'El campo Nacionalidad debe ser texto.',
            'nationality.max' => 'El campo Nacionalidad no puede exceder los 100 caracteres.',
        ];
    }
}