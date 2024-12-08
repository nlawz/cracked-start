import { db } from '@/utils/db/db'
import { usersTable } from '@/utils/db/schema'
import { eq } from "drizzle-orm";
import { headers } from 'next/headers'
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
    console.log('Webhook received');
    try {
        const body = await request.text();
        const payload = JSON.parse(body);
        
        // Handle subscription events
        if (payload.type === 'checkout.session.completed') {
            const session = payload.data.object;
            const customerId = session.customer;
            const subscriptionId = session.subscription;

            console.log(`Updating user plan: ${customerId} -> ${subscriptionId}`);
            
            // Update user's plan in database
            await db.update(usersTable)
                .set({ 
                    plan: subscriptionId,
                })
                .where(eq(usersTable.stripe_id, customerId));

            console.log('User plan updated successfully');
        }

        return new Response('Success', { status: 200 });
    } catch (error: any) {
        console.error('Webhook error:', error);
        return new Response(`Webhook Error: ${error.message}`, { status: 400 });
    }
}