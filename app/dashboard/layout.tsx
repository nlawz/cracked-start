import DashboardHeader from "@/components/DashboardHeader";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { createClient } from '@/utils/supabase/server'
import { redirect } from "next/navigation"
import { db } from '@/utils/db/db'
import { usersTable } from '@/utils/db/schema'
import { eq } from "drizzle-orm";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "SAAS Starter Kit",
    description: "SAAS Starter Kit with Stripe, Supabase, Postgres",
};

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = createClient()
    
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    try {
        // Add retry logic for checking the plan
        let attempts = 0;
        const maxAttempts = 3;
        
        while (attempts < maxAttempts) {
            const checkUserInDB = await db.select()
                .from(usersTable)
                .where(eq(usersTable.email, user.email!));

            if (checkUserInDB.length > 0) {
                if (checkUserInDB[0].plan !== "none") {
                    // User has a plan, render the dashboard
                    return (
                        <html lang="en">
                            <body>
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
        console.error('Error checking user plan:', error);
        redirect('/subscribe');
    }
}
