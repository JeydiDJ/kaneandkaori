# Kane & Kaori

Kane & Kaori is a fragrance storefront and studio dashboard built for a brand centered on purposeful scent, memory, and everyday ritual. The public site presents the collection and guides customers through a guest checkout flow, while the private studio area gives admins the tools to manage products, monitor orders, and move orders through fulfillment.

## What This Project Does

- Presents the Kane & Kaori brand story and fragrance catalog through a custom Next.js storefront.
- Lets customers browse products, view fragrance details, add items to a persistent cart, and place guest orders.
- Validates checkout requests against live product availability before creating orders.
- Sends order notification and status emails.
- Gives admins a protected studio area for product management, order review, reporting, and fulfillment updates.

## Main User Flows

### Customer experience

1. Land on the homepage and explore the brand story.
2. Browse the fragrance collection on `/products`.
3. Open a product page to review notes, price, and stock.
4. Add items to the cart or go straight to checkout.
5. Submit delivery and payment details through guest checkout.
6. Receive an order reference after a successful submission.

### Admin experience

1. Sign in at `/studio/login` with an admin account.
2. Access the studio dashboard.
3. Create or edit products.
4. Review incoming orders.
5. Move orders through `Pending -> Confirmed -> Packed -> Shipped -> Delivered`, or cancel them when needed.
6. Trigger inventory adjustments and customer email updates as order statuses change.

## Tech Stack

- Next.js 16 with the App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase for auth and data storage
- Resend for transactional email

## Project Structure

```text
src/app                    App Router pages, layouts, and API routes
src/components             UI and feature components
src/hooks                  Client-side state hooks such as cart handling
src/lib                    Shared utilities, Supabase clients, auth, and email helpers
src/services               Product, order, and analytics data access
src/types                  Shared TypeScript models
data                       Local JSON data used during development
docs                       Supporting project docs such as flowcharts
```

## Key Features

- Persistent cart state stored in the browser
- Guest checkout flow with order receipt
- Inventory-aware checkout validation
- Admin-only studio route protection
- Order status transitions with inventory reservation and release
- Email notifications for new orders and fulfillment updates

## Website Flowchart

```mermaid
flowchart TD
    A[Visitor lands on Home page] --> B{What do they do next?}

    B -->|Browse collection| C[Open Products page]
    B -->|Read brand info| D[Visit About, Contact, Shipping, Returns, Privacy, Terms]
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

    Z --> Z1[Admin enters email and password]
    Z1 --> Z2[Supabase sign-in]
    Z2 --> Z3{Is user an admin?}
    Z3 -->|No| Z4[Reject access and sign out]
    Z3 -->|Yes| Z5[Open Studio dashboard]

    Z5 --> Z6{Choose admin task}
    Z6 -->|Manage products| Z7[Create or edit products]
    Z6 -->|Manage orders| Z8[Open orders table]
    Z6 -->|View reports| Z9[Open reports page]

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
```

## Local Development

Install dependencies and start the app:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env.local` file with the required values:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
ORDER_NOTIFICATION_EMAIL=
ORDER_FROM_EMAIL=
```

Notes:

- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` can be replaced with `NEXT_PUBLIC_SUPABASE_ANON_KEY` if that is what your Supabase project uses.
- `SUPABASE_SERVICE_ROLE_KEY` is required for server-side order and inventory operations.
- `RESEND_API_KEY` is required for order notification and status emails.
- `ORDER_FROM_EMAIL` is optional. If omitted, the app falls back to a Resend onboarding sender.

## Available Scripts

- `npm run dev` starts the local development server.
- `npm run build` creates a production build.
- `npm run start` runs the production build locally.
- `npm run lint` runs ESLint.

## Important App Areas

- [`src/app/page.tsx`](D:\Passion%20Projects\KaneandKaori\kaneandkaori\src\app\page.tsx) is the storefront landing page.
- [`src/app/checkout/page.tsx`](D:\Passion%20Projects\KaneandKaori\kaneandkaori\src\app\checkout\page.tsx) and [`src/components/checkout/CheckoutForm.tsx`](D:\Passion%20Projects\KaneandKaori\kaneandkaori\src\components\checkout\CheckoutForm.tsx) power guest checkout.
- [`src/app/api/checkout/route.ts`](D:\Passion%20Projects\KaneandKaori\kaneandkaori\src\app\api\checkout\route.ts) handles order validation and creation.
- [`src/app/studio/login/page.tsx`](D:\Passion%20Projects\KaneandKaori\kaneandkaori\src\app\studio\login\page.tsx) handles admin sign-in.
- [`src/app/api/orders/[id]/status/route.ts`](D:\Passion%20Projects\KaneandKaori\kaneandkaori\src\app\api\orders\[id]\status\route.ts) handles order status transitions, inventory changes, and status emails.
- [`docs/website-flowchart.md`](D:\Passion%20Projects\KaneandKaori\kaneandkaori\docs\website-flowchart.md) contains a Mermaid flowchart of the full site journey.

## Purpose

This project is not just an online shop. It is a branded commerce experience for Kane & Kaori, designed to connect storytelling, product discovery, and lightweight order operations in one application.
