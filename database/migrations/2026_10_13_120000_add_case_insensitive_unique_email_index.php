<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $duplicateEmails = DB::table('users')
            ->selectRaw('LOWER(email) as normalized_email')
            ->groupByRaw('LOWER(email)')
            ->havingRaw('COUNT(*) > 1')
            ->exists();

        if ($duplicateEmails) {
            throw new RuntimeException('Cannot create a case-insensitive email index while duplicate email addresses exist.');
        }

        DB::statement('CREATE UNIQUE INDEX users_email_lower_unique ON users (LOWER(email))');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS users_email_lower_unique');
    }
};
