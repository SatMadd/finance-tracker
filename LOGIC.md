# LOGIC.md — Daily Ledger (Laravel)

> Working name: the raw idea says "Daily Finance Tracker", the UI says **Daily Ledger**. Pick one and use it everywhere (title tag, sidebar, emails).
> UI language: English. Currency/date display: user-configurable (default IDR, DD/MM/YYYY).

---

## 0. Decisions you need to make first

These change the schema and the screens, so settle them before building more.

| # | Question | Recommendation |
|---|----------|----------------|
| D1 | Income + expense, or expense only? The raw idea asks for both plus "total balance", but every screen in the current design shows **spending only**. | Support both. Add `type` to transactions and a Balance card to the dashboard. |
| D2 | Changing currency in Settings: only the symbol, or convert amounts? | Display only, **no conversion**. Say so under the dropdown. |
| D3 | Are categories shared defaults or per-user? | Per-user, seeded on registration (simplest to scope and secure). |
| D4 | Delete = permanent or soft delete? | Soft delete for transactions (allows an undo toast). Optional for homework. |
| D5 | Database for production? | SQLite is fine for local/homework. Move to MySQL/PostgreSQL if deployed for real users. |

---

## 1. Roles

Single role: **authenticated user**. Every row of money data belongs to exactly one user. There is no admin in scope.

---

## 2. Authentication

### 2.1 Login (`/login`)
Fields: **Email or Username**, **Password** (with show/hide toggle). Plus "Remember me" and link to Register.

Logic for the identifier field:
1. Trim the value, then check for `@`.
2. Contains `@` → treat as **email** (must pass email validation), look up `users.email` (lowercased).
3. No `@` → treat as **username**, look up `users.username` (case-insensitive).
4. Usernames may **never** contain `@` (enforced at registration). This is what makes the "can't type both" rule enforceable: a string with `@` can only ever be an email.
5. Wrong credentials → one generic error ("These credentials do not match our records."). Never reveal which part was wrong.
6. Rate limit: 5 attempts per minute per identifier+IP (Laravel `RateLimiter`).
7. If email not verified → allow login but redirect to the "verify your email" notice (or block, your call — see §2.3).

Password toggle is purely client-side (switch input `type` between `password` and `text`); the toggle button needs an accessible label.

### 2.2 Register (`/register`)
Fields: **Username**, **Email**, **Password**, **Confirm Password**.

| Field | Rules |
|-------|-------|
| username | required, 3–30 chars, `^[A-Za-z0-9_.-]+$` (no `@`, no spaces), unique (case-insensitive) |
| email | required, valid email, lowercased, unique |
| password | required, min 8, confirmed (use `Password::min(8)`; add `->uncompromised()` if online) |
| password_confirmation | must match |

On success: create user → hash password → seed default categories → send verification email → log in → redirect to "verify email" notice.

### 2.3 Email confirmation
- Implement `MustVerifyEmail` on the User model and use the `verified` middleware on app routes.
- Routes needed: `/email/verify` (notice), `/email/verify/{id}/{hash}` (signed link), `/email/verification-notification` (resend, throttled).
- **Mail must actually be configured.** Laravel's default `MAIL_MAILER=log` writes emails into `storage/logs/laravel.log` instead of sending them. For development use Mailpit/Mailtrap; for real sending use SMTP/Resend/Brevo etc.

### 2.4 Not in the raw idea but required
- **Forgot / reset password** (`/forgot-password`, `/reset-password/{token}`). Without it a user who forgets the password is locked out forever.
- **Logout** (POST, CSRF protected) — currently only the user chip exists in the sidebar; the dropdown needs "Log out".
- **Session security**: regenerate session on login, invalidate on logout.

### 2.5 Password storage
Laravel hashes with bcrypt (or argon2) through `Hash::make` / the `'password' => 'hashed'` cast. Passwords are never stored in plain text and cannot be read back. See SCHEMA.md §1 for how to confirm this in your own database.

---

## 3. Transactions

### 3.1 Add (`/transactions/create`)
Fields: amount, category, type (income/expense), date, note (optional), Save.

| Field | Rules |
|-------|-------|
| type | required, `income` or `expense` |
| amount | required, integer > 0, max e.g. 999,999,999,999. Strip thousand separators before validating. No decimals for IDR. |
| category_id | required, must exist **and belong to the current user**, and its type must match the transaction type |
| transaction_date | required, valid date, not more than e.g. 1 year in the future |
| note | optional, max 500 chars |

- Changing **type** in the form should filter the category dropdown to matching categories.
- Default date = today in the **user's timezone**.
- On success: redirect to History (or Dashboard) with a success toast.
- On validation failure: stay on the form, keep old input, show per-field errors + an error toast.

### 3.2 History (`/transactions`)
- Newest first: order by `transaction_date DESC, id DESC`.
- Paginated (15–20 per page). Do not load everything.
- The dashboard card says "Browse and filter your transactions", so provide filters: **search note**, **category**, **type**, **date range**. Keep them in the query string so the URL is shareable and pagination keeps them.
- Each row links to detail.

### 3.3 Detail (`/transactions/{id}`)
Shows amount, type, category, date, note, created/updated time. Buttons: **Edit**, **Delete**.

### 3.4 Edit (`/transactions/{id}/edit`)
Same form, pre-filled. Same validation. Redirect back to detail with toast.

### 3.5 Delete
- Confirmation dialog first ("Delete this transaction? This can't be undone.").
- Soft delete (D4) → toast "Transaction deleted" with optional Undo for ~8 seconds.
- Redirect to History.

### 3.6 Ownership (critical)
Every query on transactions is scoped to `auth()->id()`. Use a **Policy** (`TransactionPolicy`) and route model binding. A user opening `/transactions/5` that belongs to someone else must get **404** (or 403). This is the most common beginner security hole in CRUD apps.

---

## 4. Categories (`/categories`)

Raw idea: list of categories with total per category (e.g. Makan Rp150.000).

- Two sections or tabs: **Expense** and **Income**.
- Each row: color dot, name, transaction count, total for the selected period (default: this month).
- **Manage**: create, rename, recolor, delete.
- Delete rule: if the category has transactions → block with a message, or ask the user to reassign them to another category. Never silently orphan transactions. (`category_id` is `restrictOnDelete` in the schema.)
- Name unique per user per type.
- Default set seeded at registration. Suggested:
  - Expense: Food & Dining, Transport, Shopping, Bills & Utilities, Health, Entertainment, Education, Other
  - Income: Salary, Business, Gift, Other
- "Other" cannot be deleted (fallback).

---

## 5. Dashboard (`/dashboard`)

Cards currently in the design and how to compute them (all scoped to the user, `deleted_at IS NULL`):

| Card | Definition |
|------|-----------|
| Spent today | `SUM(amount)` where type=expense and date = today (user TZ) |
| This month | `SUM(amount)` where type=expense and date in current month |
| Transactions | `COUNT(*)` of this month's transactions |
| Review your spending | Link card → History |
| Recent transactions | Latest 5 (date desc, id desc), "View all" → History |
| Top categories | Expense totals this month grouped by category, top 5, bar = share of the largest or of the total (pick one and be consistent) |

**Missing vs the raw idea** (add if D1 = yes):
- **Total balance** = all-time `SUM(income) − SUM(expense)`.
- **Income this month** and **Expense this month** as a pair.
- The raw idea also lists buttons for settings, category summary, and monthly chart — in the sidebar design these are covered by navigation, so no extra buttons are needed.
- Copy fix: "Transactions · Purchases this month" should say "Transactions this month" once income exists.

Empty state (new user): "No transactions yet" + Add transaction button.

---

## 6. Statistics (`/statistics`)

- Date range: **From / To** + Update. Default = first day of current month → today. Validate `from <= to`, max range e.g. 2 years.
- Summary cards: Total spending, Purchases (count), Average purchase (`total / count`, guard against divide by zero → show 0).
- **Spending by category**: grouped totals with count, share %.
- **Daily spending**: one bar per day in range. Include days with zero? The subtitle says "Days with purchases", so only days with data; if you want a continuous axis, fill gaps with 0.
- The raw idea asks for a pie/bar of category proportions. The current design uses horizontal progress bars; that satisfies "proportion per category". A donut is optional.
- If income is added: toggle Expense / Income / Both.
- Empty state when range has no data.
- Use a real chart library (Chart.js or similar) or hand-built SVG. See DESIGN.md §7 about the daily chart bug.

---

## 7. Settings

Sidebar of the settings page: **Profile**, **Security**, **Appearance**, and the existing **Currency & Date format** card.

| Section | Contents |
|---------|----------|
| Profile | Edit username, email (changing email → re-verify), avatar initials auto-generated |
| Security | Change password (current + new + confirm), log out other devices, **delete account** (password required) |
| Preferences | Currency (IDR default, USD, EUR, …), date format (DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD) → saved on the user row |
| Data | **Reset data**: deletes all of the user's transactions (and optionally custom categories). Requires typing `RESET` and the password. Cannot be undone. |
| About | App name, version, short description, credits |

Notes:
- Raw idea lists "Reset data", "currency", "about" — Reset data and About are **not in the current Settings screen**. Add them.
- Currency is a formatting preference (D2). Format via a helper: `format_money($amount, $user)`; IDR has 0 decimals, USD/EUR 2.
- Appearance: the app is dark only right now. A theme toggle (light/dark/system) is optional; skip unless you design a light theme.

---

## 8. Notifications / feedback

Use flash messages rendered as toasts (success, error, info). Required events from the raw idea plus a few more:

| Event | Type | Message |
|-------|------|---------|
| Transaction saved | success | Transaction saved |
| Transaction updated | success | Transaction updated |
| Transaction deleted | success (+Undo) | Transaction deleted |
| Validation failed | error | Please fix the highlighted fields |
| Empty required input | error | per-field text, e.g. "Amount is required" |
| Registration done | success | Account created. Check your email to verify. |
| Verification sent | info | Verification link sent |
| Password changed / reset | success | |
| Data reset | success | All transactions removed |
| Unexpected server error | error | Something went wrong. Try again. |

---

## 9. Routes (proposed)

```
GET   /                         → redirect to /dashboard or /login
GET   /login          POST /login          POST /logout
GET   /register       POST /register
GET   /forgot-password POST /forgot-password
GET   /reset-password/{token} POST /reset-password
GET   /email/verify   GET /email/verify/{id}/{hash}   POST /email/verification-notification

(auth + verified)
GET   /dashboard
GET   /transactions             GET /transactions/create   POST /transactions
GET   /transactions/{t}         GET /transactions/{t}/edit PUT/PATCH /transactions/{t}   DELETE /transactions/{t}
GET   /categories   POST /categories   PUT /categories/{c}   DELETE /categories/{c}
GET   /statistics
GET   /settings     (profile / security / appearance tabs)
PUT   /settings/profile   PUT /settings/password   PUT /settings/preferences
POST  /settings/reset-data   DELETE /settings/account
```

Suggested structure: `TransactionController`, `CategoryController`, `DashboardController`, `StatisticsController`, `SettingsController`; `FormRequest` classes for every write; `TransactionPolicy`, `CategoryPolicy`; a small `ReportService` for the totals so controllers stay thin.

---

## 10. Gap analysis — what is not yet accounted for

Priority: **P0** = fix before sharing/submitting, **P1** = should have, **P2** = nice to have.

| Pri | Gap | Why it matters |
|-----|-----|----------------|
| P0 | Income type + total balance missing from design/UI | Core raw requirement, affects schema |
| P0 | Per-user scoping and policies on every query | Otherwise users can read/edit each other's data |
| P0 | Email verification needs working mail config | Default mailer only logs to a file |
| P0 | Forgot/reset password | Lock-out with no recovery |
| P0 | Money stored as integer, never float | Rounding errors |
| P0 | Timezone set to Asia/Jakarta (`APP_TIMEZONE`) | "Spent today" and month boundaries are wrong otherwise |
| P1 | Category rules (seed, unique, delete restriction, type match) | Raw idea has categories but no lifecycle |
| P1 | Reset data and About screens | In the raw idea, not in the Settings design |
| P1 | History filters + pagination | Design promises filtering; unbounded lists get slow |
| P1 | Username may not contain `@` | Makes "email or username" unambiguous |
| P1 | Login rate limiting | Brute-force protection |
| P1 | Empty states and error pages (404/419/500) | Fresh users see blank cards |
| P1 | Currency/date format helpers used everywhere | Prevent `IDR 20,000` hard-coded in views |
| P1 | Logout and user menu in the sidebar footer | The chip exists but has no defined menu |
| P1 | `.env` and `database.sqlite` kept out of git | Secrets and user data leak |
| P2 | Soft delete + Undo | Safer UX |
| P2 | Export to CSV | Typical finance-app expectation |
| P2 | Budgets, recurring transactions | Future features |
| P2 | Tests (feature tests for auth, ownership, totals) | Confidence when you keep iterating with an agent |
| P2 | Mobile layout (sidebar collapses, tables become cards) | Finance apps are used on phones |
| P2 | Number format: Indonesian users expect `Rp20.000`, design shows `IDR 20,000` | Make it follow the chosen locale |

---

## 11. Build order

1. Fix `.env`: timezone, mail, app name. Confirm DB connection.
2. Migrations (SCHEMA.md) and seeders.
3. Auth (login with email/username, register, verify, reset).
4. Categories (seeded + manage).
5. Transactions CRUD with policies and form requests.
6. Dashboard + Statistics queries (`ReportService`).
7. Settings (profile, security, preferences, reset, about).
8. Toasts, empty states, error pages.
9. Feature tests for ownership and totals.
