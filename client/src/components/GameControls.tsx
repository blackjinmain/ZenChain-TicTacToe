import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, RotateCcw, Coins } from 'lucide-react';

interface GameControlsProps {
  onStartGame: () => void;
  onResetStats: () => void;
  canStartGame: boolean;
  isGameActive: boolean;
  walletBalance: string;
  gameFee: string;
}

export default function GameControls({ 
  onStartGame, 
  onResetStats, 
  canStartGame, 
  isGameActive,
  walletBalance,
  gameFee
}: GameControlsProps) {
  const canAfford = parseFloat(walletBalance) >= parseFloat(gameFee);
  
  return (
    <Card className="p-4 bg-card border-card-border">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="font-semibold text-card-foreground mb-2">Game Controls</h3>
          
          {!canStartGame && (
            <p className="text-sm text-muted-foreground mb-3">
              Connect your wallet to start playing
            </p>
          )}
          
          {canStartGame && !canAfford && (
            <p className="text-sm text-destructive mb-3">
              Insufficient balance to play ({gameFee} ZTC required)
            </p>
          )}
        </div>

        {/* Game Fee Display */}
        {canStartGame && (
          <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-primary" data-testid="icon-game-fee" />
              <span className="text-sm font-medium text-primary">Game Fee</span>
            </div>
            <span className="text-sm font-bold text-primary" data-testid="text-fee-amount">
              {gameFee} ZTC
            </span>
          </div>
        )}

        {/* Start Game Button */}
        <Button
          onClick={onStartGame}
          disabled={!canStartGame || !canAfford || isGameActive}
          className="w-full"
          data-testid="button-start-game"
        >
          <Play className="h-4 w-4 mr-2" />
          {isGameActive ? 'Game in Progress' : 'Start New Game'}
        </Button>

        {/* Reset Stats */}
        <Button
          variant="outline"
          onClick={onResetStats}
          disabled={isGameActive}
          className="w-full"
          data-testid="button-reset-stats"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Statistics
        </Button>

        {/* Instructions */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Pay {gameFee} ZTC to start each game</p>
          <p>• You play as X, computer plays as O</p>
          <p>• Win by getting 3 in a row</p>
          <p>• Stats are tracked for each session</p>
        </div>
      </div>
    </Card>
  );
}