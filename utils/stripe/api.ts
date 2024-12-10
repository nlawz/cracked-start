import { Stripe } from "stripe";
import { db } from "../db/db";
import { workspace, account, profile } from "../db/schema";
import { eq } from "drizzle-orm";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const PUBLIC_URL = process.env.NEXT_PUBLIC_WEBSITE_URL ?? "http://localhost:3000";

export async function createStripeCustomer(
    id: string,
    email: string,
    name: string
) {
    const customer = await stripe.customers.create({
        name: name || email.split('@')[0],
        email: email,
        metadata: {
            workspace_name: name || `${email.split('@')[0]}'s Workspace`
        },
    });

    return customer.id;
}

export async function getUserWorkspaces(email: string) {
    const workspaces = await db
        .select({
            id: workspace.id,
            name: workspace.name,
            plan: workspace.plan,
            stripeId: workspace.stripeId,
            role: profile.role
        })
        .from(account)
        .where(eq(account.email, email))
        .innerJoin(profile, eq(profile.accountId, account.id))
        .innerJoin(workspace, eq(workspace.id, profile.workspaceId));

    return workspaces;
}

export async function getStripePlan(email: string) {
    const workspaces = await getUserWorkspaces(email);
    return workspaces[0]?.plan || 'free';
}

export async function createStripeCheckoutSession(email: string) {
    const workspaces = await getUserWorkspaces(email);
    
    if (!workspaces.length) {
        throw new Error('No workspace found');
    }

    const customerSession = await stripe.customerSessions.create({
        customer: workspaces[0].stripeId,
        components: {
            pricing_table: {
                enabled: true,
            },
        },
    });

    return customerSession.client_secret;
}

export async function generateStripeBillingPortalLink(email: string) {
    const workspaces = await getUserWorkspaces(email);
    
    if (!workspaces.length) {
        throw new Error('No workspace found');
    }

    const portalSession = await stripe.billingPortal.sessions.create({
        customer: workspaces[0].stripeId,
        return_url: `${PUBLIC_URL}/dashboard`,
    });

    return portalSession.url;
}
