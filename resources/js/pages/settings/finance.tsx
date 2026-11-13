import { Head, useForm } from '@inertiajs/react';
import { Check, Globe2, Wallet } from 'lucide-react';
import type { FormEvent } from 'react';
import { update } from '@/actions/App/Http/Controllers/FinanceSettingsController';

export default function FinanceSettings({ currency, dateFormat }: { currency: string; dateFormat: string }) {
    const form = useForm({ currency, date_format: dateFormat });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.put(update.url());
    }

    return (
        <>
            <Head title="Settings" />
            <main className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6 lg:p-8">
                <section><p className="text-sm text-muted-foreground">Make the tracker feel familiar</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Settings</h1><p className="mt-2 text-sm text-muted-foreground">Choose how amounts and dates appear across your finance tracker.</p></section>
                <form onSubmit={submit} className="rounded-2xl border bg-card shadow-xs"><div className="space-y-6 p-5 sm:p-7"><div className="flex items-start gap-4"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Wallet size={19} /></span><div className="flex-1"><h2 className="font-semibold">Currency</h2><p className="mt-1 text-sm text-muted-foreground">Used for transaction amounts and spending summaries.</p><select value={form.data.currency} onChange={(event) => form.setData('currency', event.target.value)} className="mt-4 h-11 w-full max-w-sm rounded-xl border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"><option value="IDR">Indonesian Rupiah (IDR)</option><option value="USD">US Dollar (USD)</option><option value="SGD">Singapore Dollar (SGD)</option></select>{form.errors.currency && <span className="mt-1 block text-xs text-destructive">{form.errors.currency}</span>}</div></div><div className="flex items-start gap-4 border-t pt-6"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Globe2 size={19} /></span><div className="flex-1"><h2 className="font-semibold">Date format</h2><p className="mt-1 text-sm text-muted-foreground">Pick the date style that’s easiest for you to read.</p><select value={form.data.date_format} onChange={(event) => form.setData('date_format', event.target.value)} className="mt-4 h-11 w-full max-w-sm rounded-xl border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"><option value="d/m/Y">Day / month / year (06/10/2026)</option><option value="M j, Y">Month day, year (Oct 6, 2026)</option></select>{form.errors.date_format && <span className="mt-1 block text-xs text-destructive">{form.errors.date_format}</span>}</div></div></div><div className="flex justify-end border-t px-5 py-4 sm:px-7"><button disabled={form.processing} className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50"><Check size={16} />{form.processing ? 'Saving…' : 'Save preferences'}</button></div></form>
            </main>
        </>
    );
}
