import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Check } from 'lucide-react';
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

type TransactionData = {
    id: number;
    category_id: number;
    type: 'expense' | 'income';
    description: string;
    amount: number;
    date: string;
    payment_method: string;
    notes: string;
};

export default function OrgTransactionEdit({
    organization,
    transaction,
    categories,
    currency,
}: {
    organization: { id: number; name: string; slug: string };
    transaction: TransactionData;
    categories: CategoryOption[];
    currency: string;
}) {
    const form = useForm({
        type: transaction.type,
        description: transaction.description,
        amount: String(transaction.amount),
        category_id: String(transaction.category_id),
        date: transaction.date,
        payment_method: transaction.payment_method || 'Cash',
        notes: transaction.notes || '',
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
        form.put(
            `/organizations/${organization.slug}/transactions/${transaction.id}`,
        );
    }

    return (
        <>
            <Head title={`Edit Transaction - ${organization.name}`} />
            <main className="mx-auto max-w-2xl space-y-6 p-4 sm:p-6 lg:p-8">
                <div>
                    <Link
                        href={orgTransactionsIndex(organization.slug)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft size={14} />
                        Back to Team Transactions
                    </Link>
                    <h1 className="mt-2 text-2xl font-bold tracking-tight">
                        Edit Transaction
                    </h1>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Update transaction details for{' '}
                        <strong>{organization.name}</strong>. Only owners and
                        co-owners can edit transactions.
                    </p>
                </div>

                <form
                    onSubmit={submit}
                    className="space-y-5 rounded-2xl border bg-card p-6 shadow-xs"
                >
                    {/* Type Selector: Income / Expense */}
                    <div>
                        <label className="block text-xs font-medium text-muted-foreground">
                            Type
                        </label>
                        <div className="mt-1.5 grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => handleTypeChange('expense')}
                                className={`h-10 rounded-xl border text-sm font-medium transition ${
                                    form.data.type === 'expense'
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'bg-background text-muted-foreground hover:bg-muted'
                                }`}
                            >
                                Expense (Outcome)
                            </button>
                            <button
                                type="button"
                                onClick={() => handleTypeChange('income')}
                                className={`h-10 rounded-xl border text-sm font-medium transition ${
                                    form.data.type === 'income'
                                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                        : 'bg-background text-muted-foreground hover:bg-muted'
                                }`}
                            >
                                Income
                            </button>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-medium text-muted-foreground">
                            Description
                        </label>
                        <input
                            type="text"
                            required
                            maxLength={255}
                            value={form.data.description}
                            onChange={(e) =>
                                form.setData('description', e.target.value)
                            }
                            placeholder="e.g. Office supplies, Client payment..."
                            className="mt-1.5 h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                        {form.errors.description && (
                            <p className="mt-1 text-xs text-destructive">
                                {form.errors.description}
                            </p>
                        )}
                    </div>

                    {/* Amount & Date */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-xs font-medium text-muted-foreground">
                                Amount ({currency})
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                required
                                value={form.data.amount}
                                onChange={(e) =>
                                    form.setData('amount', e.target.value)
                                }
                                placeholder="0.00"
                                className="mt-1.5 h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                            {form.errors.amount && (
                                <p className="mt-1 text-xs text-destructive">
                                    {form.errors.amount}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-muted-foreground">
                                Date
                            </label>
                            <input
                                type="date"
                                required
                                value={form.data.date}
                                onChange={(e) =>
                                    form.setData('date', e.target.value)
                                }
                                className="mt-1.5 h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                            {form.errors.date && (
                                <p className="mt-1 text-xs text-destructive">
                                    {form.errors.date}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Category Selection */}
                    <div>
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-medium text-muted-foreground">
                                Category
                            </label>
                            <span className="text-[11px] text-muted-foreground">
                                Showing {form.data.type} categories
                            </span>
                        </div>
                        <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {filteredCategories.map((cat) => {
                                const selected =
                                    String(cat.id) === form.data.category_id;
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() =>
                                            form.setData(
                                                'category_id',
                                                String(cat.id),
                                            )
                                        }
                                        className={`flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs font-medium transition ${
                                            selected
                                                ? 'border-primary bg-primary/10 text-primary shadow-xs'
                                                : 'bg-background hover:bg-muted'
                                        }`}
                                    >
                                        <span
                                            className="size-3 shrink-0 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    cat.color || '#64748b',
                                            }}
                                        />
                                        <span className="truncate">
                                            {cat.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                        {form.errors.category_id && (
                            <p className="mt-1 text-xs text-destructive">
                                {form.errors.category_id}
                            </p>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div>
                        <label className="block text-xs font-medium text-muted-foreground">
                            Payment Method
                        </label>
                        <select
                            value={form.data.payment_method}
                            onChange={(e) =>
                                form.setData('payment_method', e.target.value)
                            }
                            className="mt-1.5 h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <option value="Cash">Cash</option>
                            <option value="Bank transfer">Bank transfer</option>
                            <option value="Credit card">Credit card</option>
                            <option value="Debit card">Debit card</option>
                            <option value="Digital wallet">
                                Digital wallet (QRIS/E-Wallet)
                            </option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-xs font-medium text-muted-foreground">
                            Notes / Reference (optional)
                        </label>
                        <textarea
                            rows={3}
                            maxLength={1000}
                            value={form.data.notes}
                            onChange={(e) =>
                                form.setData('notes', e.target.value)
                            }
                            placeholder="Add invoice number, receipt URL, or team context..."
                            className="mt-1.5 w-full rounded-xl border bg-background p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-3">
                        <Link
                            href={orgTransactionsIndex(organization.slug)}
                            className="h-10 rounded-xl border px-4 py-2 text-sm font-medium hover:bg-muted"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground disabled:opacity-50"
                        >
                            <Check size={16} />
                            Save Changes
                        </button>
                    </div>
                </form>
            </main>
        </>
    );
}

OrgTransactionEdit.layout = {
    breadcrumbs: [
        { title: 'Personal Dashboard', href: dashboard() },
        { title: 'Organizations', href: organizationsIndex() },
    ],
};
