import { Head, router, useForm } from '@inertiajs/react';
import { Check, FolderOpen, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { destroy, store, update } from '@/actions/App/Http/Controllers/CategoryController';

type Category = { id: number; name: string; color: string; is_default: boolean; transactions_count: number };
type CategoryForm = { name: string; color: string };

export default function CategoriesIndex({ categories }: { categories: Category[] }) {
    const [editing, setEditing] = useState<Category | null>(null);
    const form = useForm<CategoryForm>({ name: '', color: '#718096' });

    function reset() {
        setEditing(null);
        form.setData({ name: '', color: '#718096' });
        form.clearErrors();
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (editing) {
            form.put(update(editing.id).url, { onSuccess: reset });
        } else {
            form.post(store.url(), { onSuccess: reset });
        }
    }

    function remove(category: Category) {
        if (window.confirm(`Delete the “${category.name}” category?`)) {
            router.delete(destroy(category.id).url);
        }
    }

    return (
        <>
            <Head title="Categories" />
            <main className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
                <section><p className="text-sm text-muted-foreground">Organize purchases your way</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Categories</h1><p className="mt-2 text-sm text-muted-foreground">Use categories to see where your spending goes.</p></section>
                <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="overflow-hidden rounded-2xl border bg-card shadow-xs"><div className="border-b px-5 py-4"><h2 className="font-semibold">Your categories</h2><p className="mt-1 text-xs text-muted-foreground">{categories.length} available</p></div><div className="divide-y">{categories.map((category) => <div key={category.id} className="flex items-center justify-between gap-3 px-5 py-4"><div className="flex min-w-0 items-center gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${category.color}20`, color: category.color }}><FolderOpen size={18} /></span><span className="min-w-0"><span className="block truncate text-sm font-medium">{category.name}{category.is_default && <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[10px] font-normal text-muted-foreground">Default</span>}</span><span className="mt-1 block text-xs text-muted-foreground">{category.transactions_count} transactions</span></span></div>{!category.is_default && <div className="flex shrink-0 gap-1"><button aria-label={`Edit ${category.name}`} onClick={() => { setEditing(category); form.setData({ name: category.name, color: category.color }); form.clearErrors(); }} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><Pencil size={15} /></button><button aria-label={`Delete ${category.name}`} onClick={() => remove(category)} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 size={15} /></button></div>}</div>)}</div></div>
                    <form onSubmit={submit} className="h-fit space-y-4 rounded-2xl border bg-card p-5 shadow-xs"><div><p className="text-sm font-semibold">{editing ? 'Edit category' : 'Create a category'}</p><p className="mt-1 text-xs text-muted-foreground">{editing ? 'Update its name or color.' : 'Add a label that fits your spending.'}</p></div><label className="block text-sm font-medium">Category name<input maxLength={60} value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} placeholder="Example: Coffee & snacks" className="mt-2 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />{form.errors.name && <span className="mt-1 block text-xs text-destructive">{form.errors.name}</span>}</label><label className="flex items-center gap-3 text-sm font-medium">Color<input type="color" value={form.data.color} onChange={(event) => form.setData('color', event.target.value)} className="size-10 cursor-pointer rounded-lg border bg-background p-1" /> <span className="text-xs text-muted-foreground">{form.data.color}</span></label>{form.errors.color && <span className="block text-xs text-destructive">{form.errors.color}</span>}<div className="flex gap-2"><button disabled={form.processing} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50">{editing ? <Check size={15} /> : <Plus size={15} />}{editing ? 'Save category' : 'Add category'}</button>{editing && <button type="button" onClick={reset} className="inline-flex h-10 items-center gap-1 rounded-xl border px-3 text-sm"><X size={15} />Cancel</button>}</div></form>
                </section>
            </main>
        </>
    );
}
