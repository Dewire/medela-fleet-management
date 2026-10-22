# Organizations

Prototype customer-organisation directory for the Medela Sales portal.

## How to use

- `/sales` lists organisations from `organizationStore` in the same full-height card as the device list. Search matches hospital name, city, and country. **Most recent** is selected by default; **A–Z** is the other order. Seed order is oldest first, and a hospital added in the session is the newest. That new row stays yellow until it is opened once. Each row shows the hospital, its city and country, and a user-count chip. **Add organisation** opens a modal for the hospital name, city, country, and at least one admin email. City and country suggest known places; choosing a city fills the country. **Save** stays off until the name, city, country, and one admin email are valid. Extra email rows can be added; blank extra rows are ignored.
- `/sales/organizations/new` redirects back to `/sales`.
- `/sales/organizations/[id]` follows the device-detail layout: page title, back link, a hospital card (name, city, country), then **Hospital-side users**. Each user carries an Admin or User tag. **Add user** opens that form in a modal and stays off until the name, email, and role are valid. An authorised **Created by** card records the sales person and date. New organisations are attributed to Maya Patel.

Forms validate with Zod before writing to the in-memory store. Organisation
names and user emails must be unique case-insensitively.

## Gotchas

- Data resets on a full page reload.
- Directory users are records managed by Sales; they are not login accounts.
- The admin tooltip describes an invitation email. The prototype stores the address and does not send mail. Admin display names are derived from the email.
- Emails added in the **Add organisation** modal are always stored with the `admin` role. Users added on the detail page default to `user`.
- Dynamic organisation pages resolve records in the client store so newly
  created organisations work during client navigation.

## For implementers

Replace the repository and store with an API while keeping the hook boundary.
Add authorization before treating Sales route separation as a security control.
