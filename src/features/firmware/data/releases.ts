import type { FirmwareRelease } from "../types";

export const FIRMWARE_RELEASES: FirmwareRelease[] = [
  { version: "v2.4.0", date: "2025-12-10", region: "All regions", deviceType: "Freestyle Hands-free", status: "active", devices: 442, notes: "Battery optimisation, improved connectivity stability.", uploadedBy: "Sarah Chen" },
  { version: "v2.4.0", date: "2025-12-10", region: "All regions", deviceType: "Symphony", status: "active", devices: 198, notes: "Battery optimisation, improved connectivity stability.", uploadedBy: "Sarah Chen" },
  { version: "v2.4.0", date: "2025-12-10", region: "All regions", deviceType: "Swing Maxi", status: "active", devices: 134, notes: "Battery optimisation, improved connectivity stability.", uploadedBy: "Sarah Chen" },
  { version: "v2.4.0", date: "2025-12-10", region: "All regions", deviceType: "Queen", status: "active", devices: 86, notes: "Battery optimisation, improved connectivity stability.", uploadedBy: "Sarah Chen" },
  { version: "v2.3.1", date: "2025-09-04", region: "Europe", deviceType: "Freestyle Hands-free", status: "superseded", devices: 312, notes: "EU compliance patch — CE re-certification.", uploadedBy: "Tobias Keller" },
  { version: "v2.3.1", date: "2025-09-04", region: "Europe", deviceType: "Symphony", status: "superseded", devices: 145, notes: "EU compliance patch — CE re-certification.", uploadedBy: "Tobias Keller" },
  { version: "v2.3.0", date: "2025-07-18", region: "All regions", deviceType: "Freestyle Hands-free", status: "superseded", devices: 480, notes: "New OTA update engine, background sync.", uploadedBy: "Lena Hofmann" },
  { version: "v2.3.0", date: "2025-07-18", region: "All regions", deviceType: "Symphony", status: "superseded", devices: 200, notes: "New OTA update engine, background sync.", uploadedBy: "Lena Hofmann" },
  { version: "v2.2.9", date: "2025-05-22", region: "United States", deviceType: "Freestyle Hands-free", status: "superseded", devices: 128, notes: "FDA 510(k) alignment update.", uploadedBy: "Sarah Chen" },
  { version: "v2.2.8", date: "2025-03-11", region: "All regions", deviceType: "Freestyle Hands-free", status: "superseded", devices: 480, notes: "Sensor calibration fix.", uploadedBy: "Priya Nair" },
  { version: "v2.2.8", date: "2025-03-11", region: "All regions", deviceType: "Swing Maxi", status: "superseded", devices: 130, notes: "Sensor calibration fix.", uploadedBy: "Priya Nair" },
  { version: "v2.1.5", date: "2024-11-30", region: "All regions", deviceType: "Freestyle Hands-free", status: "superseded", devices: 320, notes: "Initial fleet deployment release.", uploadedBy: "Tobias Keller" },
  { version: "v2.0.0", date: "2024-06-01", region: "Europe", deviceType: "Freestyle Hands-free", status: "recalled", devices: 0, notes: "Recalled — connectivity regression. Do not deploy.", uploadedBy: "Lena Hofmann" },
];
