<?php

namespace App\Actions;

use App\Models\Category;

class EnsureDefaultCategoriesExist
{
    /**
     * @var array<int, array{name: string, type: string, color: string}>
     */
    private const CATEGORIES = [
        ['name' => 'Food & Dining', 'type' => 'expense', 'color' => '#e6a36f'],
        ['name' => 'Transportation', 'type' => 'expense', 'color' => '#6c9bb8'],
        ['name' => 'Shopping', 'type' => 'expense', 'color' => '#a78bbd'],
        ['name' => 'Bills & Utilities', 'type' => 'expense', 'color' => '#d17b75'],
        ['name' => 'Health', 'type' => 'expense', 'color' => '#7da58a'],
        ['name' => 'Entertainment', 'type' => 'expense', 'color' => '#d2a44e'],
        ['name' => 'Other', 'type' => 'expense', 'color' => '#8d9680'],
        ['name' => 'Salary', 'type' => 'income', 'color' => '#7da58a'],
        ['name' => 'Business', 'type' => 'income', 'color' => '#6c9bb8'],
        ['name' => 'Gift', 'type' => 'income', 'color' => '#d2a44e'],
        ['name' => 'Other income', 'type' => 'income', 'color' => '#8d9680'],
    ];

    public function handle(): void
    {
        foreach (self::CATEGORIES as $category) {
            Category::query()->firstOrCreate(
                [
                    'user_id' => null,
                    'type' => $category['type'],
                    'name' => $category['name'],
                ],
                [
                    'color' => $category['color'],
                    'is_default' => true,
                ],
            );
        }
    }
}
