# Brand

The official Medela identity: the lockup, the trefoil mark, and the palette they belong to.

## How to use

- `MedelaLogo` — the full horizontal lockup. Use it wherever the product needs to identify itself: auth screens, the app header, empty states. Set a height class (`h-7`, `h-9`) and let the 168:32 ratio pick the width. The wordmark follows `currentColor`, so `text-white` inverts it for dark surfaces.
- `MedelaMark` — the trefoil on its own, for tight spots (favicons, compact headers) and as oversized artwork. It is `aria-hidden`, so give it visible accompanying text.
- `BrandFocusLayout` — the black auth frame (large lockup, watermark). Login uses it; put the white card in the children. The lockup is parked at a fixed viewport offset so the card cannot move it; only the card scrolls.
- `public/medela-logo.svg` and `public/medela-mark.svg` — the same artwork as static files, for `<link rel="icon">`, Open Graph images, and anything outside React.
- `src/app/opengraph-image.tsx` — the social-share card. It draws the official lockup (white wordmark, orange trefoil) on brand ink with the metadata line **Fleet Management for Medela devices**.

Brand colours live as `--brand-*` tokens in `src/app/globals.css` and are exposed to Tailwind as `brand-yellow`, `brand-teal`, `brand-orange`, and `brand-ink`.

| Token | Hex | Medela's own role |
| --- | --- | --- |
| `--brand-yellow` | `#ffcd00` | Primary call to action, always with near-black text |
| `--brand-teal` | `#007a8c` | Secondary actions, links, focus rings |
| `--brand-orange` | `#ff8200` | The trefoil, plus sparing accents |
| `--brand-ink` | `#292929` | Headings and body copy |

## Gotchas

- The paths in `lib/medela-artwork.ts` are traced verbatim from Medela's published asset (`https://www.medela.com/configuration/brand/logo-medela.svg`). Refetch that file rather than nudging coordinates — the lockup's spacing is part of the identity.
- Never put yellow text on white. Medela uses yellow as a *fill* with dark text on top; `--primary` is the teal precisely so `text-primary` links stay legible.
- The trefoil keeps its orange in every theme. It is the one colour that does not follow the surface.
- `MEDELA_MARK_TRANSFORM` exists because the trefoil sits at the right edge of the lockup's coordinate space; it recentres those coordinates inside a square viewBox. It is meaningless outside `MEDELA_MARK_VIEW_BOX`.
