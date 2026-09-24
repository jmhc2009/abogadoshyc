<?php

use App\Http\Controllers\AbogadoController;
use App\Http\Controllers\CausaController;
use App\Http\Controllers\AudienciaController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ServicioController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('clients/{client}/pdf', [ClientController::class, 'pdf'])
        ->name('clients.pdf');
    Route::resource('clients', ClientController::class)->names('clients');

    Route::get('abogados/{abogado}/pdf', [AbogadoController::class, 'pdf'])
        ->name('abogados.pdf');
    Route::resource('abogados', AbogadoController::class)->names('abogados');

    Route::resource('servicios', ServicioController::class)->names('servicios');
    Route::resource('causas', CausaController::class)->names('causas');
    Route::resource('audiencias', AudienciaController::class)->names('audiencias');
});

require __DIR__.'/settings.php';
