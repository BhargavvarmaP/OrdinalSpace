import { createContext, ReactNode, useEffect, useState } from 'react';
import { IAuthContext, IWallet } from './types';
import { WALLET_COOKIE } from '@/lib/constants';
import { useRouter } from 'next/navigation';

export const AuthContext = createContext<IAuthContext>({} as any);

const AuthContextProvider = ({ children }: { children: NonNullable<ReactNode> }) => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [wallet, setWallet] = useState<IWallet | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const loginWithWallet = (wallet: IWallet) => {
    sessionStorage.setItem(WALLET_COOKIE, JSON.stringify(wallet));
    setWallet(wallet);
    setWalletAddress(wallet.ordinalsAddress);
    router.push('/create');
  };

  const logout = () => {
    sessionStorage.removeItem(WALLET_COOKIE);
    setWallet(null);
    setWalletAddress(null);
    router.push('/');
  };

  useEffect(() => {
    const localWallet = JSON.parse(sessionStorage.getItem(WALLET_COOKIE) || 'null');

    if (localWallet) {
      setWallet(localWallet);
      setWalletAddress(localWallet.ordinalsAddress);
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loginWithWallet, 
        logout, 
        walletAddress,
        loading, 
        wallet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;