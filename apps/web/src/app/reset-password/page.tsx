import { ResetPasswordForm } from "@/components/ResetPasswordForm";

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const token = params.token ?? "";

  return (
    <div className="px-4 py-12">
      <ResetPasswordForm token={token} />
    </div>
  );
}
