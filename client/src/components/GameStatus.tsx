import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Coins, TrendingUp } from 'lucide-react';

interface GameStatusProps {
  playerWins: number;
  computerWins: number;
  draws: number;
  gamesPlayed: number;
  walletBalance: string;
  gamesFeesPaid: string;
}

export default function GameStatus({ 
  playerWins, 
  computerWins, 
  draws, 
  gamesPlayed, 
  walletBalance,
  gamesFeesPaid 
}: GameStatusProps) {
  const winRate = gamesPlayed > 0 ? Math.round((playerWins / gamesPlayed) * 100) : 0;
  
  return (
    <div className="space-y-4">
      {/* Score Card */}
      <Card className="p-4 bg-card border-card-border">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="h-5 w-5 text-primary" data-testid="icon-trophy" />
          <h3 className="font-semibold text-card-foreground">Game Statistics</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary" data-testid="text-player-wins">
              {playerWins}
            </div>
            <div className="text-xs text-muted-foreground">Your Wins</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-destructive" data-testid="text-computer-wins">
              {computerWins}
            </div>
            <div className="text-xs text-muted-foreground">Computer Wins</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-semibold text-muted-foreground" data-testid="text-draws">
              {draws}
            </div>
            <div className="text-xs text-muted-foreground">Draws</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-semibold text-card-foreground" data-testid="text-total-games">
              {gamesPlayed}
            </div>
            <div className="text-xs text-muted-foreground">Total Games</div>
          </div>
        </div>
      </Card>

      {/* Win Rate */}
      <Card className="p-4 bg-card border-card-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" data-testid="icon-trending" />
            <span className="text-sm font-medium text-card-foreground">Win Rate</span>
          </div>
          <Badge 
            variant={winRate >= 50 ? 'default' : 'secondary'}
            data-testid="badge-win-rate"
          >
            {winRate}%
          </Badge>
        </div>
      </Card>

      {/* Wallet & Fees */}
      <Card className="p-4 bg-card border-card-border">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" data-testid="icon-coins" />
            <h3 className="font-semibold text-card-foreground">Wallet</h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Balance</span>
              <span className="text-sm font-medium text-card-foreground" data-testid="text-wallet-balance">
                {walletBalance} ZTC
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Fees Paid</span>
              <span className="text-sm font-medium text-destructive" data-testid="text-fees-paid">
                {gamesFeesPaid} ZTC
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Achievement Badge */}
      {playerWins >= 3 && (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" data-testid="icon-achievement" />
            <div>
              <p className="text-sm font-medium text-primary">Achievement Unlocked!</p>
              <p className="text-xs text-primary/80">Win Streak Master</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}