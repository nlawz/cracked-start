import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const workspace = pgTable("workspace", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    plan: text("plan").notNull(),
    stripeId: text("stripe_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const account = pgTable("account", {
    id: serial("id").primaryKey(),
    email: text("email").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const profile = pgTable("profile", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    basicInfo: text("basic_info"),
    role: text("role").notNull().default("member"),
    accountId: serial("account_id")
        .notNull()
        .references(() => account.id),
    workspaceId: serial("workspace_id")
        .notNull()
        .references(() => workspace.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations remain the same but with clearer purpose
export const workspaceRelations = relations(workspace, ({ many }) => ({
    profiles: many(profile), // One workspace has many team members
}));

export const accountRelations = relations(account, ({ many }) => ({
    profiles: many(profile), // One email can be part of many workspaces
}));

export const profileRelations = relations(profile, ({ one }) => ({
    workspace: one(workspace, {
        fields: [profile.workspaceId],
        references: [workspace.id],
    }),
    account: one(account, {
        fields: [profile.accountId],
        references: [account.id],
    }),
}));

// Type inference helpers
export type Workspace = typeof workspace.$inferSelect;
export type Account = typeof account.$inferSelect;
export type Profile = typeof profile.$inferSelect;
