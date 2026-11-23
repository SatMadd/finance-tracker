import { Head, Link, router } from '@inertiajs/react';
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Plus,
    Search,
    SlidersHorizontal,
    Trash2,
    User,
    Users,
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

type CreatedByUser = {
    id: number;
    name: string;
    username: string;
    email: string;
};

type OrgTransactionItem = {
    id: number;
    description: string;
    amount: string | number;
    date: string;
    payment_method: string;
    notes: string | null;
    type: 'income' | 'expense';
    category?: { id: number; name: string; color: string } | null;
    created_by?: CreatedByUser | null;
};

type TransactionPage = {
    data: OrgTransactionItem[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
    current_page: number;
    last_page: number;
};

type CategoryOption = { id: number; name: string; color: string };

type Filters = { search?: string; from?: string; to?: string };

export default function OrgTransactionsIndex({
    organization,
    transactions,
    categories: _categories,
    filters,
    isManager,
    currency,
    dateFormat,
}: {
    organization: { id: number; name: string; slug: string };
    transactions: TransactionPage;
    categories: CategoryOption[];
    filters: Filters;
    isManager: boolean;
    currency: string;
    dateFormat: string;
}) {
    const [values, setValues] = useState<Filters>({
        search: filters.search ?? '',
        from: filters.from ?? '',
        to: filters.to ?? '',
    });

    const [selectedTx, setSelectedTx] = useState<OrgTransactionItem | null>(
        null,
    );

    function submitFilters(e: FormEvent) {
        e.preventDefault();
        router.get(orgTransactionsIndex(organization.slug), values, {
            preserveState: true,
            replace: true,
        });
    }

    function handleDelete(tx: OrgTransactionItem) {
        if (confirm(`Delete transaction "${tx.description}"?`)) {
            router.delete(
                `/organizations/${organization.slug}/transactions/${tx.id}`,
            );
        }
    }

    return (
        <>
            <Head title={`${organization.name} - Transactions`} />
            <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
                {/* Org Header */}
                <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">
                                {organization.name}
                            </span>
                        </div>
                        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                            Team Transactions
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Browse, review, and record finances on behalf of the
                            company.
                        </p>
                    </div>

                    <Link
                        href={createOrgTransaction(organization.slug)}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                    >
                        <Plus size={16} />
                        Record Transaction
                    </Link>
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
                        className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary"
                    >
                        Transactions
                    </Link>
                    <Link
                        href={membersIndex(organization.slug)}
                        className="inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    >
                        <Users size={14} />
                        Members & Invites
                    </Link>
                </nav>

                {/* Filter Form */}
                <form
                    onSubmit={submitFilters}
                    className="grid gap-3 rounded-2xl border bg-card p-4 shadow-xs sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_auto] lg:items-end"
                >
                    <label className="text-xs font-medium text-muted-foreground">
                        Search
                        <input
                            type="text"
                            value={values.search}
                            onChange={(e) =>
                                setValues({ ...values, search: e.target.value })
                            }
                            placeholder="Description..."
                            className="mt-1.5 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </label>

                    <label className="text-xs font-medium text-muted-foreground">
                        From Date
                        <input
                            type="date"
                            value={values.from}
                            onChange={(e) =>
                                setValues({ ...values, from: e.target.value })
                            }
                            className="mt-1.5 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </label>

                    <label className="text-xs font-medium text-muted-foreground">
                        To Date
                        <input
                            type="date"
                            value={values.to}
                            onChange={(e) =>
                                setValues({ ...values, to: e.target.value })
                            }
                            className="mt-1.5 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </label>

                    <button
                        type="submit"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium transition hover:bg-muted"
                    >
                        <SlidersHorizontal size={15} />
                        Apply
                    </button>
                </form>

                {/* Transactions Table */}
                <section className="overflow-hidden rounded-2xl border bg-card shadow-xs">
                    <div className="flex items-center justify-between border-b px-5 py-4">
                        <div>
                            <h2 className="font-semibold">All Team Records</h2>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                                {transactions.total} records recorded
                            </p>
                        </div>
                        <CalendarDays
                            size={18}
                            className="text-muted-foreground"
                        />
                    </div>

                    {transactions.data.length > 0 ? (
                        <div className="divide-y">
                            {transactions.data.map((tx) => (
                                <div
                                    key={tx.id}
                                    onClick={() => setSelectedTx(tx)}
                                    className="flex cursor-pointer items-center justify-between gap-4 px-5 py-3.5 transition hover:bg-muted/40"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <span
                                            className="size-3 shrink-0 rounded-full"
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
                                                        dateFormat ||
                                                            'yyyy-MM-dd',
                                                    )}
                                                </span>
                                                <span>·</span>
                                                {/* Author label: Username mainly, email in detail */}
                                                <span className="inline-flex items-center gap-1 font-semibold text-primary">
                                                    @
                                                    {tx.created_by?.username ||
                                                        'member'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-3">
                                        <span
                                            className={`text-sm font-semibold ${
                                                tx.type === 'income'
                                                    ? 'text-emerald-600 dark:text-emerald-400'
                                                    : ''
                                            }`}
                                        >
                                            {tx.type === 'income' ? '+' : '-'}
                                            {formatMoney(
                                                tx.amount,
                                                currency || 'USD',
                                            )}
                                        </span>
                                        {isManager && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(tx);
                                                }}
                                                className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                title="Delete transaction"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="px-5 py-16 text-center text-sm text-muted-foreground">
                            <Search
                                size={24}
                                className="mx-auto text-muted-foreground/60"
                            />
                            <p className="mt-3 font-medium">
                                No transactions found
                            </p>
                            <p className="mt-1 text-xs">
                                Try adjusting your filters or record a new
                                transaction.
                            </p>
                        </div>
                    )}

                    {transactions.last_page > 1 && (
                        <nav
                            aria-label="Transaction pages"
                            className="flex items-center justify-between border-t px-5 py-3"
                        >
                            <span className="text-xs text-muted-foreground">
                                Page {transactions.current_page} of{' '}
                                {transactions.last_page}
                            </span>
                            <div className="flex gap-1">
                                {transactions.links
                                    .filter(
                                        (link) =>
                                            link.label.includes('Previous') ||
                                            link.label.includes('Next'),
                                    )
                                    .map((link) => (
                                        <Link
                                            key={link.label}
                                            href={
                                                link.url ??
                                                orgTransactionsIndex(
                                                    organization.slug,
                                                )
                                            }
                                            aria-disabled={!link.url}
                                            className={`inline-flex h-9 items-center gap-1 rounded-lg border px-3 text-sm transition hover:bg-muted ${
                                                !link.url
                                                    ? 'pointer-events-none opacity-40'
                                                    : ''
                                            }`}
                                        >
                                            {link.label.includes('Previous') ? (
                                                <>
                                                    <ChevronLeft size={15} />
                                                    Previous
                                                </>
                                            ) : (
                                                <>
                                                    Next
                                                    <ChevronRight size={15} />
                                                </>
                                            )}
                                        </Link>
                                    ))}
                            </div>
                        </nav>
                    )}
                </section>

                {/* Transaction Detail Modal (Shows email & full metadata) */}
                {selectedTx && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
                        <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl">
                            <div className="flex items-start justify-between">
                                <div>
                                    <span className="inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium tracking-wider text-secondary-foreground uppercase">
                                        {selectedTx.type}
                                    </span>
                                    <h3 className="mt-2 text-xl font-bold tracking-tight">
                                        {selectedTx.description}
                                    </h3>
                                </div>
                                <span className="text-xl font-bold">
                                    {formatMoney(selectedTx.amount, currency)}
                                </span>
                            </div>

                            <div className="mt-5 space-y-3 rounded-xl border bg-muted/40 p-4 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Category
                                    </span>
                                    <span className="font-medium">
                                        {selectedTx.category?.name ||
                                            'Uncategorized'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Date
                                    </span>
                                    <span className="font-medium">
                                        {formatDate(
                                            selectedTx.date,
                                            dateFormat,
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Payment Method
                                    </span>
                                    <span className="font-medium">
                                        {selectedTx.payment_method || 'Cash'}
                                    </span>
                                </div>

                                {/* Creator details: Username + Email as requested */}
                                <div className="border-t pt-2">
                                    <span className="text-muted-foreground">
                                        Recorded By:
                                    </span>
                                    <div className="mt-1 flex items-center gap-2 rounded-lg bg-background p-2">
                                        <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <User size={14} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground">
                                                {selectedTx.created_by?.name ||
                                                    'Member'}{' '}
                                                <span className="font-normal text-muted-foreground">
                                                    (@
                                                    {
                                                        selectedTx.created_by
                                                            ?.username
                                                    }
                                                    )
                                                </span>
                                            </p>
                                            <p className="text-[11px] text-muted-foreground">
                                                {selectedTx.created_by?.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {selectedTx.notes && (
                                    <div className="border-t pt-2">
                                        <span className="text-muted-foreground">
                                            Notes:
                                        </span>
                                        <p className="mt-1 text-foreground">
                                            {selectedTx.notes}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-5 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setSelectedTx(null)}
                                    className="h-9 rounded-xl border px-4 text-xs font-medium hover:bg-muted"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
}

OrgTransactionsIndex.layout = {
    breadcrumbs: [
        { title: 'Personal Dashboard', href: dashboard() },
        { title: 'Organizations', href: organizationsIndex() },
    ],
};
