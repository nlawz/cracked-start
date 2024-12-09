const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const PUBLIC_URL = process.env.NEXT_PUBLIC_WEBSITE_URL ?? "http://localhost:3000"
const currencyType = 'usd'
const plans = [
    {
        name: "Free",
        price: 0, // price in cents, use 0 for free
        features: [
            // This will be used to list the features that will show up on the pricing table
            { name: "Upto 5 users" },
            { name: "Upto 100 records" },
            { name: "Upto 1000 API calls" },
        ],
    },
    {
        name: "Basic-Test",
        price: 1000, // price in cents, use 0 for free
        features: [
            // This will be used to list the features that will show up on the pricing table
            { name: "Upto 10 users" },
            { name: "Upto 1000 records" },
            { name: "Upto 1000 API calls" },
        ],
    },
    {
        name: "Pro-Test",
        price: 2000,
        features: [
            { name: "Upto 100 users" },
            { name: "Upto 10000 records" },
            { name: "Upto 10000 API calls" },
        ],
    },
    {
        name: "Enterprise-Test",
        price: 5000,
        features: [
            { name: "Unlimited users" },
            { name: "Unlimited records" },
            { name: "Unlimited API calls" },
        ],
    },
];

// Create products and prices sequentially
async function setupProducts() {
    try {
        for (const plan of plans) {
            console.log(`Creating product: ${plan.name}`);
            
            // Create product with features in metadata
            const product = await stripe.products.create({
                name: plan.name,
                metadata: {
                    features: JSON.stringify(plan.features.map(f => f.name))
                },
                description: plan.features.map(f => f.name).join(', ') // Optional: adds features to product description
            });

            console.log(`Creating price for: ${plan.name}`);
            const price = await stripe.prices.create({
                product: product.id,
                unit_amount: plan.price,
                currency: currencyType,
                recurring: {
                    interval: 'month' // Add this if these are subscription products
                }
            });

            await stripe.products.update(product.id, {
                default_price: price.id
            });
            
            console.log(`Successfully created product and price for: ${plan.name}`);
        }

        // Only create webhook if not in local development
        if (!PUBLIC_URL.includes('localhost')) {
            await stripe.webhookEndpoints.create({
                enabled_events: [
                    'customer.subscription.created',
                    'customer.subscription.deleted',
                    'customer.subscription.updated'
                ],
                url: `${PUBLIC_URL}/webhook/stripe`,
            });
        } else {
            console.log('Skipping webhook creation in local environment');
        }
    } catch (error) {
        console.error('Error setting up products:', error);
    }
}

// Execute the setup
setupProducts();