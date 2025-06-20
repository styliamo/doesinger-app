import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProjectProvider } from '@/contexts/ProjectContext';
import { AppProvider } from '@/contexts/AppContext';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import AdminPage from '@/pages/AdminPage';
import ThankYouPage from '@/pages/ThankYouPage';
import { InvoicesPage } from '@/pages/InvoicesPage';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <ProjectProvider>
          <AppProvider>
            <Router>
              <div className="min-h-screen bg-background">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/invoices" element={<InvoicesPage />} />
                  <Route path="/rechnungen" element={<InvoicesPage />} />
                  <Route path="/thank-you" element={<ThankYouPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </div>
            </Router>
          </AppProvider>
        </ProjectProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;