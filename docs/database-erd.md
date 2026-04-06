# Kane & Kaori Database ERD

```mermaid
erDiagram
    PROFILES {
        uuid id PK
        text email
        text full_name
        text role
        timestamptz created_at
    }

    PRODUCTS {
        uuid id PK
        text name
        text slug
        text description
        numeric price
        integer inventory
        text category
        text notes
        text image_url
        boolean featured
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }

    ORDERS {
        uuid id PK
        text customer_name
        text email
        text phone
        text address_line
        text barangay
        text city_municipality
        text province
        text postal_code
        text country
        text payment_method
        text payment_reference
        text notes
        text status
        numeric subtotal
        numeric shipping_fee
        numeric total_amount
        timestamptz created_at
        timestamptz updated_at
    }

    ORDER_ITEMS {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        text product_name
        numeric price
        integer quantity
        numeric line_total
        timestamptz created_at
    }

    BLOG_POSTS {
        uuid id PK
        text title
        text slug
        text excerpt
        text content
        text cover_image_url
        text category
        text author_name
        text seo_title
        text seo_description
        boolean is_published
        boolean featured
        timestamptz published_at
        timestamptz created_at
        timestamptz updated_at
    }

    ORDERS ||--o{ ORDER_ITEMS : contains
    PRODUCTS ||--o{ ORDER_ITEMS : appears_in
```

## Notes

- `profiles.id` references `auth.users.id` in Supabase Auth, so that relationship sits outside the public schema shown here.
- `blog_posts` is standalone in the current app and is not linked to a dedicated author table.
- `order_items.product_name` preserves the item name at the time of purchase even if the product record changes later.