# Firmware

Release history and the publish form.

## How to use

- `/internal/firmware` — history table
- `/internal/firmware/upload` — publish form; Publish Update prepends a release and returns to history
- `/internal/firmware/[version]?deviceType=` — read-only detail (version is not unique without device type). The card under the notes says who uploaded the release.

The history and upload **pages** wrap `AppShell fleetNav` so Devices / Firmware history / Upload firmware sit in the same slot. List pages also pass `fill` so only the rows scroll. Feature screens return content only.

History has a search field (`filterFirmwareReleases` matches version, notes, and uploader). Rows show notes and **Uploaded by:** plus the staff name in bold (`FirmwareHistorySubtitle`, also used on a device's install history). There is no sort control; history is already newest-first.

Publish collects version, device type, and notes. New releases are stored as all regions. Device type is one of Freestyle Hands-free, Symphony, or Swing Maxi so device-update matching stays exact.

## Gotchas

- `findFirmwareRelease` requires both version and device type.
- The `upload` folder must stay so it is not captured by `[version]`.
- Published releases live in memory and reset on a full reload.

## For implementers

- Replace `firmwareReleaseStore` with an API. Keep `listFirmwareReleases` as the read boundary until then.
- Add auth middleware so history, upload, and detail are not public.
- Keep Zod at the publish boundary (`publishFirmwareSchema` + `parseFormData`). The dropzone is visual only today — wire the file when the API exists.
- Pages own `AppShell`. This screen should stay embeddable.
