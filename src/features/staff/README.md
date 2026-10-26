# Staff

Prototype Medela staff directory for Internal Users.

## How to use

- `/internal/users` lists Medela people from `staffStore` in the same full-height card as Biomed Users. The heading is **Medela Users**. **Invite user** asks for a name, an email, and an Admin, Sales, or Software Update role. It adds that person to the staff directory and confirms that an invite email was sent. No email is actually delivered.
- The Users tab count is the staff directory size, not hospital-side users.

Populated fixtures are Sarah Chen (Admin), Maya Patel (Sales), and Tobias Keller (Software Update).

## Gotchas

- Data resets on a full page reload. The header **First time** switch also empties this directory until **Populated** restores the fixtures.
- These records are Internal staff, not hospital-side users. Hospital invites stay on Biomed and Sales hospital detail.
- The confirmation is a prototype message; no email is sent.

## For implementers

Replace the in-memory store with an API and real role authorization before production.
