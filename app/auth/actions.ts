"use server"
import { createClient } from '@/utils/supabase/server'
import { redirect } from "next/navigation"
import { revalidatePath } from 'next/cache'
import { createStripeCustomer } from '@/utils/stripe/api'
import { db } from '@/utils/db/db'
import { account, workspace, profile } from '@/utils/db/schema'
import { eq } from 'drizzle-orm'

const PUBLIC_URL = process.env.NEXT_PUBLIC_WEBSITE_URL ?? "http://localhost:3000"

// Helper function to create initial workspace setup
async function createInitialWorkspace(email: string) {
    // Add logging
    console.log("Starting workspace creation");

    // Create Stripe customer
    const stripeId = await createStripeCustomer("", email, "");
    console.log("Stripe customer created:", stripeId);

    // Create workspace
    const [newWorkspace] = await db
        .insert(workspace)
        .values({
            name: `${email.split("@")[0]}'s Workspace`,
            plan: "free",
            stripeId,
        })
        .returning();

    console.log("Workspace created:", newWorkspace);
    return newWorkspace;
}

async function getOrCreateAccount(email: string) {
    // Add logging
    console.log("Looking for existing account");

    // Try to find existing account
    const existingAccount = await db
        .select()
        .from(account)
        .where(eq(account.email, email))
        .limit(1);

    if (existingAccount.length > 0) {
        console.log("Found existing account");
        return existingAccount[0];
    }

    console.log("Creating new account");
    // Create new account if none exists
    const [newAccount] = await db.insert(account).values({ email }).returning();

    return newAccount;
}

export async function resetPassword(currentState: { message: string }, formData: FormData) {

    const supabase = createClient()
    const passwordData = {
        password: formData.get('password') as string,
        confirm_password: formData.get('confirm_password') as string,
        code: formData.get('code') as string
    }
    if (passwordData.password !== passwordData.confirm_password) {
        return { message: "Passwords do not match" }
    }

    const { data } = await supabase.auth.exchangeCodeForSession(passwordData.code)

    let { error } = await supabase.auth.updateUser({
        password: passwordData.password

    })
    if (error) {
        return { message: error.message }
    }
    redirect(`/forgot-password/reset/success`)
}

export async function forgotPassword(currentState: { message: string }, formData: FormData) {

    const supabase = createClient()
    const email = formData.get('email') as string
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${PUBLIC_URL}/forgot-password/reset` })

    if (error) {
        return { message: error.message }
    }
    redirect(`/forgot-password/success`)

}
export async function signup(currentState: { message: string }, formData: FormData) {
    const supabase = createClient()
    console.log("Starting signup with redirect URL:", `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/callback`);

    const { error } = await supabase.auth.signUp({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/callback`,
        }
    })

    if (error) {
        console.error('Signup error:', error);
        return { message: error.message }
    }

    return { message: 'Please check your email for a confirmation link before signing in.' }
}

export async function loginUser(currentState: { message: string }, formData: FormData) {
    const supabase = createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return { message: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}



export async function logout() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    redirect('/login')
}

export async function signInWithGoogle() {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${PUBLIC_URL}/auth/callback`,
        },
    })

    if (data.url) {
        redirect(data.url) // use the redirect API for your server framework
    }
}


export async function signInWithGithub() {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: `${PUBLIC_URL}/auth/callback`,
        },
    })

    if (data.url) {
        redirect(data.url) // use the redirect API for your server framework
    }

}