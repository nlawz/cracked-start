import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createStripeCustomer } from '@/utils/stripe/api'
import { db } from '@/utils/db/db'
import { account, workspace, profile } from '@/utils/db/schema'
import { eq } from "drizzle-orm"

async function getOrCreateAccount(email: string) {
    if (!account || !account.email) {
        console.error("Schema validation failed:", { account });
        throw new Error("Invalid schema configuration");
    }

    console.log("Schema check:", { 
        accountSchema: account,
        workspaceSchema: workspace,
        profileSchema: profile 
    });

    const existingAccount = await db
        .select()
        .from(account)
        .where(eq(account.email, email))
        .limit(1)

    if (existingAccount.length > 0) {
        return existingAccount[0]
    }

    const [newAccount] = await db
        .insert(account)
        .values({ email })
        .returning()

    return newAccount
}

export async function GET(request: Request) {
    console.log("Callback route hit with URL:", request.url);
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    console.log("Code received:", code);

    if (code) {
        const supabase = createClient()
        console.log("Exchanging code for session...");
        const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)
        
        if (error) {
            console.error("Session exchange error:", error);
        }
        
        if (!error && user?.email) {
            try {
                console.log("Starting account creation for user:", user.email);
                const userAccount = await getOrCreateAccount(user.email)
                console.log("Account created:", userAccount);
                
                const stripeId = await createStripeCustomer("", user.email, user.email.split('@')[0])
                console.log("Stripe customer created:", stripeId);
                
                const [userWorkspace] = await db
                    .insert(workspace)
                    .values({
                        name: `${user.email.split('@')[0]}'s Workspace`,
                        plan: 'free',
                        stripeId,
                    })
                    .returning()
                console.log("Workspace created:", userWorkspace);
                
                await db.insert(profile).values({
                    name: user.email.split('@')[0],
                    basicInfo: '',
                    role: 'owner',
                    accountId: userAccount.id,
                    workspaceId: userWorkspace.id,
                })
                console.log("Profile created, setup complete");
                
                return NextResponse.redirect(`${origin}/dashboard`)
            } catch (error) {
                console.error('Detailed error:', error)
                return NextResponse.redirect(`${origin}/error`)
            }
        }
    }

    console.log("No code found or invalid request");
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}