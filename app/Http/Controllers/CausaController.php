<?php

namespace App\Http\Controllers;

use App\Http\Requests\CausaRequest;
use App\Models\Causa;
use App\Models\Client;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Inertia\ResponseFactory;

class CausaController extends Controller
{
    public function index(): Response|ResponseFactory
    {
        $search = trim((string) request()->input('search', ''));

        $causas = Causa::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('identificador', 'like', "%{$search}%")
                        ->orWhere('caratula', 'like', "%{$search}%")
                        ->orWhere('tribunal', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Causa $causa): array => [
                'id' => $causa->id,
                'identificador' => $causa->identificador,
                'tipo_identificador' => $causa->tipo_identificador ?: str($causa->identificador)->before(' ')->toString(),
                'numero_identificador' => $causa->numero_identificador ?: str($causa->identificador)->after(' ')->toString(),
                'caratula' => $causa->caratula,
                'fecha_ingreso' => $causa->fecha_ingreso?->format('Y-m-d'),
                'tribunal' => $causa->tribunal,
                'asunto' => $causa->asunto,
                'intervinientes_representado' => $causa->intervinientes_representado,
                'representado_ids' => $causa->representados->pluck('id')->values(),
                'intervinientes_contraparte' => $causa->intervinientes_contraparte,
                'estado' => $causa->estado,
                'fecha_termino' => $causa->fecha_termino?->format('Y-m-d'),
                'observaciones' => $causa->observaciones,
            ]);

        return Inertia::render('causas/Index', [
            'causas' => $causas,
            'filters' => ['search' => $search],
            'estados' => CausaRequest::estados(),
            'clientes' => $this->clientes(),
        ]);
    }

    public function create(): RedirectResponse
    {
        return to_route('causas.index');
    }

    public function store(CausaRequest $request): RedirectResponse
    {
        $causa = $this->persist($request, new Causa());

        return to_route('causas.index')->with('success', 'Causa creada correctamente.');
    }

    public function show(Causa $causa): Response|ResponseFactory
    {
        return Inertia::render('causas/Show', [
            'causa' => $this->formData($causa),
            'estados' => CausaRequest::estados(),
            'clientes' => $this->clientes(),
        ]);
    }

    public function edit(Causa $causa): Response|ResponseFactory
    {
        return Inertia::render('causas/Show', [
            'causa' => $this->formData($causa),
            'editing' => true,
            'estados' => CausaRequest::estados(),
            'clientes' => $this->clientes(),
        ]);
    }

    public function update(CausaRequest $request, Causa $causa): RedirectResponse
    {
        $this->persist($request, $causa);

        return to_route('causas.index')->with('success', 'Causa actualizada correctamente.');
    }

    public function destroy(Causa $causa): RedirectResponse
    {
        $causa->delete();

        return to_route('causas.index')->with('success', 'Causa eliminada correctamente.');
    }

    private function formData(Causa $causa): array
    {
        return array_merge($causa->toArray(), [
            'tipo_identificador' => $causa->tipo_identificador ?: str($causa->identificador)->before(' ')->toString(),
            'numero_identificador' => $causa->numero_identificador ?: str($causa->identificador)->after(' ')->toString(),
            'representado_ids' => $causa->representados->pluck('id')->values()->all(),
        ]);
    }

    private function clientes()
    {
        return Client::query()->orderBy('name')->get(['id', 'name']);
    }

    private function persist(CausaRequest $request, Causa $causa): Causa
    {
        $data = $request->validated();
        $clientIds = $data['representado_ids'];
        unset($data['representado_ids']);
        $data['intervinientes_representado'] = Client::whereKey($clientIds)
            ->orderBy('name')
            ->pluck('name')
            ->implode(', ');

        $causa->fill($data);
        $causa->save();
        $causa->representados()->sync($clientIds);

        return $causa;
    }
}