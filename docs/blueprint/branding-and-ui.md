# SAFE Design Identity

- Visual language blends Algerian zellige geometry with modern minimal UI.
- Light theme: Sahara sands with Mediterranean accents.
- Dark theme: Deep navy/charcoal with glowing line art.

## Colors
- Primary emerald: #0A7A4F
- Desert sand: #F3E8D1
- Terracotta: #C76A3A
- Ochre: #D0A85C
- Mediterranean teal: #2E6D73
- White: #FFFFFF
- Dark base: #0B1220
- Accent red (flag): #C62828

Tokens are implemented in `apps/web/src/index.css`.

## Typography
- Display: Playfair Display (serif)
- UI: Inter (sans)

## Components
- Mobile-first cards, tabs, bottom nav, FAB. ShadCN UI base.

## Patterns
- `bg-zellige-light` and `bg-zellige-dark` utility classes render subtle geometric backgrounds.

## UI Screens
- Home: search bar, categories grid, promos carousel
- Marketplace: product grid, price + location tag, quick Chat button
- Reservations: calendar, time slots, booking CTA
- Checkout: 2-step modal (method + confirm)
- Profile: avatar, badges, activity
- Admin (v0): users list endpoint
