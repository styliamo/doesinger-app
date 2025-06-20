import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { InvoiceModule } from '@/components/InvoiceModule';
import { PaymentReminder } from '@/components/PaymentReminder';
import { AppLayout } from '@/components/AppLayout';

export function InvoicesPage() {
  const { user } = useAuth();

  if (!user) {
    return <div>Bitte melden Sie sich an.</div>;
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Rechnungen</h1>
        </div>
        
        {/* Payment Reminders (Admin only) */}
        {user.role === 'admin' && (
          <PaymentReminder user={user} />
        )}
        
        {/* Main Invoice Module */}
        <InvoiceModule user={user} />
      </div>
    </AppLayout>
  );
}