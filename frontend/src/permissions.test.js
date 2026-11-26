import { getDefaultFeaturePath, hasFeaturePermission } from "./permissions";

test("administrators retain access when a feature is disabled on their account", () => {
  expect(hasFeaturePermission({ accountRole: "admin", permissions: { jobs: false } }, "jobs")).toBe(true);
});

test("standard users need an explicit grant for each feature", () => {
  const user = { accountRole: "user", permissions: { jobs: true, connections: false } };

  expect(hasFeaturePermission(user, "jobs")).toBe(true);
  expect(hasFeaturePermission(user, "connections")).toBe(false);
  expect(hasFeaturePermission(user, "requests")).toBe(false);
});

test("the default route follows the first feature enabled for the user", () => {
  expect(getDefaultFeaturePath({ accountRole: "user", permissions: { home: false, jobs: true } })).toBe("/jobs");
});

test("users without feature grants land on their profile instead of a restricted feature", () => {
  expect(getDefaultFeaturePath({ accountRole: "user", permissions: {} })).toBe("/profile");
});
