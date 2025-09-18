# SAFE Database Schema (Prisma)

Located at `apps/api/prisma/schema.prisma`.

Key models:
- User(id, email, phone, passwordHash, roles[USER|MODERATOR|FINANCE|ADMIN], badges[], rating)
- Listing(id, title, description, price, currency, city, lat/lng, category[ELECTRONICS..], status)
- Reservation(id, userId, listingId?, start, end, city, status[PENDING..])
- Order(id, buyerId, listingId, total, currency, cod)
- Payment(id, amount, currency, method, providerRef, status, escrow, orderId?, reservationId?)
- Delivery(id, provider, tracking, etaDays, orderId)
- Conversation(id) and Message(id, body, senderId)

Indexes, constraints, and relations are captured in the Prisma schema for PostgreSQL.

Extensions roadmap:
- Wallet balance and ledger entries per user
- Reviews with rating distribution per listing/provider
- Availability blocks per provider for calendar sync
- Webhook events store for payment/logistics providers
