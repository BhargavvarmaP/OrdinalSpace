"use client";

import { useState, useContext } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import ordinalsbot from '@/lib/ob';
import { DirectInscriptionOrder, InscriptionOrderState, type InscriptionFile } from 'ordinalsbot/dist/types/v1';
import { AuthContext } from '@/contexts/Authcontext';

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(1000, "Content must not exceed 1000 characters"),
  fee: z.number().min(1, "Fee must be greater than 0"),
});

export function TextInscription() {
  const { toast } = useToast();
  const [isInscribing, setIsInscribing] = useState(false);
  const [order, setOrder] = useState<DirectInscriptionOrder | null>(null);
  const { loginWithWallet,walletAddress,wallet } = useContext(AuthContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      content: "",
      fee: 5000,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsInscribing(true);
    try {
      if (!wallet?.ordinalsAddress) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please connect a wallet.",
        });
        return;
      }

      const content = new Blob([values.content], { type: "text/plain;charset=utf-8" });
      const fileName = `${values.name}.txt`;

      const inscriptionOrder = await ordinalsbot.Inscription().createDirectOrder({
        files: [{
          name: fileName,
          size: content.size,
          type: content.type,
        }],
        fee: values.fee,
        receiveAddress: wallet.ordinalsAddress,
      });
      setOrder(inscriptionOrder);
      toast({
        title: "Inscription Created",
        description: "Your text has been successfully inscribed.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create inscription. Please try again.",
      });
    } finally {
      setIsInscribing(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter the item name you want to inscribe..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter the text you want to inscribe..."
                  className="min-h-[200px] resize-none bg-background/50 backdrop-blur-sm"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Your text will be permanently inscribed on the Bitcoin blockchain.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fee (sats)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Transaction fee in satoshis
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold py-3 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
          disabled={isInscribing}
        >
          {isInscribing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isInscribing ? "Creating Inscription..." : "Create Inscription"}
        </Button>
      </form>
    </Form>
  );
}