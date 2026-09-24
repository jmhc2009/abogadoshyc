<?php

namespace App\Http\Controllers;

use App\Http\Requests\AbogadoRequest;
use App\Models\Abogado;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;
use Inertia\ResponseFactory;

class AbogadoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response|ResponseFactory
    {
        $search = request()->input('search');

        $abogados = Abogado::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nombres', 'like', "%{$search}%")
                      ->orwhere('apellidos', 'like', "%{$search}%")
                      ->orwhere('rut', 'like', "%{$search}%")
                      ->orwhere('email', 'like', "%{$search}%")
                      ->orwhere('especialidad', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withPath('abogados')
            ->through(fn ($abogado) => [
                'id' => $abogado->id,
                'name' => $abogado->full_name,
                'nombres' => $abogado->nombres,
                'apellidos' => $abogado->apellidos,
                'rut' => $abogado->rut,
                'rut_formatted' => $abogado->rut_formatted,
                'email' => $abogado->email,
                'phone' => $abogado->telefono,
                'especialidad' => $abogado->especialidad,
                'is_active' => $abogado->is_active,
                'created_at' => $abogado->created_at?->toDateTimeString(),
                'updated_at' => $abogado->updated_at?->toDateTimeString(),
            ]);

        return Inertia::render('abogados/Index', [
            'abogados' => $abogados,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AbogadoRequest $request): RedirectResponse
    {
        Abogado::create($request->validated());

        return to_route('abogados.index')->with('success', 'Abogado creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): Response|ResponseFactory
    {
        $abogado = Abogado::findOrFail($id);

        return Inertia::render('abogados/Show', [
            'abogado' => $abogado,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AbogadoRequest $request, Abogado $abogado): RedirectResponse
    {
        $abogado->update($request->validated());

        return to_route('abogados.index')->with('success', 'Abogado actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): RedirectResponse
    {
        $abogado = Abogado::findOrFail($id);
        $abogado->delete();

        return to_route('abogados.index')->with('success', 'Abogado eliminado correctamente.');
    }

    /**
     * Toggle the active state of the specified resource.
     */
    public function toggle(Abogado $abogado): RedirectResponse
    {
        $abogado->update(['is_active' => ! $abogado->is_active]);

        $message = $abogado->is_active
            ? 'Abogado activado correctamente.'
            : 'Abogado desactivado correctamente.';

        return back()->with('success', $message);
    }

    /**
     * Generate a PDF with the abogado technical sheet.
     */
    public function pdf(Abogado $abogado): HttpResponse
    {
        $pdf = Pdf::loadView('abogados.ficha', [
            'abogado' => $abogado,
        ])->setPaper('a4')->setOption('defaultFont', 'DejaVu Sans');

        return $pdf->stream('ficha-abogado-'.$abogado->id.'.pdf');
    }
}