<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StatisticsController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date', 'after_or_equal:from'],
        ]);
        $from = $filters['from'] ?? now()->startOfMonth()->toDateString();
        $to = $filters['to'] ?? now()->toDateString();
        $transactions = $request->user()->transactions()
            ->with('category:id,name,color')
            ->whereBetween('date', [$from, $to])
            ->orderBy('date')
            ->get();
        $byCategory = $transactions->groupBy('category_id')->map(fn ($items) => [
            'name' => $items->first()->category->name,
            'color' => $items->first()->category->color,
            'total' => $items->sum(fn ($item) => (float) $item->amount),
            'count' => $items->count(),
        ])->sortByDesc('total')->values();
        $byDate = $transactions->groupBy(fn ($item) => $item->date->toDateString())->map(fn ($items, $date) => [
            'date' => $date,
            'total' => $items->sum(fn ($item) => (float) $item->amount),
        ])->values();

        return Inertia::render('statistics/index', [
            'from' => $from,
            'to' => $to,
            'currency' => $request->user()->currency,
            'dateFormat' => $request->user()->date_format,
            'total' => $transactions->sum(fn ($item) => (float) $item->amount),
            'count' => $transactions->count(),
            'average' => $transactions->count() ? $transactions->avg(fn ($item) => (float) $item->amount) : 0,
            'byCategory' => $byCategory,
            'byDate' => $byDate,
        ]);
    }
}
