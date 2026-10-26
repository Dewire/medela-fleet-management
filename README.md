# Medela Fleet Management

Prototype portal with separate Medela Internal, Medela Sales, and Biomed
workspaces for fleet operations, customer setup, and device registration.

This is a **front-end prototype**. There is no real session, API, or
persistence. In-memory stores reset on a full page reload. Role buttons and
route separation are for demonstration only; every route is publicly reachable.

## Scripts

```bash
npm run dev    # http://localhost:3000
npm test       # Vitest unit suite
npm run lint   # ESLint
```

## Routes

| Path | Screen |
| --- | --- |
| `/` | Redirects to `/login/medela` |
| `/login/medela` | Profile picker for Internal, Sales, and Biomed |
| `/internal` | Device list |
| `/internal/devices` | Redirects to `/internal` (keeps `?status=`) |
| `/internal/devices/[id]` | Device detail and OTA update |
| `/internal/firmware` | Firmware history |
| `/internal/firmware/upload` | Publish a release |
| `/internal/firmware/[version]` | Release detail (`?deviceType=` required) |
| `/internal/users` | Medela staff; invites are prototype messages |
| `/internal/profile` | Read-only account fixture |
| `/sales` | Customer organisation list |
| `/sales/organizations/new` | Redirects to `/sales`; hospitals are added in a modal |
| `/sales/organizations/[id]` | Organisation details and user management |
| `/sales/profile` | Sales account fixture |
| `/biomed` | Devices registered by the fixture hospital |
| `/biomed/devices/[id]` | One registered device and its hospital token |
| `/biomed/devices/new` | Redirects to `/biomed`; devices are added in a modal |
| `/biomed/users` | Hospital users for a Biomed admin; invites are prototype messages |
| `/biomed/profile` | Biomed account fixture |

There is no real sign-up or authentication route.

## Feature modules

Code lives under `src/features/`, organized by domain:

| Module | Role |
| --- | --- |
| `auth` | Prototype profile picker |
| `account` | Header menu and role-specific profile fixtures |
| `biomed` | Hospital device-registration workflow |
| `brand` | Lockup, trefoil, auth frame |
| `devices` | Fleet list, filters, device detail |
| `firmware` | History, publish, release detail |
| `organizations` | Sales organisation and directory-user management |
| `staff` | Medela Internal staff directory |
| `shell` | Shared chrome and list/form primitives |

Authenticated **pages** wrap `AppShell`. Feature screens return content only.

## Prototype limits

- Login buttons route directly to one workspace. There is no cookie,
  middleware, permission check, or route guard.
- Fixture identities come from `getAccountUser(role)`.
- Organisation, staff, device, and firmware mutations live in module-scoped
  stores and vanish on reload.
- Device hospital tokens are five-digit prototype codes, not secrets.
- The publish dropzone is visual only; Zod validates the form fields.

Unused list menus, dialogs, and unused shadcn table/select/badge primitives were removed on purpose. Do not treat that as a missing backlog — rebuild them when a screen needs them.

## For implementers

- Replace the in-memory stores with an API. Keep repositories as the read boundary.
- Add real identity, role authorization, and middleware before production.
- Keep Zod at form and API boundaries (`parseFormData` on the client).
- Do not import `AppShell` from feature screens; wrap it in the route file.
