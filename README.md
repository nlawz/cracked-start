![Landing screenshot](https://start.crack.build/screenshot.png)

# Next.js SaaS Starter Kit  

This is your go-to starter kit for building SaaS apps with **Next.js**, designed to simplify the setup process while giving you the tools to launch quickly. It features everything from a polished landing page to robust integrations with **Supabase Auth**, **Drizzle ORM**, **PostgreSQL**, and **Stripe** for seamless user authentication, subscription management, and payment processing.

## Quick Start

1. Clone and install dependencies:

```bash
git clone https://github.com/nlawz/cracked-start
cd starter
pnpm install
```

2. Set up your environment:

```bash
cp .env.example .env
```

3. Configure your `.env` file with:

```env
# PLACE YOUR SUPABASE PROJECT URL AND ANON KEY HERE
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx
NEXT_PUBLIC_WEBSITE_URL=http://localhost:3000

# PLACE YOUR POSTGRES DATABBASE UEL AND PASSWORD HERE
DATABASE_URL=xxxxx

# PLACE YOUR GOOGLE CLIENT ID AND SECRET HERE TO ENABLE OAUTH SOCIAL LOGIN (https://supabase.com/docs/guides/auth/social-login/auth-google)
GOOGLE_OAUTH_CLIENT_ID=xxxx
GOOGLE_OAUTH_CLIENT_SECRET=xxxx

# Place GITHUB client id and secret to easily enable github oauth login
GITHUB_OAUTH_CLIENT_ID=xxxxx
GITHUB_OAUTH_CLIENT_SECRET=xxxxx
# STRIPE PRICING TABLE PUBLIC KEY AND API
STRIPE_PRICING_TABLE_ID=xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxx
```

4. Start the development server:

```bash
pnpm dev
```

5. Go to http://localhost:3000/ 

## Features  

- **Full Authentication Flow**:  
  - Sign up, log in, log out, forgot password/password reset functionality.  
- **OAuth Support**:  
  - Log in with **Google** or **GitHub** accounts. Easily extend providers through the Supabase Dashboard. 
- **Stripe Integration**:  
  - Use Stripe Pricing Tables and Checkout for subscription setup.  
  - Manage billing settings through the Stripe Customer Portal.  
- **Protected Routes**:  
  - Secure `/dashboard` routes with authentication.  
- **Database Management**:  
  - Effortlessly connect **Drizzle ORM** with a **PostgreSQL** database.  
- **Responsive UI**:  
  - Styled with **Tailwind CSS** and components from **shadcn**.  
- **Stripe Webhooks**:  
  - Automate subscription status updates with webhook listeners.  
  - API hook to fetch the current plan for customers.  

This starter kit equips you with everything you need to get your SaaS app up and running quickly while keeping your stack clean and modern.


## Getting Started

As we will be setting up both dev and prod environments, simply use `.env.local` to develop locally and `.env` for production environments

### Setup Supabase
1. Create a new project on [Supabase](https://app.supabase.com/)
2. ADD `SUPABASE_URL` and `SUPABASE_ANON_KEY` to your .env file
3. Add `NEXT_PUBLIC_WEBSITE_URL` to let Supabase know where to redirect the user after the Oauth flow(if using oauth).

#### Setup Google OAUTH Social Auth
You can easily set up social auth with this template. First navigate to [google cloud](https://console.cloud.google.com) and create a new project. You just need to add the `GOOGLE_OAUTH_CLIENT_ID` and `GOOGLE_OAUTH_CLIENT_SECRET` to your `.env` file.

1. Follow these [instructions](https://supabase.com/docs/guides/auth/social-login/auth-google?queryGroups=environment&environment=server) to set up Google OAuth.

#### Setup Github OAUTH Social Auth
You can easily set up social auth with this template. First navigate to google cloud and create a new project. All code is written. You just need to add the `GITHUB_OAUTH_CLIENT_ID` and `GITHUB_OAUTH_CLIENT_SECRET` to your `.env` file.

1. Follow these [instructions](https://supabase.com/docs/guides/auth/social-login/auth-github?queryGroups=environment&environment=server) to set up Github OAuth.

### Setup Postgres DB
You can use any Postgres db with this boilerplate code, but I recommend Supabase for continuity purposes. Feel free to use [Vercel's Marketplace](https://vercel.com/marketplace) to browse through a collection of first-party services to add to your Vercel project.

Add `DATABASE_URL` to `.env` file e.g `postgresql://postgres.[PROJECT-ID]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`


### Setup OAuth with Social Providers

#### Setup redirect url
1. Go to Supabase dashboard
2. Go to Authentication > Url Configuration
3. Place production url into "Site URL".


### Setup Stripe

In order to collect payments and setup subscriptions for your users, we will be making use of [Stripe Checkout](https://stripe.com/payments/checkout), [Stripe Pricing Tables](https://docs.stripe.com/payments/checkout/pricing-table), and [Stripe Webhooks](https://docs.stripe.com/webhooks)

1. [Register for Stripe](https://dashboard.stripe.com/register)
2. get your `STRIPE_SECRET_KEY` key and add it to `.env`. Stripe has both a Test and Production API key. Once you verify your business on Stripe, you will be able to get access to production mode in Stripe which would come with a production API key. But until then, we can use [Stripe's Test Mode](https://docs.stripe.com/test-mode) to build our app


3. Open up `stripe-config.ts` and change your product information
4. run `node --env-file=.env stripe-config.ts` in the project directory to setup your Stripe product. This can also be done through the Stripe Dashboard.
5. [Create a new Pricing Table](https://dashboard.stripe.com/test/pricing-tables) and add your newly created products
6. When creating your new Pricing Table, set the *Confirmation Page* to *Don't show confirmation page*. Add [YOUR_PUBLIC_URL/subscribe/success](YOUR_PUBLIC_URL/subscribe/success) as the value(use [http://localhost:3000/subscribe/success](http://localhost:3000/subscribe/success) for local development). This will redirect the user to your main dashboard when they have completed their checkout. For prod, this will be your public url



8. Add `STRIPE_PUBLISHABLE_KEY` and `STRIPE_PRICING_TABLE_ID` to `.env` 

Your pricing table should be good to go.

### Setup Database
This boilerplate uses Drizzle ORM to interact with a PostgresDb. 

Before we start, please ensure that you have `DATABASE_URL` set.

To create the necessary tables to start, run `npm drizzle-kit migrate`

#### To alter or add a table
1. navigate to `/utils/db/schema.ts`
2. Edit/add a table
3. run `npx drizzle-kit activate` to generate migration files
4. run `npm drizzle-kit migrate` to apply migration

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Local Development Setup  

Follow these steps to set up your local development environment for the Next.js SaaS Starter Kit.

---

## Prerequisites  

Make sure you have the following installed:  
- [Node.js](https://nodejs.org/) (LTS version recommended)  
- [Docker Desktop](https://www.docker.com/products/docker-desktop)  
- [Git](https://git-scm.com/)  

---

## Step 1: Install the Supabase CLI  

1. **Install Supabase CLI**:  
  ```bash
  npm install -g supabase
  ```
2. Verify Installation
  ```bash
  supabase --version
  ```
3. Login to Supabase
   ```bash
   supabase login
   ```
## Step 2: Install the Stripe CLI

1. Download the Stripe CLI. Follow the instructions [here](https://docs.stripe.com/stripe-cli#install)
2. Verify Installation
   ```bash
   stripe --version
   ```
3. Login to Stripe CLI
   ```bash
   stripe login
   ```
4. Listen for webhooks
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks
   ```

## Set up Supabase locally
### 1. Initialize Supabase
  In your project directory, run: (make sure Docker Desktop is running)
  ```bash
  supabase init
  ```
### Launch Supabase
```bash
supabase start
```
Once all of the Supabase services are running, you'll see output containing your local Supabase credentials. It should look like this, with urls and keys that you'll use in your local project:
```bash

Started supabase local development setup.

         API URL: http://localhost:54321
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
        anon key: eyJh......
service_role key: eyJh......
```

Add these variables to your .env.local file.
Supabase Studio will run locally at the default URL http://localhost:54323

### Supabase link
You can link this local environment to a Supabase project using the `supabase link` command. Run the link command, select the project you would like to link and input your DB password when prompted.


You should now have a local development setup that allows you to develop locally, test your application, and deploy easily when ready.


## Deploy on Vercel

The easiest a Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js. Push your code to github and you can link your project to your repo.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Resources
- [Next.js](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Drizzle <> Supabase](https://orm.drizzle.team/docs/connect-supabase)
- [Supabase <> Drizzle](https://supabase.com/docs/guides/database/drizzle)
