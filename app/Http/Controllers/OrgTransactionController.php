<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Organization;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrgTransactionController extends Controller
{
    public function index(Request $request, Organization $organization): Response
    {
        $this->authorize('view', $organization);

        $isManager = $organization->isOwnerOrCoOwner($request->user()->id);

        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date'],
        ]);

        $query = $organization->transactions()
            ->with(['category', 'createdBy:id,name,username,email'])
            ->when($filters['search'] ?? null, fn ($q, $v) => $q->where('description', 'like', "%{$v}%"))
            ->when($filters['from'] ?? null, fn ($q, $v) => $q->whereDate('date', '>=', $v))
            ->when($filters['to'] ?? null, fn ($q, $v) => $q->whereDate('date', '<=', $v))
            ->orderByDesc('date')->orderByDesc('id');

        $categories = Category::query()
            ->where(fn ($q) => $q->where(fn ($sub) => $sub->whereNull('organization_id')->whereNull('user_id'))->orWhere('organization_id', $organization->id))
            ->orderBy('name')
            ->get(['id', 'name', 'color', 'type']);

        return Inertia::render('organizations/transactions', [
            'organization' => ['id' => $organization->id, 'name' => $organization->name, 'slug' => $organization->slug],
            'transactions' => $query->paginate(12)->withQueryString(),
            'categories' => $categories,
            'filters' => $filters,
            'isManager' => $isManager,
            'currency' => $request->user()->currency,
            'dateFormat' => $request->user()->date_format,
        ]);
    }

    public function create(Request $request, Organization $organization): Response
    {
        $this->authorize('view', $organization);

        $categories = Category::query()
            ->where(fn ($q) => $q->where(fn ($sub) => $sub->whereNull('organization_id')->whereNull('user_id'))->orWhere('organization_id', $organization->id))
            ->orderBy('name')
            ->get(['id', 'name', 'color', 'type']);

        return Inertia::render('organizations/transaction-create', [
            'organization' => ['id' => $organization->id, 'name' => $organization->name, 'slug' => $organization->slug],
            'categories' => $categories,
            'currency' => $request->user()->currency,
        ]);
    }

    public function store(Request $request, Organization $organization): RedirectResponse
    {
        $this->authorize('view', $organization);

        $data = $request->validate([
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'type' => ['required', 'in:income,expense'],
            'description' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'date' => ['required', 'date'],
            'payment_method' => ['nullable', 'string', 'max:40'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $organization->transactions()->create([
            ...$data,
            'created_by' => $request->user()->id,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Transaction added.']);

        return to_route('organizations.transactions.index', $organization->slug);
    }

    public function destroy(Request $request, Organization $organization, Transaction $transaction): RedirectResponse
    {
        $this->authorize('view', $organization);

        abort_if($transaction->organization_id !== $organization->id, 404);

        $isManager = $organization->isOwnerOrCoOwner($request->user()->id);
        abort_unless($isManager || $transaction->created_by === $request->user()->id, 403);

        $transaction->delete();
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Transaction deleted.']);

        return back();
    }
}
