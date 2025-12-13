import { createAccessControl } from "better-auth/plugins/access";

/**
 * Permission statements for resources
 * Each resource has an array of allowed actions
 */
const statement = {
  project: ["create", "read", "update", "delete"],
  member: ["invite", "remove"],
  organization: ["update", "delete"],
} as const;

/**
 * Access Control instance
 */
export const ac = createAccessControl(statement);

/**
 * Role: Owner
 * Full access to all resources
 */
export const owner = ac.newRole({
  project: ["create", "read", "update", "delete"],
  member: ["invite", "remove"],
  organization: ["update", "delete"],
});

/**
 * Role: Admin
 * Can manage projects and invite members
 */
export const admin = ac.newRole({
  project: ["create", "read", "update", "delete"],
  member: ["invite"],
  organization: ["update"],
});

/**
 * Role: Member
 * Can read and create projects only
 */
export const member = ac.newRole({
  project: ["create", "read"],
});
