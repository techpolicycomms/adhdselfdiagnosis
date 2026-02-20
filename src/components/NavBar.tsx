"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClientAccountLink } from "./ClientAccountLink";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/donate", label: "Assessment" },
  { href: "/extension/install", label: "Extension" },
] as const;

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold text-stone-900 hover:text-emerald-600">
          ADHD Self-Assessment
        </Link>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors ${
                pathname === href
                  ? "text-emerald-600"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {label}
            </Link>
          ))}
          <ClientAccountLink />
        </div>
      </nav>
    </header>
  );
}
