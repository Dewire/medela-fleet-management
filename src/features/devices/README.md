# Devices

Fleet inventory and status chips for Medela Internal staff.

## How to use

- `listWorldDevices` / `getWorldDeviceById` — internal device table
- `filterWorldDevices` — table status and search
- `availableFirmwareUpdates` — installable packages for a device (dropdown on the detail card)
- `recommendedFirmwareUpdate` — newest package newer than what is already installed. `Not installed` is older than any real version.
- `noInstallableFirmwareMessage` — update-card copy when nothing can be offered. Only a parseable installed version is called latest.
- `deviceCatalogStore` — live fleet and per-device install logs
- `deviceCatalogStore.addDevice` — Biomed registration with an `EU-K7M2Q9XR4DP` token, or a token the caller already showed
- `generateRegistrationCode` — unique `EU-` hospital token generation
- `StatusChip` — use anywhere a device status appears

### Filter state

- `emptyDeviceFilters(status?)` — the default filter set, optionally pinned to a starting status so a route can deep-link
- `resetDeviceFilter(filters, key)` — clears one facet; backs both chip removal and the empty state
- `describeDeviceFilters(filters)` — resolves the search chip label
- `suggestFilterRelaxation(devices, filters)` — for an empty result, the one filter whose removal reveals the most devices

`DeviceListToolbar` composes the shell's search field and status segmented control. `DeviceListEmpty` turns a `suggestFilterRelaxation` result into a one-click way out.

The `/internal` page wraps `AppShell fill fleetNav`. Feature screens return list content only. Filters and rows share a `GroupedList` card so only the rows scroll. The Devices tab count follows the list filters via `fleetNavCountStore` when the list is open, and uses the catalog size on the other fleet tabs. `/internal/devices` redirects here, including a `?status=` filter. Device rows still open `/internal/devices/[id]`. Identity and the next firmware share one card; firmware history is a second card with the title separated from the rows. History rows use the same uploader credit as the firmware catalog, with notes shortened to the first clause. Device detail uses the shell `DefinitionList` for model and firmware.

The `/biomed` list reads the same live catalog but only shows devices carrying
the fixture organisation ID. Six St Mary's devices are part of that catalog,
so the hospital list is populated on every load. It uses the same status chips
and status filter as the internal list. Registration adds organisation
ownership and a per-device token. The token is shown on the device detail,
not on the list row.

## Gotchas

- Status colors are fixed: amber needs-update, green updated, red failed.
- Search matches device ID and model only, not city or hospital.
- Status is the visible segmented axis, so `describeDeviceFilters` deliberately omits it. Adding it would give one filter two controls.
- `suggestFilterRelaxation` assumes the current result is empty; it only returns a removal that reveals at least one device, and ties go to the less intentional facet (search is suggested last).
- Sample data is in-memory only.
- Biomed device registrations and their tokens reset on a full reload.
- Starting an update on a device finishes in `DEVICE_UPDATE_DURATION_MS` (12s) so the progress is visible without waiting minutes. The device then shows as updated on the list.

## For implementers

- Replace `deviceCatalogStore` with an API. Keep `listWorldDevices` / `getWorldDeviceById` as the read boundary until then.
- Add auth middleware so `/internal/devices/[id]` is not public.
- Keep filter and update rules in `lib/`; do not move them into components.
- Pages own `AppShell`. This screen should stay embeddable.
