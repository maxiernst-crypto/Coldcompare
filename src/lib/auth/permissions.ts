import type { Role } from "../schemas";

export type Permission =
  | "content.edit" // create/edit products, articles, links (drafts)
  | "content.publish" // move content to "published"
  | "links.manage"
  | "analytics.view"
  | "revenue.manage"
  | "settings.manage"
  | "users.manage";

const MATRIX: Record<Role, Permission[]> = {
  admin: ["content.edit", "content.publish", "links.manage", "analytics.view", "revenue.manage", "settings.manage", "users.manage"],
  editor: ["content.edit", "content.publish", "links.manage", "analytics.view"],
  writer: ["content.edit"],
  analyst: ["analytics.view"],
};

export function can(role: Role, permission: Permission): boolean {
  return MATRIX[role].includes(permission);
}

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  admin: "Everything, including users, settings and revenue data.",
  editor: "Edit and publish content, manage affiliate links, view analytics.",
  writer: "Create and edit drafts; can submit for review but not publish.",
  analyst: "Read-only access to analytics.",
};
