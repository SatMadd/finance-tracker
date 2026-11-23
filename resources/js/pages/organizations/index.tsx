import { Head, Link, useForm } from '@inertiajs/react';
import { Building2, Check, KeyRound, Plus, Shield, Users, X } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { dashboard } from '@/routes';
import { index as organizationsIndex, join as joinOrganization, show as organizationShow, store as storeOrganization } from '@/routes/organizations';

export type OrganizationItem = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    members_count: number;
    role: 'owner' | 'co_owner' | 'member';
    role_label: string;
    label: string | null;
    joined_at: string;
};

export default function OrganizationsIndex({
    organizations,
}: {
    organizations: OrganizationItem[];
}) {
    const [createOpen, setCreateOpen] = useState(false);
    const [joinOpen, setJoinOpen] = useState(false);

    const createForm = useForm({
        name: '',
        description: '',
    });

    const joinForm = useForm({
        code: '',
        message: '',
    });

    function submitCreate(e: FormEvent) {
        e.preventDefault();
        createForm.post(storeOrganization.url(), {
            onSuccess: () => {
                setCreateOpen(false);
                createForm.reset();
            },
        });
    }

    function submitJoin(e: FormEvent) {
        e.preventDefault();
        joinForm.post(joinOrganization.url(), {
            onSuccess: () => {
                setJoinOpen(false);
                joinForm.reset();
            },
        });
    }

    return (
        <>
            <Head title="Organizations" />
            <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
                {/* Header & Taskbar */}
                <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Collaborative Finance</p>
                        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Organizations</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage and collaborate on multi-member company finances.
                        </p>
                    </div>

                    {/* Taskbar: 2 buttons as requested */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setJoinOpen(true);
                                joinForm.clearErrors();
                            }}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-input bg-background px-4 text-sm font-medium transition hover:bg-muted"
                        >
                            <KeyRound size={16} />
                            Join Organization
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setCreateOpen(true);
                                createForm.clearErrors();
                            }}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                        >
                            <Plus size={16} />
                            Create Organization
                        </button>
                    </div>
                </section>

                {/* Empty State when no organization */}
                {organizations.length === 0 ? (
                    <section className="flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-dashed bg-card/50 p-8 text-center shadow-xs">
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Building2 size={28} />
                        </div>
                        <h2 className="mt-4 text-xl font-semibold">No organization yet</h2>
                        <p className="mt-2 max-w-md text-sm text-muted-foreground">
                            You haven't joined or created any organization yet. Start your own company finance tracker or apply with an organization join code.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => setCreateOpen(true)}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90"
                            >
                                <Plus size={16} />
                                Create Organization
                            </button>
                            <button
                                type="button"
                                onClick={() => setJoinOpen(true)}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border bg-background px-5 text-sm font-medium transition hover:bg-muted"
                            >
                                <KeyRound size={16} />
                                Join Organization
                            </button>
                        </div>
                    </section>
                ) : (
                    /* Organization Cards Grid */
                    <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {organizations.map((org) => {
                            const roleColor =
                                org.role === 'owner'
                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                    : org.role === 'co_owner'
                                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                                      : 'bg-muted text-muted-foreground border-border';

                            return (
                                <div
                                    key={org.id}
                                    className="flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-xs transition hover:border-primary/40 hover:shadow-sm"
                                >
                                    <div>
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                <Building2 size={20} />
                                            </div>
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${roleColor}`}
                                            >
                                                <Shield size={12} />
                                                {org.role_label}
                                            </span>
                                        </div>

                                        <h3 className="mt-4 text-lg font-semibold tracking-tight">{org.name}</h3>
                                        {org.description ? (
                                            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                                {org.description}
                                            </p>
                                        ) : (
                                            <p className="mt-1 text-xs italic text-muted-foreground">No description</p>
                                        )}

                                        {org.label && (
                                            <div className="mt-3">
                                                <span className="inline-block rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
                                                    Label: {org.label}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 border-t pt-4">
                                        <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Users size={14} />
                                                {org.members_count} {org.members_count === 1 ? 'member' : 'members'}
                                            </span>
                                        </div>
                                        <Link
                                            href={organizationShow(org.slug)}
                                            className="inline-flex h-9 w-full items-center justify-center rounded-xl bg-secondary px-3 text-sm font-medium text-secondary-foreground transition hover:bg-secondary/80"
                                        >
                                            Open Workspace →
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </section>
                )}

                {/* Create Modal */}
                {createOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
                        <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Create Organization</h3>
                                <button
                                    type="button"
                                    onClick={() => setCreateOpen(false)}
                                    className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Create an organization for your company or team. You will be set as the Owner.
                            </p>

                            <form onSubmit={submitCreate} className="mt-4 space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground">
                                        Organization Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={100}
                                        value={createForm.data.name}
                                        onChange={(e) => createForm.setData('name', e.target.value)}
                                        placeholder="e.g. Acme Corp Finance"
                                        className="mt-1.5 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    />
                                    {createForm.errors.name && (
                                        <p className="mt-1 text-xs text-destructive">{createForm.errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground">
                                        Description (optional)
                                    </label>
                                    <textarea
                                        rows={3}
                                        maxLength={500}
                                        value={createForm.data.description}
                                        onChange={(e) => createForm.setData('description', e.target.value)}
                                        placeholder="Short description of this organization..."
                                        className="mt-1.5 w-full rounded-lg border bg-background p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    />
                                    {createForm.errors.description && (
                                        <p className="mt-1 text-xs text-destructive">{createForm.errors.description}</p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setCreateOpen(false)}
                                        className="h-9 rounded-xl border px-4 text-sm font-medium hover:bg-muted"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createForm.processing}
                                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50"
                                    >
                                        <Check size={16} />
                                        Create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Join Modal */}
                {joinOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
                        <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Join Organization</h3>
                                <button
                                    type="button"
                                    onClick={() => setJoinOpen(false)}
                                    className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Enter the 8-character join code provided by your organization owner or co-owner.
                            </p>

                            <form onSubmit={submitJoin} className="mt-4 space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground">
                                        Organization Code *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={8}
                                        value={joinForm.data.code}
                                        onChange={(e) => joinForm.setData('code', e.target.value)}
                                        placeholder="e.g. FIN-X7K2"
                                        className="mt-1.5 h-10 w-full rounded-lg border bg-background px-3 font-mono text-sm uppercase tracking-wider outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    />
                                    <p className="mt-1 text-[11px] text-muted-foreground">Codes are case-sensitive.</p>
                                    {joinForm.errors.code && (
                                        <p className="mt-1 text-xs text-destructive">{joinForm.errors.code}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground">
                                        Message to Leaders (optional)
                                    </label>
                                    <textarea
                                        rows={3}
                                        maxLength={300}
                                        value={joinForm.data.message}
                                        onChange={(e) => joinForm.setData('message', e.target.value)}
                                        placeholder="Hi, I am joining the marketing team..."
                                        className="mt-1.5 w-full rounded-lg border bg-background p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    />
                                    {joinForm.errors.message && (
                                        <p className="mt-1 text-xs text-destructive">{joinForm.errors.message}</p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setJoinOpen(false)}
                                        className="h-9 rounded-xl border px-4 text-sm font-medium hover:bg-muted"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={joinForm.processing}
                                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50"
                                    >
                                        <Check size={16} />
                                        Send Request
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

OrganizationsIndex.layout = {
    breadcrumbs: [
        { title: 'Personal Dashboard', href: dashboard() },
        { title: 'Organizations', href: organizationsIndex() },
    ],
};
