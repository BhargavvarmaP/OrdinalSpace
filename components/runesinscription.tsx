"use client"
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function RunesComponent() {
  const [activeTab, setActiveTab] = useState("etch");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="flex justify-center space-x-4 bg-background rounded-lg p-2 shadow-md">
        <TabsTrigger value="etch" className="flex-1 py-2 px-4 rounded-lg data-[state=active]:bg-orange-500 data-[state=active]:text-white">
          Etch
        </TabsTrigger>
        <TabsTrigger value="mint" className="flex-1 py-2 px-4 rounded-lg data-[state=active]:bg-orange-500 data-[state=active]:text-white">
          Mint
        </TabsTrigger>
      </TabsList>

      <TabsContent value="etch" className="space-y-4">
        <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
          <h2 className="text-2xl font-bold mb-4">Etch Runes</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="file">Upload File</Label>
              <Input id="file" type="file" />
            </div>
            <div>
              <Label htmlFor="runeName">Rune Name</Label>
              <Input id="runeName" type="text" />
            </div>
            <div>
              <Label htmlFor="supply">Supply</Label>
              <Input id="supply" type="number" />
            </div>
            <div>
              <Label htmlFor="symbol">Symbol</Label>
              <Input id="symbol" type="text" />
            </div>
            <div>
              <Label htmlFor="divisibility">Divisibility</Label>
              <Input id="divisibility" type="number" />
            </div>
            <div>
              <Label htmlFor="fee">Fee</Label>
              <Input id="fee" type="number" />
            </div>
            <div>
              <Label htmlFor="premine">Premine</Label>
              <Input id="premine" type="number" />
            </div>
            <div>
              <Label htmlFor="receiveAddress">Receive Address</Label>
              <Input id="receiveAddress" type="text" />
            </div>
            <div>
              <Label htmlFor="terms">Terms</Label>
              <Input id="terms" type="text" />
            </div>
            <Button className="w-full">Submit</Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="mint" className="space-y-4">
        <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
          <h2 className="text-2xl font-bold mb-4">Mint Runes</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="runeName">Rune Name</Label>
              <Input id="runeName" type="text" />
            </div>
            <div>
              <Label htmlFor="fee">Fee</Label>
              <Input id="fee" type="number" />
            </div>
            <div>
              <Label htmlFor="receiveAddress">Receive Address</Label>
              <Input id="receiveAddress" type="text" />
            </div>
            <div>
              <Label htmlFor="numberOfMints">Number of Mints</Label>
              <Input id="numberOfMints" type="number" />
            </div>
            <div>
              <Label htmlFor="network">Select Network</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Network" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bitcoin">Bitcoin</SelectItem>
                  <SelectItem value="testnet">Testnet</SelectItem>
                  <SelectItem value="signet">Signet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full">Submit</Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}