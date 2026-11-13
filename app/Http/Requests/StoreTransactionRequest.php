<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'description' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'gt:0', 'max:9999999999.99'],
            'category_id' => [
                'required',
                Rule::exists('categories', 'id')->where(fn (Builder $query) => $query->whereNull('user_id')->orWhere('user_id', $this->user()->id)),
            ],
            'date' => ['required', 'date'],
            'payment_method' => ['required', 'string', 'max:40', Rule::in(['Cash', 'Debit card', 'Credit card', 'Digital wallet', 'Bank transfer', 'Other'])],
            'notes' => ['nullable', 'string', 'max:3000'],
        ];
    }
}
