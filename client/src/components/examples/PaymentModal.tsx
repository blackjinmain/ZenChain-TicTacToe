import { useState } from 'react';
import { Button } from '@/components/ui/button';
import PaymentModal from '../PaymentModal';

export default function PaymentModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4">
      <Button onClick={() => setIsOpen(true)}>
        Open Payment Modal
      </Button>
      
      <PaymentModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onPaymentSuccess={() => console.log('Payment successful!')}
        gameFee="0.05"
        walletBalance="15.43"
      />
    </div>
  );
}