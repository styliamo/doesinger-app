import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, Euro, CreditCard } from 'lucide-react';
import { UserRole } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface Invoice {
  id: string;
  project_id: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  created_at: string;
  due_date: string;
  mollie_payment_id?: string;
  description: string;
}

interface PaymentModuleProps {
  userRole: UserRole;
  projectId?: string;
}

export const PaymentModule: React.FC<PaymentModuleProps> = ({ userRole, projectId }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchInvoices();
  }, [projectId]);

  const fetchInvoices = async () => {
    try {
      let query = supabase.from('invoices').select('*');
      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      const { data, error } = await query;
      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const createMolliePayment = async (invoice: Invoice) => {
    setLoading(true);
    try {
      const response = await fetch('https://api.mollie.com/v2/payments', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test_ueWhdz8GdjDa4ppsmN6HQufgaG7whE',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: {
            currency: 'EUR',
            value: invoice.amount.toFixed(2)
          },
          description: invoice.description,
          redirectUrl: 'https://www.doesinger.com/thank-you',
          webhookUrl: 'https://hqkybuumgwpylkhlppxk.supabase.co/functions/v1/8334dbeb-e579-4ee2-9e8a-e38dac0c089f',
          metadata: {
            invoice_id: invoice.id,
            project_id: invoice.project_id
          }
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        await supabase
          .from('invoices')
          .update({ mollie_payment_id: data.id })
          .eq('id', invoice.id);
        
        window.open(data._links.checkout.href, '_blank');
        toast({ title: 'Zahlung initiiert', description: 'Sie werden zur Mollie-Zahlungsseite weitergeleitet.' });
      } else {
        throw new Error(data.detail || 'Fehler beim Erstellen der Zahlung');
      }
    } catch (error) {
      toast({ title: 'Fehler', description: error instanceof Error ? error.message : 'Unbekannter Fehler', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const sendPaymentReminder = async (invoice: Invoice) => {
    try {
      const response = await fetch('/api/send-payment-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: invoice.id,
          projectId: invoice.project_id,
          amount: invoice.amount,
          dueDate: invoice.due_date
        })
      });
      
      if (!response.ok) throw new Error('Failed to send reminder');
      toast({ title: 'Erinnerung gesendet', description: 'Zahlungserinnerung wurde per E-Mail versendet.' });
    } catch (error) {
      toast({ title: 'Fehler', description: 'Erinnerung konnte nicht gesendet werden.', variant: 'destructive' });
    }
  };

  const createInvoice = async () => {
    if (userRole !== 'ADMIN') return;
    
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert({
          project_id: projectId || 'default',
          amount: 1000,
          status: 'pending',
          description: 'Projekt Rechnung',
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      setInvoices(prev => [...prev, data]);
      toast({ title: 'Rechnung erstellt', description: 'Neue Rechnung wurde erfolgreich erstellt.' });
    } catch (error) {
      toast({ title: 'Fehler', description: 'Rechnung konnte nicht erstellt werden.', variant: 'destructive' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return CheckCircle;
      case 'pending': return Clock;
      case 'overdue': return AlertCircle;
      default: return Clock;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Zahlungen & Rechnungen</h2>
        {userRole === 'ADMIN' && (
          <Button onClick={createInvoice}>
            Rechnung erstellen
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Offene Rechnungen</p>
                <p className="text-2xl font-bold">{invoices.filter(i => i.status === 'pending').length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bezahlt</p>
                <p className="text-2xl font-bold">{invoices.filter(i => i.status === 'paid').length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Überfällig</p>
                <p className="text-2xl font-bold">{invoices.filter(i => i.status === 'overdue').length}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gesamtsumme</p>
                <p className="text-2xl font-bold">
                  {invoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString('de-DE')}€
                </p>
              </div>
              <Euro className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rechnungsübersicht</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Beschreibung</TableHead>
                <TableHead>Betrag</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Erstellt</TableHead>
                <TableHead>Fällig</TableHead>
                <TableHead>Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => {
                const StatusIcon = getStatusIcon(invoice.status);
                return (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.description}</TableCell>
                    <TableCell>{invoice.amount.toLocaleString('de-DE')}€</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(invoice.status)}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {invoice.status === 'paid' ? 'Bezahlt' : invoice.status === 'pending' ? 'Offen' : 'Überfällig'}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(invoice.created_at).toLocaleDateString('de-DE')}</TableCell>
                    <TableCell>{new Date(invoice.due_date).toLocaleDateString('de-DE')}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {userRole === 'CLIENT' && invoice.status === 'pending' && (
                          <Button 
                            size="sm" 
                            onClick={() => createMolliePayment(invoice)}
                            disabled={loading}
                          >
                            <CreditCard className="w-4 h-4 mr-1" />
                            Jetzt bezahlen
                          </Button>
                        )}
                        {userRole === 'ADMIN' && invoice.status === 'overdue' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => sendPaymentReminder(invoice)}
                          >
                            Erinnerung senden
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};