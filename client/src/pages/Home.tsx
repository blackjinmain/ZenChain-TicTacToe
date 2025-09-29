import { useState } from 'react';
import Header from '@/components/Header';
import WalletConnect from '@/components/WalletConnect';
import GameBoard from '@/components/GameBoard';
import GameStatus from '@/components/GameStatus';
import PaymentModal from '@/components/PaymentModal';
import GameControls from '@/components/GameControls';

type Player = 'X' | 'O' | null;

export default function Home() {
  // Wallet state
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('0');

  // Game state
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  
  // Game statistics
  const [playerWins, setPlayerWins] = useState(0);
  const [computerWins, setComputerWins] = useState(0);
  const [draws, setDraws] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [gamesFeesPaid, setGamesFeesPaid] = useState('0');

  // Payment modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const gameFee = '0.05'; // 0.05 ZTC per game

  const handleWalletConnect = (address: string, balance: string) => {
    setIsWalletConnected(true);
    setWalletAddress(address);
    setWalletBalance(balance);
    console.log('Wallet connected in main app');
  };

  const handleWalletDisconnect = () => {
    setIsWalletConnected(false);
    setWalletAddress('');
    setWalletBalance('0');
    setIsGameActive(false);
    console.log('Wallet disconnected in main app');
  };

  const handleStartGame = () => {
    if (!isWalletConnected) {
      console.log('Please connect wallet first');
      return;
    }
    
    if (parseFloat(walletBalance) < parseFloat(gameFee)) {
      console.log('Insufficient balance');
      return;
    }

    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    // Deduct fee from balance
    const newBalance = (parseFloat(walletBalance) - parseFloat(gameFee)).toFixed(2);
    setWalletBalance(newBalance);
    
    // Update fees paid
    const newFeesPaid = (parseFloat(gamesFeesPaid) + parseFloat(gameFee)).toFixed(2);
    setGamesFeesPaid(newFeesPaid);
    
    // Start new game
    setIsGameActive(true);
    setGameKey(prev => prev + 1);
    
    console.log('Payment successful, game started');
  };

  const handleGameEnd = (winner: Player) => {
    setIsGameActive(false);
    setGamesPlayed(prev => prev + 1);
    
    if (winner === 'X') {
      setPlayerWins(prev => prev + 1);
      console.log('Player wins!');
    } else if (winner === 'O') {
      setComputerWins(prev => prev + 1);
      console.log('Computer wins!');
    } else {
      setDraws(prev => prev + 1);
      console.log('Game drawn!');
    }
  };

  const handleResetStats = () => {
    setPlayerWins(0);
    setComputerWins(0);
    setDraws(0);
    setGamesPlayed(0);
    setGamesFeesPaid('0');
    console.log('Statistics reset');
  };

  const handleSettings = () => {
    console.log('Settings clicked - could open wallet management, network settings, etc.');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        isWalletConnected={isWalletConnected}
        walletAddress={walletAddress}
        walletBalance={walletBalance}
        onConnectWallet={() => setShowPaymentModal(false)} // Close any modals when connecting from header
        onSettings={handleSettings}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Wallet Connection */}
          {!isWalletConnected && (
            <div className="mb-8">
              <WalletConnect
                onConnect={handleWalletConnect}
                onDisconnect={handleWalletDisconnect}
              />
            </div>
          )}

          {/* Game Interface */}
          {isWalletConnected && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Game Controls & Stats */}
              <div className="lg:order-1 space-y-6">
                <GameControls
                  onStartGame={handleStartGame}
                  onResetStats={handleResetStats}
                  canStartGame={isWalletConnected}
                  isGameActive={isGameActive}
                  walletBalance={walletBalance}
                  gameFee={gameFee}
                />
                
                <GameStatus
                  playerWins={playerWins}
                  computerWins={computerWins}
                  draws={draws}
                  gamesPlayed={gamesPlayed}
                  walletBalance={walletBalance}
                  gamesFeesPaid={gamesFeesPaid}
                />
              </div>

              {/* Center Column - Game Board */}
              <div className="lg:order-2 flex justify-center">
                <GameBoard
                  onGameEnd={handleGameEnd}
                  onMove={(position, player) => console.log(`Move: ${player} at position ${position}`)}
                  disabled={!isGameActive}
                  gameKey={gameKey}
                />
              </div>

              {/* Right Column - Instructions/Info */}
              <div className="lg:order-3">
                <div className="bg-card border border-card-border rounded-lg p-6">
                  <h3 className="font-semibold text-card-foreground mb-4">How to Play</h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>1. Connect your MetaMask wallet to ZenChain testnet</p>
                    <p>2. Get ZTC tokens from the faucet if needed</p>
                    <p>3. Pay {gameFee} ZTC to start each game</p>
                    <p>4. You play as X, computer plays as O</p>
                    <p>5. Get 3 in a row to win!</p>
                  </div>
                  
                  <div className="mt-6 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <p className="text-xs text-primary font-medium">
                      💡 Tip: Get testnet ZTC from the faucet at faucet.zenchain.io
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
        gameFee={gameFee}
        walletBalance={walletBalance}
      />
    </div>
  );
}