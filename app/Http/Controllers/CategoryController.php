<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('categories/index', [
            'categories' => Category::query()
                ->where(fn ($query) => $query->whereNull('user_id')->orWhere('user_id', $user->id))
                ->withCount(['transactions' => fn ($query) => $query->where('user_id', $user->id)])
                ->orderByDesc('is_default')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        $request->user()->categories()->create($request->validated());
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Category created.']);

        return to_route('categories.index');
    }

    public function update(UpdateCategoryRequest $request, Category $category): RedirectResponse
    {
        $category->update($request->validated());
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Category updated.']);

        return to_route('categories.index');
    }

    public function destroy(Request $request, Category $category): RedirectResponse
    {
        abort_unless($category->user_id === $request->user()->id, 404);

        if ($category->transactions()->exists()) {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'Move or delete this category’s transactions before removing it.']);

            return to_route('categories.index');
        }

        $category->delete();
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Category deleted.']);

        return to_route('categories.index');
    }
}
