import GameStatus from '../GameStatus';

export default function GameStatusExample() {
  return (
    <div className="p-4 max-w-sm mx-auto">
      <GameStatus
        playerWins={5}
        computerWins={3}
        draws={2}
        gamesPlayed={10}
        walletBalance="15.43"
        gamesFeesPaid="1.25"
      />
    </div>
  );
}