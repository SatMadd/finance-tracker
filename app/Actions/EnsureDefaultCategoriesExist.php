<?php

namespace App\Actions;

use App\Models\Category;

class EnsureDefaultCategoriesExist
{
    /**
     * @var array<int, array{name: string, type: string, color: string}>
     */
    private const CATEGORIES = [
        // Expense categories
        ['name' => 'Food & Dining', 'type' => 'expense', 'color' => '#F97316'],
        ['name' => 'Transportation', 'type' => 'expense', 'color' => '#3B82F6'],
        ['name' => 'Shopping', 'type' => 'expense', 'color' => '#A855F7'],
        ['name' => 'Bills & Utilities', 'type' => 'expense', 'color' => '#EF4444'],
        ['name' => 'Health & Medical', 'type' => 'expense', 'color' => '#10B981'],
        ['name' => 'Entertainment', 'type' => 'expense', 'color' => '#EC4899'],
        ['name' => 'Education', 'type' => 'expense', 'color' => '#06B6D4'],
        ['name' => 'Housing & Rent', 'type' => 'expense', 'color' => '#8B5CF6'],
        ['name' => 'Travel', 'type' => 'expense', 'color' => '#F59E0B'],
        ['name' => 'Personal Care', 'type' => 'expense', 'color' => '#14B8A6'],
        ['name' => 'Subscriptions', 'type' => 'expense', 'color' => '#6366F1'],
        ['name' => 'Office & Business', 'type' => 'expense', 'color' => '#64748B'],
        ['name' => 'Other Expense', 'type' => 'expense', 'color' => '#9CA3AF'],
        // Income categories
        ['name' => 'Salary & Wages', 'type' => 'income', 'color' => '#10B981'],
        ['name' => 'Freelance / Contract', 'type' => 'income', 'color' => '#059669'],
        ['name' => 'Business Revenue', 'type' => 'income', 'color' => '#16A34A'],
        ['name' => 'Investments & Dividends', 'type' => 'income', 'color' => '#2563EB'],
        ['name' => 'Rental Income', 'type' => 'income', 'color' => '#7C3AED'],
        ['name' => 'Bonuses & Commissions', 'type' => 'income', 'color' => '#F59E0B'],
        ['name' => 'Gifts & Grants', 'type' => 'income', 'color' => '#EC4899'],
        ['name' => 'Government / Benefits', 'type' => 'income', 'color' => '#0EA5E9'],
        ['name' => 'Side Projects', 'type' => 'income', 'color' => '#8B5CF6'],
        ['name' => 'Other Income', 'type' => 'income', 'color' => '#9CA3AF'],
    ];

    public function handle(): void
    {
        foreach (self::CATEGORIES as $category) {
            $existing = Category::query()
                ->whereNull('user_id')
                ->where('type', $category['type'])
                ->whereRaw('LOWER(name) = ?', [strtolower($category['name'])])
                ->first();

            if ($existing) {
                $existing->update([
                    'name' => $category['name'],
                    'color' => $category['color'],
                    'is_default' => true,
                ]);
            } else {
                Category::query()->create([
                    'user_id' => null,
                    'type' => $category['type'],
                    'name' => $category['name'],
                    'color' => $category['color'],
                    'is_default' => true,
                ]);
            }
        }
    }
}
