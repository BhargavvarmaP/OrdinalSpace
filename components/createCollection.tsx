"use client"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

export function CreateCollection() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [collectionData, setCollectionData] = useState({
    id: "",
    name: "",
    description: "",
    creator: "",
    totalCount: 0,
    price: 0,
    twitter: "",
    website: "",
    banner: null as File | null,
    cover: null as File | null,
    creatorAddress: "",
    allowList: {},
    files: [] as File[],
    altPrices: {}
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCollectionData({
      ...collectionData,
      [name]: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      setCollectionData({
        ...collectionData,
        [name]: file
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('id', collectionData.id);
    formData.append('name', collectionData.name);
    formData.append('description', collectionData.description);
    formData.append('creator', collectionData.creator);
    formData.append('totalCount', collectionData.totalCount.toString());
    formData.append('price', collectionData.price.toString());
    formData.append('twitter', collectionData.twitter);
    formData.append('website', collectionData.website);
    if (collectionData.banner) formData.append('banner', collectionData.banner);
    if (collectionData.cover) formData.append('cover', collectionData.cover);
    formData.append('creatorAddress', collectionData.creatorAddress);
    formData.append('allowList', JSON.stringify(collectionData.allowList));
    collectionData.files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });
    formData.append('altPrices', JSON.stringify(collectionData.altPrices));

    try {
      const response = await fetch('https://api.ordinalsbot.com/collection-create', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Error creating collection:', error);
    }
  };

  const renderPhase = () => {
    switch (currentPhase) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold mb-4">Get Started</h2>
            <div>
              <Label htmlFor="id">Collection ID</Label>
              <Input id="id" name="id" type="text" value={collectionData.id} onChange={handleInputChange} required className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <Label htmlFor="name">Collection Name</Label>
              <Input id="name" name="name" type="text" value={collectionData.name} onChange={handleInputChange} required className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={collectionData.description} onChange={handleInputChange} required className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <Button onClick={() => setCurrentPhase(1)} className="w-full bg-blue-500 text-white py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-200">Next</Button>
          </motion.div>
        );
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold mb-4">Details</h2>
            <div>
              <Label htmlFor="creator">Creator</Label>
              <Input id="creator" name="creator" type="text" value={collectionData.creator} onChange={handleInputChange} required className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <Label htmlFor="totalCount">Total Count</Label>
              <Input id="totalCount" name="totalCount" type="number" value={collectionData.totalCount} onChange={handleInputChange} required className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input id="price" name="price" type="number" value={collectionData.price} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <Label htmlFor="twitter">Twitter</Label>
              <Input id="twitter" name="twitter" type="text" value={collectionData.twitter} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input id="website" name="website" type="text" value={collectionData.website} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <Label htmlFor="banner">Upload Banner</Label>
              <Input id="banner" name="banner" type="file" onChange={handleFileChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <Label htmlFor="cover">Upload Cover</Label>
              <Input id="cover" name="cover" type="file" onChange={handleFileChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <Label htmlFor="creatorAddress">Creator Address</Label>
              <Input id="creatorAddress" name="creatorAddress" type="text" value={collectionData.creatorAddress} onChange={handleInputChange} required className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <Button onClick={() => setCurrentPhase(2)} className="w-full bg-blue-500 text-white py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-200">Next</Button>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold mb-4">Review</h2>
            <div>
              <Label>Collection ID</Label>
              <p>{collectionData.id}</p>
            </div>
            <div>
              <Label>Collection Name</Label>
              <p>{collectionData.name}</p>
            </div>
            <div>
              <Label>Description</Label>
              <p>{collectionData.description}</p>
            </div>
            <div>
              <Label>Creator</Label>
              <p>{collectionData.creator}</p>
            </div>
            <div>
              <Label>Total Count</Label>
              <p>{collectionData.totalCount}</p>
            </div>
            <div>
              <Label>Price</Label>
              <p>{collectionData.price}</p>
            </div>
            <div>
              <Label>Twitter</Label>
              <p>{collectionData.twitter}</p>
            </div>
            <div>
              <Label>Website</Label>
              <p>{collectionData.website}</p>
            </div>
            <div>
              <Label>Banner</Label>
              {collectionData.banner && <img src={URL.createObjectURL(collectionData.banner)} alt="Banner" className="max-w-full h-auto rounded-lg shadow-lg" />}
            </div>
            <div>
              <Label>Cover</Label>
              {collectionData.cover && <img src={URL.createObjectURL(collectionData.cover)} alt="Cover" className="max-w-full h-auto rounded-lg shadow-lg" />}
            </div>
            <div>
              <Label>Creator Address</Label>
              <p>{collectionData.creatorAddress}</p>
            </div>
            <Button onClick={() => setCurrentPhase(3)} className="w-full bg-blue-500 text-white py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-200">Next</Button>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold mb-4">Submit</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="files">Upload Files</Label>
                <Input id="files" type="file" multiple onChange={handleFileChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <Button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-200">Submit</Button>
            </form>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
      {renderPhase()}
    </div>
  );
}