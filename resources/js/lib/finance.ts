export function formatMoney(amount: number | string, currency: string): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits: currency === 'IDR' ? 0 : 2,
    }).format(Number(amount));
}

export function formatDate(value: string, dateFormat = 'd/m/Y'): string {
    const date = new Date(`${value.slice(0, 10)}T00:00:00`);

    if (dateFormat === 'M j, Y') {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).format(date);
    }

    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(date);
}

export function localDateInput(): string {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);

    return local.toISOString().slice(0, 10);
}
