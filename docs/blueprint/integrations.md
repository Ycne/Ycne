# Integration Strategy (Algeria)

## Payments
- Short-term:
  - COD: Order.cod=true with Delivery provider integration; payment status captured on delivery.
  - BaridiMob: Deep link or QR initiation; confirm via callback webhook.
- Medium-term:
  - SATIM: Unified gateway for CIB/EDAHABIA. Build provider module with redirect flow, signature validation, and webhook.
- Long-term:
  - PayPal/Stripe for digital goods and diaspora. Region toggles; currency conversion when needed.

## Logistics
- Yalidine API: create shipment, label, tracking; store tracking and ETA in `Delivery`.
- ZR Express API: same contract via provider adapter interface.

## Messaging
- WhatsApp Business API (Cloud or On-prem): send transactional messages (booking confirmation, delivery ETA). Use templates with dynamic fields.

## Implementation Pattern
- Provider adapters implement a common interface per domain (payments, logistics, messaging).
- Outbound webhooks signed with HMAC. Inbound webhooks verified with provider keys.
