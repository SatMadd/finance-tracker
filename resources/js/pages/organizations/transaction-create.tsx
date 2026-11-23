import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useMemo } from 'react';
import type { FormEvent } from 'react';
import { dashboard } from '@/routes';
import { index as organizationsIndex } from '@/routes/organizations';
import { index as orgTransactionsIndex } from '@/routes/organizations/transactions';

type CategoryOption = {
    id: number;
    name: string;
    color: string;
    type?: string;
};

const fieldClass =
    'mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50';

export default function OrgTransactionCreate({
    organization,
    categories,
    currency,
}: {
    organization: { id: number; name: string; slug: string };
    categories: CategoryOption[];
    currency: string;
}) {
    const form = useForm({
        type: 'expense' as 'expense' | 'income',
        description: '',
        amount: '',
        category_id: categories.length > 0 ? String(categories[0].id) : '',
        date: new Date().toISOString().split('T')[0],
        payment_method: 'Cash',
        notes: '',
    });

    const filteredCategories = useMemo(() => {
        return categories.filter((c) => !c.type || c.type === form.data.type);
    }, [categories, form.data.type]);

    function handleTypeChange(newType: 'expense' | 'income') {
        const nextCategories = categories.filter(
            (c) => !c.type || c.type === newType,
        );
        const currentCategoryValid = nextCategories.some(
            (c) => String(c.id) === form.data.category_id,
        );
        form.setData((prev) => ({
            ...prev,
            type: newType,
            category_id: currentCategoryValid
                ? prev.category_id
                : nextCategories[0]
                  ? String(nextCategories[0].id)
                  : '',
        }));
    }

    function submit(e: FormEvent) {
        e.preventDefault();
        form.post(`/organizations/${organization.slug}/transactions`);
    }

    return (
        <>
            <Head title={`Record Transaction - ${organization.name}`} />
            <div className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
                <Link
                    href={orgTransactionsIndex(organization.slug)}
                    className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                >
                    <ArrowLeft size={16} /> Back to transactions
                </Link>

                <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-8">
                    <div className="mb-7">
                        <p className="text-sm font-medium text-primary">
                            Transaction details
                        </p>
                        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                            Add a transaction
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Record{' '}
                            {form.data.type === 'income'
                                ? 'income'
                                : 'a purchase'}{' '}
                            for <strong>{organization.name}</strong> so team
                            finances stay up to date.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        {/* Transaction Type Toggle */}
                        <div>
                            <label className="text-sm font-medium">
                                Transaction type
                            </label>
                            <div className="mt-2 grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleTypeChange('expense')}
                                    className={`h-11 rounded-xl border text-sm font-medium transition ${
                                        form.data.type === 'expense'
                                            ? 'border-primary bg-primary/10 font-semibold text-primary'
                                            : 'bg-background text-muted-foreground hover:bg-muted'
                                    }`}
                                >
                                    Expense
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleTypeChange('income')}
                                    className={`h-11 rounded-xl border text-sm font-medium transition ${
                                        form.data.type === 'income'
                                            ? 'border-emerald-500 bg-emerald-500/10 font-semibold text-emerald-600 dark:text-emerald-400'
                                            : 'bg-background text-muted-foreground hover:bg-muted'
                                    }`}
                                >
                                    Income
                                </button>
                            </div>
                        </div>

                        {/* Fields Grid */}
                        <div className="grid gap-5 sm:grid-cols-2">
                            {/* Description */}
                            <label className="text-sm font-medium sm:col-span-2">
                                Description
                                <input
                                    required
                                    maxLength={255}
                                    className={fieldClass}
                                    placeholder={
                                        form.data.type === 'income'
                                            ? 'Example: Client payment, Monthly grant'
                                            : 'Example: Office supplies, Software license'
                                    }
                                    value={form.data.description}
                                    onChange={(e) =>
                                        form.setData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                />
                                {form.errors.description && (
                                    <span className="mt-1 block text-xs text-destructive">
                                        {form.errors.description}
                                    </span>
                                )}
                            </label>

                            {/* Amount */}
                            <label className="text-sm font-medium">
                                Amount ({currency})
                                <input
                                    inputMode="decimal"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    required
                                    className={fieldClass}
                                    placeholder="Example: 125000"
                                    value={form.data.amount}
                                    onChange={(e) =>
                                        form.setData('amount', e.target.value)
                                    }
                                />
                                {form.errors.amount && (
                                    <span className="mt-1 block text-xs text-destructive">
                                        {form.errors.amount}
                                    </span>
                                )}
                            </label>

                            {/* Category Dropdown */}
                            <label className="text-sm font-medium">
                                Category (
                                {form.data.type === 'income'
                                    ? 'Income'
                                    : 'Expense'}
                                )
                                <select
                                    className={fieldClass}
                                    value={form.data.category_id}
                                    onChange={(e) =>
                                        form.setData(
                                            'category_id',
                                            e.target.value,
                                        )
                                    }
                                >
                                    <option value="">Choose a category</option>
                                    {filteredCategories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.category_id && (
                                    <span className="mt-1 block text-xs text-destructive">
                                        {form.errors.category_id}
                                    </span>
                                )}
                            </label>

                            {/* Date */}
                            <label className="text-sm font-medium">
                                Date
                                <input
                                    type="date"
                                    required
                                    className={fieldClass}
                                    value={form.data.date}
                                    onChange={(e) =>
                                        form.setData('date', e.target.value)
                                    }
                                />
                                {form.errors.date && (
                                    <span className="mt-1 block text-xs text-destructive">
                                        {form.errors.date}
                                    </span>
                                )}
                            </label>

                            {/* Payment Method */}
                            <label className="text-sm font-medium">
                                Payment method
                                <select
                                    className={fieldClass}
                                    value={form.data.payment_method}
                                    onChange={(e) =>
                                        form.setData(
                                            'payment_method',
                                            e.target.value,
                                        )
                                    }
                                >
                                    {[
                                        'Cash',
                                        'Debit card',
                                        'Credit card',
                                        'Digital wallet',
                                        'Bank transfer',
                                        'Other',
                                    ].map((method) => (
                                        <option key={method}>{method}</option>
                                    ))}
                                </select>
                                {form.errors.payment_method && (
                                    <span className="mt-1 block text-xs text-destructive">
                                        {form.errors.payment_method}
                                    </span>
                                )}
                            </label>

                            {/* Notes */}
                            <label className="text-sm font-medium sm:col-span-2">
                                Notes{' '}
                                <span className="font-normal text-muted-foreground">
                                    (optional)
                                </span>
                                <textarea
                                    rows={4}
                                    maxLength={3000}
                                    className="mt-2 w-full resize-y rounded-xl border border-input bg-background px-3 py-2.5 text-sm shadow-xs transition outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                                    placeholder="Additional details or reference notes..."
                                    value={form.data.notes}
                                    onChange={(e) =>
                                        form.setData('notes', e.target.value)
                                    }
                                />
                                {form.errors.notes && (
                                    <span className="mt-1 block text-xs text-destructive">
                                        {form.errors.notes}
                                    </span>
                                )}
                            </label>
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex justify-end gap-3 border-t pt-5">
                            <Link
                                href={orgTransactionsIndex(organization.slug)}
                                className="inline-flex h-10 items-center rounded-xl border px-4 text-sm font-medium transition hover:bg-muted"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
                            >
                                <Save size={16} />
                                {form.processing
                                    ? 'Saving…'
                                    : 'Save transaction'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

OrgTransactionCreate.layout = {
    breadcrumbs: [
        { title: 'Personal Dashboard', href: dashboard() },
        { title: 'Organizations', href: organizationsIndex() },
    ],
};
