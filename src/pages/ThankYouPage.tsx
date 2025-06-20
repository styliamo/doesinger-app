import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft } from 'lucide-react';

const ThankYouPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [projectName, setProjectName] = useState('Ihr Projekt');

  useEffect(() => {
    // Extract project name from URL parameters if available
    const project = searchParams.get('project');
    if (project) {
      setProjectName(decodeURIComponent(project));
    }
  }, [searchParams]);

  const handleBackToDashboard = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Vielen Dank für Ihre Zahlung!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-gray-600 leading-relaxed">
            Ihre Zahlung für das Projekt <strong>{projectName}</strong> wurde erfolgreich durchgeführt. 
            Wir setzen uns in Kürze mit Ihnen in Verbindung.
          </p>
          
          <div className="pt-4">
            <Button 
              onClick={handleBackToDashboard}
              className="w-full"
              size="lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zur Projektübersicht
            </Button>
          </div>
          
          <div className="text-sm text-gray-500 pt-4 border-t">
            <p>Bei Fragen erreichen Sie uns unter:</p>
            <p className="font-medium">info@doesinger.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThankYouPage;