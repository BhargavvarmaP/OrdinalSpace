"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "./ui/checkbox";

const formSchema = z.object({
  ticker: z.string().min(4, "Ticker must be at least 4 characters").max(5, "Ticker must be at most 5 characters"),
  amount: z.number().min(1, "Amount must be greater than 0"),
  repeat: z.number().min(1, "Repeat must be greater than 0"),
  tickerLength: z.enum(["4", "5"]),
  totalSupply: z.number().min(1, "Total supply must be greater than 0"),
  limitPerMint: z.number().min(1, "Limit per mint must be greater than 0"),
  selfMint: z.boolean(),
});

export function BRC20Mint() {
  const { toast } = useToast();
  const [txid, setTxid] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticker: "",
      amount: 1,
      repeat: 1,
      tickerLength: "4",
      totalSupply: 21000000,
      limitPerMint: 1,
      selfMint: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError("");
    try {
      // Simulate a mint transaction (replace with actual API call)
      const response = await fetch("/api/mint-brc20", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok) {
        setTxid(data.txid);
        toast({
          title: "BRC-20 Tokens Minted",
          description: "Your BRC-20 tokens have been successfully minted.",
        });
      } else {
        setError(data.message || "Failed to mint BRC-20 tokens");
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "Failed to mint BRC-20 tokens",
        });
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold">Mint BRC-20 Tokens</h2>
      <p className="text-muted-foreground">
        You can mint or deploy BRC-20 tokens below. Learn more here.
      </p>

      <Tabs defaultValue="mint" className="space-y-6">
        <TabsList className="flex justify-center space-x-4 bg-background rounded-lg p-2 shadow-md">
          <TabsTrigger value="mint" className="flex-1 py-2 px-4 rounded-lg data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            Mint
          </TabsTrigger>
          <TabsTrigger value="deploy" className="flex-1 py-2 px-4 rounded-lg data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            Deploy
          </TabsTrigger>
          <TabsTrigger value="transfer" className="flex-1 py-2 px-4 rounded-lg data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            Transfer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mint" className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="ticker"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ticker</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter 4 or 5 character tick code, e.g., ordi"
                        {...field}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the ticker code for your BRC-20 token.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormDescription>
                      Amount of tokens to mint.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="repeat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repeat</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-4">
                        <Slider
                          defaultValue={[field.value]}
                          max={100}
                          step={1}
                          onValueChange={(value: number[]) => field.onChange(value[0])}
                          className="w-full"
                        />
                        <Input
                          type="number"
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="w-16 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Number of times to repeat the minting process.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tickerLength"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Ticker Length</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="4" />
                          </FormControl>
                          <FormLabel>4 Ticker</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="5" />
                          </FormControl>
                          <FormLabel>5 Ticker</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold py-3 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Minting..." : "Mint BRC-20 Tokens"}
              </Button>

              {error && <p className="text-red-500">{error}</p>}
              {txid && (
                <p className="text-green-500">
                  BRC-20 tokens minted successfully! Transaction ID: {txid}
                </p>
              )}
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="deploy" className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="ticker"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ticker</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter 4 or 5 character tick code, e.g., ordi"
                        {...field}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the ticker code for your BRC-20 token.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalSupply"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Supply</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormDescription>
                      Total supply of tokens.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="limitPerMint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Limit Per Mint</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormDescription>
                      Limit of tokens per mint.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="selfMint"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Self Mint</FormLabel>
                      <FormDescription>
                        Enable self minting.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold py-3 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Deploying..." : "Deploy BRC-20 Tokens"}
              </Button>

              {error && <p className="text-red-500">{error}</p>}
              {txid && (
                <p className="text-green-500">
                  BRC-20 tokens deployed successfully! Transaction ID: {txid}
                </p>
              )}
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="transfer" className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="ticker"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ticker</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter 4 or 5 character tick code, e.g., ordi"
                        {...field}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the ticker code for your BRC-20 token.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormDescription>
                      Amount of tokens to transfer.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold py-3 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Transferring..." : "Transfer BRC-20 Tokens"}
              </Button>

              {error && <p className="text-red-500">{error}</p>}
              {txid && (
                <p className="text-green-500">
                  BRC-20 tokens transferred successfully! Transaction ID: {txid}
                </p>
              )}
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}