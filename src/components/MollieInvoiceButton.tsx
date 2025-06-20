import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Loader2 } from 'lucide-react';
import { ProjectItem, UserRole } from '@/types';

interface MollieInvoiceButtonProps {
  projectId: string;
  projectName: string;
  items: ProjectItem[];
  clientEmail?: string;
  userRole: UserRole;
}

export const MollieInvoiceButton: React.FC<MollieInvoiceButtonProps> = ({
  projectId,
  projectName,
  items,
  clientEmail,
  userRole
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Only show for Admin users
  if (userRole !== 'ADMIN') {
    return null;
  }

  const calculateTotalAmount = () => {
    return items.reduce((sum, item) => sum + item.totalSellingPrice, 0);
  };

  const handleSendInvoice = async () => {
    setIsLoading(true);
    
    try {
      const totalAmount = calculateTotalAmount();
      
      const paymentData = {
        amount: {
          currency: 'EUR',
          value: totalAmount.toFixed(2)
        },
        description: `Invoice for project ${projectName}`,
        redirectUrl: `https://doesinger.com/thank-you?project=${encodeURIComponent(projectName)}`,
        webhookUrl: 'https://doesinger.com/api/mollie-webhook',
        metadata: {
          customer_email: clientEmail || '',
          project_id: projectId
        }
      };

      const response = await fetch('https://api.mollie.com/v2/payments', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test_ueWhdz8GdjDa4ppsmN6HQufgaG7whE',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: 'Success',
          description: 'Invoice was sent via Mollie. Awaiting payment.',
          variant: 'default'
        });
        
        // Optionally redirect to payment URL
        if (result.links?.checkout?.href) {
          window.open(result.links.checkout.href, '_blank');
        }
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.detail || 'Failed to send invoice via Mollie',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Network error occurred while sending invoice',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSendInvoice}
      disabled={isLoading || items.length === 0}
      className="bg-blue-600 hover:bg-blue-700"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <CreditCard className="w-4 h-4 mr-2" />
      )}
      Send Invoice via Mollie
    </Button>
  );
};