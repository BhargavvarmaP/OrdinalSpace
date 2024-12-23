import {
  CircleDollarSign,
  FileText,
  Image,
  Shield,
  Wallet,
  Zap,
} from "lucide-react";

const features = [
  {
    name: "Text Inscriptions",
    description:
      "Inscribe text messages, documents, and more directly onto the Bitcoin blockchain.",
    icon: FileText,
  },
  {
    name: "Image Inscriptions",
    description:
      "Upload and preserve images as Bitcoin Ordinals with support for various formats.",
    icon: Image,
  },
  {
    name: "Wallet Integration",
    description:
      "Seamlessly connect your Bitcoin wallet for secure transaction signing.",
    icon: Wallet,
  },
  {
    name: "Low Fees",
    description:
      "Optimize your inscription costs with our efficient transaction processing.",
    icon: CircleDollarSign,
  },
  {
    name: "Enhanced Security",
    description:
      "Your inscriptions are secured by Bitcoin's robust and decentralized network.",
    icon: Shield,
  },
  {
    name: "Fast Processing",
    description:
      "Quick and reliable inscription processing with real-time status updates.",
    icon: Zap,
  },
];

export function Features() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-orange-500">
            Features
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to inscribe on Bitcoin
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Our platform provides all the tools you need to create and manage your
            Bitcoin inscriptions efficiently and securely.
          </p>
        </div>

        <div className="mt-20 max-w-lg sm:mx-auto md:max-w-none">
          <div className="grid grid-cols-1 gap-y-16 md:grid-cols-2 lg:grid-cols-3 md:gap-x-12 md:gap-y-16">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="relative flex flex-col gap-6 sm:flex-row md:flex-col lg:flex-row"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 sm:shrink-0">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="sm:min-w-0 sm:flex-1">
                  <p className="text-lg font-semibold leading-8">{feature.name}</p>
                  <p className="mt-2 text-base leading-7 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}