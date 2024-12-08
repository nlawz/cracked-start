"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import {
    Copy,
    Check,
    Coins,
    UserCheck,
    Database,
    ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { NavBar } from "@/components/navbar";
import { Footer } from "@/components/footer/footer";

export default function LandingPage() {
    const [hasCopied, setHasCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText("gh repo clone nlawz/cracked-start");
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), 2000); // Reset after 2 seconds
    };

    return (
        <div className="flex flex-col min-h-[100dvh]">
            <NavBar />
            <main className="min-h-screen bg-white p-4">
                {/* Hero Section */}
                <section className="relative mb-16">
                    <div className="max-w-8xl mx-auto">
                        {/* Background Image Container */}
                        <div className="relative rounded-3xl overflow-hidden">
                            <div className="aspect-[2/4] md:aspect-[3/4] lg:aspect-[16/9]">
                                <Image
                                    src="/hero.png"
                                    layout="fill"
                                    objectFit="cover"
                                    alt="Workspace background"
                                    priority
                                />
                            </div>

                            {/* Content Container - Fixed height ensures space for input */}
                            <div className="absolute inset-0">
                                {/* Text Content */}
                                <div className="flex flex-col items-center text-center text-black h-[60%] pt-12 md:pt-48 lg:pt-48">
                                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                                        The only boilerplate you need.
                                    </h1>
                                    <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
                                        A new era of productivity begins with a
                                        toolkit built for the modern developer.
                                        Experience a workspace where everything
                                        just works - effortlessly.
                                    </p>
                                </div>

                                {/* Input Container - Fixed position at bottom of content area */}
                                <div className="h-[40%] flex items-start justify-center px-4">
                                    <div className="relative w-full max-w-md">
                                        <Input
                                            readOnly
                                            value="gh repo clone nlawz/cracked-start"
                                            className="h-16 bg-black/80 text-white font-mono pr-24 w-full rounded-xl"
                                        />
                                        <Button
                                            className="absolute right-[12px] top-[12px] h-[40px] px-4 bg-white text-black hover:bg-white/90"
                                            onClick={handleCopy}>
                                            {hasCopied ? (
                                                <Check className="h-4 w-4" />
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* App Screenshot - Separate container */}
                    <div className="max-w-4xl mx-auto px-4">
                        <div className="relative rounded-3xl overflow-hidden border shadow-2xl -mt-24">
                            <Image
                                src="/app.png"
                                width={800}
                                height={400}
                                className="w-full object-cover"
                                alt="Application screenshot"
                            />
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section>
                    <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="flex flex-col items-center text-center p-6">
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                <UserCheck className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                Supabase Authentication
                            </h3>
                            <p className="text-muted-foreground">
                                Complete auth flow with email/password, OAuth
                                (Google/GitHub), and password reset
                                functionality. Secure and ready to use.
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center p-6">
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                <Database className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                PostgreSQL + Drizzle ORM
                            </h3>
                            <p className="text-muted-foreground">
                                Type-safe database operations with Drizzle ORM.
                                Efficient queries, migrations, and schema
                                management for PostgreSQL.
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center p-6">
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                <Coins className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                Stripe Integration
                            </h3>
                            <p className="text-muted-foreground">
                                Complete payment infrastructure with Stripe.
                                Subscription management, webhooks, customer
                                portal, and pricing tables included.
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center p-6">
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                <ArrowRight className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                Modern UI Components
                            </h3>
                            <p className="text-muted-foreground">
                                Beautifully crafted with Tailwind CSS and
                                shadcn/ui. Responsive, accessible, and
                                customizable components ready to use.
                            </p>
                        </div>
                    </div>
                </section>
                <section
                    className="w-full py-10 md:py-20 lg:py-32 bg-muted"
                    id="pricing">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-4">
                            Pricing Plans
                        </h2>
                        <p className="text-muted-foreground text-center mb-8 md:text-xl">
                            Choose the perfect plan for your needs
                        </p>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Hobby</CardTitle>
                                    <CardDescription>
                                        For individuals and small teams
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold">Free</p>
                                    <ul className="mt-4 space-y-2">
                                        <li className="flex items-center">
                                            <Check className="mr-2 h-4 w-4 text-primary" />
                                            Up to 2 users
                                        </li>
                                        <li className="flex items-center">
                                            <Check className="mr-2 h-4 w-4 text-primary" />
                                            Basic analytics
                                        </li>
                                        <li className="flex items-center">
                                            <Check className="mr-2 h-4 w-4 text-primary" />
                                            24/7 support
                                        </li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Link
                                        className="text-sm font-medium hover:underline underline-offset-4"
                                        href="/signup">
                                        <Button className="w-full">
                                            Get Started
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Team</CardTitle>
                                    <CardDescription>
                                        For growing businesses
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold">
                                        $49/month
                                    </p>
                                    <ul className="mt-4 space-y-2">
                                        <li className="flex items-center">
                                            <Check className="mr-2 h-4 w-4 text-primary" />
                                            Up to 20 users
                                        </li>
                                        <li className="flex items-center">
                                            <Check className="mr-2 h-4 w-4 text-primary" />
                                            Advanced analytics
                                        </li>
                                        <li className="flex items-center">
                                            <Check className="mr-2 h-4 w-4 text-primary" />
                                            Priority support
                                        </li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Link
                                        className="text-sm font-medium hover:underline underline-offset-4"
                                        href="/signup">
                                        <Button className="w-full">
                                            Get Started
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Pro</CardTitle>
                                    <CardDescription>
                                        For large-scale organizations
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold">Custom</p>
                                    <ul className="mt-4 space-y-2">
                                        <li className="flex items-center">
                                            <Check className="mr-2 h-4 w-4 text-primary" />
                                            Unlimited users
                                        </li>
                                        <li className="flex items-center">
                                            <Check className="mr-2 h-4 w-4 text-primary" />
                                            Custom analytics
                                        </li>
                                        <li className="flex items-center">
                                            <Check className="mr-2 h-4 w-4 text-primary" />
                                            Dedicated support
                                        </li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Link
                                        className="text-sm font-medium hover:underline underline-offset-4"
                                        href="/signup">
                                        <Button className="w-full">
                                            Get Started
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </section>
                <section className="w-full py-10 md:py-20 lg:py-32 ">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                                    Start shipping today.
                                </h2>
                                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                    Jump right into the business logic and stop
                                    procrastinating. With this, their are no
                                    more excuses. It&apos;s even free!
                                </p>
                            </div>
                            <div className="w-full max-w-sm space-y-2">
                                <Link className="btn" href="/signup">
                                    <Button className=" p-7">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <section className="pb-16 md:pb-24">
                <Footer />
            </section>
        </div>
    );
}
