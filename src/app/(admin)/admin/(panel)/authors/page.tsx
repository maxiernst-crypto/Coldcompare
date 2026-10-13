import { Btn, Check, Input, LocalizedField, Notice, PageTitle, Section } from "@/components/admin-ui";
import { requirePermission } from "@/lib/auth/session";
import { listAuthors } from "@/lib/repo/articles";
import { saveAuthorAction } from "../../actions";

export default async function AuthorsAdmin({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  await requirePermission("content.publish");
  const sp = await searchParams;
  const authors = await listAuthors();
  const rows = [...authors, { id: "", name: "", role: { en: "", de: "" }, bio: { en: "", de: "" }, avatarUrl: null, isPlaceholder: false }];
  return (
    <div className="max-w-4xl">
      <PageTitle title="Authors" sub="Named authors with real credentials strengthen trust (E-E-A-T). Never invent people or credentials." />
      <Notice sp={sp} />
      <div className="space-y-6">
        {rows.map((a, i) => (
          <form key={a.id || `new-${i}`} action={saveAuthorAction}>
            <Section title={a.id ? a.name : "Add author"}>
              <div className="grid gap-3 md:grid-cols-3">
                <Input label="ID (slug)" name="id" defaultValue={a.id} readOnly={!!a.id} required />
                <Input label="Name" name="name" defaultValue={a.name} required />
                <Input label="Avatar URL" name="avatarUrl" defaultValue={a.avatarUrl ?? ""} />
              </div>
              <LocalizedField name="role" label="Role" value={a.role} />
              <LocalizedField name="bio" label="Bio & credentials" value={a.bio} multiline />
              <Check name="isPlaceholder" label="Placeholder (not a real named person yet)" checked={a.isPlaceholder} />
              <Btn type="submit" variant="secondary">
                Save author
              </Btn>
            </Section>
          </form>
        ))}
      </div>
    </div>
  );
}
