# Daily Ledger migration and implementation plan

Status: planning only. No application code or migrations have been changed and no migration has been run. The SQLite backup and ignore rule requested in step 1 are complete.

## 1. Final decisions to implement

- Transactions and categories support `income` and `expense`; every existing category and transaction is backfilled as `expense`.
- Dashboard adds all-time balance and a month-to-date income/expense summary.
- Categories remain shared defaults (`user_id IS NULL`, read-only) plus user-created categories. Shared defaults include expense categories already present and the new income categories `Salary`, `Business`, `Gift`, and `Other income`.
- A transaction can reference only a shared default or current-user category whose `type` matches the transaction `type`.
- Deletion remains permanent, but the transaction and category confirmation prompts become a styled dialog. No soft deletes or undo are introduced.
- Currency remains display-only; the settings selector gets a one-line “Changing this setting changes how amounts are displayed; it does not convert them.” note.
- `username` is unique without regard to ASCII letter case, 3–30 characters, matching `[A-Za-z0-9_.-]+`, and cannot contain `@`. `name` remains the display name. Login chooses email when the trimmed identifier contains `@`; otherwise it looks up username.
- Keep `amount` as `DECIMAL(12,2)`, SQLite as the database, existing visual design/tokens/layout, and use application-wide `Asia/Jakarta` timezone.
- Remove the unused learning-topic code and table using a new forward migration. The historical migration that originally created the table remains in migration history.

## 2. Completed preparatory changes

1. Created `database/backup-2026-10-13.sqlite` using SQLite's online backup API. It is 356,352 bytes, the same size as the source at backup time.
2. Added `/database/*.sqlite` to `.gitignore`.

The four requested references were read. `docs/AUDIT.md` exists. `LOGIC.md`, `SCHEMA.md`, and `DESIGN.md` currently reside at the project root, as also recorded in the audit; the absent `docs/` copies were not created or moved.

## 3. Exact forward migrations

Migration files will be timestamped after existing migrations, in the order below. Names and exact timestamp prefixes are proposals; timestamps must be unique when implementation begins.

### 3.1 `2026_10_13_000001_add_username_to_users_table`

**Schema changes**

- Add `users.username VARCHAR(30)`, ultimately `NOT NULL`.
- Add named unique index `users_username_unique_nocase` on `username COLLATE NOCASE`. SQLite's built-in `NOCASE` handles the allowed ASCII username alphabet and enforces case-insensitive uniqueness even for concurrent registrations.
- No user timezone column: the final decision is one application-wide timezone.

**Backfill**

- Backfill all existing users before enforcing `NOT NULL`.
- Derive a candidate from each `name`: lowercase it, replace runs outside `A-Z`, `a-z`, `0-9`, `_`, `.`, `-` with `-`, trim punctuation at the ends, and cap at 30 characters.
- If the candidate is shorter than 3 characters or empty, use `user-<id>` (truncated only if necessary).
- Process users by ascending ID. On a case-insensitive collision, append `-2`, `-3`, etc., truncating the base so the final username remains at most 30 characters. This makes duplicate display names deterministic while preserving `name` unchanged.
- Backfill in bounded ID batches. Validate every generated username against the agreed regex/length before adding the unique index and making the column non-null.

**Application-level validation after this migration**

- Registration and profile update require username length 3–30 and the exact allowed-character rule.
- Check uniqueness case-insensitively in validation; the SQLite unique index remains the final race-safe constraint.
- Login input is trimmed. An identifier containing `@` is validated/looked up as lowercase email; otherwise lowercase username is queried. Do not silently reinterpret an invalid email as a username.

**Rollback**

- Drop `users_username_unique_nocase`, then remove `username`.
- `name` and all pre-existing user data remain untouched. This is a destructive schema rollback only for usernames added in this migration.

### 3.2 `2026_10_13_000002_add_type_to_categories_table`

**Schema changes**

- Add `categories.type VARCHAR(7) NOT NULL DEFAULT 'expense'` with application and database validation limited to `expense` or `income`.
- Preserve nullable `user_id`, existing colors, `is_default`, category IDs, and the existing `(user_id, name)` index.
- Add lookup index `categories_user_type_name_index` on `(user_id, type, name)`.
- Add SQLite unique expression index `categories_owner_type_name_unique` on `(COALESCE(user_id, 0), type, name COLLATE NOCASE)`. User IDs are positive, so `0` is a safe owner sentinel; this enforces case-insensitive uniqueness for user categories and shared defaults despite SQLite treating NULLs as distinct in ordinary unique indexes.

**Backfill / seed**

- Set every existing category to `expense` (the new-column default is also `expense`). This includes shared defaults and user-created categories.
- Insert four global default income categories with `user_id=NULL`, `is_default=true`, and the established default palette style: `Salary`, `Business`, `Gift`, and `Other income`. Use idempotent matching on `(user_id, type, name)` so a retry cannot create duplicates. Do not overwrite existing category names/colors.
- Do not convert existing expense categories or transactions to another owner or rename `Other`.

**Rollback**

- Before rollback, fail safely if any income category has transactions or if any user-created income category exists; the migration must not delete user-entered category data or make a transaction point at an invalid category.
- If safe, remove only the four migration-created global income categories by exact `(user_id=NULL, type=income, name)` match, drop the two new indexes, and drop `type`.
- Existing expense category IDs and data remain intact. Global income categories added later will require manual resolution before rollback.

### 3.3 `2026_10_13_000003_add_type_to_transactions_table`

**Schema changes**

- Add `transactions.type VARCHAR(7) NOT NULL DEFAULT 'expense'` with accepted values `expense` and `income`.
- Preserve `DECIMAL(12,2)` amount, `date`, `description`, `notes`, payment method, IDs, foreign keys, and timestamps.
- Keep existing `(user_id, date)` index and add `transactions_user_type_date_index` on `(user_id, type, date)` for dashboard and statistics queries.
- Category/type matching is a cross-table rule: enforce it in both transaction FormRequests (and any other write path), and test store/update. A normal SQLite CHECK cannot compare the referenced category's type without a trigger; do not add a hidden trigger in this phase.

**Backfill**

- All current transactions become `expense` through the column default; verify every transaction's referenced category is also expense after migration 3.2.
- Existing amount values are copied unchanged; do not round or convert decimal amounts.

**Rollback**

- Abort rollback if any income transaction exists. Never silently reclassify income as expense.
- If no income transactions exist, drop the new composite index and `type` column. Existing expense records and their decimal amounts remain unchanged.

### 3.4 `2026_10_13_000004_drop_learning_topics_table`

**Schema changes**

- Drop `learning_topics` with `Schema::dropIfExists` after removing its application model/controller/requests/factory references in the same release.
- No finance data is moved or modified.

**Rollback**

- Recreate the original `learning_topics` table shape (`id`, `title`, nullable `study_date`, `status` default `not_started`, nullable `notes`, timestamps) so the migration can be rolled back structurally.
- A down migration cannot recover the deleted topic rows. The pre-change database backup retains those rows and is the recovery source. This intentional removal must be acknowledged when applying the migration.

### 3.5 Runtime configuration (not a database migration)

- Change `.env` and `.env.example` to `APP_NAME="Daily Ledger"` and `APP_TIMEZONE=Asia/Jakarta`.
- Change `config/app.php` timezone from hardcoded `UTC` to `env('APP_TIMEZONE', 'UTC')`; Laravel's app configuration otherwise ignores the requested environment value.
- No schema column is needed for timezone. Existing transaction dates remain calendar dates and are not shifted. “Today”, month boundaries, and default transaction dates use the app timezone.
- Do not alter the design tokens, page layout, theme, palette, or component visual language.

## 4. Backend files to change

### Schema, seed, and configuration

- `database/migrations/` — add the four forward migrations above; retain all historical migrations.
- `database/seeders/DatabaseSeeder.php` — continue creating only the global shared defaults; include the income defaults in an idempotent manner if those rows are not exclusively created by the category migration. Pick one owner for those inserts to avoid duplicate seeding logic.
- `database/factories/CategoryFactory.php` — add a valid default type and type states for tests.
- `database/factories/TransactionFactory.php` — add a default type consistent with its category; keep decimal amount generation.
- `config/app.php`, `.env`, `.env.example` — wire timezone, set app name, preserve SQLite.

### Models and validation

- `app/Models/User.php` — expose `username` as fillable and property metadata; retain `name` and existing auth/password casts.
- `app/Models/Category.php` — add `type` fillable/cast or enum handling consistent with the app's existing conventions; keep nullable owner and default-category behavior.
- `app/Models/Transaction.php` — add `type` to fillable and keep `decimal:2` amount cast.
- `app/Concerns/ProfileValidationRules.php` and `app/Http/Requests/Settings/ProfileUpdateRequest.php` — validate and persist usernames on profile updates as well as registration.
- `app/Http/Requests/StoreCategoryRequest.php`, `UpdateCategoryRequest.php` — validate category type; preserve protection of shared defaults and validate case-insensitive name uniqueness in the effective owner/type scope.
- `app/Http/Requests/StoreTransactionRequest.php`, `UpdateTransactionRequest.php` — require valid transaction type and enforce category ownership plus matching type.
- `app/Http/Requests/UpdateFinanceSettingsRequest.php` — no backend rule change expected; frontend copy only for D2.

### Fortify and controllers

- `app/Actions/Fortify/CreateNewUser.php` — accept/validate username while retaining `name`, email, and password behavior.
- `app/Providers/FortifyServiceProvider.php`, `config/fortify.php` — configure a login identifier request field and custom authentication resolver: `@` means email, otherwise username; preserve generic credential errors and the existing five-per-minute identifier/IP limiter. Keep Fortify's reset flow keyed to email.
- `app/Http/Controllers/Settings/ProfileController.php` — allow saving the username through the revised profile request without changing email verification semantics.
- `app/Http/Controllers/TransactionController.php` — pass categories grouped/filtered by type and expose `type` on detail/history; keep existing owner checks and route behavior.
- `app/Http/Controllers/CategoryController.php` — include category type, preserve shared defaults as read-only, and ensure transaction counts use the current user.
- `app/Http/Controllers/DashboardController.php` — calculate all-time balance and month-to-date income and expense separately, in the app timezone; scope every sum/count to the authenticated user.
- `app/Http/Controllers/StatisticsController.php` — return income/expense totals and type-grouped category/date data; retain current range behavior unless separately approved.
- `app/Http/Controllers/FinanceSettingsController.php` — no logic change expected for display-only currency.
- Remove `app/Models/LearningTopic.php`, `app/Http/Controllers/LearningTopicController.php`, `app/Http/Requests/StoreLearningTopicRequest.php`, `app/Http/Requests/UpdateLearningTopicRequest.php`, and `database/factories/LearningTopicFactory.php`. Retain the historical `create_learning_topics_table` migration and remove any references from seeders/tests if found.

## 5. React/Inertia frontend files and order

Use the current component and token conventions. Keep styling/layout as-is; add behavior and copy within the established UI. Use Wayfinder helpers for route calls and regenerate them if route definitions change.

1. `resources/js/pages/auth/register.tsx` — add Username field while retaining Name, Email, Password, Confirm password.
2. `resources/js/pages/auth/login.tsx` — change identifier label, input name/type/autocomplete/placeholder to “Email or username”; retain password/passkey, remember me, forgot-password, and register links.
3. `resources/js/pages/settings/profile.tsx` — display and edit username as well as the current display name and email.
4. `resources/js/components/transaction-form.tsx` — add Expense/Income type control, filter category options by type, preserve edit value, and keep current form layout/style and decimal amount behavior.
5. `resources/js/pages/transactions/create.tsx` and `edit.tsx` — pass any new type/category props through the shared form; preserve the existing page composition.
6. `resources/js/pages/transactions/index.tsx` — add the type filter and show income/expense meaning on rows while retaining existing search, category, date, and pagination UI.
7. `resources/js/pages/transactions/show.tsx` — show transaction type and replace `window.confirm` with the shared styled confirmation dialog.
8. `resources/js/pages/categories/index.tsx` — split/filter income and expense categories, display type, and add type to create/edit form; use the same confirmation dialog for category deletion.
9. `resources/js/pages/dashboard.tsx` — add total balance and month-to-date income/expense summary; update existing amounts/categories by type, preserving current card layout and design.
10. `resources/js/pages/statistics/index.tsx` — expose income/expense totals and type-specific category/daily results within the current chart and card design.
11. `resources/js/pages/settings/finance.tsx` — add the required one-line display-only currency note immediately under the selector.
12. Add `resources/js/components/confirm-dialog.tsx` (or the project’s established dialog wrapper if one exists) using current UI primitives/tokens, focus handling, accessible title/description, cancel, and destructive action. No `alert-dialog.tsx` wrapper exists at the time of planning.
13. Remove any `learning-topics` page/components if found during implementation, and check imports/route helpers for stale references. Current page inventory has no learning-topic page.

`resources/js/lib/finance.ts` is not expected to change for currency conversion (none is introduced). It may need adjustment only if the app's existing formatting proves incompatible with the final income/expense display. Do not change visual tokens or chart design as part of this scope.

## 6. Existing-data risks

| Risk | Handling |
|---|---|
| Users with duplicate/short/non-ASCII display names may produce colliding or invalid usernames | Deterministic ASCII slug plus ID fallback and collision suffix; validate all rows and index before constraint creation. `name` remains unchanged. |
| SQLite's ordinary unique index treats NULL owners as distinct | Use the planned expression index with `COALESCE(user_id, 0)` so shared defaults are unique by type/name too. Verify SQLite expression-index support on the installed runtime. |
| Existing transactions may point to personal categories; all data is classified expense | Keep category and transaction IDs/FKs unchanged; backfill both to expense before activating transaction type validation. |
| Income category rows must not be removed on rollback if referenced | The category migration's down path refuses unsafe rollback; resolve references manually before rollback. |
| Income transactions must not be demoted on rollback | The transaction migration's down path refuses rollback while income rows exist. |
| Dropping `learning_topics` removes its live rows | The requested backup retains the table and data. The migration's rollback recreates an empty table, not the rows. Restore from the backup only if topic data is needed. |
| App timezone change can change which transactions count as “today” or in the current month | Stored transaction date fields are unchanged; verify totals around midnight/month boundaries under Asia/Jakarta. |
| Backup may be stale if the app writes new data after backup | Before migration, close writers or take a fresh SQLite online backup and compare source/backup integrity and row counts immediately before applying. |
| `.env` is local and not generally shared via source control | Also update `.env.example`; each environment must set `APP_NAME`/`APP_TIMEZONE` or inherit the documented defaults. |

## 7. Data-preservation verification plan

Run only after implementation approval. Do not run these migrations as part of this planning task.

1. Immediately before migrations, take/refresh an SQLite online backup and record per-table row counts for `users`, `categories`, `transactions`, and `learning_topics`; record transaction `SUM(amount)` and IDs, plus category/transaction foreign-key consistency. At planning time the live DB and backup both have 2 users, 7 categories, 1 transaction, and 12 learning topics; the transaction sum is 20,000. Both returned `PRAGMA integrity_check = ok`.
2. Run `PRAGMA integrity_check` on the backup and live database. Confirm the source and backup both pass and their core-table counts match at backup time.
3. Apply migrations in order. Confirm `users`, `categories`, and `transactions` counts are exactly unchanged. Confirm the transaction ID set and per-row `amount`, `date`, `description`, `notes`, `user_id`, `category_id` values are unchanged. Confirm transaction amount sum is identical before/after.
4. Confirm every pre-existing category and transaction now has `type='expense'`; confirm exactly the four intended global income defaults were added (or already existed idempotently), and no existing category row was duplicated or renamed.
5. Verify all rows satisfy both foreign keys and every transaction category type equals its transaction type. Verify username is non-null, 3–30 characters, regex-valid, and unique under `COLLATE NOCASE`.
6. Confirm `learning_topics` is absent after migration and its pre-migration count is documented; compare that count and sample rows against `backup-2026-10-13.sqlite` to prove recoverability.
7. Run the focused backend tests, app test suite, TypeScript checks, route helper generation/checks as required, and inspect generated route list. Confirm `php artisan about` reports `Asia/Jakarta` and `Daily Ledger`.
8. Do not use `migrate:fresh`; retain the original backup until a second verified post-migration backup exists.

## 8. Current baseline to capture again before migrations

The audit recorded 13 tables in the current SQLite DB, including `users`, `categories`, `transactions`, and `learning_topics`. The task-time backup is 356,352 bytes. A read-only verification at plan creation found matching counts between source and backup: 2 users, 7 categories, 1 transaction, and 12 learning topics; transaction sum 20,000; integrity check `ok` for both. Re-capture those counts immediately before applying migrations because the database may change after this plan.

