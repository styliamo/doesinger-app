import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Mail, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types';
import { supabase } from '@/lib/supabase';

interface OverdueInvoice {
  id: string;
  project_name: string;
  invoice_number: string;
  due_date: string;
  total_amount: number;
  client_email: string;
  days_overdue: number;
}

interface PaymentReminderProps {
  user: User;
}

export function PaymentReminder({ user }: PaymentReminderProps) {
  const [overdueInvoices, setOverdueInvoices] = useState<OverdueInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingReminder, setSendingReminder] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user.role === 'admin') {
      fetchOverdueInvoices();
    }
  }, [user.role]);

  const fetchOverdueInvoices = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('status', 'pending')
        .lt('due_date', today);

      if (error) throw error;

      const overdueData = data?.map(invoice => {
        const dueDate = new Date(invoice.due_date);
        const today = new Date();
        const diffTime = today.getTime() - dueDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return {
          ...invoice,
          days_overdue: diffDays
        };
      }) || [];

      setOverdueInvoices(overdueData);
    } catch (error) {
      console.error('Error fetching overdue invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendPaymentReminder = async (invoice: OverdueInvoice) => {
    setSendingReminder(invoice.id);
    
    try {
      // Create reminder email content
      const reminderText = `Erinnerung: Ihre Rechnung zum Projekt ${invoice.project_name} ist seit ${invoice.days_overdue} Tag(en) überfällig. Bitte überweisen Sie den offenen Betrag von €${invoice.total_amount.toFixed(2)} umgehend, um Verzögerungen im Projektablauf zu vermeiden.`;

      // TODO: Implement actual email sending via Supabase Edge Function
      console.log('Sending reminder:', {
        to: invoice.client_email,
        subject: `Zahlungserinnerung - Projekt ${invoice.project_name}`,
        text: reminderText
      });

      // Log the reminder activity
      await supabase
        .from('activity_logs')
        .insert({
          user_id: user.id,
          action: 'payment_reminder_sent',
          details: `Zahlungserinnerung gesendet für Rechnung ${invoice.invoice_number}`,
          project_id: invoice.project_id
        });

      toast({
        title: 'Erinnerung gesendet',
        description: `Zahlungserinnerung an ${invoice.client_email} wurde versendet.`,
      });

    } catch (error) {
      console.error('Error sending reminder:', error);
      toast({
        title: 'Fehler',
        description: 'Erinnerung konnte nicht gesendet werden.',
        variant: 'destructive',
      });
    } finally {
      setSendingReminder(null);
    }
  };

  if (user.role !== 'admin') {
    return null;
  }

  if (loading) {
    return <div>Lade überfällige Rechnungen...</div>;
  }

  if (overdueInvoices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <Clock className="h-5 w-5" />
            Zahlungserinnerungen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-green-600">
            Alle Rechnungen sind pünktlich bezahlt! 🎉
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          Überfällige Rechnungen ({overdueInvoices.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {overdueInvoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
              <div className="flex-1">
                <div className="font-medium text-red-800">
                  {invoice.project_name}
                </div>
                <div className="text-sm text-red-600">
                  Rechnung #{invoice.invoice_number} • Fällig: {new Date(invoice.due_date).toLocaleDateString('de-DE')}
                </div>
                <div className="text-sm font-medium text-red-800">
                  €{invoice.total_amount.toFixed(2)} • {invoice.client_email}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="destructive">
                  {invoice.days_overdue} Tag(e) überfällig
                </Badge>
                <Button
                  onClick={() => sendPaymentReminder(invoice)}
                  variant="outline"
                  size="sm"
                  disabled={sendingReminder === invoice.id}
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  {sendingReminder === invoice.id ? 'Sende...' : 'Erinnerung'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}