"use client"
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="footer bg-background text-foreground py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-between gap-4 md:flex-row"
        >
          <div className="text-center md:text-left">
            <p className="text-lg font-semibold">
              Inscribe Your Vision on Bitcoin
            </p>
            <p className="mt-2 text-base leading-7 text-muted-foreground">
              &copy; {new Date().getFullYear()} Calibraint. All rights reserved.
            </p>
          </div>
          <Separator orientation="vertical" className="hidden md:block" />
          <div className="flex space-x-6">
            <Link href="/about">
              <Button variant="link" className="text-base hover:text-primary transition-colors duration-300">
                About
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="link" className="text-base hover:text-primary transition-colors duration-300">
                Contact
              </Button>
            </Link>
            <Link href="/privacy">
              <Button variant="link" className="text-base hover:text-primary transition-colors duration-300">
                Privacy Policy
              </Button>
            </Link>
            <Link href="/terms">
              <Button variant="link" className="text-base hover:text-primary transition-colors duration-300">
                Terms of Service
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}