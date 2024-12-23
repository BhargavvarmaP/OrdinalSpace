import React, { createContext, useState, useEffect } from 'react';
import { IWallet, IAuthContext, SUPPORTED_WALLETS } from '@/contexts/types';

export const AuthContext = createContext<IAuthContext>({
  loginWithWallet: () => {},
  logout: () => {},
  wallet: null,
  loading: true,
  walletAddress: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<IWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading state
    
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const loginWithWallet = (wallet: IWallet) => {
    setWallet(wallet);
    setWalletAddress(wallet.ordinalsAddress);
  };

  const logout = () => {
    setWallet(null);
    setWalletAddress(null);
  };

  return (
    <AuthContext.Provider value={{ loginWithWallet, logout, wallet, loading, walletAddress }}>
      {children}
    </AuthContext.Provider>
  );
};