import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Building2,
    Check,
    CheckCircle2,
    Clock,
    Mail,
    Pencil,
    Shield,
    Trash2,
    UserCheck,
    UserPlus,
    Users,
    X,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { formatDate } from '@/lib/finance';
import { dashboard } from '@/routes';
import { index as organizationsIndex, show as organizationShow } from '@/routes/organizations';
import { index as membersIndex } from '@/routes/organizations/members';
import { index as orgTransactionsIndex } from '@/routes/organizations/transactions';

type MemberItem = {
    id: number;
    user_id: number;
    name: string;
    username: string;
    email: string;
    role: 'owner' | 'co_owner' | 'member';
    role_label: string;
    label: string | null;
    joined_at: string;
};

type PendingRequest = {
    id: number;
    user_id: number;
    name: string;
    username: string;
    email: string;
    message: string | null;
    created_at: string;
};

export default function OrganizationMembersIndex({
    organization,
    members,
    pendingRequests,
    userRole,
    isManager,
    authUserId,
}: {
    organization: { id: number; name: string; slug: string; owner_id: number };
    members: MemberItem[];
    pendingRequests: PendingRequest[];
    userRole: 'owner' | 'co_owner' | 'member';
    isManager: boolean;
    authUserId: number;
}) {
    const [inviteOpen, setInviteOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<MemberItem | null>(null);

    const inviteForm = useForm({
        email: '',
        role: 'member' as 'co_owner' | 'member',
        label: '',
    });

    const editForm = useForm({
        role: 'member' as 'co_owner' | 'member',
        label: '',
    });

    function submitInvite(e: FormEvent) {
        e.preventDefault();
        inviteForm.post(`/organizations/${organization.slug}/invite`, {
            onSuccess: () => {
                setInviteOpen(false);
                inviteForm.reset();
            },
        });
    }

    function submitEdit(e: FormEvent) {
        e.preventDefault();
        if (!editingMember) return;
        editForm.put(`/organizations/${organization.slug}/members/${editingMember.id}`, {
            onSuccess: () => {
                setEditingMember(null);
                editForm.reset();
            },
        });
    }

    function handleRemoveMember(member: MemberItem) {
        if (confirm(`Remove @${member.username} (${member.name}) from ${organization.name}?`)) {
            router.delete(`/organizations/${organization.slug}/members/${member.id}`);
        }
    }

    function handleApprove(requestId: number) {
        router.post(`/organizations/${organization.slug}/requests/${requestId}/approve`);
    }

    function handleReject(requestId: number) {
        if (confirm('Reject this join request?')) {
            router.post(`/organizations/${organization.slug}/requests/${requestId}/reject`);
        }
    }

    return (
        <>
            <Head title={`${organization.name} - Members`} />
            <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
                {/* Org Header */}
                <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">{organization.name}</span>
                        </div>
                        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Team Members & Roles</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage collaborators, assign roles, and review membership requests.
                        </p>
                    </div>

                    {isManager && (
                        <button
                            type="button"
                            onClick={() => {
                                setInviteOpen(true);
                                inviteForm.clearErrors();
                            }}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                        >
                            <UserPlus size={16} />
                            Invite Member
                        </button>
                    )}
                </section>

                {/* Org Navigation Bar */}
                <nav className="flex items-center gap-2 border-b pb-3">
                    <Link
                        href={organizationShow(organization.slug)}
                        className="inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href={orgTransactionsIndex(organization.slug)}
                        className="inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    >
                        Transactions
                    </Link>
                    <Link
                        href={membersIndex(organization.slug)}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary"
                    >
                        <Users size={14} />
                        Members & Invites
                        {pendingRequests.length > 0 && (
                            <span className="flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                                {pendingRequests.length}
                            </span>
                        )}
                    </Link>
                </nav>

                {/* Pending Requests Section (Shown if any exist and user is Manager) */}
                {isManager && pendingRequests.length > 0 && (
                    <section className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 shadow-xs">
                        <div className="flex items-center gap-2">
                            <Clock size={18} className="text-amber-600 dark:text-amber-400" />
                            <h2 className="font-semibold text-amber-900 dark:text-amber-200">
                                Pending Join Requests ({pendingRequests.length})
                            </h2>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            These users entered your organization's code and are waiting for your approval.
                        </p>

                        <div className="mt-4 space-y-3">
                            {pendingRequests.map((req) => (
                                <div
                                    key={req.id}
                                    className="flex flex-col justify-between gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {req.name} <span className="text-muted-foreground">(@{req.username})</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground">{req.email}</p>
                                        {req.message && (
                                            <p className="mt-1 text-xs italic text-foreground/80">
                                                "{req.message}"
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleReject(req.id)}
                                            className="inline-flex h-8 items-center gap-1 rounded-lg border px-3 text-xs font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                        >
                                            <XCircle size={14} />
                                            Reject
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleApprove(req.id)}
                                            className="inline-flex h-8 items-center gap-1 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                                        >
                                            <CheckCircle2 size={14} />
                                            Approve
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Members List Table */}
                <section className="overflow-hidden rounded-2xl border bg-card shadow-xs">
                    <div className="border-b px-5 py-4">
                        <h2 className="font-semibold">Team Members</h2>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {members.length} {members.length === 1 ? 'member' : 'members'} total
                        </p>
                    </div>

                    <div className="divide-y">
                        {members.map((member) => {
                            const roleBadge =
                                member.role === 'owner'
                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                    : member.role === 'co_owner'
                                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                                      : 'bg-muted text-muted-foreground border-border';

                            return (
                                <div
                                    key={member.id}
                                    className="flex flex-col justify-between gap-3 px-5 py-4 sm:flex-row sm:items-center"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary uppercase">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="font-semibold text-foreground">{member.name}</p>
                                                <span className="text-xs text-muted-foreground">
                                                    (@{member.username})
                                                </span>
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize ${roleBadge}`}
                                                >
                                                    <Shield size={11} />
                                                    {member.role === 'co_owner' ? 'Co-owner' : member.role}
                                                </span>
                                                {member.label && (
                                                    <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                                                        {member.label}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-0.5 text-xs text-muted-foreground">{member.email}</p>
                                        </div>
                                    </div>

                                    {/* Actions for Managers */}
                                    {isManager && member.role !== 'owner' && (
                                        <div className="flex items-center gap-1.5 self-end sm:self-auto">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingMember(member);
                                                    editForm.setData({
                                                        role: member.role === 'owner' ? 'co_owner' : member.role,
                                                        label: member.label || '',
                                                    });
                                                }}
                                                className="inline-flex h-8 items-center gap-1 rounded-lg border px-2.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                                            >
                                                <Pencil size={12} />
                                                Edit
                                            </button>
                                            {member.user_id !== authUserId && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveMember(member)}
                                                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-destructive/20 p-2 text-xs font-medium text-destructive hover:bg-destructive/10"
                                                    title="Remove from organization"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Invite Modal */}
                {inviteOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
                        <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Invite Member by Email</h3>
                                <button
                                    type="button"
                                    onClick={() => setInviteOpen(false)}
                                    className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Add a team member or leader directly to <strong>{organization.name}</strong>.
                            </p>

                            <form onSubmit={submitInvite} className="mt-4 space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground">Email *</label>
                                    <input
                                        type="email"
                                        required
                                        value={inviteForm.data.email}
                                        onChange={(e) => inviteForm.setData('email', e.target.value)}
                                        placeholder="colleague@company.com"
                                        className="mt-1.5 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    />
                                    {inviteForm.errors.email && (
                                        <p className="mt-1 text-xs text-destructive">{inviteForm.errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground">Role</label>
                                    <select
                                        value={inviteForm.data.role}
                                        onChange={(e) =>
                                            inviteForm.setData('role', e.target.value as 'co_owner' | 'member')
                                        }
                                        className="mt-1.5 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        <option value="member">Member (can record transactions & view team stats)</option>
                                        <option value="co_owner">Co-owner (can manage members & settings)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground">
                                        Custom Label / Department (optional)
                                    </label>
                                    <input
                                        type="text"
                                        maxLength={60}
                                        value={inviteForm.data.label}
                                        onChange={(e) => inviteForm.setData('label', e.target.value)}
                                        placeholder="e.g. Finance Lead, Marketing, Operations..."
                                        className="mt-1.5 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setInviteOpen(false)}
                                        className="h-9 rounded-xl border px-4 text-sm font-medium hover:bg-muted"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={inviteForm.processing}
                                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50"
                                    >
                                        <Check size={16} />
                                        Send Invite
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Member Modal */}
                {editingMember && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
                        <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Edit Member: @{editingMember.username}</h3>
                                <button
                                    type="button"
                                    onClick={() => setEditingMember(null)}
                                    className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={submitEdit} className="mt-4 space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground">Role</label>
                                    <select
                                        value={editForm.data.role}
                                        onChange={(e) =>
                                            editForm.setData('role', e.target.value as 'co_owner' | 'member')
                                        }
                                        className="mt-1.5 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        <option value="member">Member</option>
                                        <option value="co_owner">Co-owner</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground">
                                        Custom Label
                                    </label>
                                    <input
                                        type="text"
                                        maxLength={60}
                                        value={editForm.data.label}
                                        onChange={(e) => editForm.setData('label', e.target.value)}
                                        placeholder="e.g. Finance Lead, Marketing..."
                                        className="mt-1.5 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditingMember(null)}
                                        className="h-9 rounded-xl border px-4 text-sm font-medium hover:bg-muted"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={editForm.processing}
                                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50"
                                    >
                                        <Check size={16} />
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
}

OrganizationMembersIndex.layout = {
    breadcrumbs: [
        { title: 'Personal Dashboard', href: dashboard() },
        { title: 'Organizations', href: organizationsIndex() },
    ],
};
