<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('causa_cliente', function (Blueprint $table) {
            $table->foreignId('causa_id')->constrained('causas')->cascadeOnDelete();
            $table->foreignId('client_id')->constrained('clients')->cascadeOnDelete();
            $table->primary(['causa_id', 'client_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('causa_cliente');
    }
};