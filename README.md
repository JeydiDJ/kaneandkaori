# Kane & Kaori

Kane & Kaori is a branded commerce site built with Next.js for a fragrance label focused on ritual, memory, and becoming. The app combines a public storefront, a protected studio dashboard for operations, and a blog system for editorial publishing.

## Overview

This project currently supports three main surfaces:

- A public storefront for product discovery, cart management, and guest checkout
- A protected studio area for admins to manage products, orders, reports, and blog posts
- A public blog with featured articles, SEO metadata, and structured data

## Core Features

### Storefront

- Home, about, contact, shipping, returns, privacy, and terms pages
- Product listing and individual product detail pages
- Persistent cart state in the browser
- Guest checkout flow
- Inventory-aware order validation before order creation
- Order receipt experience after successful checkout

### Studio Admin

- Admin login backed by Supabase auth
- Protected studio routes
- Product create and edit flows
- Order review and lifecycle management
- Reporting page for operational visibility
- Inventory reservation and release during order status changes

### Blog

- Public `/blog` landing page with featured and recent published posts
- Individual blog post pages at `/blog/[slug]`
- Admin CRUD flow for blog posts inside `/studio/blog`
- Cover image upload to Supabase Storage
- SEO title and description controls per post
- Schema.org metadata for blog index and blog post pages

## Main User Flows

### Customer journey

1. Visit the homepage and explore the brand story
2. Browse fragrances on `/products`
3. Open a product page to review notes, pricing, and availability
4. Add items to cart or continue directly to checkout
5. Submit guest checkout details
6. Receive an order reference after successful order creation

### Admin journey

1. Sign in at `/studio/login`
2. Access the studio dashboard
3. Manage products, orders, reports, and blog posts
4. Update order statuses as fulfillment progresses
5. Create draft or published blog articles and optionally feature them on the blog homepage

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase Auth, Database, and Storage
- Resend for order and contact notifications
- EmailJS for the public contact form

## Project Structure

```text
src/app                    App Router pages, layouts, and API routes
src/components             Feature and UI components
src/hooks                  Client-side hooks such as cart state
src/lib                    Shared clients, helpers, auth, SEO, and email utilities
src/services               Server-side data access and domain services
src/types                  Shared TypeScript models
data                       Local JSON seed-style data used in development
docs                       Supporting SQL and project documentation
public                     Public static assets
```

## Important Routes

### Public

- `/` home page
- `/products` product listing
- `/products/[id]` product detail
- `/cart` cart
- `/checkout` guest checkout
- `/contact` contact form
- `/blog` blog landing page
- `/blog/[slug]` blog article page

### Studio

- `/studio/login` admin sign-in
- `/studio` dashboard overview
- `/studio/products` product management
- `/studio/orders` order management
- `/studio/reports` reports
- `/studio/blog` blog management

## Environment Variables

Create a `.env.local` file in the project root.

### Required for core app

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`NEXT_PUBLIC_SUPABASE_ANON_KEY` can be used instead of `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` if that matches your Supabase project setup.

### Required for email notifications

```env
RESEND_API_KEY=
ORDER_NOTIFICATION_EMAIL=
```

### Optional but recommended

```env
ORDER_FROM_EMAIL=
CONTACT_NOTIFICATION_EMAIL=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_BING_SITE_VERIFICATION=
NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=
```

Notes:

- `SUPABASE_SERVICE_ROLE_KEY` is required for server-side order creation, inventory updates, and blog queries
- `RESEND_API_KEY` is required for order and contact notification emails sent from server routes
- `ORDER_FROM_EMAIL` should use a verified Resend sender domain in production
- `CONTACT_NOTIFICATION_EMAIL` falls back to `ORDER_NOTIFICATION_EMAIL` if omitted
- `NEXT_PUBLIC_SITE_URL` is used for canonical URLs and absolute metadata URLs
- The EmailJS keys are required for the browser-based contact form submission flow

## Supabase Setup

### Database

The app expects Supabase tables for products, orders, admin access, and blog posts. For the blog feature, run the SQL in [docs/blog_posts.sql](/D:/Passion%20Projects/KaneandKaori/kaneandkaori/docs/blog_posts.sql) to create the `blog_posts` table and its `updated_at` trigger.

For a quick view of how the main entities connect, see the ERD in [docs/database-erd.md](/D:/Passion%20Projects/KaneandKaori/kaneandkaori/docs/database-erd.md).

### Storage

Create a public Supabase Storage bucket named `blog-images`.

The studio blog editor uploads cover images into that bucket and stores the returned public URL on each post.

## Local Development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev` starts the local development server
- `npm run build` creates a production build
- `npm run start` runs the production build locally
- `npm run lint` runs ESLint

## Operational Notes

- Blog pages only display posts where `is_published = true`
- Blog posts are ordered by `featured`, then `published_at`, then `created_at`
- The blog editor generates the slug from the post title when saving
- Checkout validates items against current product availability before creating an order
- Order status changes can trigger inventory adjustments and customer notifications
- `next.config.ts` allows remote images from Unsplash and the configured Supabase host

## Key Files

- [src/app/page.tsx](/D:/Passion%20Projects/KaneandKaori/kaneandkaori/src/app/page.tsx) storefront landing page
- [src/app/checkout/page.tsx](/D:/Passion%20Projects/KaneandKaori/kaneandkaori/src/app/checkout/page.tsx) checkout route
- [src/app/api/checkout/route.ts](/D:/Passion%20Projects/KaneandKaori/kaneandkaori/src/app/api/checkout/route.ts) order validation and creation
- [src/app/blog/page.tsx](/D:/Passion%20Projects/KaneandKaori/kaneandkaori/src/app/blog/page.tsx) public blog index
- [src/app/blog/[slug]/page.tsx](/D:/Passion%20Projects/KaneandKaori/kaneandkaori/src/app/blog/[slug]/page.tsx) public blog post page
- [src/app/studio/(protected)/blog/page.tsx](/D:/Passion%20Projects/KaneandKaori/kaneandkaori/src/app/studio/(protected)/blog/page.tsx) admin blog management
- [src/components/admin/BlogPostForm.tsx](/D:/Passion%20Projects/KaneandKaori/kaneandkaori/src/components/admin/BlogPostForm.tsx) blog create and edit form
- [src/services/blogService.ts](/D:/Passion%20Projects/KaneandKaori/kaneandkaori/src/services/blogService.ts) published blog queries
- [docs/website-flowchart.md](/D:/Passion%20Projects/KaneandKaori/kaneandkaori/docs/website-flowchart.md) end-to-end site flow

## Website Flowchart

```mermaid
flowchart TD
    A[Visitor lands on Home page] --> B{What do they do next?}

    B -->|Browse collection| C[Open Products page]
    B -->|Read brand info| D[Visit About, Contact, Shipping, Returns, Privacy, Terms]
    B -->|Read blog| BA[Open Blog page]
    B -->|Admin access| Z[Open Studio Login]

    C --> E[View product grid]
    E --> F[Open product details]
    F --> G{Choose an action}

    G -->|Add to cart| H[Cart stored in local browser storage]
    G -->|Go straight to checkout| J[Open Checkout page]
    G -->|Keep browsing| C

    H --> I[Open Cart page]
    I --> I1{Cart empty?}
    I1 -->|Yes| C
    I1 -->|No| I2[Review items, update quantity, or remove products]
    I2 --> I3{Ready to order?}
    I3 -->|Keep shopping| C
    I3 -->|Continue| J

    J --> J1{Cart has items?}
    J1 -->|No| C
    J1 -->|Yes| K[Fill guest checkout form]

    K --> L[Submit order to /api/checkout]
    L --> M[Server validates cart and requested quantities]
    M --> N[Fetch active products and check inventory]
    N --> O{Valid order?}

    O -->|No| P[Return error message to checkout form]
    P --> K

    O -->|Yes| Q[Create order record in Supabase]
    Q --> R[Create order item records]
    R --> S[Send new-order notification email]
    S --> T[Return success response]
    T --> U[Clear cart]
    U --> V[Show receipt and order reference]
    V --> W[Customer can contact support using reference number]

    BA --> BB[View featured and recent published posts]
    BB --> BC{Choose an article?}
    BC -->|Yes| BD[Open /blog/[slug]]
    BC -->|No| BA
    BD --> BE[Read article, metadata, and structured content]

    Z --> Z1[Admin enters email and password]
    Z1 --> Z2[Supabase sign-in]
    Z2 --> Z3{Is user an admin?}
    Z3 -->|No| Z4[Reject access and sign out]
    Z3 -->|Yes| Z5[Open Studio dashboard]

    Z5 --> Z6{Choose admin task}
    Z6 -->|Manage products| Z7[Create or edit products]
    Z6 -->|Manage orders| Z8[Open orders table]
    Z6 -->|View reports| Z9[Open reports page]
    Z6 -->|Manage blog| Z10[Open blog manager]

    Z8 --> AA[Review and filter orders]
    AA --> AB[Open order details or quick actions]
    AB --> AC{Update status?}

    AC -->|Confirm| AD[Reserve inventory]
    AC -->|Pack| AE[Mark packed]
    AC -->|Ship| AF[Mark shipped and notify customer]
    AC -->|Deliver| AG[Mark delivered and notify customer]
    AC -->|Cancel after reserve| AH[Release inventory]

    AD --> AI[Save new status in Supabase]
    AE --> AI
    AF --> AI
    AG --> AI
    AH --> AI

    AI --> AJ[Send status email when applicable]
    AJ --> AK[Order lifecycle continues until Delivered or Cancelled]

    Z10 --> AL[Create, edit, publish, feature, or delete blog posts]
    AL --> AM[Upload cover image to blog-images bucket]
    AM --> AN[Save blog post in Supabase]
    AN --> AO{Published?}
    AO -->|Yes| AP[Post appears on public blog]
    AO -->|No| AQ[Post remains draft in studio]
```

## Website Flow

The full storefront and studio journey is documented in [docs/website-flowchart.md](/D:/Passion%20Projects/KaneandKaori/kaneandkaori/docs/website-flowchart.md).

## Purpose

Kane & Kaori is more than a storefront. It is a brand system that combines product storytelling, lightweight commerce operations, and now editorial publishing in one application.

