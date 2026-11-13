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

        return Inertia::render('dashboard', [
            'currency' => $user->currency,
            'dateFormat' => $user->date_format,
            'todayTotal' => $user->transactions()->whereDate('date', $today)->sum('amount'),
            'monthTotal' => $user->transactions()->whereBetween('date', [$monthStart, $today])->sum('amount'),
            'monthCount' => $user->transactions()->whereBetween('date', [$monthStart, $today])->count(),
            'latestTransactions' => $user->transactions()
                ->with('category')
                ->orderByDesc('date')
                ->orderByDesc('id')
                ->limit(6)
                ->get(),
            'categorySpending' => Transaction::query()
                ->selectRaw('category_id, SUM(amount) as total')
                ->where('user_id', $user->id)
                ->whereBetween('date', [$monthStart, $today])
                ->with('category:id,name,color')
                ->groupBy('category_id')
                ->orderByDesc('total')
                ->limit(5)
                ->get(),
        ]);
    }
}
