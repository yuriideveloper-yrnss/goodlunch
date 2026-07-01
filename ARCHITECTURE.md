# GoodLunch Architecture

## 1. Project Status & Tech Stack
- **Framework:** Next.js (App Router) with TypeScript
- **Styling:** TailwindCSS
- **Database / Backend:** Supabase (PostgreSQL client)
- **Deployment:** Vercel (Edge Functions, Analytics)
- **Notifications:** Telegram Bot API (for real-time order alerts)
- **Analytics & Tracking:** Vercel Analytics, custom pixel/event tracking (`lib/tracking.ts`)

---

## 2. Route & File Map

### Routing Structure (Next.js App Router)
- **`/middleware.ts`**: Handles automatic locale detection (detects `pl`, `ua`, `ru`, defaulting to `en`) and redirects root routes to localized subpaths (e.g., `/` -> `/pl`).
- **`app/robots.ts`**: SEO robots instructions.
- **`app/[lang]/layout.tsx`**: Localized root layout containing global styles, fonts (Inter), locale-specific metadata, standard scripts, and global providers/layout components:
  - `OrderProvider` (State management for package calculators and orders)
  - `Header` (Sticky desktop nav / language flags toggler)
  - `Footer` (Copyright, logo, social media links)
  - `LoadingScreen`, `FloatingBackgrounds`, `TrackingScripts`
- **`app/[lang]/page.tsx`**: Localized main Landing page rendering layout sections:
  - `Hero`
  - `Features`
  - `MenuCalendar`
  - `PriceCalculator`
  - `Reviews`
  - `FAQ`
  - `LeadForm`
- **`app/[lang]/privacy-policy/page.tsx`**: Localized Privacy Policy & Cookies page displaying the full legal policy document with a desktop-sticky table of contents and back-to-home navigation links.
- **`app/admin/`**: Admin portal layout and client component containing the dashboard:
  - `layout.tsx`: Base wrapper.
  - `page.tsx`: Full operational dashboard to view/manage orders, update menu, filter by date, search, and change statuses.

### API Routes
- **`app/api/orders/route.ts`**: 
  - `GET`: Fetch a single order details by UUID.
  - `POST`: Create a new order or update step-by-step order data, trigger/edit Telegram notifications, and update statuses.
- **`app/api/menu/route.ts`**: Fetch current catering menu configurations.
- **`app/api/admin/`**: Admin operations endpoints:
  - `/login`: Secure session verification.
  - `/orders`: Order modifications.
  - `/menu`: Menu editing endpoints.

### Components & Libs
- **`components/ui/`**: Interactive micro-animations, loading animations, dialogs.
- **`components/sections/`**: Modular sections of the landing page (Hero, Reviews, Calculator).
- **`lib/supabaseClient.ts`**: Supabase client connection (using Service Role Key for secure server-side execution).
- **`lib/dictionary.ts`**: Translation dictionaries for `pl`, `ua`, `ru`, and `en`.
- **`lib/constants.ts`**: Hardcoded menu sizes, calories, pricing formulas, and contact credentials.
- **`lib/tracking.ts`**: Event tracking utilities.

---

## 3. Data Schema

### Supabase Table: `orders`
Used to persist catering lead steps and completed sales:
- `id` (uuid, primary key)
- `name` (text)
- `phone` (text)
- `messenger` (text)
- `street` (text)
- `house` (text)
- `floor` (text)
- `apt` (text)
- `intercom` (text)
- `deliveryDay` (text)
- `package` (text)
- `calories` (integer)
- `price` (text)
- `lang` (text)
- `status` (text: `'New'` / `'Unfinished'`)
- `telegram_message_id` (text, stores bot message ID to allow in-place message edits as the lead progresses through stages)
- `created_at` (timestamptz, defaults to `now()`)

---

## 4. Integration Mapping
- **Telegram Bot API**: Sends real-time messages to a designated Telegram Chat/Channel when leads are started or updated. Edits messages in place using `telegram_message_id`.
- **Webhooks**: Integrates with external workflow systems (like Make or Zapier) inside `actions/submit-lead.ts`.
- **Vercel Analytics**: Out-of-the-box tracking for views and vital performance indicators.
