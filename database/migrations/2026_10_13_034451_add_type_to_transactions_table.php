<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->string('type', 7)->default('expense');
            $table->index(['user_id', 'type', 'date'], 'transactions_user_type_date_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::table('transactions')->where('type', 'income')->exists()) {
            throw new RuntimeException('Cannot roll back transaction types while income transactions exist.');
        }

        Schema::table('transactions', function (Blueprint $table) {
            $table->dropIndex('transactions_user_type_date_index');
            $table->dropColumn('type');
        });
    }
};
