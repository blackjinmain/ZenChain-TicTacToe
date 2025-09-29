import { useState } from 'react';
import Header from '@/components/Header';
import WalletConnect from '@/components/WalletConnect';
import GameBoard from '@/components/GameBoard';
import GameStatus from '@/components/GameStatus';
import PaymentModal from '@/components/PaymentModal';
import GameControls from '@/components/GameControls';
import { ethers } from "ethers";
import { gameFeeForwarderABI, gameFeeForwarderAddress } from "@/contracts/GameFeeForwarder";
import Footer from "@/components/Footer";


const GAME_FEE = "0.05"; // 0.05 ZTC per game
const RECEIVER = "0x623FE15625dd24680a1177383771d5CdB61A0d39"; // <-- replace with your wallet

type Player = 'X' | 'O' | null;

export default function Home() {
  // Wallet state
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('0');

  // Game state
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  // Game statistics
  const [playerWins, setPlayerWins] = useState(0);
  const [computerWins, setComputerWins] = useState(0);
  const [draws, setDraws] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [gamesFeesPaid, setGamesFeesPaid] = useState('0');

  // Payment modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const gameFee = '0.05'; // 0.05 ZTC per game

  // 🔑 Wallet connect/disconnect handlers
  const handleWalletConnect = (address: string, balance: string) => {
    setIsWalletConnected(true);
    setWalletAddress(address);
    setWalletBalance(balance);
    console.log('Wallet connected in main app:', address, balance);
  };

  const handleWalletDisconnect = () => {
    setIsWalletConnected(false);
    setWalletAddress('');
    setWalletBalance('0');
    setIsGameActive(false);
    console.log('Wallet disconnected in main app');
  };

  // 🎮 Start Game with contract payment
  const handleStartGame = async () => {
    if (!window.ethereum) {
      console.log("Please install MetaMask or OKX Wallet");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        gameFeeForwarderAddress,
        gameFeeForwarderABI,
        signer
      );

      // Send 0.05 ZTC to the contract
      const tx = await contract.startGame({
        value: ethers.parseEther("0.05"),
      });

      console.log("Transaction sent:", tx.hash);

      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);

      // If successful, start the game
      setIsGameActive(true);
      setGameKey(prev => prev + 1);

      // Update stats
      const newBalance = (parseFloat(walletBalance) - parseFloat(gameFee)).toFixed(2);
      setWalletBalance(newBalance);

      const newFeesPaid = (parseFloat(gamesFeesPaid) + parseFloat(gameFee)).toFixed(2);
      setGamesFeesPaid(newFeesPaid);

      console.log("Payment successful, game started ✅");
    } catch (error) {
      console.error("Transaction failed ❌", error);
    }
  };

  // 🎮 Direct Payment Success
  const handlePaymentSuccess = async () => {
    if (!window.ethereum) {
      console.error("No wallet found!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Send 0.05 ZTC to your wallet
      const tx = await signer.sendTransaction({
        to: RECEIVER,
        value: ethers.parseEther(GAME_FEE),
      });

      await tx.wait();
      console.log("Payment confirmed:", tx.hash);

      // Deduct from UI balance
      const newBalance = (parseFloat(walletBalance) - parseFloat(GAME_FEE)).toFixed(2);
      setWalletBalance(newBalance);

      // Update stats
      const newFeesPaid = (parseFloat(gamesFeesPaid) + parseFloat(GAME_FEE)).toFixed(2);
      setGamesFeesPaid(newFeesPaid);

      // Start the game
      setIsGameActive(true);
      setGameKey(prev => prev + 1);
    } catch (err) {
      console.error("Payment failed:", err);
    }
  };

  // 🎮 Game End Handler
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
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <Header
        isWalletConnected={isWalletConnected}
        walletAddress={walletAddress}
        walletBalance={walletBalance}
        onConnectWallet={() => setShowPaymentModal(false)}
        onSettings={handleSettings}
      />

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
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
              <div className="lg:order-2 flex flex-col items-center gap-4">
                {/* Difficulty Selector */}
                <div className="w-full max-w-xs">
                  <label className="block text-sm font-medium text-card-foreground mb-1">
                    Select Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
                  >
                    <option value="easy">🟢 Easy</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="hard">🔴 Hard</option>
                  </select>
                </div>

                <GameBoard
                  onGameEnd={handleGameEnd}
                  onMove={(position, player) => console.log(`Move: ${player} at position ${position}`)}
                  disabled={!isGameActive}
                  gameKey={gameKey}
                  difficulty={difficulty} // ✅ Pass difficulty
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

      {/* Footer */}
      <Footer />

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
