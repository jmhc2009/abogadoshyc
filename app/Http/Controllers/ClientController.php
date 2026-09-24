<?php

namespace App\Http\Controllers;

use App\Http\Requests\ClientRequest;
use App\Models\Client;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;
use Inertia\ResponseFactory;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response|ResponseFactory
    {
        return Inertia::render('clients/Index', [
            'clients' => Client::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ClientRequest $request): RedirectResponse
    {
        Client::create($request->validated());

        return to_route('clients.index')->with('success', 'Cliente creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): Response|ResponseFactory
    {
        $client = Client::findOrFail($id);

        return Inertia::render('clients/Show', [
            'client' => $client,
        ]);
    }

    public function pdf(Client $client): HttpResponse
    {
        $pdf = Pdf::loadView('clients.ficha', [
            'client' => $client,
        ])->setPaper('a4')->setOption('defaultFont', 'DejaVu Sans');

        return $pdf->stream('ficha-cliente-'.$client->id.'.pdf');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ClientRequest $request, Client $client): RedirectResponse
    {
        $client->update($request->validated());

        return to_route('clients.index')->with('success', 'Cliente actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): RedirectResponse
    {
        $client = Client::findOrFail($id);
        $client->delete();

        return to_route('clients.index')->with('success', 'Cliente eliminado correctamente.');
    }
}
