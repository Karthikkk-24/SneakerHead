import { AuthForm } from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="px-4 py-12">
      <AuthForm mode="login" />
    </div>
  );
}
