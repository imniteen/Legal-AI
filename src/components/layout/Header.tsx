"use client";

import Link from "next/link";
import { Scale, Upload, FolderOpen } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Dashboard", icon: FolderOpen },
    { href: "/upload", label: "Upload Case", icon: Upload },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--primary-dark)]">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]">
            <Scale className="h-6 w-6 text-[var(--primary-dark)]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">JurisAI</h1>
            <p className="text-xs text-slate-300">Legal Case Analysis</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[var(--primary)] text-white"
                    : "text-slate-300 hover:bg-[var(--primary)] hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
