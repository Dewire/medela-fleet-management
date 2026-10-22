# Auth

Prototype entry point for the Internal, Sales, and Biomed workspaces.

## How to use

- `/` redirects to `/login/medela`
- `/login/medela` — role picker with three profile buttons

Login sits in `BrandFocusLayout` — black field, official lockup parked above a white card. The lockup does not move when the card grows; only the card scrolls.

Buttons route directly to `/internal`, `/sales`, or `/biomed` with no identity
handshake.

## Gotchas

- There is no real session or authorization. Log out returns to
  `/login/medela`.
- Branding comes from `features/brand` (`MedelaLogo`, `MedelaMark`, `BrandFocusLayout`). Do not re-draw the lockup here.
- Route separation is a demo convenience, not a security boundary.
- There is no register route. First-time access is out of scope for this prototype.
