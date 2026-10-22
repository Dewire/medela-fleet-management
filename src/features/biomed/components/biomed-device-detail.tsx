"use client";

import { BiomedFirmwareUpdate } from "@/features/biomed/components/biomed-firmware-update";
import { BIOMED_ORGANIZATION } from "@/features/biomed/constants";
import { StatusChip } from "@/features/devices/components/status-chip";
import { useDeviceCatalog } from "@/features/devices/hooks/use-device-catalog";
import { recommendedFirmwareUpdate } from "@/features/devices/lib/recommended-update";
import { useFirmwareReleases } from "@/features/firmware/hooks/use-firmware-releases";
import { BackLink } from "@/features/shell/back-link";
import { DefinitionList } from "@/features/shell/definition-list";
import { Panel } from "@/features/shell/panel";

/**
 * Firmware state for one device registered to the Biomed hospital.
 *
 * @param deviceId - Device id from the route
 */
export function BiomedDeviceDetail({ deviceId }: { deviceId: string }) {
  const { devices, applyUpdate } = useDeviceCatalog();
  const { releases } = useFirmwareReleases();
  const device = devices.find(
    (item) => item.id === deviceId && item.organizationId === BIOMED_ORGANIZATION.id,
  );

  if (!device) {
    return (
      <>
        <BackLink href="/biomed" label="Back to Devices" />
        <p className="text-sm text-muted-foreground">This device was not found.</p>
      </>
    );
  }

  const offer = recommendedFirmwareUpdate(device, releases);

  return (
    <>
      <BackLink href="/biomed" label="Back to Devices" />
      <div className="flex max-w-xl flex-col gap-8">
        <Panel className="p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <h2 className="text-2xl font-bold text-foreground">{device.id}</h2>
            <StatusChip status={device.status} />
          </div>
          <DefinitionList
            rows={[
              ["Firmware version", device.firmware],
              ["Model", device.model],
              ["Hospital token", device.registrationCode ?? "Not issued"],
            ]}
          />
          <div className="mt-5 border-t border-black/6 pt-5">
            <BiomedFirmwareUpdate
              device={device}
              offer={offer}
              onFinished={(finished) => {
                applyUpdate(device.id, finished);
              }}
            />
          </div>
        </Panel>
      </div>
    </>
  );
}
