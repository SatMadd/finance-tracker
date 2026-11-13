import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import type { FormEvent } from 'react';
import { store, update } from '@/actions/App/Http/Controllers/TransactionController';
import { localDateInput } from '@/lib/finance';
import { index } from '@/routes/transactions';

export type CategoryOption = {
    id: number;
    name: string;
    color: string;
};

export type TransactionRecord = {
    id: number;
    category_id: number;
    description: string;
    amount: string;
    date: string;
    payment_method: string;
    notes: string | null;
    category?: CategoryOption;
};

type FormData = {
    description: string;
    amount: string;
    category_id: string;
    date: string;
    payment_method: string;
    notes: string;
};

const fieldClass = 'mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50';

export default function TransactionForm({
    categories,
    transaction,
    currency,
}: {
    categories: CategoryOption[];
    transaction?: TransactionRecord;
    currency: string;
}) {
    const form = useForm<FormData>({
        description: transaction?.description ?? '',
        amount: transaction?.amount ?? '',
        category_id: transaction ? String(transaction.category_id) : '',
        date: transaction?.date.slice(0, 10) ?? localDateInput(),
        payment_method: transaction?.payment_method ?? 'Cash',
        notes: transaction?.notes ?? '',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (transaction) {
            form.put(update(transaction.id).url);
            return;
        }

        form.post(store.url());
    }

    return (
        <div className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
            <Link href={index()} className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"><ArrowLeft size={16} /> Back to transactions</Link>
            <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-8">
                <div className="mb-7"><p className="text-sm font-medium text-primary">Expense details</p><h1 className="mt-1 text-2xl font-semibold tracking-tight">{transaction ? 'Edit transaction' : 'Add a transaction'}</h1><p className="mt-2 text-sm text-muted-foreground">Record a purchase so your daily spending stays up to date.</p></div>
                <form onSubmit={submit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <label className="text-sm font-medium sm:col-span-2">Description<input autoFocus maxLength={255} className={fieldClass} placeholder="Example: Groceries at the market" value={form.data.description} onChange={(event) => form.setData('description', event.target.value)} />{form.errors.description && <span className="mt-1 block text-xs text-destructive">{form.errors.description}</span>}</label>
                        <label className="text-sm font-medium">Amount ({currency})<input inputMode="decimal" type="number" min="0.01" step="0.01" className={fieldClass} placeholder="Example: 125000" value={form.data.amount} onChange={(event) => form.setData('amount', event.target.value)} />{form.errors.amount && <span className="mt-1 block text-xs text-destructive">{form.errors.amount}</span>}</label>
                        <label className="text-sm font-medium">Category<select className={fieldClass} value={form.data.category_id} onChange={(event) => form.setData('category_id', event.target.value)}><option value="">Choose a category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>{form.errors.category_id && <span className="mt-1 block text-xs text-destructive">{form.errors.category_id}</span>}</label>
                        <label className="text-sm font-medium">Date<input type="date" className={fieldClass} value={form.data.date} onChange={(event) => form.setData('date', event.target.value)} />{form.errors.date && <span className="mt-1 block text-xs text-destructive">{form.errors.date}</span>}</label>
                        <label className="text-sm font-medium">Payment method<select className={fieldClass} value={form.data.payment_method} onChange={(event) => form.setData('payment_method', event.target.value)}>{['Cash', 'Debit card', 'Credit card', 'Digital wallet', 'Bank transfer', 'Other'].map((method) => <option key={method}>{method}</option>)}</select>{form.errors.payment_method && <span className="mt-1 block text-xs text-destructive">{form.errors.payment_method}</span>}</label>
                        <label className="text-sm font-medium sm:col-span-2">Notes <span className="font-normal text-muted-foreground">(optional)</span><textarea rows={4} maxLength={3000} className="mt-2 w-full resize-y rounded-xl border border-input bg-background px-3 py-2.5 text-sm shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" placeholder="Example: Weekly groceries, including pantry staples." value={form.data.notes} onChange={(event) => form.setData('notes', event.target.value)} />{form.errors.notes && <span className="mt-1 block text-xs text-destructive">{form.errors.notes}</span>}</label>
                    </div>
                    <div className="flex justify-end gap-3 border-t pt-5"><Link href={index()} className="inline-flex h-10 items-center rounded-xl border px-4 text-sm font-medium transition hover:bg-muted">Cancel</Link><button disabled={form.processing} className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"><Save size={16} />{form.processing ? 'Saving…' : transaction ? 'Save changes' : 'Save transaction'}</button></div>
                </form>
            </div>
        </div>
    );
}
