import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Gamepad2, Zap, Settings } from 'lucide-react';

interface HeaderProps {
  isWalletConnected: boolean;
  walletAddress?: string;
  walletBalance?: string;
  onConnectWallet?: () => void;
  onSettings?: () => void;
}

export default function Header({ 
  isWalletConnected, 
  walletAddress = '', 
  walletBalance = '0',
  onConnectWallet,
  onSettings
}: HeaderProps) {
  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary p-2">
              <Gamepad2 className="h-6 w-6 text-primary-foreground" data-testid="icon-logo" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground" data-testid="text-app-title">
                ZenChain Tic-Tac-Toe
              </h1>
              <p className="text-xs text-muted-foreground">
                Play & Earn on Blockchain
              </p>
            </div>
          </div>

          {/* Wallet Status & Controls */}
          <div className="flex items-center gap-3">
            {/* Network Badge */}
            <Badge variant="outline" className="hidden sm:flex items-center gap-1" data-testid="badge-network">
              <Zap className="h-3 w-3" />
              ZenChain Testnet
            </Badge>

            {/* Wallet Info */}
            {isWalletConnected ? (
              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-foreground" data-testid="text-wallet-address">
                    {formatAddress(walletAddress)}
                  </p>
                  <p className="text-xs text-muted-foreground" data-testid="text-wallet-balance">
                    {walletBalance} ZTC
                  </p>
                </div>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={onSettings}
                  data-testid="button-settings"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button 
                onClick={onConnectWallet}
                data-testid="button-connect-wallet"
              >
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}