import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserRole } from '@/types';

interface WelcomeMessageProps {
  userRole: UserRole;
}

export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ userRole }) => {
  if (userRole !== 'PARTNER') return null;

  return (
    <Card className="mb-6 bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <p className="text-blue-800 text-sm leading-relaxed">
          Liebe Partner, willkommen auf unserer Angebotsplattform. Bitte tragen Sie Ihre Preise 
          ausschließlich im vorgesehenen Feld ein. Für Fragen stehen wir jederzeit zur Verfügung. 
          Vielen Dank für Ihre Zusammenarbeit.
        </p>
      </CardContent>
    </Card>
  );
};