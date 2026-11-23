<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrganizationMember extends Model
{
    public $timestamps = false;

    /** @var list<string> */
    protected $fillable = ['organization_id', 'user_id', 'role', 'label', 'joined_at'];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return ['joined_at' => 'datetime'];
    }

    /** @return BelongsTo<Organization, $this> */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isOwner(): bool
    {
        return $this->role === 'owner';
    }

    public function isCoOwner(): bool
    {
        return $this->role === 'co_owner';
    }

    public function canManageMembers(): bool
    {
        return in_array($this->role, ['owner', 'co_owner']);
    }

    public function roleLabel(): string
    {
        return match ($this->role) {
            'owner' => 'Owner',
            'co_owner' => 'Co-owner',
            default => 'Member',
        };
    }
}
