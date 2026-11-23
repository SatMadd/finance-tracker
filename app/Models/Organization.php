<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Organization extends Model
{
    use HasFactory;

    /** @var list<string> */
    protected $fillable = ['name', 'slug', 'description', 'join_code', 'owner_id'];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    protected static function booted(): void
    {
        static::creating(function (Organization $org): void {
            if (empty($org->slug)) {
                $org->slug = Str::slug($org->name).'-'.Str::random(4);
            }
            if (empty($org->join_code)) {
                do {
                    $code = strtoupper(Str::random(8));
                } while (self::where('join_code', $code)->exists());
                $org->join_code = $code;
            }
        });
    }

    /** @return BelongsTo<User, $this> */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /** @return HasMany<OrganizationMember, $this> */
    public function members(): HasMany
    {
        return $this->hasMany(OrganizationMember::class);
    }

    /** @return HasMany<OrganizationInvite, $this> */
    public function invites(): HasMany
    {
        return $this->hasMany(OrganizationInvite::class);
    }

    /** @return HasMany<OrganizationJoinRequest, $this> */
    public function joinRequests(): HasMany
    {
        return $this->hasMany(OrganizationJoinRequest::class);
    }

    /** @return HasMany<Transaction, $this> */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    /** @return HasMany<Category, $this> */
    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }

    public function memberRole(int $userId): ?string
    {
        $role = $this->members()->where('user_id', $userId)->value('role');
        if (! $role && $this->owner_id === $userId) {
            return 'owner';
        }

        return $role;
    }

    public function hasMember(int $userId): bool
    {
        if ($this->owner_id === $userId) {
            return true;
        }

        return $this->members()->where('user_id', $userId)->exists();
    }

    public function isOwnerOrCoOwner(int $userId): bool
    {
        if ($this->owner_id === $userId) {
            return true;
        }

        return $this->members()
            ->where('user_id', $userId)
            ->whereIn('role', ['owner', 'co_owner'])
            ->exists();
    }
}
