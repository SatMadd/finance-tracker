<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'category' => ['nullable', 'integer'],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date'],
        ]);

        $transactions = $request->user()->transactions()
            ->with('category')
            ->when($filters['search'] ?? null, fn ($query, string $search) => $query->where('description', 'like', "%{$search}%"))
            ->when($filters['category'] ?? null, fn ($query, int $category) => $query->where('category_id', $category))
            ->when($filters['from'] ?? null, fn ($query, string $from) => $query->whereDate('date', '>=', $from))
            ->when($filters['to'] ?? null, fn ($query, string $to) => $query->whereDate('date', '<=', $to))
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('transactions/index', [
            'transactions' => $transactions,
            'categories' => Category::query()
                ->where(fn ($query) => $query->whereNull('user_id')->orWhere('user_id', $request->user()->id))
                ->orderBy('name')
                ->get(['id', 'name', 'color']),
            'filters' => $filters,
            'currency' => $request->user()->currency,
            'dateFormat' => $request->user()->date_format,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('transactions/create', [
            'categories' => $this->categoriesFor($request),
            'currency' => $request->user()->currency,
        ]);
    }

    public function store(StoreTransactionRequest $request): RedirectResponse
    {
        $transaction = $request->user()->transactions()->create($request->validated());
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Transaction added.']);

        return to_route('transactions.show', $transaction);
    }

    public function show(Request $request, Transaction $transaction): Response
    {
        abort_unless($transaction->user_id === $request->user()->id, 404);
        $transaction->load('category');

        return Inertia::render('transactions/show', [
            'transaction' => $transaction,
            'currency' => $request->user()->currency,
            'dateFormat' => $request->user()->date_format,
        ]);
    }

    public function edit(Request $request, Transaction $transaction): Response
    {
        abort_unless($transaction->user_id === $request->user()->id, 404);

        return Inertia::render('transactions/edit', [
            'transaction' => $transaction,
            'categories' => $this->categoriesFor($request),
            'currency' => $request->user()->currency,
        ]);
    }

    public function update(UpdateTransactionRequest $request, Transaction $transaction): RedirectResponse
    {
        abort_unless($transaction->user_id === $request->user()->id, 404);
        $transaction->update($request->validated());
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Transaction updated.']);

        return to_route('transactions.show', $transaction);
    }

    public function destroy(Request $request, Transaction $transaction): RedirectResponse
    {
        abort_unless($transaction->user_id === $request->user()->id, 404);
        $transaction->delete();
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Transaction deleted.']);

        return to_route('transactions.index');
    }

    /** @return Collection<int, Category> */
    private function categoriesFor(Request $request): Collection
    {
        return Category::query()
            ->where(fn ($query) => $query->whereNull('user_id')->orWhere('user_id', $request->user()->id))
            ->orderBy('name')
            ->get(['id', 'name', 'color']);
    }
}
