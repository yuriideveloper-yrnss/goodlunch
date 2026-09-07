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
- **`app/[lang]/external/smartcatering/page.tsx`**: Localized Smart Catering funnel copy. Captures lead contacts without requesting delivery address, fires tracking events (`smartcatering_lead`, `InitiateCheckout`, `trackLead`), logs to Supabase with status `SmartCatering`, notifies Telegram with dedicated alert, and redirects directly to Mobilny Catering store products (3 meals: `https://goodlunch-catering.mobilnycatering.pl/sklep/produkt/3-posiki/3574`, 4 meals: `https://goodlunch-catering.mobilnycatering.pl/sklep/produkt/4-posiki/3575`).
- **`app/[lang]/privacy-policy/page.tsx`**: Localized Privacy Policy & Cookies page displaying the full legal policy document with a desktop-sticky table of contents and back-to-home navigation links.
- **`app/admin/`**: Admin portal layout and client component containing the dashboard:
  - `layout.tsx`: Base wrapper.
  - `page.tsx`: Full operational dashboard to view/manage orders, update menu, filter by date, search, and change statuses (including `SmartCatering`).

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
- **`components/ui/`**: Interactive micro-animations, loading animations, dialogs, and reusable custom primitives (e.g., `apple-calendar-picker.tsx` for calendar date selection).
- **`components/sections/`**: Modular sections of the landing page (Hero, Reviews, Calculator):
  - `Reviews.tsx`: Locale-aware multimedia reviews gallery (serves Polish/English reviews for `pl`/`en` and Ukrainian/Russian reviews for `ua`/`ru` directly from Supabase Storage `goodlunch content` bucket).
- **`components/smartcatering/`**: Smart Catering external order flow components:
  - `SmartCateringCalculator.tsx`: Pricing calculator opening external checkout modal.
  - `SmartCateringModal.tsx`: Single-step lead modal without address inputs.
  - `SmartCateringLeadForm.tsx`: Bottom section lead capture with package selector.
  - `SmartCateringForm.tsx`: Unified contact submission, tracking dispatcher, and direct redirector.
- **`lib/smartcatering.ts`**: Mobilny Catering product URL mapping (3 meals vs 4 meals) and redirect resolver.
- **`lib/supabaseClient.ts`**: Supabase client connection (using Service Role Key for secure server-side execution).
- **Supabase Storage**: `goodlunch content` public bucket hosting all video (`.mp4`/`.webm`) and photo (`.png`/`.jpg`) testimonials.
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
