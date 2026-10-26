# Shell

Shared chrome: brand-yellow header, grouped lists, list filter controls, auth frame, and back link.

## How to use

The yellow header has a **First time / Populated** slider, shared by Internal, Sales, and Biomed. **Populated** is the default and shows the fixture lists. **First time** empties devices, firmware, organisations, and Medela staff so the lists look like first-time onboarding. Switching discards in-session adds, the same as a reload.

Wrap authenticated **pages** in `AppShell`. Feature screens should not import it — they return page content only. Use `variant="form"` on firmware publish and detail to constrain the column. Render `SignOffCard` on those pages yourself: publish uses authorising copy, detail uses uploaded-by copy. Use `fill` on list pages so chrome stays put and the list fills the leftover laptop height. Pass `fleetNav` on the fleet list screens so `FleetNavTabs` sits in the same slot above the page. Pass `header` on `GroupedList` when title, actions, or filters should sit inside the same card as the rows.

`FleetNavTabs` is the Devices / Firmware history / Users switcher. **Upload firmware** sits on the trailing edge of Devices and Firmware history, like Sales **Add organisation**, and opens `/internal/firmware/upload?from=` with the current tab. The button is hidden on Users; the slot height stays so the bar does not jump. That page has no tab bar. The back link returns to the tab that opened it. `resolveFleetTab` picks the selected tab from the path. The selected tab uses a yellow tint and a thicker yellow underline so the current section is obvious. The Devices tab count is the visible list count when that list has published one, and the fleet catalog size otherwise, so Firmware history and Users still show a number. Firmware history shows the published-release count from the firmware catalog. Users shows the Medela staff count from `staffStore`. The Biomed Devices tab uses `biomedNavCountStore` the same way, so its count stays separate from the internal fleet.

Pass `portalRole="sales"` or `portalRole="biomed"` so header identity, logo,
profile, and home links stay inside that workspace. Add `portalNav` on the main
Sales and Biomed screens to render their role-specific tabs. `portalNavAction`
places one control on the trailing edge of that tab bar. That slot is always
the same height, so the bar does not jump when a tab has no action. The Biomed
Devices and Users lists share one layout so the header and tabs stay mounted.

### List toolbars

Filterable lists compose one row from these parts, in this order:

- `SearchField` — pill used in list toolbars (`bg-black/5`, icon then input)
- `SegmentedControl` — the single filter axis that stays visible
- `ActiveFilterChips` — sits under the row and names what is currently narrowing the list

`PopoverSurface` is the floating panel used by the account menu. `useDismiss` gives any popover outside-press and Escape handling.

### Other primitives

- `DefinitionList` — label/value rows on profile and device detail
- `InfoTooltip` — info icon on base-ui's tooltip. Opens on hover and on keyboard focus
- `FormField` / `NativeSelect` / `PrimaryActionButton` — form controls
- `Panel` / `BackLink` / `AuthShell` / `AuthHeading` — layout pieces

## Gotchas

- `fleetNav` also locks the viewport so list pages share the same main padding. The publish form no longer uses those tabs.
- The First time / Populated slider resets the in-memory catalogs. It is a prototype demo switch, not a saved preference.
- Logo goes to the active portal's home.
- The header avatar opens Profile and Log out. Log out goes to `/login/medela`.
- `SegmentedControl` is built on native radio inputs, so arrow keys navigate and the selected state is announced. Each instance scopes its own `name` via `useId`, so two controls on one page never share a group.
- `ActiveFilterChips` skips the segmented axis, since that control already shows its own state.
- `InfoTooltip` renders a solid popup, not the frosted `PopoverSurface` — dense text over a blurred page is hard to read. Its content portals outside the trigger, so do not nest it inside a `useDismiss` popover: pressing it reads as an outside press.
- Unused list menus, dialogs, and shadcn table/select/badge primitives were removed on purpose. Rebuild them when a screen needs them; they are not a missing backlog.
