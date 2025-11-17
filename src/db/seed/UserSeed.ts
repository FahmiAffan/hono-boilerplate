import { type usersTable } from "../schema.js";

type User = typeof usersTable.$inferSelect
export const userSeedData: User = {
  id: null,
  name: "Seed User",
  email: "seed@example.com",
  password: "password",
  createdAt: new Date(),
  updatedAt: new Date(),
};