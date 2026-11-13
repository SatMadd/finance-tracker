import { Head, router } from '@inertiajs/react';
import { ChartNoAxesCombined, ReceiptText, Wallet } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { formatDate, formatMoney } from '@/lib/finance';
import { index as statisticsIndex } from '@/routes/statistics';

type CategoryTotal = { name: string; color: string; total: number; count: number };
type DateTotal = { date: string; total: number };

export default function Statistics({
    from,
    to,
    currency,
    dateFormat,
    total,
    count,
    average,
    byCategory,
    byDate,
}: {
    from: string;
    to: string;
    currency: string;
    dateFormat: string;
    total: number;
    count: number;
    average: number;
    byCategory: CategoryTotal[];
    byDate: DateTotal[];
}) {
    const [range, setRange] = useState({ from, to });
    const maxCategory = Math.max(...byCategory.map((item) => item.total), 1);
    const maxDate = Math.max(...byDate.map((item) => item.total), 1);

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        router.get(statisticsIndex.url(), range, { preserveState: true, replace: true });
    }

    return (
        <>
            <Head title="Statistics" />
            <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
                <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm text-muted-foreground">Understand your spending patterns</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Statistics</h1></div>
                    <form onSubmit={submit} className="flex flex-wrap items-end gap-2 rounded-xl border bg-card p-3"><label className="text-[11px] font-medium text-muted-foreground">From<input type="date" value={range.from} onChange={(event) => setRange({ ...range, from: event.target.value })} className="mt-1 block h-9 rounded-lg border bg-background px-2 text-xs text-foreground" /></label><label className="text-[11px] font-medium text-muted-foreground">To<input type="date" value={range.to} onChange={(event) => setRange({ ...range, to: event.target.value })} className="mt-1 block h-9 rounded-lg border bg-background px-2 text-xs text-foreground" /></label><button className="h-9 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground">Update</button></form>
                </section>
                <section className="grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border bg-card p-5 shadow-xs"><div className="flex justify-between text-sm text-muted-foreground"><span>Total spending</span><Wallet size={17} /></div><p className="mt-4 text-2xl font-semibold">{formatMoney(total, currency)}</p><p className="mt-1 text-xs text-muted-foreground">Selected date range</p></div><div className="rounded-2xl border bg-card p-5 shadow-xs"><div className="flex justify-between text-sm text-muted-foreground"><span>Purchases</span><ReceiptText size={17} /></div><p className="mt-4 text-2xl font-semibold">{count}</p><p className="mt-1 text-xs text-muted-foreground">Transactions in range</p></div><div className="rounded-2xl border bg-card p-5 shadow-xs"><div className="flex justify-between text-sm text-muted-foreground"><span>Average purchase</span><ChartNoAxesCombined size={17} /></div><p className="mt-4 text-2xl font-semibold">{formatMoney(average, currency)}</p><p className="mt-1 text-xs text-muted-foreground">Per transaction</p></div></section>
                <section className="grid gap-5 xl:grid-cols-2"><div className="rounded-2xl border bg-card shadow-xs"><div className="border-b px-5 py-4"><h2 className="font-semibold">Spending by category</h2><p className="mt-1 text-xs text-muted-foreground">Category totals for {formatDate(from, dateFormat)} – {formatDate(to, dateFormat)}</p></div>{byCategory.length ? <div className="space-y-5 p-5">{byCategory.map((item) => <div key={item.name}><div className="mb-2 flex items-center justify-between gap-4 text-sm"><span className="flex min-w-0 items-center gap-2 font-medium"><span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />{item.name}<span className="text-xs font-normal text-muted-foreground">({item.count})</span></span><span className="shrink-0 text-muted-foreground">{formatMoney(item.total, currency)}</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full" style={{ width: `${Math.max(3, item.total / maxCategory * 100)}%`, backgroundColor: item.color }} /></div></div>)}</div> : <div className="px-5 py-14 text-center text-sm text-muted-foreground">No spending recorded in this date range.</div>}</div>
                    <div className="rounded-2xl border bg-card shadow-xs"><div className="border-b px-5 py-4"><h2 className="font-semibold">Daily spending</h2><p className="mt-1 text-xs text-muted-foreground">Days with purchases in the selected range</p></div>{byDate.length ? <div className="flex h-64 items-end gap-2 overflow-x-auto px-5 pb-5 pt-8">{byDate.map((item) => <div key={item.date} className="group flex h-full min-w-7 flex-1 flex-col items-center justify-end gap-2"><span className="hidden whitespace-nowrap text-[10px] text-muted-foreground group-hover:block">{formatMoney(item.total, currency)}</span><div className="w-full min-w-3 rounded-t-md bg-primary/75 transition hover:bg-primary" style={{ height: `${Math.max(5, item.total / maxDate * 100)}%` }} title={`${formatDate(item.date)} · ${formatMoney(item.total, currency)}`} /><span className="whitespace-nowrap text-[9px] text-muted-foreground">{new Date(`${item.date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></div>)}</div> : <div className="px-5 py-14 text-center text-sm text-muted-foreground">Add transactions to see daily spending.</div>}</div>
                </section>
            </main>
        </>
    );
}
