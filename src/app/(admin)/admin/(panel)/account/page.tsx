import { Btn, Input, Notice, PageTitle, Section } from "@/components/admin-ui";
import { requireUser } from "@/lib/auth/session";
import { changeOwnPasswordAction } from "../../actions";

export default async function Account({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const user = await requireUser();
  const sp = await searchParams;
  return (
    <div className="max-w-xl">
      <PageTitle title="Your account" sub={`${user.email} · ${user.role}`} />
      <Notice sp={sp} />
      <form action={changeOwnPasswordAction}>
        <Section title="Change password" desc="Changing your password signs you out on all devices.">
          <Input label="New password (min. 12 characters)" name="password" type="password" minLength={12} required autoComplete="new-password" />
          <Input label="Confirm" name="confirm" type="password" minLength={12} required autoComplete="new-password" />
          <Btn type="submit">Change password</Btn>
        </Section>
      </form>
    </div>
  );
}
