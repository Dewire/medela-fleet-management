import { ImageResponse } from "next/og";

import {
  MEDELA_LOCKUP_VIEW_BOX,
  MEDELA_TREFOIL_PATHS,
  MEDELA_WORDMARK_PATHS,
} from "@/features/brand/lib/medela-artwork";

/** Line shown in the social card and in page metadata. */
export const alt = "Fleet Management for Medela devices";

/** Standard Open Graph preview size. */
export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

const LOCKUP_SCALE = 2.75;

/**
 * Social-share image: official Medela lockup and the product line on brand ink.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#292929",
          padding: "80px 80px 0",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
          <svg
            width={MEDELA_LOCKUP_VIEW_BOX.width * LOCKUP_SCALE}
            height={MEDELA_LOCKUP_VIEW_BOX.height * LOCKUP_SCALE}
            viewBox={`0 0 ${MEDELA_LOCKUP_VIEW_BOX.width} ${MEDELA_LOCKUP_VIEW_BOX.height}`}
          >
            {MEDELA_WORDMARK_PATHS.map((d) => (
              <path key={d} d={d} fill="#ffffff" />
            ))}
            {MEDELA_TREFOIL_PATHS.map((d) => (
              <path key={d} d={d} fill="#ff8200" />
            ))}
          </svg>
          <div
            style={{
              display: "flex",
              fontSize: 52,
              fontWeight: 600,
              lineHeight: 1.2,
              color: "#ffffff",
              letterSpacing: "-0.03em",
              whiteSpace: "nowrap",
            }}
          >
            {alt}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            height: 18,
            width: "100%",
            background: "#ffcd00",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
