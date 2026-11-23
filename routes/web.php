<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FinanceSettingsController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\OrganizationMemberController;
use App\Http\Controllers\OrgTransactionController;
use App\Http\Controllers\StatisticsController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/dashboard')->name('home');

Route::middleware(['auth'])->group(function () {
    // Personal Finance Routes
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('transactions', TransactionController::class);
    Route::resource('categories', CategoryController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::get('statistics', [StatisticsController::class, 'index'])->name('statistics.index');
    Route::get('finance-settings', [FinanceSettingsController::class, 'edit'])->name('finance-settings.edit');
    Route::put('finance-settings', [FinanceSettingsController::class, 'update'])->name('finance-settings.update');

    // Organizations
    Route::get('organizations', [OrganizationController::class, 'index'])->name('organizations.index');
    Route::post('organizations', [OrganizationController::class, 'store'])->name('organizations.store');
    Route::post('organizations/join', [OrganizationController::class, 'join'])->name('organizations.join');

    Route::prefix('organizations/{organization}')->name('organizations.')->group(function () {
        Route::get('/', [OrganizationController::class, 'show'])->name('show');
        Route::put('/', [OrganizationController::class, 'update'])->name('update');
        Route::delete('/', [OrganizationController::class, 'destroy'])->name('destroy');
        Route::post('regenerate-code', [OrganizationController::class, 'regenerateCode'])->name('regenerate-code');
        Route::post('transfer-ownership', [OrganizationController::class, 'transferOwnership'])->name('transfer-ownership');
        Route::post('leave', [OrganizationController::class, 'leave'])->name('leave');
        Route::get('export', [OrganizationController::class, 'export'])->name('export');

        // Members & Requests & Invites
        Route::get('members', [OrganizationMemberController::class, 'index'])->name('members.index');
        Route::put('members/{member}', [OrganizationMemberController::class, 'update'])->name('members.update');
        Route::delete('members/{member}', [OrganizationMemberController::class, 'destroy'])->name('members.destroy');
        Route::post('requests/{joinRequestId}/approve', [OrganizationMemberController::class, 'approveRequest'])->name('requests.approve');
        Route::post('requests/{joinRequestId}/reject', [OrganizationMemberController::class, 'rejectRequest'])->name('requests.reject');
        Route::post('invite', [OrganizationMemberController::class, 'invite'])->name('invite');

        // Org Transactions
        Route::get('transactions', [OrgTransactionController::class, 'index'])->name('transactions.index');
        Route::get('transactions/create', [OrgTransactionController::class, 'create'])->name('transactions.create');
        Route::post('transactions', [OrgTransactionController::class, 'store'])->name('transactions.store');
        Route::get('transactions/{transaction}/edit', [OrgTransactionController::class, 'edit'])->name('transactions.edit');
        Route::put('transactions/{transaction}', [OrgTransactionController::class, 'update'])->name('transactions.update');
        Route::delete('transactions/{transaction}', [OrgTransactionController::class, 'destroy'])->name('transactions.destroy');
    });
});

require __DIR__.'/settings.php';
