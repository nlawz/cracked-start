"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Wordmark } from "./wordmark";
import { LogoIcon } from "../logo-icon";

type NavLink = {
  title: string;
  href: string;
  external?: boolean;
};
const navigation = [
    {
        title: "Company",
        links: [
            {
                title: "crack.dev",
                href: "https://crack.dev",
                external: true,
            },
            { title: "Manifesto", href: "/manifesto" },
        ],
    },
    {
        title: "Connect",
        links: [
            {
                title: "X (Twitter)",
                href: "https://x.com/nlawz_",
                external: true,
            },
            { title: "GitHub", href: "https://github.com/nlawz", external: true },
            {
                title: "Book a Call",
                href: "https://cal.com/cracked/15min",
                external: true,
            },
        ],
    },
] satisfies Array<{ title: string; links: Array<NavLink> }>;

const Column: React.FC<{ title: string; links: Array<NavLink>; className?: string }> = ({
  title,
  links,
  className,
}) => {
  return (
    <div className={cn("flex flex-col gap-8  text-left ", className)}>
      <span className="w-full text-sm font-medium tracking-wider text-black font-display">
        {title}
      </span>
      <ul className="flex flex-col gap-4 md:gap-8">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="text-sm font-normal transition hover:text-black/40 text-black/70"
            >
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export function Footer() {
  return (
    <div className="border-t border-white/20 blog-footer-radial-gradient">
      <footer className="container relative grid grid-cols-2 gap-8 pt-8 mx-auto overflow-hidden lg:gap-16 sm:grid-cols-3 xl:grid-cols-5 sm:pt-12 md:pt-16 lg:pt-24 xl:pt-32">
        <div className="flex flex-col items-center col-span-2 sm:items-start sm:col-span-3 xl:col-span-2">
          <div className="flex items-center gap-2">
            <LogoIcon className="w-6 h-6" />
            <h1 className="bg-gradient-to-br text-transparent text-balance bg-gradient-stop bg-clip-text from-black/70 via-black/70 via-40% to-black/30 text-2xl">
              crack.dev
            </h1>
          </div>
          <div className="mt-8 text-sm font-normal leading-6 text-black/60">
            Build products faster.
          </div>
          <div className="text-sm font-normal leading-6 text-black/40">
            cracked labs {new Date().getUTCFullYear()}
          </div>
        </div>

        {navigation.map(({ title, links }) => (
          <Column
            key={title}
            title={title}
            links={links}
            className="col-span-1 "
          />
        ))}
      </footer>
      <div className="container mt-8 h-[100px]">
        <Wordmark className="flex object-cover overflow-visible" />
      </div>
    </div>
  );
}
