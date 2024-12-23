"use client";

import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "@/contexts/Authcontext";

interface Ordinal {
  id: string;
  name: string;
}

export function BurnOrdinals() {
  const [txid, setTxid] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [ordinals, setOrdinals] = useState<Ordinal[]>([]);
  const { walletAddress } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrdinals = async () => {
      try {
        const response = await fetch(`/api/get-ordinals?walletAddress=${walletAddress}`);
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const data = await response.json();
        setOrdinals(data.ordinals);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "An error occurred");
        } else {
          setError("An unexpected error occurred");
        }
      }
    };

    if (walletAddress) {
      fetchOrdinals();
    }
  }, [walletAddress]);

  const handleBurn = async (ordinalId: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/burn-ordinals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ordinalId }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      setTxid(data.txid);
      setOrdinals(ordinals.filter((ordinal) => ordinal.id !== ordinalId));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "An error occurred");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold">Burn Ordinals</h2>
      <p className="text-muted-foreground">
        Select the ordinals you want to burn.
      </p>

      <div className="space-y-4">
        {ordinals.length === 0 ? (
          <p className="text-center text-lg text-muted-foreground">
            No assets found
          </p>
        ) : (
          ordinals.map((ordinal) => (
            <div key={ordinal.id} className="bg-card rounded-lg p-4 shadow-lg border border-border">
              <p className="text-lg">{ordinal.name}</p>
              <button
                onClick={() => handleBurn(ordinal.id)}
                disabled={loading}
                className="w-full p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                {loading ? "Burning..." : "Burn"}
              </button>
            </div>
          ))
        )}

        {error && <p className="text-red-500">{error}</p>}
        {txid && (
          <p className="text-green-500">
            Ordinals burned successfully! Transaction ID: {txid}
          </p>
        )}
      </div>
    </motion.div>
  );
}