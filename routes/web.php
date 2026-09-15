<?php

use App\Http\Controllers\ClientController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('clients/{client}/pdf', [ClientController::class, 'pdf'])
        ->name('clients.pdf');
    Route::resource('clients', ClientController::class)->names('clients');
});

require __DIR__.'/settings.php';
