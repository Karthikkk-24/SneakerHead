import { redirect } from "next/navigation";
import { AccountProfile } from "@/components/AccountProfile";
import { getSession } from "@/lib/session";

export default async function AccountPage() {
  const user = await getSession();
  if (!user) {
    redirect("/login?redirect=/account");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <AccountProfile user={user} />
    </div>
  );
}
