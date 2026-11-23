<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\OrganizationMember;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class OrganizationController extends Controller
{
    public function index(Request $request): Response
    {
        $organizations = $request->user()
            ->organizations()
            ->withPivot(['role', 'label', 'joined_at'])
            ->withCount('members')
            ->get()
            ->map(fn ($org) => [
                'id' => $org->id,
                'name' => $org->name,
                'slug' => $org->slug,
                'description' => $org->description,
                'members_count' => $org->members_count,
                'role' => $org->pivot->role,
                'role_label' => match ($org->pivot->role) {
                    'owner' => 'Owner',
                    'co_owner' => 'Co-owner',
                    default => 'Member',
                },
                'label' => $org->pivot->label,
                'joined_at' => $org->pivot->joined_at,
            ]);

        return Inertia::render('organizations/index', [
            'organizations' => $organizations,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        $org = Organization::create([
            ...$data,
            'owner_id' => $request->user()->id,
        ]);

        OrganizationMember::create([
            'organization_id' => $org->id,
            'user_id' => $request->user()->id,
            'role' => 'owner',
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => "Organization \"{$org->name}\" created."]);

        return to_route('organizations.show', $org);
    }

    public function show(Request $request, Organization $organization): Response|RedirectResponse
    {
        if (! $organization->hasMember($request->user()->id)) {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'You do not have access to this organization.']);

            return to_route('organizations.index');
        }

        $userRole = $organization->memberRole($request->user()->id);
        $isManager = $organization->isOwnerOrCoOwner($request->user()->id);

        $today = now()->toDateString();
        $monthStart = now()->startOfMonth()->toDateString();

        $monthQuery = fn () => $organization->transactions()->whereBetween('date', [$monthStart, $today]);

        return Inertia::render('organizations/show', [
            'organization' => [
                'id' => $organization->id,
                'name' => $organization->name,
                'slug' => $organization->slug,
                'description' => $organization->description,
                'join_code' => $isManager ? $organization->join_code : null,
                'owner_id' => $organization->owner_id,
            ],
            'userRole' => $userRole,
            'isManager' => $isManager,
            'stats' => [
                'todayTotal' => $organization->transactions()->whereDate('date', $today)->where('type', 'expense')->sum('amount'),
                'monthTotal' => $monthQuery()->where('type', 'expense')->sum('amount'),
                'monthCount' => $monthQuery()->count(),
                'monthIncome' => $monthQuery()->where('type', 'income')->sum('amount'),
                'monthExpense' => $monthQuery()->where('type', 'expense')->sum('amount'),
            ],
            'latestTransactions' => $organization->transactions()
                ->with(['category', 'createdBy:id,name,username,email'])
                ->orderByDesc('date')->orderByDesc('id')
                ->limit(5)->get(),
            'pendingRequestsCount' => $isManager
                ? $organization->joinRequests()->where('status', 'pending')->count()
                : 0,
        ]);
    }

    public function update(Request $request, Organization $organization): RedirectResponse
    {
        $this->authorize('update', $organization);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        $organization->update($data);
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Organization updated.']);

        return back();
    }

    public function destroy(Request $request, Organization $organization): RedirectResponse
    {
        $this->authorize('delete', $organization);

        $organization->delete();
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Organization deleted.']);

        return to_route('organizations.index');
    }

    public function join(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'code' => ['required', 'string', 'size:8'],
            'message' => ['nullable', 'string', 'max:300'],
        ]);

        $org = Organization::where('join_code', $data['code'])->first();

        if (! $org) {
            return back()->withErrors(['code' => 'No organization found with that code.']);
        }

        $user = $request->user();

        if ($org->hasMember($user->id)) {
            return back()->withErrors(['code' => 'You are already a member of this organization.']);
        }

        $existing = $org->joinRequests()->where('user_id', $user->id)->first();

        if ($existing?->isPending()) {
            return back()->withErrors(['code' => 'You already have a pending request for this organization.']);
        }

        if ($existing) {
            $existing->update(['status' => 'pending', 'message' => $data['message'] ?? null, 'reviewed_by' => null, 'reviewed_at' => null]);
        } else {
            $org->joinRequests()->create([
                'user_id' => $user->id,
                'message' => $data['message'] ?? null,
            ]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => "Join request sent to \"{$org->name}\". Waiting for approval."]);

        return back();
    }

    public function regenerateCode(Request $request, Organization $organization): RedirectResponse
    {
        $this->authorize('update', $organization);

        do {
            $code = strtoupper(Str::random(8));
        } while (Organization::where('join_code', $code)->exists());

        $organization->update(['join_code' => $code]);
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Join code regenerated.']);

        return back();
    }

    public function transferOwnership(Request $request, Organization $organization): RedirectResponse
    {
        $this->authorize('transferOwnership', $organization);

        $data = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
        ]);

        $newOwner = $organization->members()->where('user_id', $data['user_id'])->first();

        if (! $newOwner) {
            return back()->withErrors(['user_id' => 'User is not a member of this organization.']);
        }

        $organization->members()->where('user_id', $request->user()->id)->update(['role' => 'co_owner']);
        $newOwner->update(['role' => 'owner']);
        $organization->update(['owner_id' => $data['user_id']]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Ownership transferred.']);

        return back();
    }

    public function leave(Request $request, Organization $organization): RedirectResponse
    {
        $user = $request->user();
        $role = $organization->memberRole($user->id);

        if ($role === 'owner') {
            return back()->withErrors(['leave' => 'Transfer ownership before leaving.']);
        }

        $organization->members()->where('user_id', $user->id)->delete();
        Inertia::flash('toast', ['type' => 'success', 'message' => "You left \"{$organization->name}\"."]);

        return to_route('organizations.index');
    }
}
