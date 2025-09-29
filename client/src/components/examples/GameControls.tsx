import GameControls from '../GameControls';

export default function GameControlsExample() {
  return (
    <div className="p-4 max-w-sm mx-auto">
      <GameControls
        onStartGame={() => console.log('Start game clicked')}
        onResetStats={() => console.log('Reset stats clicked')}
        canStartGame={true}
        isGameActive={false}
        walletBalance="15.43"
        gameFee="0.05"
      />
    </div>
  );
}