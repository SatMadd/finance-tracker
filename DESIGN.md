# DESIGN.md — Daily Ledger UI

> **Rule:** the screenshots (Dashboard, Settings, Statistics) are the source of truth. Do not redesign. Everything below describes what is visible and extends it to unbuilt screens using the same components.
>
> **Caveat:** values marked `~` are estimated by eye from screenshots. The real values live in the project's CSS/Tailwind config. Ask the agent to export them into one tokens file (`resources/css/tokens.css` or `tailwind.config`) and replace the estimates here.

---

## 1. Look and feel
Dark, minimal, neutral. Near-black canvas, hairline borders, white primary actions, one warm accent (orange/peach) used only for data (category dots, progress bars, chart bars). Looks like a shadcn/ui-style system: sidebar layout, cards, popover-like selects.

## 2. Tokens (estimated)

| Token | Value | Use |
|-------|-------|-----|
| `--bg` | ~`#0A0A0A` | page canvas |
| `--sidebar-bg` | ~`#0D0D0D`–`#101010` | sidebar |
| `--surface` | ~`#0F0F0F`–`#111111` | cards (very slightly lifted from bg) |
| `--surface-hover` | ~`#171717` | active nav item, hovered card (e.g. "Review your spending") |
| `--border` | ~`#222`–`#2A2A2A` | 1px card/input borders |
| `--text` | ~`#FAFAFA` | headings, values |
| `--text-muted` | ~`#A1A1A1` | labels, helper text, eyebrow |
| `--accent` | ~`#E8A27A` (peach-orange) | category bars/dots, chart bars |
| `--primary-bg` / `--primary-text` | `#FFFFFF` / `#0A0A0A` | primary buttons, logo tile |
| Radius | cards ~12px, buttons/inputs ~8px, progress bars full pill | |
| Font | geometric grotesque sans (Geist-like), tight tracking on headings | confirm in CSS |

Semantic colors still to define (not visible): **success** (green), **danger** (red), **warning** (amber), and one distinct color for each of ~12 categories. Income vs expense needs a clear pair, e.g. green-ish and the existing accent, never red/green only (accessibility).

## 3. Type scale (estimated from screenshots)

| Role | Size / weight |
|------|---------------|
| Page title (H1) | ~28–30px / 600 |
| Eyebrow above title | ~13px / 400 muted |
| Page subtitle | ~13px muted |
| Card title | ~15px / 600 |
| Card subtitle / helper | ~12px muted |
| Stat value | ~24px / 700 |
| Nav item | ~13–14px / 500 |
| Body/table text | ~13–14px |

## 4. Layout

### App shell
- **Sidebar** (~240px wide, collapsible via the icon button top-left of the top bar).
  - Top: white rounded square logo tile + wordmark "Daily Ledger" (bold).
  - Group label **Finance** (small muted).
  - Nav: Dashboard, Add Transaction, Transaction History, Categories, Statistics, Settings — each a line icon + label; **active** item = lifted rounded background.
  - Bottom: user chip — circular avatar with initials ("TU"), username, up/down chevron (opens menu: Profile, Settings, Log out).
- **Top bar** (~66px, bottom border): sidebar toggle + breadcrumb text (shown on Dashboard: "Dashboard").
- **Content**: scrolls independently, rounded container with a hairline border against the sidebar.

### Content widths (as built)
- Dashboard: ~1000px column, centered.
- Statistics: ~580px column, centered.
- Settings: left-aligned, ~480px card.
See §8 — these should be unified.

## 5. Components

| Component | Spec |
|-----------|------|
| **Page header** | eyebrow (muted) → H1 → subtitle; optional action on the right (e.g. *+ Add transaction*) |
| **Primary button** | white background, dark text, ~8px radius, icon (16px) + label, ~36–40px tall |
| **Stat card** | bordered card; muted label top-left, line icon top-right; large value; muted helper line below. Four-up grid on Dashboard, three-up on Statistics |
| **Link card** | like stat card but with title, helper line and arrow icon; hover = `--surface-hover` ("Review your spending") |
| **List card** | header (title + subtitle + optional "View all" link) separated by a divider from rows; row = colored dot, primary text, muted meta (`Category · date`), right-aligned bold amount |
| **Category bar row** | name (bold) left, amount right (muted), 6px pill bar below filled with the category color; in Statistics also a dot and `(count)` badge |
| **Select** | bordered, ~44px tall, ~8px radius, chevron right; label + helper text above, in a card row with a round-square icon tile on the left (Settings) |
| **Date input** | native date field in a bordered input with calendar icon; paired From/To + *Update* button |
| **Icon tile** | ~36px rounded square, subtle lifted background, line icon |
| **Settings tabs** | text list: Profile, Security, Appearance (plain text links, no active style visible yet) |
| **Divider** | 1px `--border` |
| **Avatar** | circle, initials, subtle background |

Icons are a consistent **line icon** set (Lucide-style, ~16–20px, 1.5px stroke). Keep one set.

## 6. Screen inventory

### 6.1 Built (from screenshots)
1. **Dashboard** — header + *Add transaction*; 4 cards (Spent today, This month, Transactions, Review your spending); two-column row: *Recent transactions* (wider) + *Top categories*.
2. **Settings** — card with Currency select and Date format select, *Save preferences* button right-aligned in a footer strip with divider. Left sub-nav: Profile, Security, Appearance.
3. **Statistics** — header + date range panel (From, To, Update); 3 stat cards (Total spending, Purchases, Average purchase); two cards: *Spending by category* and *Daily spending*.

### 6.2 To build, using only the components above
| Screen | Layout |
|--------|--------|
| **Login** | centered single card (~400px) on `--bg`, logo + "Daily Ledger", fields **Email or username** and **Password** (eye icon toggle inside the input), "Remember me", primary full-width *Sign in*, "Forgot password?" and "Don't have an account? Register" links |
| **Register** | same card: Username, Email, Password (toggle), Confirm password (toggle), primary *Create account*, "Already have an account? Sign in" |
| **Verify email notice** | same card: message + *Resend email* (secondary button) + *Log out* link |
| **Forgot / reset password** | same card, one or two fields |
| **Add transaction / Edit** | page header + one form card (~560px): segmented **Expense / Income** toggle, Amount (with currency prefix), Category select (filtered by type), Date, Note (textarea), footer strip with *Cancel* (ghost) and *Save* (primary). Edit = same, pre-filled, title "Edit transaction" |
| **Transaction history** | page header + filter bar (search, category, type, date range) above a list card; each row = dot, note/category, date, amount (income/expense styled differently), whole row is a link; pagination footer; empty state |
| **Transaction detail** | a card with label/value pairs (Amount, Type, Category, Date, Note, Created), header actions *Edit* (secondary) and *Delete* (danger outline) |
| **Categories** | tabs Expense / Income; list card of category rows (dot, name, count, total for the month) with a *+ New category* button and per-row edit/delete menu; modal for create/edit (name, color swatches) |
| **Settings → Profile / Security / Appearance** | same card pattern as the current Settings card; Security contains *Change password* and a *Danger zone* card (Reset data, Delete account) with a danger-outline button and confirm dialog |
| **Settings → About** | small card with app name, version, description |
| **Confirm dialog** | centered modal, title, one-line consequence, *Cancel* + danger primary; type-to-confirm input for Reset data |
| **Toast** | bottom-right, bordered dark card with a small leading status icon, auto-dismiss ~4–6s; delete toast carries *Undo* |
| **Error pages** | 404/419/500 using the auth card layout with a *Go to dashboard* button |
| **Empty states** | muted icon tile + one-line title + one-line help + primary action; for Dashboard, History, Statistics, Categories |

## 7. States every component needs
default, hover, focus (visible ring, e.g. 2px white/70% offset), active, disabled, loading (button spinner, skeleton rows), error (red border + message below the field), success.

Forms: validation message under the field in muted red, never only in a toast.

## 8. Observations on the current screens (not changed, flagged for you)

1. **Daily spending chart looks broken.** With one data point it renders as a big flat grey block (~240×170px) instead of a bar in the accent color, and the label reads "Oct 7". Needs: accent-colored bars, fixed max bar width, a value axis or tooltip, scale relative to the max value, and a proper empty/one-point state.
2. **Settings page is inconsistent with the others.** The heading "Settings" appears twice (a page header on the left plus a second one inside the content), the left sub-nav floats beside the card, and the content is left-aligned while Dashboard/Statistics are centered. Pick one structure (suggest: one header, left sub-nav, content column).
3. **Content widths differ** (Dashboard ~1000px, Statistics ~580px, Settings ~480px). Standardize on one max-width (e.g. ~1000px) and let sections go narrower inside it.
4. **Top bar breadcrumb** shows only on Dashboard. Show a consistent breadcrumb/title on every page or remove it everywhere.
5. **Spending only.** There's no income, no balance card, and the History/Add pages in the raw idea expect a type toggle. See LOGIC.md D1.
6. **Active nav on Settings sub-tabs** (Profile/Security/Appearance) has no selected style yet.
7. **Number format** `IDR 20,000` vs the Indonesian convention `Rp20.000`. Tie it to the Currency/Locale setting.
8. **Settings page has no About or Reset data**, both from the raw idea.
9. **Dashboard "Spent today IDR 0"** while the only transaction is dated 07/10/2026 and today is 13/10/2026 — behaving correctly, but it shows why demo data (SCHEMA.md §7) is needed to review the design.
10. **Date input** in Statistics uses the browser's native format; make sure it matches the chosen Date format setting (display) while submitting ISO `YYYY-MM-DD`.
11. **Accessibility**: muted text on near-black must stay ≥ 4.5:1; the peach accent alone must not be the only carrier of meaning (also label by text); icons need `aria-label`s on icon-only buttons (sidebar toggle, user menu).
12. **Responsive** behavior is undefined: under ~768px collapse the sidebar into an off-canvas drawer, make card grids 2-up then 1-up, history rows stack amount under title.

## 9. Implementation notes for the agent
- One layout component for the authenticated shell and one for guest pages (auth cards).
- Reusable Blade components: `x-card`, `x-stat-card`, `x-page-header`, `x-button`, `x-input`, `x-select`, `x-toast`, `x-empty-state`, `x-category-bar`, `x-confirm-dialog`.
- All colors, radii and spacing from CSS variables listed above; no hard-coded hex in views.
- All money and dates go through two helpers (`money()` and `fdate()`) that read the user's preferences.
