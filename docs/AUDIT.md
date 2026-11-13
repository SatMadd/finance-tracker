# Daily Ledger project audit

Audit date: 2026-10-13  
Scope: read-only review of application code, current SQLite schema, routes, UI, configuration, and existing tests. No application files or database contents were changed.  
Reference documents: `LavarelProjectRawIdea.txt`, `LOGIC.md`, `SCHEMA.md`, and `DESIGN.md` are in the repository root; the audit brief described them as being under `docs/`. The only new file is this report.

## 1. Summary

- Daily Ledger is a working Laravel 13.35.0 / PHP 8.5.0 Inertia React application backed by SQLite at `database/database.sqlite`.
- The main purchase-tracking screens and standard email authentication flows exist, including transaction CRUD, history filters/pagination, categories, statistics, and display preferences.
- The delivered app is an expense tracker, not the income-and-expense tracker recommended in `LOGIC.md`; there is no transaction type or balance.
- The actual schema differs substantially from `SCHEMA.md`: categories can be global and have no type; transactions use decimal `amount`, `date`, `description`, and `notes`, with no soft-delete column.
- Transaction reads and writes are scoped to the authenticated user, including route-bound detail/edit/update/delete checks. Category changes are owner-checked; shared defaults are read-only.
- Login accepts email only. Registration asks for name and email, not username. Password recovery and email verification routes exist, but current mail configuration logs notifications instead of sending them.
- Local `.env` has `APP_DEBUG=true`, `APP_NAME=Laravel`, `APP_TIMEZONE` unset (effective timezone UTC), and SQLite configured. `.env` is ignored by Git; `.gitignore` does not ignore `database/database.sqlite`.
- The test run reports 40 tests: 39 passed and 1 failed. The failure is the starter `ExampleTest` expecting `/` to return 200 while the app redirects `/` to `/dashboard`.
- No active IDOR was found in transaction controller paths inspected; important missing coverage includes transaction/category ownership, validation, totals, and new finance behavior.
- The written reference documents disagree about a few optional/design choices; recommended decisions are listed in section 9 for the owner to approve.

## 2. Environment facts

| Item | Observed | Evidence |
|---|---|---|
| Framework / PHP | Laravel 13.35.0 / PHP 8.5.0 | `php artisan about` |
| Runtime | `local`, debug enabled, URL `http://localhost:8000`, timezone UTC, locale `en` | `php artisan about` |
| Database | SQLite; `C:\Users\ADVAN\laravel-web\database\database.sqlite`; 13 tables | `php artisan db:show` |
| Local environment settings | `APP_NAME=Laravel`, `APP_DEBUG=true`, `APP_URL=http://localhost:8000`, `DB_CONNECTION=sqlite`, `MAIL_MAILER=log`; no `APP_TIMEZONE` line | `.env:1-5,23,50`; `php artisan about` |
| Database tables | `cache`, `cache_locks`, `categories`, `failed_jobs`, `job_batches`, `jobs`, `learning_topics`, `migrations`, `passkeys`, `password_reset_tokens`, `sessions`, `transactions`, `users` | `php artisan db:show` and `php artisan db:table` for each table |
| Session / cache / queue | database / database / database | `php artisan about`; `.env:30,38,40` |
| App name used in config | Laravel, not Daily Ledger | `.env:1`; app logo text says Daily Ledger in `resources/js/components/app-logo.tsx` |
| Version dependencies | Laravel framework `^13.17`, Fortify `^1.37.2`, Inertia Laravel `^3.0`; React Inertia `^3.0.0`, Tailwind `^4.0.0` | `composer.json`, `package.json` |
| Test database | SQLite in-memory; mail array; session/cache array | `phpunit.xml` |
| Git ignore / repository state | `.env` ignored; no rule for `database/database.sqlite`; this workspace directory has no `.git` entry, so tracked-file status cannot be checked | `.gitignore`; `Test-Path .git` |
| `.ai/rules` | Not present, so no path-scoped project rules were available | filesystem check |

`php artisan db:show` reports 13 tables. The SQLite file is a local database file, so CRUD is persisted there; Laravel creates the sessions, cache, and queue tables because those drivers are database-backed. The user factory hashes the literal development/test password `password`; the seeder creates a `test@example.com` account if absent. Treat seeded credentials as local-only and never reuse them in a deployed environment. The checked-in factory is `database/factories/UserFactory.php`; `database/seeders/DatabaseSeeder.php` creates the local account and global starter categories.

## 3. Feature status

Statuses: `✅ Done`, `🟡 Partial`, `🔀 Differs from docs`, `❌ Missing`, `❓ Can't verify`.

| Feature / requirement | Status | Evidence / notes |
|---|---|---|
| SQLite persistence / migrations | ✅ Done | SQLite file and 13 migrated tables verified with Artisan. |
| Login / logout | 🟡 Partial | Fortify email login, remember-me, password visibility, and POST logout exist. Email-or-username behavior is absent. `config/fortify.php` sets username field to `email`; login page label says Email address. |
| Registration | 🔀 Differs from docs | Form accepts `name`, `email`, password, confirmation; no username field or username column. See `CreateNewUser` and auth register page. |
| Password hashing | ✅ Done | User model uses Laravel `hashed` cast; factory hashes test password. No plaintext storage found in the app’s normal creation flow. |
| Email verification | 🟡 Partial | MustVerifyEmail, Fortify verification notice/signed-link/resend, and `auth,verified` protection exist. `MAIL_MAILER=log` means verification is not delivered to an inbox in this environment. |
| Forgot/reset password | ✅ Done | Fortify feature enabled; UI and routes present. Delivery is subject to the mailer configuration above. |
| Rate limiting | ✅ Done | Login limiter is 5 per minute per lowercased identifier + IP; two-factor and passkey limiters also configured. |
| Transaction create/detail/edit/delete | 🟡 Partial | CRUD pages/routes and input validation exist. Delete is permanent; no transaction type; field names/rules differ from docs. |
| Transaction ownership | ✅ Done | Listing uses `$request->user()->transactions()`; detail/edit/update/delete abort 404 when owner differs; writes create through the authenticated user relation. |
| Transaction history | 🟡 Partial | Search, category, from/to and 12-row pagination, newest date/id first. No type filter; search targets `description`, not `note`; documented target is 15–20 rows. |
| Categories | 🔀 Differs from docs | Shared global defaults + user-defined categories; no income/expense type; shows count but no period total. Delete blocks categories with any transactions. |
| Dashboard | 🔀 Differs from docs | Today/month spending, monthly count, recent rows, top categories, empty state. No income, expense-vs-income split, or balance. |
| Statistics | 🟡 Partial | Range summary, category totals/counts, daily bars, and empty state. No maximum two-year range, type selector, or zero-day fill; loads all matching transactions into memory. |
| Settings | 🟡 Partial | Finance currency/date preferences, profile, security, appearance. Reset-data and About screens absent. No timezone preference. |
| Currency/date display | 🟡 Partial | Helper uses `Intl.NumberFormat('en-US')` and `en-GB` or `en-US` dates. Supported currencies are IDR/USD/SGD; user preference is formatting only in current behavior. Currency preference UI does not explicitly explain no conversion. |
| Confirmation / feedback | 🟡 Partial | Browser `window.confirm` before transaction/category delete; success flash toasts exist; field errors render. No soft-delete undo, reset confirmation flow, or global validation-error toast was found. |
| Error / empty states | 🟡 Partial | Finance pages include empty/no-results states. Custom 404/419/500 pages were not found in the page inventory. |
| Responsive UI | ✅ Done | Key layouts/pages use responsive Tailwind breakpoints (e.g. dashboard grids, form/list stacks); no runtime device matrix performed. |
| Tests | 🔀 Differs from docs | 40 tests executed: 39 passed, one starter home-route test failed. No transaction/category CRUD or cross-user ownership test coverage found. |
| Demo data | ❌ Missing | DatabaseSeeder seeds one test user and seven global expense categories; no transaction demo seeder / 30 sample transactions. |
| Legacy learning-topic feature | 🔀 Differs from docs | `learning_topics` table/model/factory/controller/requests remain, but no learning-topic routes appear in the route list. This is leftover scope/code. |

## 4. Schema diff

Reference columns and constraints are from `SCHEMA.md` §§3–5. Actual columns below are from `php artisan db:table` for every table and the migrations in `database/migrations/`.

### `users`

| Expected in docs | Actual | Difference |
|---|---|---|
| `username` unique; optionally keep `name` | `name`, unique `email`; no `username` | Username login/registration cannot currently work. |
| `email` unique, lowercased | Unique email; no application lowercasing evident in custom registration action | Case normalization behavior differs / not enforced by `CreateNewUser`. |
| `email_verified_at`, `password`, `remember_token`, timestamps | Present | Match. |
| `currency` default IDR, `date_format` default `d/m/Y` | Present | Match. |
| `timezone` default `Asia/Jakarta` | Absent; effective app timezone UTC | Difference affects “today” and month boundaries. |
| Optional two-factor fields | Present (`two_factor_secret`, recovery codes, confirmed timestamp) | Extra auth capability. |

### `categories`

| Expected in docs | Actual | Difference |
|---|---|---|
| Non-null `user_id`, cascade delete | Nullable `user_id`, cascade delete | Null owner represents shared global defaults. |
| `name` (40 in sketch), `type` income/expense, `color`, `is_default` | `name` varchar(60), no `type`, `color` default `#718096`, `is_default` default false | No separation by income/expense. |
| Unique `(user_id,type,name)` and user index | Index `(user_id,name)`; no unique constraint | Application validates per-user name, but no database uniqueness and no type scope. Null/global duplicate semantics differ. |
| timestamps | Present | Match. |

### `transactions`

| Expected in docs | Actual | Difference |
|---|---|---|
| `user_id` FK cascade; `category_id` FK | Both present; category FK restricts delete | Match, with deletion protection. |
| `type` income/expense | Absent | Income and balance impossible. |
| Integer/bigint amount | Decimal(12,2) | Differs from integer-money recommendation; decimals are allowed. |
| `transaction_date` date | `date` date | Similar storage, different name. |
| `note` max 500 | `description` string plus nullable `notes` text; request permits notes up to 3000 | Different semantics/limits and separate title-like description. |
| `deleted_at` / SoftDeletes | Absent; model does not use SoftDeletes | Delete is permanent; no undo. |
| indexes `(user_id,transaction_date)` and `(user_id,type,transaction_date)` | `(user_id,date)` only | No type index. |
| timestamps | Present | Match. |

### Other tables and migration recommendations

The support tables `cache`, `cache_locks`, `failed_jobs`, `job_batches`, `jobs`, `migrations`, `password_reset_tokens`, and `sessions` are framework/runtime tables; `passkeys` supports the enabled Fortify passkeys feature. `learning_topics` is unrelated legacy scope. Those support tables are extra to the finance-domain schema.

Proposed migration names/purpose only (no migrations created):

1. `add_username_and_timezone_to_users_table` — add case-normalized unique username and timezone; resolve whether to retain `name`.
2. `add_type_to_categories_table` — add category type and replace nullable global ownership with per-user category rows; backfill existing defaults per account or define a global-default strategy.
3. `add_type_and_soft_deletes_to_transactions_table` — add income/expense type and `deleted_at`; preserve/backfill existing rows as expenses.
4. `align_transaction_fields_and_indexes` — decide whether to rename `date`/`description`/`notes`, amount precision, and report indexes. Avoid renaming data until the intended note/description model and amount strategy are approved.

Migration safety: current user data exists in the local SQLite database. Do not use `migrate:fresh` if those rows matter; use forward migrations with explicit backfills and a database backup.

## 5. Route diff

Actual inventory: `php artisan route:list` showed 61 routes, including 23 non-vendor application routes. Finance routes are behind `auth` and `verified` in `routes/web.php`; profile routes require auth, while security/appearance and profile deletion require verified auth.

| Requested route/behavior | Actual |
|---|---|
| `/` redirect to dashboard or login | Redirects to `/dashboard`; guest is then sent to login by auth middleware. |
| Login / registration / logout | Fortify routes exist: GET+POST `/login`, GET+POST `/register`, POST `/logout`. Login accepts email field only. |
| Forgot/reset password | GET+POST `/forgot-password`; GET `/reset-password/{token}`, POST `/reset-password`. |
| Verification notice/link/resend | GET `/email/verify`, GET `/email/verify/{id}/{hash}`, POST `/email/verification-notification`. |
| Transactions CRUD | All expected resource endpoints exist under `/transactions`. |
| Categories | GET+POST `/categories`, PUT/PATCH and DELETE `/categories/{category}`; no show/create/edit pages. |
| Statistics | GET `/statistics`. |
| Settings | Profile, security, appearance, finance-settings, password update exist. `/settings` redirects to profile. |
| Reset personal data | Missing. |
| About page | Missing. |
| CSV export / undo-delete | Missing (future/optional in docs). |
| Extra routes | Framework status `/up`, storage routes, Boost browser-log endpoint, Inertia devtools, passkey, 2FA, password-confirmation endpoints, and `.well-known/passkey-endpoints`. These are route extras rather than missing finance routes. |
| Legacy topics | `LearningTopicController` and model exist, but no `/topics` route. |

## 6. Security findings

Ordered by severity; each item includes evidence and a practical repro/check.

### High: production configuration would expose debug details

- **Evidence:** `.env:4` sets `APP_DEBUG=true`; `php artisan about` confirms debug enabled. `.env:1` also leaves the app name as Laravel. `.env` is ignored by Git, so this is currently local configuration.
- **Impact:** If the local environment file is copied into a deployed environment unchanged, unhandled errors can disclose detailed diagnostics and configuration context.
- **Repro/check:** Trigger an unhandled error under this configuration and inspect the response; do not perform this on a public deployment. Set debug false before deployment and use production environment configuration.

### Medium: SQLite database file is not covered by `.gitignore`

- **Evidence:** `.gitignore` ignores `.env` but has no `database/*.sqlite` or equivalent entry; `database/database.sqlite` exists and contains live local rows. This workspace is not a Git checkout (`.git` is absent), so whether another copy tracks the file cannot be established here.
- **Impact:** A normal `git add .` can include local account and transaction data unless separately excluded.
- **Repro/check:** In the eventual Git checkout, `git check-ignore database/database.sqlite` should report no ignore rule unless one is added. Review `git status` before committing and keep this file out of source control.

### Medium: login recovery / verification mail is not delivered with the current mailer

- **Evidence:** `.env:50` is `MAIL_MAILER=log`; `LOGIC.md` §2.3 also describes that behavior. Verification and password reset endpoints exist, but notifications are written to `storage/logs/laravel.log` under this config.
- **Impact:** A user testing localhost cannot receive the message in an inbox unless they inspect the local log or configure a mail catcher/SMTP service.
- **Repro/check:** Register with an address and inspect the Laravel log for a verification URL; configure Mailpit or a real mail transport for inbox delivery.

### Low: seeded/test credentials are predictable

- **Evidence:** `database/seeders/DatabaseSeeder.php` creates `test@example.com`; `database/factories/UserFactory.php` hashes the literal password `password`. Local DB inspection found the seeded account. No password hash or other private credential is reproduced in this report.
- **Impact:** Safe only as disposable local/test data; dangerous if this seeder is run on an accessible deployment.
- **Repro/check:** A local seed creates the known test account; remove or gate the account before deploying and never treat it as a real user's credentials.

### No transaction IDOR found in inspected paths

- **Evidence:** `TransactionController@index` queries through the authenticated user relation. `show`, `edit`, `update`, and `destroy` compare the bound transaction owner to the authenticated user and abort 404 on mismatch. Create also uses the relation. Update request authorization checks the bound transaction owner.
- **Check:** As user A, request the detail/edit URL for a transaction owned by user B; controller returns 404. This behavior is not covered by a dedicated existing feature test, so regression protection is missing.

### Other observations

- Password fields use Laravel's `hashed` cast and Fortify standard auth flows; login is limited to five attempts per minute per identifier + IP (`FortifyServiceProvider`).
- No `TransactionPolicy`/`CategoryPolicy` was found, but explicit transaction ownership checks and category update authorization are present in the reviewed controller/request paths.
- Category ownership validation permits either global (`user_id IS NULL`) or current-user categories. This matches the current shared-default schema; it is not the per-user-only model described in `SCHEMA.md`.
- `APP_DEBUG=true` is expected for local development, but it must not be left enabled in production.

## 7. Design findings

### Actual CSS tokens

`resources/css/app.css` uses CSS OKLCH tokens rather than the approximate hex values in `DESIGN.md`. The app has both light `:root` tokens and a `.dark` theme.

| Token | Light (`:root`) | Dark (`.dark`) | Note |
|---|---|---|---|
| `--background` | `oklch(1 0 0)` | `oklch(0.145 0 0)` | White vs near-black canvas. |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | Inverted text color. |
| `--primary` | `oklch(0.205 0 0)` | `oklch(0.985 0 0)` | Neutral dark/light primary, not peach. |
| `--accent` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | Neutral accent; category colors provide the varied data accent. |
| `--radius` | `0.625rem` | inherited | Rounded controls/cards. |

### Confirmed and not confirmed

- **Confirmed:** Overall cards, hairline borders, responsive grids, empty states, category dots/bars, and form field errors align broadly with the reference design. UI language is English. `Daily Ledger` is shown in the app logo.
- **Differs:** Design describes a dark-only near-black UI and white primary action; CSS supports light and dark modes with neutral primary/accent tokens. Page templates generally use the shared semantic tokens.
- **Confirmed defect vs note:** Statistics daily chart uses primary/gray (`bg-primary/75`), not the peach category accent; it has no value axis, shows labels for every data point, and relies on hover-only values. This partly matches the chart issue raised in `DESIGN.md` §8.
- **Missing:** Type toggle and income-vs-expense styling on add/edit/history; category income/expense tabs and monthly totals; reset-data confirmation dialog; delete undo action; custom 404/419/500 views were not found.
- **Mixed:** Delete uses native `window.confirm`, which does ask for confirmation but is not the designed app-styled dialog. Success toasts and page-level empty states exist; a global validation error toast was not found.
- **Responsive:** Dashboard uses 2/4-column breakpoints; finance forms/lists use responsive stacking. This was verified from source classes, not by screenshot/device testing.
- **Accessibility items to verify in a later implementation:** contrast in both themes, icon-only control names, keyboard flow for native and custom dialogs, and chart descriptions.

## 8. Prioritized fixes

| Priority | What / where | Why | Size |
|---|---|---|---|
| P0 | Ensure `database/database.sqlite` is ignored and remove it from any tracked commit if present | Local database currently lacks an ignore rule and may contain personal/seed data. | S |
| P0 | Set `APP_DEBUG=false` and a production mail transport in deployed environment configuration | Avoid diagnostics exposure and allow verification/password reset delivery. | S |
| P0 | Decide D1 and migrate `transactions`/`categories` for income + expense, then update create/edit, history, dashboard, category summaries, and statistics | Current app cannot represent income or compute balance, contrary to raw idea and recommendation. | L |
| P1 | Implement username registration and email-or-username login, including unique/case-normalized storage and validation | Raw idea explicitly requires username auth. | M |
| P1 | Seed per-user income and expense categories on registration or formally approve shared defaults; add category type and type-aware validation | Current global categories do not model the planned two category sets. | L |
| P1 | Add transaction soft deletes and an undo flow, or explicitly retain permanent deletion | Current permanent delete conflicts with D4 recommendation and UI promise. | M |
| P1 | Set application/user timezone intentionally (expected default Asia/Jakarta) and use it for dates/totals | Today/month totals currently follow UTC. | S/M |
| P1 | Add reset-data and About settings routes/pages with password and typed confirmation for reset | Both were in the user’s raw idea and are absent. | M |
| P1 | Add transaction/category feature tests, especially foreign-owner 404s, category constraints, summary totals, validation and deletion semantics | Existing suite has no regression tests for core finance behavior. | M |
| P1 | Correct the starter `ExampleTest` expectation or make `/` return an intended successful landing response | Current test suite has one failure because `/` intentionally redirects. | S |
| P1 | Bound statistics range to 2 years and aggregate at the database level | Current range is unbounded and loads every matching row into memory. | M |
| P2 | Decide whether to rename `date`/`description`/`notes` to the schema vocabulary, then align UI and validation limits | Current data model differs from the written plan and note search requirement. | M |
| P2 | Add custom error pages, validation-error toast, and accessible styled confirmation dialogs | Improves the planned feedback and error states. | M |
| P2 | Tune statistics chart colors/labels/axis and add chart accessibility text | Addresses the documented chart concern and improves readability. | S/M |
| P2 | Remove or route the legacy learning-topic model/controller/factory/table after deciding whether it is intentionally retained | It is unrelated to Daily Ledger and currently orphaned from routes. | S/M |

## 9. Open decisions (D1–D5)

These decisions are not made by this audit; recommendations remain subject to owner approval.

| Decision | Current implementation | Recommendation | Implication |
|---|---|---|---|
| D1: income + expense or expense only? | Expense-only behavior; no transaction type. | Support both as `LOGIC.md` recommends and the raw idea requires. | Schema and all summaries/forms must carry a type; legacy rows need backfill as expenses. |
| D2: currency symbol only or conversion? | User currency preference changes formatting; no exchange conversion. | Display only; explicitly explain this under the preference selector. | Existing stored amounts remain numeric values with no currency history/conversion. |
| D3: shared defaults or per-user categories? | Seven global shared defaults (`user_id=NULL`) plus personal categories. | Per-user categories seeded at registration, as Logic recommends; alternatively explicitly retain global immutable defaults. | A per-user design requires data backfill and updates to category listing/validation. |
| D4: permanent or soft-delete transactions? | Permanent deletion. | Soft-delete with a short undo action if the app is expected to protect user data; otherwise keep permanent delete and revise the docs. | Soft delete requires schema/model/query behavior and restore route/UI. |
| D5: local/production DB? | SQLite in local setup. | Keep SQLite for homework/local use; choose a managed MySQL/PostgreSQL database before real multi-user deployment. | Production change needs environment setup, backup/restore, and deployment validation. |

## 10. Proposed implementation order

Each step is a separate approval point; no implementation work is included in this audit.

1. Approve D1–D5 and settle `username` vs display `name`, transaction note/description semantics, and whether the legacy learning-topic feature is discarded.
2. Protect local data: back up `database/database.sqlite`, add it to ignore rules, and confirm which local rows must be preserved.
3. Prepare forward migrations/backfills for username/timezone, typed categories, typed transactions, amount/date/note decisions, indexes, and optional soft deletes. Review migration plan before applying it to existing data.
4. Implement username/email auth, category seeding, and verification delivery configuration; retain generic login errors and rate limits.
5. Update category and transaction CRUD/forms/validation/ownership behavior to use the approved schema and type rules.
6. Update dashboard, history filters, category totals, and statistics for income/expense, balance, timezone, pagination, and bounded reporting.
7. Implement reset-data/About settings and approved delete confirmation/undo behavior.
8. Add focused feature tests for auth identifiers, cross-user isolation, category type/owner rules, totals, validation, and deletion; fix the existing root-route test expectation.
9. Refine chart/error/accessibility/responsive details and run the approved validation/build workflow.

