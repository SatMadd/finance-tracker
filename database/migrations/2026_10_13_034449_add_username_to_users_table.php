<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username', 30)->nullable()->after('name');
        });

        DB::table('users')
            ->select(['id', 'name'])
            ->orderBy('id')
            ->chunkById(100, function ($users): void {
                foreach ($users as $user) {
                    $baseUsername = Str::lower(Str::ascii((string) $user->name));
                    $baseUsername = preg_replace('/[^a-z0-9_.-]+/', '-', $baseUsername) ?? '';
                    $baseUsername = trim($baseUsername, '._-');

                    if (strlen($baseUsername) < 3) {
                        $baseUsername = 'user-'.$user->id;
                    }

                    $baseUsername = substr($baseUsername, 0, 30);
                    $username = $baseUsername;
                    $suffix = 2;

                    while (DB::table('users')
                        ->whereNotNull('username')
                        ->whereRaw('username = ? COLLATE NOCASE', [$username])
                        ->exists()) {
                        $suffixText = '-'.$suffix;
                        $username = substr($baseUsername, 0, 30 - strlen($suffixText)).$suffixText;
                        $suffix++;
                    }

                    DB::table('users')->where('id', $user->id)->update(['username' => $username]);
                }
            });

        Schema::table('users', function (Blueprint $table) {
            $table->string('username', 30)->nullable(false)->change();
        });

        DB::statement('CREATE UNIQUE INDEX users_username_unique_nocase ON users (username COLLATE NOCASE)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS users_username_unique_nocase');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('username');
        });
    }
};
