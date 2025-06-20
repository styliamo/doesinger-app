import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Project, User } from '@/types';
import { supabase } from '@/lib/supabase';

interface InvoiceTimelineProps {
  project: Project;
  user: User;
}

interface TimelineEvent {
  id: string;
  type: 'invoice_created' | 'payment_due' | 'payment_received' | 'reminder_sent';
  date: string;
  description: string;
  status?: 'completed' | 'pending' | 'overdue';
}

export function InvoiceTimeline({ project, user }: InvoiceTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [paymentDate, setPaymentDate] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTimelineEvents();
  }, [project.id]);

  const fetchTimelineEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('project_id', project.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convert invoice data to timeline events
      const timelineEvents: TimelineEvent[] = [];
      
      data?.forEach(invoice => {
        timelineEvents.push({
          id: `invoice-${invoice.id}`,
          type: 'invoice_created',
          date: invoice.created_at,
          description: `Rechnung ${invoice.invoice_number} erstellt`,
          status: 'completed'
        });

        if (invoice.due_date) {
          const dueDate = new Date(invoice.due_date);
          const now = new Date();
          timelineEvents.push({
            id: `due-${invoice.id}`,
            type: 'payment_due',
            date: invoice.due_date,
            description: `Zahlungsziel: ${dueDate.toLocaleDateString('de-DE')}`,
            status: invoice.status === 'paid' ? 'completed' : 
                   now > dueDate ? 'overdue' : 'pending'
          });
        }

        if (invoice.payment_date) {
          timelineEvents.push({
            id: `payment-${invoice.id}`,
            type: 'payment_received',
            date: invoice.payment_date,
            description: `Zahlung erhalten: €${invoice.total_amount?.toFixed(2)}`,
            status: 'completed'
          });
        }
      });

      setEvents(timelineEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    } catch (error) {
      console.error('Error fetching timeline:', error);
    } finally {
      setLoading(false);
    }
  };

  const recordPayment = async () => {
    if (!paymentDate) {
      toast({
        title: 'Fehler',
        description: 'Bitte geben Sie ein Zahlungsdatum ein.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('invoices')
        .update({
          status: 'paid',
          payment_date: paymentDate
        })
        .eq('project_id', project.id)
        .eq('status', 'pending');

      if (error) throw error;

      toast({
        title: 'Erfolg',
        description: 'Zahlungseingang wurde erfasst.',
      });

      setPaymentDate('');
      fetchTimelineEvents();
    } catch (error) {
      console.error('Error recording payment:', error);
      toast({
        title: 'Fehler',
        description: 'Zahlungseingang konnte nicht erfasst werden.',
        variant: 'destructive',
      });
    }
  };

  const getEventIcon = (type: string, status?: string) => {
    switch (type) {
      case 'invoice_created':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'payment_due':
        return status === 'overdue' ? 
          <AlertCircle className="h-4 w-4 text-red-500" /> :
          <Clock className="h-4 w-4 text-yellow-500" />;
      case 'payment_received':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const variants = {
      'completed': 'default',
      'pending': 'secondary',
      'overdue': 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'} className="ml-2">
        {status === 'completed' ? 'Erledigt' : 
         status === 'pending' ? 'Ausstehend' : 'Überfällig'}
      </Badge>
    );
  };

  if (loading) {
    return <div>Lade Timeline...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rechnungs-Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timeline Events */}
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={event.id} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {getEventIcon(event.type, event.status)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{event.description}</span>
                  {getStatusBadge(event.status)}
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(event.date).toLocaleDateString('de-DE')}
                </div>
              </div>
              {index < events.length - 1 && (
                <div className="absolute left-2 mt-6 h-6 w-px bg-gray-200" />
              )}
            </div>
          ))}
          {events.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              Noch keine Rechnungsaktivitäten vorhanden.
            </div>
          )}
        </div>

        {/* Payment Recording (Admin only) */}
        {user.role === 'admin' && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Zahlungseingang erfassen</h4>
            <div className="flex gap-2">
              <Input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="flex-1"
              />
              <Button onClick={recordPayment}>
                Zahlung erfassen
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}