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
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ImagePlus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DirectInscriptionOrder, InscriptionOrderState, type InscriptionFile } from 'ordinalsbot/dist/types/v1';
import ordinalsbot from '@/lib/ob';
import { AuthContext } from '@/contexts/Authcontext';
import { useDropzone } from 'react-dropzone';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MAX_FILE_SIZE = 6000000; // 6MB
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "audio/mpeg",
  "audio/mp3",
  "video/mp4",
  "video/quicktime",
];

const formSchema = z.object({
  files: z
    .custom<File[]>()
    .refine((files) => files.every(file => file.size <= MAX_FILE_SIZE), `Max file size is 6MB.`)
    .refine(
      (files) => files.every(file => ACCEPTED_FILE_TYPES.includes(file.type)),
      "Only .jpg, .jpeg, .png, .webp, .mp3, .mp4, and .mov formats are supported."
    ),
  fee: z.number().min(1, "Fee must be greater than 0"),
  delegateAddress: z.string().min(1, "Delegate address is required"),
  inscriptionIds: z.array(z.string()).optional(),
  metadata: z.string().optional(),
  parentInscriptionId: z.string().optional(),
  parentReturnAddress: z.string().optional(),
  receiveAddress: z.string().min(1, "Receive address is required"),
  multipleAddresses: z.array(z.string()).optional(),
});

export function ImageInscription() {
  const { toast } = useToast();
  const [previews, setPreviews] = useState<string[]>([]);
  const [isInscribing, setIsInscribing] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [order, setOrder] = useState<DirectInscriptionOrder | null>(null);
  const { wallet } = useContext(AuthContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [],
      fee: 10000,
      delegateAddress: "",
      inscriptionIds: [],
      metadata: "",
      parentInscriptionId: "",
      parentReturnAddress: "",
      receiveAddress: wallet?.ordinalsAddress || "",
      multipleAddresses: [],
    },
  });

  const onDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    const readers = acceptedFiles.map(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
      return reader;
    });
    form.setValue('files', acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: MAX_FILE_SIZE,
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

      if (!files.length) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No files selected.",
        });
        return;
      }

      const fileDetails = files.map(({ name, size, type }) => ({ name, size, type }));

      const inscriptionOrder = await ordinalsbot.Inscription().createDirectOrder({
        files: fileDetails,
        fee: values.fee,
        receiveAddress: values.receiveAddress,
        // delegateAddress: values.delegateAddress,
        // inscriptionIds: values.inscriptionIds,
        // metadata: values.metadata,
        // parentInscriptionId: values.parentInscriptionId,
        // parentReturnAddress: values.parentReturnAddress,
        // multipleAddresses: values.multipleAddresses,
      });
      setOrder(inscriptionOrder);
    
      toast({
        title: "Inscription Created",
        description: "Your files have been successfully inscribed.",
      });
      setIsInscribing(false)

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
        <Tabs defaultValue="files" className="space-y-6">
          <TabsList className="flex justify-center space-x-4 bg-background rounded-lg p-2 shadow-md">
            <TabsTrigger value="files" className="flex-1 py-2 px-4 rounded-lg data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Files
            </TabsTrigger>
            <TabsTrigger value="delegate" className="flex-1 py-2 px-4 rounded-lg data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Delegate
            </TabsTrigger>
          </TabsList>

          <TabsContent value="files" className="space-y-4">
            <FormField
              control={form.control}
              name="files"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Files</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300 hover:border-orange-500">
                        <input {...getInputProps()} />
                        {isDragActive ? (
                          <p>Drop the files here ...</p>
                        ) : (
                          <div>
                            <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-muted-foreground">
                              Drag and drop your files here, or click to select files
                            </p>
                            <p className="mt-2 text-sm text-muted-foreground">
                              jpg, webp, png, gif, mp3, mp4, h264, metal
                            </p>
                          </div>
                        )}
                      </div>
                      <AnimatePresence mode="wait">
                        {!previews.length ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="border-2 border-dashed rounded-lg p-12 text-center"
                          >
                            <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-muted-foreground">
                              Drag and drop your files here, or click to select files
                            </p>
                            <p className="mt-2 text-sm text-muted-foreground">
                              jpg, webp, png, gif, mp3, mp4, h264, metal
                            </p>
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="grid grid-cols-2 gap-4"
                          >
                            {previews.map((preview, index) => (
                              <div key={index} className="relative aspect-square w-full max-w-sm mx-auto">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={preview}
                                  alt="Preview"
                                  className="rounded-lg object-cover shadow-lg transition-all duration-300 hover:scale-105"
                                />
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Your files will be permanently inscribed on the Bitcoin blockchain.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="delegate" className="space-y-4">
            <FormField
              control={form.control}
              name="delegateAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delegate Address</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </FormControl>
                  <FormDescription>
                    Address to delegate the ordinals to.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="inscriptionIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inscription IDs</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.split(','))}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </FormControl>
                  <FormDescription>
                    Comma-separated list of inscription IDs.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metadata"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metadata</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </FormControl>
                  <FormDescription>
                    Additional metadata for the inscription.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentInscriptionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Inscription ID</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </FormControl>
                  <FormDescription>
                    ID of the parent inscription.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentReturnAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Return Address</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </FormControl>
                  <FormDescription>
                    Return address for the parent inscription.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="receiveAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Receive Address</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </FormControl>
                  <FormDescription>
                    Address to receive the inscribed files.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="multipleAddresses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Send to Multiple Addresses</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.split(','))}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </FormControl>
                  <FormDescription>
                    Comma-separated list of addresses.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

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
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
          disabled={isInscribing || !files.length}
        >
          {isInscribing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isInscribing ? "Creating Inscription..." : "Create Inscription"}
        </Button>
      </form>
    </Form>
  );
}