"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Wallet as WalletIcon } from "lucide-react"; // Import Wallet icon from lucide-react
import { useState, useContext, useEffect } from "react";
import { useLaserEyes } from '@omnisat/lasereyes';
import { UNISAT, XVERSE, MAGIC_EDEN, LEATHER } from '@omnisat/lasereyes';
import { UNISAT as unisatLogo, MAGIC_EDEN as magicEdenLogo, XVERSE as xVerseLogo, LEATHER as leatherLogo } from "@/lib/constants/imgs";
import type { SUPPORTED_WALLETS } from '@/contexts/types';
import { AuthContext } from "@/contexts/Authcontext";
import Image, { StaticImageData } from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function ConnectWallet() {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const { loginWithWallet, logout, walletAddress  } = useContext(AuthContext);
  const { connect, connected, paymentAddress, paymentPublicKey, publicKey, address, provider, hasLeather, hasMagicEden, hasUnisat, hasXverse, disconnect, signMessage } = useLaserEyes();
  const router = useRouter();

  const WalletProviderConfig: { [key in SUPPORTED_WALLETS]: { logo: StaticImageData } } = {
    [UNISAT]: { logo: unisatLogo },
    [LEATHER]: { logo: leatherLogo },
    [XVERSE]: { logo: xVerseLogo },
    [MAGIC_EDEN]: { logo: magicEdenLogo }
  };

  const connectWallet = async (wallet: SUPPORTED_WALLETS) => {
    setIsConnecting(true);
    try {
      await connect(wallet);
      toast({
        title: "Wallet Connected",
        description: "Your Bitcoin wallet has been successfully connected.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    if (connected) {
      loginWithWallet({
        ordinalsAddress: address,
        ordinalsPublicKey: publicKey,
        paymentAddress,
        paymentPublicKey,
        wallet: provider as SUPPORTED_WALLETS,
      });
    }
  }, [connected, address, publicKey, paymentAddress, paymentPublicKey, provider, loginWithWallet]);
console.log(connected, address, publicKey, paymentAddress, paymentPublicKey, provider, loginWithWallet)
  const signOut = async () => {
    try {
      await disconnect();
      logout();
      router.push('/');
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "Failed to disconnect wallet and log out.",
      });
    }
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {connected ? (
          <Button variant='outline' size='icon' className='w-auto p-3'>
            <Image src={WalletProviderConfig[provider as SUPPORTED_WALLETS].logo} alt={`${provider} wallet logo`} width={24} height={24} />
            {shortenAddress(walletAddress || '')}
          </Button>
        ) : isConnecting ? (
          <Button variant='outline' size='icon' className='w-auto p-3' disabled>
            Connecting...
          </Button>
        ) : (
          <Button variant='outline' size='icon' className='w-auto p-3'>
            <WalletIcon className="h-4 w-4" />
            Connect Wallet
          </Button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end'>
        {!connected && Object.entries(WalletProviderConfig).map(([key, value]) => {
          const isSupported = (key === UNISAT && hasUnisat) ||
                              (key === LEATHER && hasLeather) ||
                              (key === XVERSE && hasXverse) ||
                              (key === MAGIC_EDEN && hasMagicEden);
          return isSupported && (
            <DropdownMenuItem key={key} onClick={() => connectWallet(key as SUPPORTED_WALLETS)}>
              <div className='flex items-center space-x-2'>
                <Image src={value.logo} alt={`${key} wallet logo`} width={24} height={24} />
                <span className='capitalize'>{key}</span>
              </div>
            </DropdownMenuItem>
          );
        })}
        {connected && (
          <>
            <DropdownMenuItem onClick={signOut}>
              <span>Logout</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}