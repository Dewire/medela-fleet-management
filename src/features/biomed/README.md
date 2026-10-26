# Biomed

Prototype hospital workspace for device registration.

## How to use

- `/biomed` lists devices registered to the fixture hospital in the same full-height card as the internal device list. **All** is selected by default. Search matches device ID and model, and the status control filters by Updated, Needs update, or Failed. Each row shows that status. The **Devices** tab shows the visible row count, and that number follows the filters. **Add device** sits on the tab bar and opens a connection modal. The hospital token stays on the device detail and the success step of the modal. Devices and Users share one layout so the header and tabs stay put when you switch.
- `/biomed/devices/[id]` shows the firmware running on one registered device, plus its model and hospital token. When a newer non-recalled release exists for that model, the page shows that release's version and notes, and **Activate update**. The install uses the same prototype progress as the internal device page, then marks the device updated.
- `/biomed/devices/new` redirects to `/biomed`. Registration happens in the modal.
- `/biomed/users` lists the people at the Biomed hospital. The signed-in account sees a short admin note. An info icon explains that teammates can be invited so they can see device updates and details. A User chip is a dropdown so an admin can promote them to Admin. An Admin chip stays fixed. **Invite user** sits in the list header, not on the tab bar, and asks for a name, an email, and an Admin or User role. It adds that person to the same directory Sales uses and confirms that an invite email was sent. No email is actually delivered.

The list starts with six St Mary's devices in the device catalog: two current on `v2.4.0`, one on an older release, one whose last update failed, and two with no firmware installed. Those fixtures stay across a reload. `KF-2026-38977` is one of the devices with no firmware installed.

The modal issues a unique five-digit token, asks for that code to be entered on the device's Wi-Fi screen, then simulates a cloud check. About one in four checks fails. A device is written to `deviceCatalogStore` only after a successful check, assigned to the active Biomed organisation, with firmware `Not installed` and status `needs-update`.

## Gotchas

- Devices added during a session, and their tokens, reset on a full page reload. The seeded St Mary's devices do not.
- Tokens are five-digit prototype codes, not credentials or security secrets.
- Closing the modal before a successful check discards the token. **Try again** reuses the same token.
- The Biomed fixture is currently tied to St Mary's Hospital.
- Invited users are stored in the organisation directory. The confirmation is a prototype message; no email is sent. They disappear on a full page reload, along with other session changes.
- The header **First time** switch empties the hospital directory. The Biomed fixture can still open Users and invite. The first invite creates a bare St Mary's hospital, then adds that person.

## For implementers

Replace the in-memory registration with an API that issues cryptographically
secure, expiring enrollment tokens before using this workflow in production.
