<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FinanceSettingsController;
use App\Http\Controllers\StatisticsController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/dashboard')->name('home');
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('transactions', TransactionController::class);
    Route::resource('categories', CategoryController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::get('statistics', [StatisticsController::class, 'index'])->name('statistics.index');
    Route::get('finance-settings', [FinanceSettingsController::class, 'edit'])->name('finance-settings.edit');
    Route::put('finance-settings', [FinanceSettingsController::class, 'update'])->name('finance-settings.update');
});

require __DIR__.'/settings.php';
