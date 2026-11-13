<?php

use App\Actions\EnsureDefaultCategoriesExist;
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
        Schema::table('categories', function (Blueprint $table) {
            $table->string('type', 7)->default('expense');
            $table->index(['user_id', 'type', 'name'], 'categories_user_type_name_index');
        });

        DB::statement('CREATE UNIQUE INDEX categories_owner_type_name_unique ON categories (COALESCE(user_id, 0), type, name COLLATE NOCASE)');

        app(EnsureDefaultCategoriesExist::class)->handle();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::table('transactions')
            ->whereIn('category_id', DB::table('categories')->select('id')->where('type', 'income'))
            ->exists()) {
            throw new RuntimeException('Cannot roll back category types while an income category is used by a transaction.');
        }

        if (DB::table('categories')
            ->where('type', 'income')
            ->where(function ($query): void {
                $query->whereNotNull('user_id')->orWhereNotIn('name', ['Salary', 'Business', 'Gift', 'Other income']);
            })
            ->exists()) {
            throw new RuntimeException('Cannot roll back category types while non-default income categories exist.');
        }

        DB::table('categories')
            ->whereNull('user_id')
            ->where('type', 'income')
            ->whereIn('name', ['Salary', 'Business', 'Gift', 'Other income'])
            ->delete();

        DB::statement('DROP INDEX IF EXISTS categories_owner_type_name_unique');

        Schema::table('categories', function (Blueprint $table) {
            $table->dropIndex('categories_user_type_name_index');
            $table->dropColumn('type');
        });
    }
};
