<?php

namespace App\Policies;

use App\Models\Organization;
use App\Models\User;

class OrganizationPolicy
{
    public function view(User $user, Organization $organization): bool
    {
        return $organization->hasMember($user->id);
    }

    public function update(User $user, Organization $organization): bool
    {
        return $organization->isOwnerOrCoOwner($user->id);
    }

    public function delete(User $user, Organization $organization): bool
    {
        return $organization->owner_id === $user->id || $organization->memberRole($user->id) === 'owner';
    }

    public function manageMembers(User $user, Organization $organization): bool
    {
        return $organization->isOwnerOrCoOwner($user->id);
    }

    public function transferOwnership(User $user, Organization $organization): bool
    {
        return $organization->owner_id === $user->id || $organization->memberRole($user->id) === 'owner';
    }
}
