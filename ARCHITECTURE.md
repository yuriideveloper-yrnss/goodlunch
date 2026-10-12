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
- **`/middleware.ts`**: Handles automatic locale detection (detects `pl`, `ua`, `ru`, `be`, `en`, with default Polish fallback `pl` for Poland SEO priority) and redirects root routes to localized subpaths (e.g., `/` -> `/pl`).
- **`app/robots.ts`**: SEO & AI crawler instructions allowing full indexation for search engines (Google, Bing, DuckDuckGo) and top AI crawlers (GPTBot, OAI-SearchBot, ClaudeBot, Google-Extended, PerplexityBot). Disallows `/admin`, `/api`, `/old`, and `/*/old`.
- **`app/sitemap.ts`**: Dynamic sitemap with localized hreflang alternates (`pl-PL`, `uk-UA`, `ru-RU`, `be-BY`, `en-US`, `x-default`) and priority weighting on `https://good-lunch.pl`.
- **`public/llms.txt` & `public/llms-full.txt`**: Comprehensive AI context files summarizing GoodLunch food delivery in Wrocław, home meals (domowe obiady), Polish cuisine, diet catering offerings, delivery in Wrocław, pricing, and trial day discounts for direct LLM synthesis.
- **`lib/site.ts`**: Central site URL resolver using `NEXT_PUBLIC_SITE_URL` (defaults to custom production domain `https://good-lunch.pl`).
- **`lib/structured-data.ts`**: Generates Schema.org JSON-LD structured data (`FoodEstablishment`, `Restaurant`, `DeliveryService`, `LocalBusiness`, `FAQPage`, `WebSite`, `Product`, `OfferCatalog`, `OrderAction`) for rich search snippets and LLM extraction.
- **`app/[lang]/layout.tsx`**: Localized root layout containing global styles, fonts (Inter), locale-specific metadata, OpenGraph tags, Twitter Cards, geo-tags (Wrocław, Poland), Schema.org JSON-LD scripts, standard scripts, and global providers/layout components:
  - `OrderProvider` (State management for package calculators and orders)
  - `Header` (Sticky desktop nav / language flags toggler)
  - `Footer` (Copyright, logo, social media links)
  - `LoadingScreen`, `FloatingBackgrounds`, `TrackingScripts`
- **`app/[lang]/page.tsx`**: Localized main Landing page with **Smart Catering** as the primary flow:
  - `Hero` (opens Smart Catering QuickOrderModal with calorie & meal picker)
  - `Features`
  - `MenuCalendar`
  - `SmartCateringCalculator`
  - `Reviews`
  - `FAQ` (5 comprehensive Q&As covering food delivery, diet catering, and restaurant comparison)
  - `SmartCateringLeadForm`
- **`app/[lang]/old/page.tsx`**: Archived legacy landing page (address inputs flow). Strictly marked `noindex, nofollow` and blocked in `robots.txt` so it is never indexed by crawlers.
- **`next.config.mjs`**: Contains permanent 308 redirects from `/:lang/external/smartcatering` to `/:lang` (and `/external/smartcatering` to `/pl`), automatically preserving query parameters (`utm_source`, `fbclid`, `bw_cid`) for Meta ad campaigns.
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
