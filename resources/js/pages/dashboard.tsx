import { Head, Link } from '@inertiajs/react';
import { ArrowRight, CalendarDays, Plus, ReceiptText, Wallet } from 'lucide-react';
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
    latestTransactions,
    categorySpending,
}: {
    currency: string;
    dateFormat: string;
    todayTotal: number | string;
    monthTotal: number | string;
    monthCount: number;
    latestTransactions: TransactionRecord[];
    categorySpending: SpendingCategory[];
}) {
    const largestCategory = Math.max(...categorySpending.map((item) => Number(item.total)), 1);

    return (
        <>
            <Head title="Dashboard" />
            <main className="mx-auto max-w-7xl space-y-7 p-4 sm:p-6 lg:p-8">
                <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div><p className="text-sm font-medium text-muted-foreground">Your money, at a glance</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Dashboard</h1><p className="mt-2 text-sm text-muted-foreground">A clear view of what you’ve spent today and this month.</p></div>
                    <Link href={createTransaction()} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"><Plus size={17} />Add transaction</Link>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border bg-card p-5 shadow-xs"><div className="flex items-center justify-between text-sm text-muted-foreground"><span>Spent today</span><CalendarDays size={17} /></div><p className="mt-4 text-2xl font-semibold tracking-tight">{formatMoney(todayTotal, currency)}</p><p className="mt-1 text-xs text-muted-foreground">Today’s purchases</p></div>
                    <div className="rounded-2xl border bg-card p-5 shadow-xs"><div className="flex items-center justify-between text-sm text-muted-foreground"><span>This month</span><Wallet size={17} /></div><p className="mt-4 text-2xl font-semibold tracking-tight">{formatMoney(monthTotal, currency)}</p><p className="mt-1 text-xs text-muted-foreground">Month-to-date spending</p></div>
                    <div className="rounded-2xl border bg-card p-5 shadow-xs"><div className="flex items-center justify-between text-sm text-muted-foreground"><span>Transactions</span><ReceiptText size={17} /></div><p className="mt-4 text-2xl font-semibold tracking-tight">{monthCount}</p><p className="mt-1 text-xs text-muted-foreground">Purchases this month</p></div>
                    <Link href={transactionsIndex()} className="group flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 p-5 transition hover:bg-primary/10"><div><p className="text-sm font-medium">Review your spending</p><p className="mt-1 text-xs text-muted-foreground">Browse and filter your transactions</p></div><ArrowRight size={18} className="text-primary transition group-hover:translate-x-1" /></Link>
                </section>

                <section className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
                    <div className="rounded-2xl border bg-card shadow-xs"><div className="flex items-center justify-between border-b px-5 py-4"><div><h2 className="font-semibold">Recent transactions</h2><p className="mt-1 text-xs text-muted-foreground">Your latest recorded purchases</p></div><Link href={transactionsIndex()} className="text-sm font-medium text-primary hover:underline">View all</Link></div>
                        {latestTransactions.length ? <div className="divide-y">{latestTransactions.map((transaction) => <Link key={transaction.id} href={transactionShow(transaction.id)} className="flex items-center justify-between gap-3 px-5 py-4 transition hover:bg-muted/40"><div className="flex min-w-0 items-center gap-3"><span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: transaction.category?.color }} /><span className="min-w-0"><span className="block truncate text-sm font-medium">{transaction.description}</span><span className="mt-1 block text-xs text-muted-foreground">{transaction.category?.name} · {formatDate(transaction.date, dateFormat)}</span></span></div><span className="shrink-0 text-sm font-semibold">{formatMoney(transaction.amount, currency)}</span></Link>)}</div> : <div className="px-5 py-12 text-center"><ReceiptText size={24} className="mx-auto text-muted-foreground/60" /><p className="mt-3 text-sm font-medium">No transactions yet</p><p className="mt-1 text-sm text-muted-foreground">Add your first purchase to get started.</p><Link href={createTransaction()} className="mt-4 inline-flex text-sm font-medium text-primary hover:underline">Add a transaction</Link></div>}
                    </div>

                    <div className="rounded-2xl border bg-card shadow-xs"><div className="border-b px-5 py-4"><h2 className="font-semibold">Top categories</h2><p className="mt-1 text-xs text-muted-foreground">Where your money went this month</p></div>
                        {categorySpending.length ? <div className="space-y-5 p-5">{categorySpending.map((item) => <div key={item.category.id}><div className="mb-2 flex justify-between gap-3 text-sm"><span className="truncate font-medium">{item.category.name}</span><span className="shrink-0 text-muted-foreground">{formatMoney(item.total, currency)}</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full" style={{ width: `${Math.max(4, Number(item.total) / largestCategory * 100)}%`, backgroundColor: item.category.color }} /></div></div>)}</div> : <div className="px-5 py-12 text-center text-sm text-muted-foreground">Category spending will appear here after you add transactions.</div>}
                    </div>
                </section>
            </main>
        </>
    );
}

Dashboard.layout = { breadcrumbs: [{ title: 'Dashboard', href: dashboard() }] };
