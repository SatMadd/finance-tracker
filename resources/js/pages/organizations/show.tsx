import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Building2,
    CalendarDays,
    Check,
    Copy,
    LogOut,
    Plus,
    ReceiptText,
    RefreshCw,
    Settings,
    Shield,
    Trash2,
    TrendingDown,
    TrendingUp,
    Users,
    Wallet,
    X,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { formatDate, formatMoney } from '@/lib/finance';
import { dashboard } from '@/routes';
import {
    index as organizationsIndex,
    show as organizationShow,
} from '@/routes/organizations';
import { index as membersIndex } from '@/routes/organizations/members';
import {
    create as createOrgTransaction,
    index as orgTransactionsIndex,
} from '@/routes/organizations/transactions';

type OrgData = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    join_code: string | null;
    owner_id: number;
};

type CreatedByUser = {
    id: number;
    name: string;
    username: string;
    email: string;
};

type OrgTransaction = {
    id: number;
    description: string;
    amount: string | number;
    date: string;
    type?: 'income' | 'expense';
    category?: { id: number; name: string; color: string } | null;
    created_by?: CreatedByUser | null;
};

export default function OrganizationShow({
    organization,
    userRole,
    isManager,
    stats,
    latestTransactions,
    pendingRequestsCount,
}: {
    organization: OrgData;
    userRole: 'owner' | 'co_owner' | 'member';
    isManager: boolean;
    stats: {
        todayTotal: number | string;
        monthTotal: number | string;
        monthCount: number;
        monthIncome?: number | string;
        monthExpense?: number | string;
    };
    latestTransactions: OrgTransaction[];
    pendingRequestsCount: number;
}) {
    const [copied, setCopied] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);

    const editForm = useForm({
        name: organization.name,
        description: organization.description ?? '',
    });

    function copyCode() {
        if (!organization.join_code) return;
        void navigator.clipboard.writeText(organization.join_code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function handleRegenerateCode() {
        if (
            confirm(
                'Regenerate join code? The previous code will stop working.',
            )
        ) {
            router.post(`/organizations/${organization.slug}/regenerate-code`);
        }
    }

    function handleUpdateOrg(e: FormEvent) {
        e.preventDefault();
        editForm.put(`/organizations/${organization.slug}`, {
            onSuccess: () => setSettingsOpen(false),
        });
    }

    function handleLeave() {
        if (
            confirm(
                `Leave "${organization.name}"? You will lose access to its workspace.`,
            )
        ) {
            router.post(`/organizations/${organization.slug}/leave`);
        }
    }

    function handleDeleteOrg() {
        if (
            confirm(
                `Are you sure you want to permanently delete "${organization.name}"? All transactions and member records will be removed.`,
            )
        ) {
            router.delete(`/organizations/${organization.slug}`);
        }
    }

    const roleBadge =
        userRole === 'owner'
            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
            : userRole === 'co_owner'
              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
              : 'bg-muted text-muted-foreground border-border';

    const orgIncome = Number(stats.monthIncome ?? 0);
    const orgExpense = Number(stats.monthExpense ?? stats.monthTotal ?? 0);
    const orgRemaining = orgIncome - orgExpense;
    const orgHasZeroIncome = orgIncome === 0;
    const orgIsOverBudget = orgHasZeroIncome
        ? orgExpense > 0
        : orgRemaining < 0;

    return (
        <>
            <Head title={`${organization.name} - Dashboard`} />
            <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
                {/* Org Header */}
                <section className="flex flex-col justify-between gap-4 rounded-2xl border bg-card p-6 shadow-xs sm:flex-row sm:items-center">
                    <div className="flex items-start gap-4">
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Building2 size={28} />
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight">
                                    {organization.name}
                                </h1>
                                <span
                                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${roleBadge}`}
                                >
                                    <Shield size={12} />
                                    {userRole === 'co_owner'
                                        ? 'Co-owner'
                                        : userRole}
                                </span>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {organization.description ||
                                    'Company Finance Workspace'}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {isManager && organization.join_code && (
                            <div className="flex items-center gap-1.5 rounded-xl border bg-muted/50 px-3 py-1.5">
                                <span className="text-xs text-muted-foreground">
                                    Code:
                                </span>
                                <code className="font-mono text-xs font-semibold tracking-wider text-foreground">
                                    {organization.join_code}
                                </code>
                                <button
                                    type="button"
                                    onClick={copyCode}
                                    title="Copy code"
                                    className="ml-1 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                                >
                                    {copied ? (
                                        <Check
                                            size={14}
                                            className="text-emerald-500"
                                        />
                                    ) : (
                                        <Copy size={14} />
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRegenerateCode}
                                    title="Regenerate code"
                                    className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                                >
                                    <RefreshCw size={13} />
                                </button>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => setSettingsOpen(true)}
                            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border bg-background px-3 text-xs font-medium transition hover:bg-muted"
                        >
                            <Settings size={15} />
                            Settings
                        </button>

                        <Link
                            href={createOrgTransaction(organization.slug)}
                            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-medium text-primary-foreground transition hover:bg-primary/90"
                        >
                            <Plus size={15} />
                            Add Transaction
                        </Link>
                    </div>
                </section>

                {/* Org Navigation Bar */}
                <nav className="flex items-center gap-2 border-b pb-3">
                    <Link
                        href={organizationShow(organization.slug)}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary"
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
                        className="inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    >
                        <Users size={14} />
                        Members & Invites
                        {pendingRequestsCount > 0 && (
                            <span className="flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                                {pendingRequestsCount}
                            </span>
                        )}
                    </Link>
                </nav>

                {/* Metrics */}
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Budget / Balance Card */}
                    <div
                        className={`rounded-2xl border p-5 shadow-xs transition ${
                            orgIsOverBudget
                                ? 'border-red-500/30 bg-red-500/10 text-red-600 dark:bg-red-950/20 dark:text-red-400'
                                : 'border-border bg-card text-foreground'
                        }`}
                    >
                        <div className="flex items-center justify-between text-sm">
                            <span
                                className={
                                    orgIsOverBudget
                                        ? 'font-semibold text-red-600 dark:text-red-400'
                                        : 'text-muted-foreground'
                                }
                            >
                                Budget Balance
                            </span>
                            {orgIsOverBudget ? (
                                <TrendingDown
                                    size={18}
                                    className="text-red-500"
                                />
                            ) : (
                                <Wallet
                                    size={18}
                                    className="text-muted-foreground"
                                />
                            )}
                        </div>
                        <p
                            className={`mt-4 text-2xl font-bold tracking-tight ${
                                orgIsOverBudget
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-foreground'
                            }`}
                        >
                            {orgHasZeroIncome
                                ? orgExpense > 0
                                    ? `-${formatMoney(orgExpense, 'USD')}`
                                    : formatMoney(0, 'USD')
                                : orgRemaining < 0
                                  ? `-${formatMoney(Math.abs(orgRemaining), 'USD')}`
                                  : formatMoney(orgRemaining, 'USD')}
                        </p>
                        <p
                            className={`mt-1.5 text-xs ${
                                orgIsOverBudget
                                    ? 'font-medium text-red-600/90 dark:text-red-400/90'
                                    : 'text-muted-foreground'
                            }`}
                        >
                            {orgHasZeroIncome
                                ? orgExpense > 0
                                    ? 'Over budget · 0 income recorded'
                                    : '0 income recorded'
                                : orgRemaining < 0
                                  ? `Over budget by ${formatMoney(Math.abs(orgRemaining), 'USD')}`
                                  : `Remaining of ${formatMoney(orgIncome, 'USD')} income`}
                        </p>
                    </div>

                    {/* Team Income */}
                    <div className="rounded-2xl border bg-card p-5 shadow-xs">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Team Income</span>
                            <TrendingUp
                                size={18}
                                className="text-emerald-500"
                            />
                        </div>
                        <p className="mt-4 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                            {formatMoney(orgIncome, 'USD')}
                        </p>
                        <p className="mt-1.5 text-xs text-muted-foreground">
                            Recorded team income
                        </p>
                    </div>

                    {/* Month Spending */}
                    <div className="rounded-2xl border bg-card p-5 shadow-xs">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Month Spending</span>
                            <Wallet size={18} />
                        </div>
                        <p className="mt-4 text-2xl font-bold tracking-tight">
                            {formatMoney(orgExpense, 'USD')}
                        </p>
                        <p className="mt-1.5 text-xs text-muted-foreground">
                            Cumulative team spend
                        </p>
                    </div>

                    {/* Today's Total */}
                    <div className="rounded-2xl border bg-card p-5 shadow-xs">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Today's Total</span>
                            <CalendarDays size={18} />
                        </div>
                        <p className="mt-4 text-2xl font-bold tracking-tight">
                            {formatMoney(stats.todayTotal, 'USD')}
                        </p>
                        <p className="mt-1.5 text-xs text-muted-foreground">
                            {stats.monthCount}{' '}
                            {stats.monthCount === 1
                                ? 'transaction'
                                : 'transactions'}{' '}
                            this month
                        </p>
                    </div>
                </section>

                {/* Latest Transactions */}
                <section className="overflow-hidden rounded-2xl border bg-card shadow-xs">
                    <div className="flex items-center justify-between border-b px-5 py-4">
                        <div>
                            <h2 className="font-semibold">
                                Recent Team Transactions
                            </h2>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                                Activity recorded across organization members
                            </p>
                        </div>
                        <Link
                            href={orgTransactionsIndex(organization.slug)}
                            className="text-xs font-medium text-primary hover:underline"
                        >
                            View all →
                        </Link>
                    </div>

                    {latestTransactions.length > 0 ? (
                        <div className="divide-y">
                            {latestTransactions.map((tx) => (
                                <div
                                    key={tx.id}
                                    className="flex items-center justify-between gap-4 px-5 py-3.5"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <span
                                            className="size-2.5 shrink-0 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    tx.category?.color ||
                                                    '#718096',
                                            }}
                                        />
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium">
                                                {tx.description}
                                            </p>
                                            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                <span>
                                                    {tx.category?.name ||
                                                        'Uncategorized'}
                                                </span>
                                                <span>·</span>
                                                <span>
                                                    {formatDate(
                                                        tx.date,
                                                        'yyyy-MM-dd',
                                                    )}
                                                </span>
                                                <span>·</span>
                                                <span className="inline-flex items-center gap-1 font-medium text-foreground/80">
                                                    by @
                                                    {tx.created_by?.username ||
                                                        'user'}
                                                    {tx.created_by?.email && (
                                                        <span className="text-muted-foreground">
                                                            (
                                                            {
                                                                tx.created_by
                                                                    .email
                                                            }
                                                            )
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <span
                                        className={`shrink-0 text-sm font-semibold ${
                                            tx.type === 'income'
                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                : 'text-foreground'
                                        }`}
                                    >
                                        {tx.type === 'income' ? '+' : '-'}
                                        {formatMoney(tx.amount, 'USD')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                            <ReceiptText
                                size={24}
                                className="mx-auto text-muted-foreground/60"
                            />
                            <p className="mt-2 font-medium">
                                No transactions recorded yet
                            </p>
                            <p className="mt-1 text-xs">
                                Members can record team expenses or income
                                anytime.
                            </p>
                            <Link
                                href={createOrgTransaction(organization.slug)}
                                className="mt-3 inline-flex text-xs font-medium text-primary hover:underline"
                            >
                                + Record first transaction
                            </Link>
                        </div>
                    )}
                </section>

                {/* Settings Modal */}
                {settingsOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
                        <div className="w-full max-w-lg rounded-2xl border bg-card p-6 shadow-xl">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">
                                    Organization Settings
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setSettingsOpen(false)}
                                    className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Edit Form for Managers */}
                            {isManager && (
                                <form
                                    onSubmit={handleUpdateOrg}
                                    className="mt-4 space-y-4 border-b pb-5"
                                >
                                    <div>
                                        <label className="block text-xs font-medium text-muted-foreground">
                                            Organization Name
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={editForm.data.name}
                                            onChange={(e) =>
                                                editForm.setData(
                                                    'name',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        />
                                        {editForm.errors.name && (
                                            <p className="mt-1 text-xs text-destructive">
                                                {editForm.errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-muted-foreground">
                                            Description
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={editForm.data.description}
                                            onChange={(e) =>
                                                editForm.setData(
                                                    'description',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1 w-full rounded-lg border bg-background p-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={editForm.processing}
                                        className="h-9 rounded-xl bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                                    >
                                        Save Changes
                                    </button>
                                </form>
                            )}

                            {/* Danger Zone */}
                            <div className="mt-4 space-y-3">
                                <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    Membership & Actions
                                </h4>

                                {userRole !== 'owner' ? (
                                    <div className="flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/5 p-3">
                                        <div>
                                            <p className="text-xs font-medium text-destructive">
                                                Leave Organization
                                            </p>
                                            <p className="text-[11px] text-muted-foreground">
                                                Remove yourself from this
                                                organization
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleLeave}
                                            className="inline-flex h-8 items-center gap-1 rounded-lg border border-destructive/30 px-3 text-xs font-medium text-destructive hover:bg-destructive/10"
                                        >
                                            <LogOut size={13} />
                                            Leave
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/5 p-3">
                                        <div>
                                            <p className="text-xs font-medium text-destructive">
                                                Delete Organization
                                            </p>
                                            <p className="text-[11px] text-muted-foreground">
                                                Permanently deletes all data and
                                                records
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleDeleteOrg}
                                            className="inline-flex h-8 items-center gap-1 rounded-lg bg-destructive px-3 text-xs font-medium text-destructive-foreground hover:bg-destructive/90"
                                        >
                                            <Trash2 size={13} />
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
}

OrganizationShow.layout = {
    breadcrumbs: [
        { title: 'Personal Dashboard', href: dashboard() },
        { title: 'Organizations', href: organizationsIndex() },
    ],
};
