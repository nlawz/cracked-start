import { db } from '@/utils/db/db'
import { workspace } from '@/utils/db/schema'
import { eq } from "drizzle-orm";
import { headers } from 'next/headers'
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Helper to verify Stripe webhook signature
async function verifyStripeWebhook(request: Request) {
    const body = await request.text();
    const signature = headers().get('stripe-signature')!;
    
    try {
        return stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        throw new Error('Invalid signature');
    }
}

export async function POST(request: Request) {
    try {
        const event = await verifyStripeWebhook(request);
        
        switch (event.type) {
            case 'customer.subscription.created': {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;
                
                // Get the price details
                const priceId = subscription.items.data[0].price.id;
                const price = await stripe.prices.retrieve(priceId);
                
                // Get the product details
                const productId = price.product as string;
                const product = await stripe.products.retrieve(productId);
                
                // Use the product name or ID as the plan
                const plan = product.name.toLowerCase().replace(/\s+/g, '-');

                console.log('Processing subscription for plan:', plan);

                await db.update(workspace)
                    .set({ 
                        plan: plan,
                    })
                    .where(eq(workspace.stripeId, customerId));

                console.log('New subscription created and processed');
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;
                
                // Get the price details
                const priceId = subscription.items.data[0].price.id;
                const price = await stripe.prices.retrieve(priceId);
                
                // Get the product details
                const productId = price.product as string;
                const product = await stripe.products.retrieve(productId);
                
                // Use the product name or ID as the plan (consistent with creation logic)
                const plan = product.name.toLowerCase().replace(/\s+/g, '-');

                await db.update(workspace)
                    .set({ 
                        plan: plan,
                    })
                    .where(eq(workspace.stripeId, customerId));

                console.log('Subscription update processed for plan:', plan);
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;

                await db.update(workspace)
                    .set({ 
                        plan: 'free',
                    })
                    .where(eq(workspace.stripeId, customerId));

                console.log('Subscription cancellation processed');
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return new Response('Success', { status: 200 });
    } catch (error: any) {
        console.error('Webhook error:', error);
        return new Response(`Webhook Error: ${error.message}`, { 
            status: error.message === 'Invalid signature' ? 401 : 400 
        });
    }
}