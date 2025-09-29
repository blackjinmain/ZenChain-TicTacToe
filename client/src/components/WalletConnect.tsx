import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Zap, AlertCircle } from 'lucide-react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletConnectProps {
  onConnect?: (address: string, balance: string) => void;
  onDisconnect?: () => void;
}

// ZenChain Testnet config
const ZENCHAIN_TESTNET = {
  chainId: '0x20d8',  // 8408 decimal
  chainName: 'ZenChain Testnet',
  nativeCurrency: {
    name: 'ZenChain Token',
    symbol: 'ZTC',
    decimals: 18,
  },
  rpcUrls: ['https://zenchain-testnet.api.onfinality.io/public'],
  blockExplorerUrls: ['https://zentrace.io'],
};



export default function WalletConnect({ onConnect, onDisconnect }: WalletConnectProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [balance, setBalance] = useState<string>('0');
  const [isConnecting, setIsConnecting] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<'connected' | 'wrong-network' | 'disconnected'>('disconnected');
  const [chainId, setChainId] = useState<string>('');

  const handleConnect = async () => {
    setIsConnecting(true);

    try {
      if (!window.ethereum) {
        alert('No wallet found! Please install MetaMask or OKX Wallet.');
        return;
      }

      // 🔹 1. Ensure ZenChain network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: ZENCHAIN_TESTNET.chainId }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          // Chain not added → add it
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [ZENCHAIN_TESTNET],
          });
        } else {
          throw switchError;
        }
      }

      // 🔹 2. Request accounts
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const selectedAddress = accounts[0];

      // 🔹 3. Read balance (from ZenChain RPC)
      const balanceBN = await provider.getBalance(selectedAddress);
      const balance = ethers.formatEther(balanceBN);

      // 🔹 4. Get chainId and update UI
      const network = await provider.getNetwork();
      const currentChainId = `0x${network.chainId.toString(16)}`;
      setChainId(currentChainId);

      const isOnZenChain = currentChainId === ZENCHAIN_TESTNET.chainId;
      setNetworkStatus(isOnZenChain ? 'connected' : 'wrong-network');

      setAddress(selectedAddress);
      setBalance(balance);
      setIsConnected(true);

      onConnect?.(selectedAddress, balance);
      console.log('Wallet connected successfully:', selectedAddress);
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAddress('');
    setBalance('0');
    setNetworkStatus('disconnected');
    setChainId('');
    onDisconnect?.();
    console.log('Wallet disconnected');
  };

  const switchToZenChain = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [ZENCHAIN_TESTNET],
      });
    } catch (err) {
      console.error('Failed to add/switch network:', err);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected) {
    return (
      <Card className="p-4 bg-card border-card-border">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Wallet className="h-5 w-5 text-primary" data-testid="icon-wallet" />
            <div>
              <p className="text-sm font-medium text-card-foreground" data-testid="text-address">
                {formatAddress(address)}
              </p>
              <p className="text-xs text-muted-foreground" data-testid="text-balance">
                {balance} ZTC
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant={networkStatus === 'connected' ? 'default' : 'destructive'}
              className="text-xs"
              data-testid="badge-network-status"
            >
              <Zap className="h-3 w-3 mr-1" />
              {networkStatus === 'connected' ? 'ZenChain' : 'Wrong Network'}
            </Badge>
            
            {networkStatus === 'wrong-network' && (
              <Button 
                variant="secondary" 
                size="sm"
                onClick={switchToZenChain}
              >
                Switch to ZenChain
              </Button>
            )}

            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDisconnect}
              data-testid="button-disconnect"
            >
              Disconnect
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card border-card-border text-center">
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-3">
            <Wallet className="h-8 w-8 text-primary" data-testid="icon-wallet-large" />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Connect Your Wallet</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Connect to ZenChain testnet to start playing
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <AlertCircle className="h-4 w-4" />
          <span>Make sure you're on ZenChain testnet</span>
        </div>

        <Button 
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full"
          data-testid="button-connect"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      </div>
    </Card>
  );
}
