<?php

namespace App\Concerns;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;

trait ProfileValidationRules
{
    /**
     * Get the validation rules used to validate user profiles.
     *
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function profileRules(?int $userId = null): array
    {
        return [
            'username' => $this->usernameRules($userId),
            'name' => $this->nameRules(),
            'email' => $this->emailRules($userId),
        ];
    }

    /**
     * Get the validation rules used to validate usernames.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function usernameRules(?int $userId = null): array
    {
        return [
            'required',
            'string',
            'min:3',
            'max:30',
            'regex:/\A[A-Za-z0-9_.-]+\z/',
            function (string $attribute, mixed $value, \Closure $fail) use ($userId): void {
                if (! is_string($value)) {
                    return;
                }

                $driver = DB::getDriverName();
                $query = User::query()
                    ->whereRaw($driver === 'sqlite' ? 'username = ? COLLATE NOCASE' : 'LOWER(username) = LOWER(?)', [$value]);

                if ($userId !== null) {
                    $query->whereKeyNot($userId);
                }

                if ($query->exists()) {
                    $fail('The username has already been taken.');
                }
            },
        ];
    }

    /**
     * Get the validation rules used to validate user names.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function nameRules(): array
    {
        return ['required', 'string', 'max:255'];
    }

    /**
     * Get the validation rules used to validate user emails.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function emailRules(?int $userId = null): array
    {
        return [
            'required',
            'string',
            'email',
            'max:255',
            function (string $attribute, mixed $value, \Closure $fail) use ($userId): void {
                if (! is_string($value)) {
                    return;
                }

                $query = User::query()
                    ->whereRaw('LOWER(email) = LOWER(?)', [$value]);

                if ($userId !== null) {
                    $query->whereKeyNot($userId);
                }

                if ($query->exists()) {
                    $fail('The email has already been taken.');
                }
            },
        ];
    }
}
