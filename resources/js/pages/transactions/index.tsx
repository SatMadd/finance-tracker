import { Head, Link, router } from '@inertiajs/react';
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import type { CategoryOption, TransactionRecord } from '@/components/transaction-form';
import { formatDate, formatMoney } from '@/lib/finance';
import { create as createTransaction, index as transactionsIndex, show as transactionShow } from '@/routes/transactions';

type TransactionPage = {
    data: TransactionRecord[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
    current_page: number;
    last_page: number;
};

type Filters = { search?: string; category?: string; from?: string; to?: string };

export default function TransactionHistory({
    transactions,
    categories,
    filters,
    currency,
    dateFormat,
}: {
    transactions: TransactionPage;
    categories: CategoryOption[];
    filters: Filters;
    currency: string;
    dateFormat: string;
}) {
    const [values, setValues] = useState<Filters>({ search: filters.search ?? '', category: filters.category ?? '', from: filters.from ?? '', to: filters.to ?? '' });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        router.get(transactionsIndex.url(), values, { preserveState: true, replace: true });
    }

    return (
        <>
            <Head title="Transaction history" />
            <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
                <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm text-muted-foreground">Every purchase, in one place</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Transaction history</h1><p className="mt-2 text-sm text-muted-foreground">Search and filter your spending records.</p></div><Link href={createTransaction()} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"><Plus size={17} />Add transaction</Link></section>

                <form onSubmit={submit} className="grid gap-3 rounded-2xl border bg-card p-4 shadow-xs sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto] lg:items-end">
                    <label className="text-xs font-medium text-muted-foreground">Search<input value={values.search} onChange={(event) => setValues({ ...values, search: event.target.value })} placeholder="Description…" className="mt-1.5 h-10 w-full rounded-lg border bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring" /></label>
                    <label className="text-xs font-medium text-muted-foreground">Category<select value={values.category} onChange={(event) => setValues({ ...values, category: event.target.value })} className="mt-1.5 h-10 w-full rounded-lg border bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"><option value="">All categories</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
                    <label className="text-xs font-medium text-muted-foreground">From<input type="date" value={values.from} onChange={(event) => setValues({ ...values, from: event.target.value })} className="mt-1.5 h-10 w-full rounded-lg border bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring" /></label>
                    <label className="text-xs font-medium text-muted-foreground">To<input type="date" value={values.to} onChange={(event) => setValues({ ...values, to: event.target.value })} className="mt-1.5 h-10 w-full rounded-lg border bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring" /></label>
                    <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium transition hover:bg-muted"><SlidersHorizontal size={15} />Apply</button>
                </form>

                <section className="overflow-hidden rounded-2xl border bg-card shadow-xs">
                    <div className="flex items-center justify-between border-b px-5 py-4"><div><h2 className="font-semibold">All transactions</h2><p className="mt-1 text-xs text-muted-foreground">{transactions.total} records</p></div><CalendarDays size={18} className="text-muted-foreground" /></div>
                    {transactions.data.length ? <div className="divide-y">{transactions.data.map((transaction) => <Link key={transaction.id} href={transactionShow(transaction.id)} className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-muted/40"><div className="flex min-w-0 items-center gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-xs font-semibold text-muted-foreground">{transaction.category?.name.slice(0, 1)}</span><span className="min-w-0"><span className="block truncate text-sm font-medium">{transaction.description}</span><span className="mt-1 block truncate text-xs text-muted-foreground">{transaction.category?.name} · {formatDate(transaction.date, dateFormat)} · {transaction.payment_method}</span></span></div><span className="shrink-0 text-sm font-semibold">{formatMoney(transaction.amount, currency)}</span></Link>)}</div> : <div className="px-5 py-16 text-center"><Search size={24} className="mx-auto text-muted-foreground/60" /><p className="mt-3 font-medium">No transactions match these filters</p><p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or date range.</p></div>}
                    {transactions.last_page > 1 && <nav aria-label="Transaction pages" className="flex items-center justify-between border-t px-5 py-3"><span className="text-xs text-muted-foreground">Page {transactions.current_page} of {transactions.last_page}</span><div className="flex gap-1">{transactions.links.filter((link) => link.label.includes('Previous') || link.label.includes('Next')).map((link) => <Link key={link.label} href={link.url ?? transactionsIndex()} aria-disabled={!link.url} className={`inline-flex h-9 items-center gap-1 rounded-lg border px-3 text-sm transition hover:bg-muted ${!link.url ? 'pointer-events-none opacity-40' : ''}`}>{link.label.includes('Previous') ? <><ChevronLeft size={15} />Previous</> : <>Next<ChevronRight size={15} /></>}</Link>)}</div></nav>}
                </section>
            </main>
        </>
    );
}
