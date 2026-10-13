import { redirect } from "next/navigation";
import { Logo } from "@/components/chrome";
import { inputCls } from "@/components/admin-ui";
import { getCurrentUser } from "@/lib/auth/session";
import { loginAction } from "../actions";

const MESSAGES: Record<string, string> = {
  invalid: "Invalid email or password.",
  throttled: "Too many attempts. Try again in 15 minutes.",
  changed: "Password changed. Please sign in again.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await getCurrentUser()) redirect("/admin");
  const { error } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form action={loginAction} className="w-full max-w-sm space-y-4 rounded-2xl border border-line bg-card p-6 shadow-sm">
        <Logo />
        <h1 className="text-lg font-semibold">Sign in to the admin</h1>
        {error && MESSAGES[error] && <p role="alert" className={`rounded-lg p-3 text-sm ${error === "changed" ? "bg-ok-soft text-ok" : "bg-danger-soft text-danger"}`}>{MESSAGES[error]}</p>}
        <label className="block text-sm">
          Email
          <input name="email" type="email" required autoComplete="username" className={`${inputCls} mt-1`} />
        </label>
        <label className="block text-sm">
          Password
          <input name="password" type="password" required autoComplete="current-password" className={`${inputCls} mt-1`} />
        </label>
        <button type="submit" className="w-full rounded-lg bg-fg py-2.5 font-semibold text-bg">
          Sign in
        </button>
      </form>
    </main>
  );
}
