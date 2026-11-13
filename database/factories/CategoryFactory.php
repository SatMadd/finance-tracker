<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Category>
 */
class CategoryFactory extends Factory
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
            'name' => fake()->unique()->word(),
            'type' => 'expense',
            'color' => fake()->hexColor(),
            'is_default' => false,
        ];
    }

    public function income(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'income',
        ]);
    }
}
