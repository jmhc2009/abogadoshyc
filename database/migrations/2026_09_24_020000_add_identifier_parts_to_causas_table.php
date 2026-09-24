<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('causas', function (Blueprint $table) {
            $table->string('tipo_identificador', 3)->nullable()->after('identificador');
            $table->string('numero_identificador', 100)->nullable()->after('tipo_identificador');
        });
    }

    public function down(): void
    {
        Schema::table('causas', function (Blueprint $table) {
            $table->dropColumn(['tipo_identificador', 'numero_identificador']);
        });
    }
};