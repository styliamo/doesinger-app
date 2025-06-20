import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InvoicePDFGenerator } from './InvoicePDFGenerator';
import { InvoiceTimeline } from './InvoiceTimeline';
import { InvoiceArchive } from './InvoiceArchive';
import { Project, User } from '@/types';
import { FileText, Clock, Archive } from 'lucide-react';

interface InvoiceModuleProps {
  project?: Project;
  user: User;
}

export function InvoiceModule({ project, user }: InvoiceModuleProps) {
  const [activeTab, setActiveTab] = useState('generator');

  // If no project is selected, show archive only
  if (!project) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Rechnungsmodul
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InvoiceArchive user={user} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Rechnungsmodul - {project.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              PDF Erstellen
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="archive" className="flex items-center gap-2">
              <Archive className="h-4 w-4" />
              Archiv
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="mt-6">
            <InvoicePDFGenerator project={project} user={user} />
          </TabsContent>

          <TabsContent value="timeline" className="mt-6">
            <InvoiceTimeline project={project} user={user} />
          </TabsContent>

          <TabsContent value="archive" className="mt-6">
            <InvoiceArchive user={user} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}