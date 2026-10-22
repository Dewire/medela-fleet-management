import { redirect } from "next/navigation";

/**
 * Device registration now happens in the Biomed list modal.
 */
export default function NewBiomedDevicePage() {
  redirect("/biomed");
}
