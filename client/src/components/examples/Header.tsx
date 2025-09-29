import Header from '../Header';

export default function HeaderExample() {
  return (
    <div>
      <Header
        isWalletConnected={true}
        walletAddress="0x742d35Cc6659Bc4B6E9D8B4F8D8A9C5E7F6A8B9C"
        walletBalance="15.43"
        onConnectWallet={() => console.log('Connect wallet clicked')}
        onSettings={() => console.log('Settings clicked')}
      />
    </div>
  );
}