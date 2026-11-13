import { Head } from '@inertiajs/react';
import TransactionForm, { type CategoryOption } from '@/components/transaction-form';

export default function CreateTransaction({ categories, currency }: { categories: CategoryOption[]; currency: string }) {
    return <><Head title="Add transaction" /><TransactionForm categories={categories} currency={currency} /></>;
}
