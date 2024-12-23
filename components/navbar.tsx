"use client";

import { Bitcoin, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState, useContext } from "react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { ConnectWallet } from "./connect-wallet";
import { AuthContext } from "@/contexts/Authcontext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { walletAddress } = useContext(AuthContext); // Access the walletAddress from AuthContext
  const navigation = [
    { name: "Home", href: "/" },
    { name: "Ordinal Creation", href: "/create" },
    { name: "My Ordinals", href: "/inscriptions", show: walletAddress !== null }, // Conditionally show "My Ordinals"
    { name: "Creators", href: "/creators" },
    { name: "Docs", href: "/docs" },
  ];

  return (
    <nav className="bg-background border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Bitcoin className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl text-primary">Inscriber</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigation
              .filter((item) => item.show !== false) // Filter out items that should not be shown
              .map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  {item.name}
                </Link>
              ))}
            <ThemeToggle />
            <ConnectWallet />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navigation
              .filter((item) => item.show !== false) // Filter out items that should not be shown
              .map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            <div className="px-3 py-2">
              <ConnectWallet />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;