import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next.js Supabase Starter",
  description: "The only boilerplate you need.",
  openGraph: {
    title: "Next.js Supabase Starter",
    description: "The only boilerplate you need.",
    images: [
      {
        url: '/hero-start.png',
        width: 1200,
        height: 630,
        alt: 'Next.js Supabase Starter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Next.js Supabase Starter",
    description: "The only boilerplate you need.",
    images: ['/hero-start.png'],
    creator: '@nlawz_', // Optional: add your Twitter username
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Required for pricing table */}
      <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
