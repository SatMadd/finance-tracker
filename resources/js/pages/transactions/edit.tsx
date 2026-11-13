import { Head } from '@inertiajs/react';
import TransactionForm, { type CategoryOption, type TransactionRecord } from '@/components/transaction-form';

export default function EditTransaction({ categories, transaction, currency }: { categories: CategoryOption[]; transaction: TransactionRecord; currency: string }) {
    return <><Head title="Edit transaction" /><TransactionForm categories={categories} transaction={transaction} currency={currency} /></>;
}
