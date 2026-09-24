<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('causas', function (Blueprint $table) {
            $table->id();
            $table->string('identificador', 100);
            $table->string('caratula');
            $table->date('fecha_ingreso');
            $table->string('tribunal');
            $table->text('asunto')->nullable();
            $table->string('intervinientes_representado');
            $table->string('intervinientes_contraparte')->nullable();
            $table->string('estado', 100);
            $table->date('fecha_termino')->nullable();
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('causas');
    }
};