import WalletConnect from '../WalletConnect';

export default function WalletConnectExample() {
  return (
    <div className="p-4 max-w-md mx-auto">
      <WalletConnect 
        onConnect={(address, balance) => console.log('Connected:', address, balance)}
        onDisconnect={() => console.log('Disconnected')}
      />
    </div>
  );
}