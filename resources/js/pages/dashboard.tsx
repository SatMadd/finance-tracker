import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowRight,
    ArrowUpRight,
    CalendarDays,
    CheckCircle2,
    Plus,
    ReceiptText,
    TrendingDown,
    TrendingUp,
    Wallet,
} from 'lucide-react';
import { dashboard } from '@/routes';
import { create as createTransaction } from '@/routes/transactions';
import { index as transactionsIndex, show as transactionShow } from '@/routes/transactions';
import { formatDate, formatMoney } from '@/lib/finance';
import type { TransactionRecord } from '@/components/transaction-form';

type SpendingCategory = {
    category: { id: number; name: string; color: string };
    total: number | string;
};

export default function Dashboard({
    currency,
    dateFormat,
    todayTotal,
    monthTotal,
    monthCount,
    monthIncome = 0,
    monthExpense = 0,
    latestTransactions,
    categorySpending,
}: {
    currency: string;
    dateFormat: string;
    todayTotal: number | string;
    monthTotal: number | string;
    monthCount: number;
    monthIncome?: number | string;
    monthExpense?: number | string;
    latestTransactions: TransactionRecord[];
    categorySpending: SpendingCategory[];
}) {
    const largestCategory = Math.max(...categorySpending.map((item) => Number(item.total)), 1);

    const income = Number(monthIncome ?? 0);
    const expense = Number(monthExpense ?? monthTotal ?? 0);
    const remainingBudget = income - expense;
    const hasZeroIncome = income === 0;
    const isOverBudget = hasZeroIncome ? expense > 0 : remainingBudget < 0;

    return (
        <>
            <Head title="Dashboard" />
            <main className="mx-auto max-w-7xl space-y-7 p-4 sm:p-6 lg:p-8">
                <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Your money, at a glance</p>
                        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Dashboard</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            A clear view of your budget, income, and spending this month.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href={transactionsIndex()}
                            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border bg-background px-4 text-sm font-medium transition hover:bg-muted"
                        >
                            <ReceiptText size={16} />
                            Transactions
                        </Link>
                        <Link
                            href={createTransaction()}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                        >
                            <Plus size={17} />
                            Add transaction
                        </Link>
                    </div>
                </section>

                {/* Metrics Grid */}
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Budget / Balance Card */}
                    <div
                        className={`rounded-2xl border p-5 shadow-xs transition ${
                            isOverBudget
                                ? 'border-red-500/30 bg-red-500/10 dark:bg-red-950/20 text-red-600 dark:text-red-400'
                                : 'border-border bg-card text-foreground'
                        }`}
                    >
                        <div className="flex items-center justify-between text-sm">
                            <span className={isOverBudget ? 'font-semibold text-red-600 dark:text-red-400' : 'text-muted-foreground'}>
                                Budget Balance
                            </span>
                            {isOverBudget ? (
                                <TrendingDown size={18} className="text-red-500" />
                            ) : (
                                <Wallet size={18} className="text-muted-foreground" />
                            )}
                        </div>
                        <p
                            className={`mt-4 text-2xl font-bold tracking-tight ${
                                isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-foreground'
                            }`}
                        >
                            {hasZeroIncome
                                ? (expense > 0 ? `-${formatMoney(expense, currency)}` : formatMoney(0, currency))
                                : (remainingBudget < 0 ? `-${formatMoney(Math.abs(remainingBudget), currency)}` : formatMoney(remainingBudget, currency))}
                        </p>
                        <p
                            className={`mt-1.5 text-xs ${
                                isOverBudget
                                    ? 'font-medium text-red-600/90 dark:text-red-400/90'
                                    : 'text-muted-foreground'
                            }`}
                        >
                            {hasZeroIncome
                                ? (expense > 0 ? 'Over budget · 0 income recorded' : '0 income recorded')
                                : (remainingBudget < 0
                                    ? `Over budget by ${formatMoney(Math.abs(remainingBudget), currency)}`
                                    : `Remaining of ${formatMoney(income, currency)} income`)}
                        </p>
                    </div>

                    {/* Total Income */}
                    <div className="rounded-2xl border bg-card p-5 shadow-xs">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Total Income</span>
                            <TrendingUp size={18} className="text-emerald-500" />
                        </div>
                        <p className="mt-4 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                            {formatMoney(income, currency)}
                        </p>
                        <p className="mt-1.5 text-xs text-muted-foreground">Total earned this month</p>
                    </div>

                    {/* Total Spending */}
                    <div className="rounded-2xl border bg-card p-5 shadow-xs">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>This Month</span>
                            <Wallet size={18} />
                        </div>
                        <p className="mt-4 text-2xl font-bold tracking-tight">{formatMoney(expense, currency)}</p>
                        <p className="mt-1.5 text-xs text-muted-foreground">
                            {monthCount} {monthCount === 1 ? 'transaction' : 'transactions'} recorded
                        </p>
                    </div>

                    {/* Spent Today */}
                    <div className="rounded-2xl border bg-card p-5 shadow-xs">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Spent Today</span>
                            <CalendarDays size={18} />
                        </div>
                        <p className="mt-4 text-2xl font-bold tracking-tight">{formatMoney(todayTotal, currency)}</p>
                        <p className="mt-1.5 text-xs text-muted-foreground">Today's purchases</p>
                    </div>
                </section>

                <section className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
                    <div className="rounded-2xl border bg-card shadow-xs">
                        <div className="flex items-center justify-between border-b px-5 py-4">
                            <div>
                                <h2 className="font-semibold">Recent transactions</h2>
                                <p className="mt-1 text-xs text-muted-foreground">Your latest recorded activity</p>
                            </div>
                            <Link href={transactionsIndex()} className="text-sm font-medium text-primary hover:underline">
                                View all
                            </Link>
                        </div>
                        {latestTransactions.length ? (
                            <div className="divide-y">
                                {latestTransactions.map((transaction) => (
                                    <Link
                                        key={transaction.id}
                                        href={transactionShow(transaction.id)}
                                        className="flex items-center justify-between gap-3 px-5 py-4 transition hover:bg-muted/40"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span
                                                className="size-2.5 shrink-0 rounded-full"
                                                style={{ backgroundColor: transaction.category?.color || '#718096' }}
                                            />
                                            <div className="min-w-0">
                                                <span className="block truncate text-sm font-medium">
                                                    {transaction.description}
                                                </span>
                                                <span className="mt-1 block text-xs text-muted-foreground">
                                                    {transaction.category?.name} · {formatDate(transaction.date, dateFormat)}
                                                </span>
                                            </div>
                                        </div>
                                        <span
                                            className={`shrink-0 text-sm font-semibold ${
                                                transaction.type === 'income'
                                                    ? 'text-emerald-600 dark:text-emerald-400'
                                                    : 'text-foreground'
                                            }`}
                                        >
                                            {transaction.type === 'income' ? '+' : '-'}
                                            {formatMoney(transaction.amount, currency)}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="px-5 py-12 text-center">
                                <ReceiptText size={24} className="mx-auto text-muted-foreground/60" />
                                <p className="mt-3 text-sm font-medium">No transactions yet</p>
                                <p className="mt-1 text-sm text-muted-foreground">Add your first transaction to get started.</p>
                                <Link
                                    href={createTransaction()}
                                    className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
                                >
                                    Add a transaction
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="rounded-2xl border bg-card shadow-xs">
                        <div className="border-b px-5 py-4">
                            <h2 className="font-semibold">Top categories</h2>
                            <p className="mt-1 text-xs text-muted-foreground">Where your money went this month</p>
                        </div>
                        {categorySpending.length ? (
                            <div className="space-y-5 p-5">
                                {categorySpending.map((item) => (
                                    <div key={item.category.id}>
                                        <div className="mb-2 flex justify-between gap-3 text-sm">
                                            <span className="truncate font-medium">{item.category.name}</span>
                                            <span className="shrink-0 text-muted-foreground">
                                                {formatMoney(item.total, currency)}
                                            </span>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${Math.max(4, (Number(item.total) / largestCategory) * 100)}%`,
                                                    backgroundColor: item.category.color,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                                Category spending will appear here after you add transactions.
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
}

Dashboard.layout = { breadcrumbs: [{ title: 'Dashboard', href: dashboard() }] };
