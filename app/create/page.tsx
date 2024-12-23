"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextInscription } from "@/components/text-inscription";
import { ImageInscription } from "@/components/image-inscription";
import { BRC20Mint } from "@/components/brc20-mint";
import { RunesComponent } from "@/components/runesinscription"; // Import the new component
import { motion } from "framer-motion";

export default function CreatePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6"
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
            Create Ordinals
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Choose the type of content you want to inscribe on the Bitcoin blockchain.
          </p>
        </div>

        <Tabs defaultValue="text" className="space-y-6">
          <TabsList className="flex justify-center space-x-4 bg-background rounded-lg p-2 shadow-md">
            <TabsTrigger value="text" className="flex-1 py-2 px-4 rounded-lg data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Text
            </TabsTrigger>
            <TabsTrigger value="image" className="flex-1 py-2 px-4 rounded-lg data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Image
            </TabsTrigger>
            <TabsTrigger value="brc20" className="flex-1 py-2 px-4 rounded-lg data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              BRC-20
            </TabsTrigger>
            <TabsTrigger value="runes" className="flex-1 py-2 px-4 rounded-lg data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Runes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
              <TextInscription />
            </div>
          </TabsContent>

          <TabsContent value="image" className="space-y-4">
            <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
              <ImageInscription />
            </div>
          </TabsContent>

          <TabsContent value="brc20" className="space-y-4">
            <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
              <BRC20Mint />
            </div>
          </TabsContent>

          <TabsContent value="runes" className="space-y-4">
            <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
              <RunesComponent/> {/* Add the RunesInscription component here */}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}