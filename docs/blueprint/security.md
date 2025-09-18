# Security Protocols

- Transport: Enforce HTTPS (HSTS), secure cookies, SameSite, CSRF tokens for web forms where needed.
- Auth: JWT access (15m) + refresh (30d). Optional 2FA via TOTP or SMS OTP. Role-based access (USER, MODERATOR, FINANCE, ADMIN).
- Escrow: Payments marked escrow=true. Funds released when buyer confirms delivery or on reservation completion, with dispute window.
- Fraud Prevention:
  - Rate limiting per route and per IP/user.
  - Velocity checks on payments and reservations.
  - Device fingerprinting (optional future) and anomaly detection rules.
  - Moderation queue for suspicious listings and users.
- Data Protection: Hash passwords (bcrypt), salt/pepper, never log secrets. PII minimization.
- Storage: Signed URLs for uploads to S3/Spaces. Virus scan optional hook.
- Logs: Audit trails for admin actions, payment state transitions.
- Notifications: Sign web push payloads, verify WhatsApp Business signatures for webhooks.
