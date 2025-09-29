import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Circle } from 'lucide-react';

type Player = 'X' | 'O' | null;
type GameState = 'playing' | 'won' | 'draw';

interface GameBoardProps {
  onGameEnd?: (winner: Player, board: Player[]) => void;
  onMove?: (position: number, player: Player) => void;
  disabled?: boolean;
  gameKey?: number; // For resetting the game
}

export default function GameBoard({ onGameEnd, onMove, disabled = false, gameKey = 0 }: GameBoardProps) {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameState, setGameState] = useState<GameState>('playing');
  const [winner, setWinner] = useState<Player>(null);
  const [winningLine, setWinningLine] = useState<number[]>([]);

  // Reset game when gameKey changes
  useEffect(() => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setGameState('playing');
    setWinner(null);
    setWinningLine([]);
  }, [gameKey]);

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  const checkWinner = (board: Player[]): { winner: Player; line: number[] } => {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line: combination };
      }
    }
    return { winner: null, line: [] };
  };

  const makeComputerMove = (newBoard: Player[]) => {
    const availableMoves = newBoard
      .map((cell, index) => cell === null ? index : null)
      .filter(val => val !== null) as number[];

    if (availableMoves.length === 0) return newBoard;

    // Simple AI: random move for prototype
    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    const computerBoard = [...newBoard];
    computerBoard[randomMove] = 'O';
    
    onMove?.(randomMove, 'O');
    return computerBoard;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || gameState !== 'playing' || disabled || currentPlayer !== 'X') {
      return;
    }

    console.log(`Player clicked position ${index}`);

    // Player move
    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    onMove?.(index, 'X');

    // Check for winner after player move
    const { winner: playerWinner, line: playerLine } = checkWinner(newBoard);
    if (playerWinner) {
      setWinner(playerWinner);
      setWinningLine(playerLine);
      setGameState('won');
      onGameEnd?.(playerWinner, newBoard);
      return;
    }

    // Check for draw
    if (newBoard.every(cell => cell !== null)) {
      setGameState('draw');
      onGameEnd?.(null, newBoard);
      return;
    }

    // Computer move after a short delay
    setCurrentPlayer('O');
    setTimeout(() => {
      const computerBoard = makeComputerMove(newBoard);
      setBoard(computerBoard);

      // Check for winner after computer move
      const { winner: computerWinner, line: computerLine } = checkWinner(computerBoard);
      if (computerWinner) {
        setWinner(computerWinner);
        setWinningLine(computerLine);
        setGameState('won');
        onGameEnd?.(computerWinner, computerBoard);
        return;
      }

      // Check for draw after computer move
      if (computerBoard.every(cell => cell !== null)) {
        setGameState('draw');
        onGameEnd?.(null, computerBoard);
        return;
      }

      setCurrentPlayer('X');
    }, 500);
  };

  const renderIcon = (player: Player) => {
    if (player === 'X') {
      return <X className="h-8 w-8 text-primary" data-testid="icon-x" />;
    } else if (player === 'O') {
      return <Circle className="h-8 w-8 text-destructive" data-testid="icon-o" />;
    }
    return null;
  };

  return (
    <Card className="p-6 bg-card border-card-border">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-card-foreground" data-testid="text-game-title">
          Tic-Tac-Toe
        </h2>
        <p className="text-sm text-muted-foreground mt-1" data-testid="text-current-player">
          {gameState === 'playing' ? (
            `${currentPlayer === 'X' ? 'Your' : 'Computer\'s'} turn`
          ) : gameState === 'won' ? (
            `${winner === 'X' ? 'You' : 'Computer'} won!`
          ) : (
            'It\'s a draw!'
          )}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {board.map((cell, index) => (
          <Button
            key={index}
            variant="outline"
            className={`
              aspect-square h-20 w-20 p-0 
              hover-elevate active-elevate-2
              ${winningLine.includes(index) ? 'bg-primary/10 border-primary' : ''}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={() => handleCellClick(index)}
            disabled={disabled || cell !== null || gameState !== 'playing'}
            data-testid={`cell-${index}`}
          >
            {renderIcon(cell)}
          </Button>
        ))}
      </div>

      {gameState !== 'playing' && (
        <div className="text-center mt-4">
          <p className="text-lg font-semibold text-card-foreground" data-testid="text-game-result">
            {gameState === 'won' ? (
              winner === 'X' ? 'Congratulations! You won!' : 'Computer wins this round!'
            ) : (
              'It\'s a draw! Good game!'
            )}
          </p>
        </div>
      )}
    </Card>
  );
}