'use client';

import { ClientPaymentsView } from '@/components/client/client-payments-view';
import { useState, useEffect } from 'react';

export default function PaymentsPage() {
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [payments, setPayments] = useState<any[]>([]);
  const [paymentSettings, setPaymentSettings] = useState<any>(null);

  useEffect(() => {
    const mockPayments = [
      { id: 'mock-pay-1', invoiceNumber: 'INV-001', amount: 150000, status: 'pending', dueDate: '2026-08-15T00:00:00.000Z', projectName: 'Website Redesign', description: 'Initial deposit' },
      { id: 'mock-pay-2', invoiceNumber: 'INV-002', amount: 200000, status: 'paid', dueDate: '2026-07-01T00:00:00.000Z', projectName: 'Website Redesign', description: 'Milestone 1 payment', paidAt: '2026-06-28T00:00:00.000Z' },
      { id: 'mock-pay-3', invoiceNumber: 'INV-003', amount: 75000, status: 'overdue', dueDate: '2026-06-01T00:00:00.000Z', projectName: 'Mobile App', description: 'Design phase payment' },
    ];
    const mockPaymentSettings = { upiId: 'rahul@upi', bankName: 'HDFC Bank', accountNumber: 'XXXX1234' };
    setPayments(mockPayments);
    setPaymentSettings(mockPaymentSettings);
  }, []);

  return <ClientPaymentsView payments={payments} paymentSettings={paymentSettings} message={message} error={error} />;
}
