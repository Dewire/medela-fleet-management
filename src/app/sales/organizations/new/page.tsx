import { redirect } from "next/navigation";

/**
 * Organisation creation now happens in the Sales list modal.
 */
export default function NewOrganizationPage() {
  redirect("/sales");
}
