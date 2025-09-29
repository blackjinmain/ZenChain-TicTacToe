import GameBoard from '../GameBoard';

export default function GameBoardExample() {
  return (
    <div className="p-4 max-w-lg mx-auto">
      <GameBoard
        onGameEnd={(winner, board) => console.log('Game ended, winner:', winner, 'board:', board)}
        onMove={(position, player) => console.log('Move made:', position, player)}
        gameKey={0}
      />
    </div>
  );
}