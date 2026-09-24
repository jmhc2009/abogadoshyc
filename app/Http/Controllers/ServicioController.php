<?php

namespace App\Http\Controllers;

use App\Http\Requests\ServicioRequest;
use App\Models\Servicio;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Inertia\ResponseFactory;

class ServicioController extends Controller
{
    public function index(): Response|ResponseFactory
    {
        $search = trim((string) request()->input('search', ''));

        $servicios = Servicio::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nombre', 'like', "%{$search}%")
                    ->orWhere('observaciones', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Servicio $servicio): array => [
                'id' => $servicio->id,
                'nombre' => $servicio->nombre,
                'valor' => (float) $servicio->valor,
                'valor_formatted' => number_format((float) $servicio->valor, 2, ',', '.'),
                'medio_pago' => $servicio->medio_pago,
                'cantidad_cuotas' => $servicio->cantidad_cuotas,
                'cuota_inicial' => $servicio->cuota_inicial ? (float) $servicio->cuota_inicial : null,
                'cuota_inicial_formatted' => $servicio->cuota_inicial
                    ? number_format((float) $servicio->cuota_inicial, 2, ',', '.')
                    : null,
                'observaciones' => $servicio->observaciones,
                'created_at' => $servicio->created_at?->toDateTimeString(),
                'updated_at' => $servicio->updated_at?->toDateTimeString(),
            ]);

        return Inertia::render('servicios/Index', [
            'servicios' => $servicios,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): RedirectResponse
    {
        return to_route('servicios.index');
    }

    public function store(ServicioRequest $request): RedirectResponse
    {
        Servicio::create($request->validated());

        return to_route('servicios.index')->with('success', 'Servicio creado correctamente.');
    }

    public function show(Servicio $servicio): Response|ResponseFactory
    {
        return Inertia::render('servicios/Show', ['servicio' => $servicio]);
    }

    public function edit(Servicio $servicio): Response|ResponseFactory
    {
        return Inertia::render('servicios/Show', [
            'servicio' => $servicio,
            'editing' => true,
        ]);
    }

    public function update(ServicioRequest $request, Servicio $servicio): RedirectResponse
    {
        $servicio->update($request->validated());

        return to_route('servicios.index')->with('success', 'Servicio actualizado correctamente.');
    }

    public function destroy(string $id): RedirectResponse
    {
        $servicio = Servicio::findOrFail($id);
        $servicio->delete();

        return to_route('servicios.index')->with('success', 'Servicio eliminado correctamente.');
    }
}
