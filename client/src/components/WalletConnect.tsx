import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Zap, AlertCircle } from 'lucide-react';

interface WalletConnectProps {
  onConnect?: (address: string, balance: string) => void;
  onDisconnect?: () => void;
}

export default function WalletConnect({ onConnect, onDisconnect }: WalletConnectProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [balance, setBalance] = useState<string>('0');
  const [isConnecting, setIsConnecting] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<'connected' | 'wrong-network' | 'disconnected'>('disconnected');

  // Mock connection for prototype
  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAddress = '0x742d35Cc6659Bc4B6E9D8B4F8D8A9C5E7F6A8B9C';
      const mockBalance = '15.43';
      
      setAddress(mockAddress);
      setBalance(mockBalance);
      setIsConnected(true);
      setNetworkStatus('connected');
      
      onConnect?.(mockAddress, mockBalance);
      console.log('Wallet connected successfully');
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
    onDisconnect?.();
    console.log('Wallet disconnected');
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
          {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
        </Button>
      </div>
    </Card>
  );
}