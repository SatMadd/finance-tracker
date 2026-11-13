<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::dropIfExists('learning_topics');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('learning_topics', function (Blueprint $table): void {
            $table->id();
            $table->string('title');
            $table->date('study_date')->nullable();
            $table->string('status')->default('not_started');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }
};
