<?php

namespace App\Http\Controllers;

use App\Http\Requests\AudienciaRequest;
use App\Models\Audiencia;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Inertia\ResponseFactory;

class AudienciaController extends Controller
{
    public function index(): Response|ResponseFactory
    {
        $search = trim((string) request()->input('search', ''));

        $audiencias = Audiencia::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('tribunal', 'like', "%{$search}%")
                        ->orWhere('tipo', 'like', "%{$search}%")
                        ->orWhere('fecha', 'like', "%{$search}%");
                });
            })
            ->orderBy('fecha')
            ->orderBy('hora')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Audiencia $audiencia): array => $this->data($audiencia));

        return Inertia::render('audiencias/Index', [
            'audiencias' => $audiencias,
            'filters' => ['search' => $search],
            'tipos' => AudienciaRequest::tipos(),
            'comparecencias' => AudienciaRequest::comparecencias(),
        ]);
    }

    public function create(): RedirectResponse
    {
        return to_route('audiencias.index');
    }

    public function store(AudienciaRequest $request): RedirectResponse
    {
        Audiencia::create($request->validated());

        return to_route('audiencias.index')->with('success', 'Audiencia creada correctamente.');
    }

    public function show(Audiencia $audiencia): Response|ResponseFactory
    {
        return Inertia::render('audiencias/Show', [
            'audiencia' => $this->data($audiencia),
            'tipos' => AudienciaRequest::tipos(),
            'comparecencias' => AudienciaRequest::comparecencias(),
        ]);
    }

    public function edit(Audiencia $audiencia): Response|ResponseFactory
    {
        return Inertia::render('audiencias/Show', [
            'audiencia' => $this->data($audiencia),
            'editing' => true,
            'tipos' => AudienciaRequest::tipos(),
            'comparecencias' => AudienciaRequest::comparecencias(),
        ]);
    }

    public function update(AudienciaRequest $request, Audiencia $audiencia): RedirectResponse
    {
        $audiencia->update($request->validated());

        return to_route('audiencias.index')->with('success', 'Audiencia actualizada correctamente.');
    }

    public function destroy(Audiencia $audiencia): RedirectResponse
    {
        $audiencia->delete();

        return to_route('audiencias.index')->with('success', 'Audiencia eliminada correctamente.');
    }

    private function data(Audiencia $audiencia): array
    {
        return [
            'id' => $audiencia->id,
            'tipo' => $audiencia->tipo,
            'fecha' => $audiencia->fecha?->format('Y-m-d'),
            'hora' => substr((string) $audiencia->hora, 0, 5),
            'tribunal' => $audiencia->tribunal,
            'comparecencia' => $audiencia->comparecencia,
            'observaciones' => $audiencia->observaciones,
        ];
    }
}