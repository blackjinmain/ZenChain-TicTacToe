import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Coins, Zap, CheckCircle, AlertCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  gameFee: string;
  walletBalance: string;
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  onPaymentSuccess, 
  gameFee,
  walletBalance 
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [transactionHash, setTransactionHash] = useState<string>('');

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentStatus('processing');
    
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock transaction hash
      const mockTxHash = '0x' + Math.random().toString(16).substr(2, 40);
      setTransactionHash(mockTxHash);
      setPaymentStatus('success');
      
      console.log('Payment successful, tx hash:', mockTxHash);
      
      // Delay before closing and starting game
      setTimeout(() => {
        onPaymentSuccess();
        handleClose();
      }, 1500);
      
    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentStatus('failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setPaymentStatus('idle');
      setTransactionHash('');
      onClose();
    }
  };

  const canAfford = parseFloat(walletBalance) >= parseFloat(gameFee);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" data-testid="icon-payment" />
            Pay Game Fee
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {paymentStatus === 'idle' && (
            <>
              <Card className="p-4 bg-card border-card-border">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Game Fee</span>
                    <span className="text-lg font-bold text-primary" data-testid="text-game-fee">
                      {gameFee} ZTC
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Your Balance</span>
                    <span className="text-sm font-medium text-card-foreground" data-testid="text-balance">
                      {walletBalance} ZTC
                    </span>
                  </div>
                  
                  <div className="border-t pt-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-card-foreground">Remaining</span>
                    <span className={`text-sm font-bold ${canAfford ? 'text-primary' : 'text-destructive'}`} data-testid="text-remaining">
                      {(parseFloat(walletBalance) - parseFloat(gameFee)).toFixed(2)} ZTC
                    </span>
                  </div>
                </div>
              </Card>

              {!canAfford && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-destructive" data-testid="icon-insufficient-funds" />
                  <span className="text-sm text-destructive">Insufficient balance</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Zap className="h-3 w-3" />
                <span>Transaction will be processed on ZenChain testnet</span>
              </div>
            </>
          )}

          {paymentStatus === 'processing' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" data-testid="icon-loading" />
              </div>
              <div>
                <p className="font-medium text-card-foreground">Processing Payment</p>
                <p className="text-sm text-muted-foreground">Confirm the transaction in your wallet</p>
              </div>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="h-8 w-8 text-primary" data-testid="icon-success" />
              </div>
              <div>
                <p className="font-medium text-primary">Payment Successful!</p>
                <p className="text-sm text-muted-foreground">Starting your game...</p>
                {transactionHash && (
                  <p className="text-xs text-muted-foreground mt-2" data-testid="text-tx-hash">
                    Tx: {transactionHash.slice(0, 10)}...{transactionHash.slice(-6)}
                  </p>
                )}
              </div>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <AlertCircle className="h-8 w-8 text-destructive" data-testid="icon-error" />
              </div>
              <div>
                <p className="font-medium text-destructive">Payment Failed</p>
                <p className="text-sm text-muted-foreground">Please try again</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isProcessing}
            className="flex-1"
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          
          {paymentStatus === 'idle' && (
            <Button
              onClick={handlePayment}
              disabled={!canAfford || isProcessing}
              className="flex-1"
              data-testid="button-pay"
            >
              Pay & Play
            </Button>
          )}
          
          {paymentStatus === 'failed' && (
            <Button
              onClick={handlePayment}
              disabled={!canAfford}
              className="flex-1"
              data-testid="button-retry"
            >
              Retry Payment
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}