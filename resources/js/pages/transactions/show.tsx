import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, CalendarDays, CreditCard, Edit3, Tag, Trash2 } from 'lucide-react';
import type { TransactionRecord } from '@/components/transaction-form';
import { formatDate, formatMoney } from '@/lib/finance';
import { destroy, edit } from '@/actions/App/Http/Controllers/TransactionController';
import { index as transactionsIndex } from '@/routes/transactions';

export default function TransactionDetail({ transaction, currency, dateFormat }: { transaction: TransactionRecord; currency: string; dateFormat: string }) {
    function deleteTransaction() {
        if (window.confirm(`Delete “${transaction.description}”? This action cannot be undone.`)) {
            router.delete(destroy(transaction.id).url);
        }
    }

    return (
        <>
            <Head title={transaction.description} />
            <main className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
                <Link href={transactionsIndex()} className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"><ArrowLeft size={16} />Transaction history</Link>
                <section className="overflow-hidden rounded-2xl border bg-card shadow-xs">
                    <div className="border-b bg-muted/20 px-5 py-6 sm:px-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium"><span className="size-2 rounded-full" style={{ backgroundColor: transaction.category?.color }} />{transaction.category?.name}</span><h1 className="mt-4 text-2xl font-semibold tracking-tight">{transaction.description}</h1><p className="mt-2 text-sm text-muted-foreground">Purchase detail</p></div><div className="text-left sm:text-right"><p className="text-xs text-muted-foreground">Amount</p><p className="mt-1 text-2xl font-semibold tracking-tight">{formatMoney(transaction.amount, currency)}</p></div></div></div>
                    <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-8"><div className="flex items-start gap-3"><CalendarDays size={17} className="mt-0.5 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Date</p><p className="mt-1 text-sm font-medium">{formatDate(transaction.date, dateFormat)}</p></div></div><div className="flex items-start gap-3"><CreditCard size={17} className="mt-0.5 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Payment method</p><p className="mt-1 text-sm font-medium">{transaction.payment_method}</p></div></div><div className="flex items-start gap-3 sm:col-span-2"><Tag size={17} className="mt-0.5 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Category</p><p className="mt-1 text-sm font-medium">{transaction.category?.name}</p></div></div>{transaction.notes && <div className="border-t pt-5 sm:col-span-2"><p className="text-xs text-muted-foreground">Notes</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6">{transaction.notes}</p></div>}</div>
                    <div className="flex flex-col-reverse justify-between gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:px-8"><button onClick={deleteTransaction} className="inline-flex items-center justify-center gap-2 self-start text-sm font-medium text-destructive transition hover:underline"><Trash2 size={15} />Delete transaction</button><Link href={edit(transaction.id)} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"><Edit3 size={15} />Edit transaction</Link></div>
                </section>
            </main>
        </>
    );
}
