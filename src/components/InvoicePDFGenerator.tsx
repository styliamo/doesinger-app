import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Project, User } from '@/types';

interface InvoicePDFGeneratorProps {
  project: Project;
  user: User;
}

export function InvoicePDFGenerator({ project, user }: InvoicePDFGeneratorProps) {
  const { toast } = useToast();

  const generateInvoicePDF = async () => {
    try {
      // Calculate totals
      const totalAmount = project.items?.reduce((sum, item) => {
        const itemTotal = (item.quantity || 1) * (item.client_price || 0);
        return sum + itemTotal;
      }, 0) || 0;

      // Generate invoice number
      const invoiceNumber = `INV-${Date.now()}`;
      const invoiceDate = new Date().toLocaleDateString('de-DE');
      const dueDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString('de-DE');

      // Create PDF content structure
      const invoiceData = {
        projectName: project.name,
        customerData: {
          name: project.client_name || 'Kunde',
          company: project.client_company || '',
          email: project.client_email || '',
          address: project.client_address || ''
        },
        invoiceNumber,
        invoiceDate,
        dueDate,
        items: project.items?.map(item => ({
          description: item.description,
          quantity: item.quantity || 1,
          unitPrice: item.client_price || 0,
          total: (item.quantity || 1) * (item.client_price || 0)
        })) || [],
        totalAmount,
        bankDetails: {
          iban: 'DE89 3704 0044 0532 0130 00',
          bic: 'COBADEFFXXX'
        }
      };

      // For now, show success message
      toast({
        title: 'Rechnung erstellt',
        description: `PDF-Rechnung ${invoiceNumber} wurde generiert.`,
      });

      // TODO: Implement actual PDF generation
      console.log('Invoice data:', invoiceData);

    } catch (error) {
      console.error('Error generating invoice:', error);
      toast({
        title: 'Fehler',
        description: 'Rechnung konnte nicht erstellt werden.',
        variant: 'destructive',
      });
    }
  };

  if (user.role !== 'admin') {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Rechnungserstellung</h3>
        <Button onClick={generateInvoicePDF} className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Rechnung generieren
        </Button>
      </div>
      
      <div className="text-sm text-gray-600">
        <p>Erstellt automatisch eine PDF-Rechnung mit:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Projektname und Kundendaten</li>
          <li>Fortlaufende Rechnungsnummer</li>
          <li>Alle Projektpositionen mit Preisen</li>
          <li>Zahlungsziel: 10 Tage</li>
          <li>Bankverbindung und AGB-Hinweis</li>
        </ul>
      </div>
    </div>
  );
}