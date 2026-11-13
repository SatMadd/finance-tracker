<?php

namespace App\Models;

use Database\Factories\TransactionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    /** @use HasFactory<TransactionFactory> */
    use HasFactory;

    /** @var list<string> */
    protected $fillable = ['user_id', 'category_id', 'type', 'description', 'amount', 'date', 'payment_method', 'notes'];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return ['amount' => 'decimal:2', 'date' => 'date'];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<Category, $this> */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
