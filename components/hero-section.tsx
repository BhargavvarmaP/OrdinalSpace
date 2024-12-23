import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export function HeroSection() {
  return (
    <div className="relative isolate">
      <div className="mx-auto max-w-4xl py-12 sm:py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
            Inscribe Your Legacy on Bitcoin
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Create permanent, immutable inscriptions on the Bitcoin blockchain.
            Preserve text, images, and more with our easy-to-use platform.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/create">
              <Button size="lg" className="gap-2">
                Start Inscribing
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-orange-500 to-yellow-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </div>
  );
}