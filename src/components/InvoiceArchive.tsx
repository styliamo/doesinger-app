import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ClientInvoice, User } from '@/types';
import { Archive, Download, Search, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface InvoiceArchiveProps {
  user: User;
}

export function InvoiceArchive({ user }: InvoiceArchiveProps) {
  const [invoices, setInvoices] = useState<ClientInvoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast({
        title: 'Fehler',
        description: 'Rechnungen konnten nicht geladen werden.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (invoiceId: string) => {
    toast({
      title: 'Download',
      description: 'PDF-Download wird vorbereitet...',
    });
  };

  const downloadAllAsZip = async () => {
    toast({
      title: 'ZIP-Download',
      description: 'Alle Rechnungen werden als ZIP vorbereitet...',
    });
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      'paid': 'default',
      'pending': 'secondary',
      'overdue': 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status === 'paid' ? 'Bezahlt' : status === 'pending' ? 'Offen' : 'Überfällig'}
      </Badge>
    );
  };

  if (loading) {
    return <div className="p-6">Lade Rechnungen...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Archive className="h-5 w-5" />
          Rechnungsarchiv
        </CardTitle>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Nach Projekt oder Rechnungsnummer suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {user.role === 'admin' && (
            <Button onClick={downloadAllAsZip} variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Alle als ZIP
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredInvoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="font-medium">{invoice.project_name}</div>
                <div className="text-sm text-gray-600">
                  Rechnung #{invoice.invoice_number} • {new Date(invoice.created_at).toLocaleDateString('de-DE')}
                </div>
                <div className="text-sm font-medium">
                  €{invoice.total_amount?.toFixed(2) || '0.00'}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(invoice.status)}
                <Button
                  onClick={() => downloadInvoice(invoice.id)}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>
          ))}
          {filteredInvoices.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'Keine Rechnungen gefunden.' : 'Noch keine Rechnungen vorhanden.'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}