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

        DB::table('users')->update(['email' => DB::raw('LOWER(email)')]);
        DB::statement('DROP INDEX IF EXISTS users_email_unique');
        DB::statement('CREATE UNIQUE INDEX users_email_unique_nocase ON users (email COLLATE NOCASE)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS users_email_unique_nocase');
        DB::statement('CREATE UNIQUE INDEX users_email_unique ON users (email)');
    }
};
