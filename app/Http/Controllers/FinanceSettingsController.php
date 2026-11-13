<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateFinanceSettingsRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FinanceSettingsController extends Controller
{
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/finance', [
            'currency' => $request->user()->currency,
            'dateFormat' => $request->user()->date_format,
        ]);
    }

    public function update(UpdateFinanceSettingsRequest $request): RedirectResponse
    {
        $request->user()->update($request->validated());
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Preferences saved.']);

        return to_route('finance-settings.edit');
    }
}
