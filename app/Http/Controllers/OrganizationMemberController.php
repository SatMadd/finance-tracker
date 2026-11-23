<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\OrganizationMember;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrganizationMemberController extends Controller
{
    public function index(Request $request, Organization $organization): Response|RedirectResponse
    {
        if (! $organization->hasMember($request->user()->id)) {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'You do not have access to this organization.']);

            return to_route('organizations.index');
        }

        $isManager = $organization->isOwnerOrCoOwner($request->user()->id);
        $userRole = $organization->memberRole($request->user()->id);

        $members = $organization->members()
            ->with('user:id,name,username,email')
            ->get()
            ->map(fn ($m) => [
                'id' => $m->id,
                'user_id' => $m->user_id,
                'name' => $m->user->name,
                'username' => $m->user->username,
                'email' => $m->user->email,
                'role' => $m->role,
                'role_label' => $m->roleLabel(),
                'label' => $m->label,
                'joined_at' => $m->joined_at,
            ]);

        $pendingRequests = $isManager
            ? $organization->joinRequests()
                ->where('status', 'pending')
                ->with('user:id,name,username,email')
                ->get()
                ->map(fn ($r) => [
                    'id' => $r->id,
                    'user_id' => $r->user_id,
                    'name' => $r->user->name,
                    'username' => $r->user->username,
                    'email' => $r->user->email,
                    'message' => $r->message,
                    'created_at' => $r->created_at,
                ])
            : [];

        return Inertia::render('organizations/members', [
            'organization' => [
                'id' => $organization->id,
                'name' => $organization->name,
                'slug' => $organization->slug,
                'owner_id' => $organization->owner_id,
            ],
            'members' => $members,
            'pendingRequests' => $pendingRequests,
            'userRole' => $userRole,
            'isManager' => $isManager,
            'authUserId' => $request->user()->id,
        ]);
    }

    public function update(Request $request, Organization $organization, OrganizationMember $member): RedirectResponse
    {
        $this->authorize('manageMembers', $organization);

        abort_if($member->organization_id !== $organization->id, 404);
        abort_if($member->role === 'owner', 403, 'Cannot change owner role here.');

        $data = $request->validate([
            'role' => ['required', 'in:co_owner,member'],
            'label' => ['nullable', 'string', 'max:60'],
        ]);

        $member->update($data);
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Member updated.']);

        return back();
    }

    public function destroy(Request $request, Organization $organization, OrganizationMember $member): RedirectResponse
    {
        $this->authorize('manageMembers', $organization);

        abort_if($member->organization_id !== $organization->id, 404);
        abort_if($member->role === 'owner', 403, 'Cannot remove the owner.');
        abort_if($member->user_id === $request->user()->id, 403, 'Use the leave action to remove yourself.');

        $member->delete();
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Member removed.']);

        return back();
    }

    public function approveRequest(Request $request, Organization $organization, int $joinRequestId): RedirectResponse
    {
        $this->authorize('manageMembers', $organization);

        $joinRequest = $organization->joinRequests()->where('id', $joinRequestId)->where('status', 'pending')->firstOrFail();

        $organization->members()->create([
            'user_id' => $joinRequest->user_id,
            'role' => 'member',
        ]);

        $joinRequest->update([
            'status' => 'approved',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Request approved.']);

        return back();
    }

    public function rejectRequest(Request $request, Organization $organization, int $joinRequestId): RedirectResponse
    {
        $this->authorize('manageMembers', $organization);

        $joinRequest = $organization->joinRequests()->where('id', $joinRequestId)->where('status', 'pending')->firstOrFail();

        $joinRequest->update([
            'status' => 'rejected',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Request rejected.']);

        return back();
    }

    public function invite(Request $request, Organization $organization): RedirectResponse
    {
        $this->authorize('manageMembers', $organization);

        $data = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'role' => ['required', 'in:co_owner,member'],
            'label' => ['nullable', 'string', 'max:60'],
        ]);

        $existingUser = User::where('email', $data['email'])->first();

        if ($existingUser && $organization->hasMember($existingUser->id)) {
            return back()->withErrors(['email' => 'This user is already a member.']);
        }

        $organization->invites()->updateOrCreate(
            ['email' => $data['email'], 'accepted_at' => null],
            [
                'role' => $data['role'],
                'label' => $data['label'] ?? null,
                'invited_by' => $request->user()->id,
            ]
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => "Invite sent to {$data['email']}."]);

        return back();
    }
}
