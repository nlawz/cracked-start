import DashboardHeader from "@/components/DashboardHeader";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { createClient } from '@/utils/supabase/server'
import { redirect } from "next/navigation"
import { db } from '@/utils/db/db'
import { account, profile, workspace } from '@/utils/db/schema'
import { eq } from "drizzle-orm";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "SAAS Starter Kit",
    description: "SAAS Starter Kit with Stripe, Supabase, Postgres",
};

async function getUserWorkspaceAccess(email: string) {
    // Get account and associated profiles with workspaces
    const userAccess = await db
        .select({
            account: account,
            profile: profile,
            workspace: workspace
        })
        .from(account)
        .where(eq(account.email, email))
        .innerJoin(profile, eq(profile.accountId, account.id))
        .innerJoin(workspace, eq(workspace.id, profile.workspaceId))
        .limit(1);

    return userAccess[0];
}

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = createClient()
    
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user?.email) {
        redirect('/login')
    }

    try {
        // Add retry logic for checking workspace access
        let attempts = 0;
        const maxAttempts = 3;
        
        while (attempts < maxAttempts) {
            const userAccess = await getUserWorkspaceAccess(user.email);

            if (userAccess) {
                const { workspace: currentWorkspace } = userAccess;
                
                if (currentWorkspace.plan !== "free") {
                    // User has access to a paid workspace, render the dashboard
                    return (
                        <html lang="en">
                            <body className={inter.className}>
                                <DashboardHeader />
                                <main className="container mx-auto px-4 py-8">
                                    {children}
                                </main>
                            </body>
                        </html>
                    );
                }
                
                // If coming from successful subscription, wait and retry
                if (attempts < maxAttempts - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    attempts++;
                    continue;
                }
            }
            
            // If all retries failed or no subscription found, redirect to subscribe
            redirect('/subscribe');
        }
        
        // Fallback redirect
        redirect('/subscribe');
    } catch (error) {
        console.error('Error checking workspace access:', error);
        redirect('/subscribe');
    }
}
