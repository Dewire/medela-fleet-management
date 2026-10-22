# Account

Header avatar menu and profile fixtures for each prototype portal.

## How to use

- `AccountMenu` lives in `AppHeader`. Everyone sees Profile and Log out.
- `/internal/profile`, `/sales/profile`, and `/biomed/profile` show the active
  route's fixture. Pages wrap `AppShell`; `ProfileScreen` returns the card only.

This module is only ever about the signed-in user.

`getAccountUser(role)` is the only way UI should resolve a fixture identity.
`getPortalHrefs(role)` owns profile and home links. There is no session.

## Gotchas

- Log out goes to `/login/medela`. It does not clear state because role is
  represented by the current route.
- Initials are stored on the fixture. Do not derive them from the name — titles like "Dr." would produce the wrong mark.
