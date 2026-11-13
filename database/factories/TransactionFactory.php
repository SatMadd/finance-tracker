<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'category_id' => Category::factory()->state(['type' => 'expense']),
            'type' => 'expense',
            'description' => fake()->words(3, true),
            'amount' => fake()->randomFloat(2, 1000, 500000),
            'date' => fake()->date(),
            'payment_method' => fake()->randomElement(['Cash', 'Debit card', 'Credit card', 'Digital wallet', 'Bank transfer']),
            'notes' => fake()->optional()->sentence(),
        ];
    }

    public function income(): static
    {
        return $this->state(fn (array $attributes) => [
            'category_id' => Category::factory()->income(),
            'type' => 'income',
        ]);
    }
}
