<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $today = now()->toDateString();
        $monthStart = now()->startOfMonth()->toDateString();
        $monthEnd = now()->endOfMonth()->toDateString();

        $monthQuery = fn () => $user->transactions()->whereBetween('date', [$monthStart, $monthEnd]);

        return Inertia::render('dashboard', [
            'currency' => $user->currency,
            'dateFormat' => $user->date_format,
            'todayTotal' => $user->transactions()->whereDate('date', $today)->where('type', 'expense')->sum('amount'),
            'monthTotal' => $monthQuery()->where('type', 'expense')->sum('amount'),
            'monthCount' => $monthQuery()->count(),
            'monthIncome' => $monthQuery()->where('type', 'income')->sum('amount'),
            'monthExpense' => $monthQuery()->where('type', 'expense')->sum('amount'),
            'latestTransactions' => $user->transactions()
                ->with('category')
                ->orderByDesc('date')
                ->orderByDesc('id')
                ->limit(6)
                ->get(),
            'categorySpending' => Transaction::query()
                ->selectRaw('category_id, SUM(amount) as total')
                ->where('user_id', $user->id)
                ->whereBetween('date', [$monthStart, $monthEnd])
                ->with('category:id,name,color')
                ->groupBy('category_id')
                ->orderByDesc('total')
                ->limit(5)
                ->get(),
        ]);
    }
}
