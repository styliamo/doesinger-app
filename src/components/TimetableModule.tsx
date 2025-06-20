import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Package, Wrench, CheckCircle, CreditCard } from 'lucide-react';
import { UserRole } from '@/types';
import { useProjectData } from '@/hooks/useProjectData';

interface TimetableEvent {
  id: string;
  itemId: string;
  type: 'delivery' | 'assembly' | 'acceptance' | 'payment';
  startDate: string;
  endDate: string;
  status: 'planned' | 'in-progress' | 'completed' | 'delayed';
  assignedTo: string;
  notes?: string;
}

interface TimetableModuleProps {
  userRole: UserRole;
}

const eventTypeIcons = {
  delivery: Package,
  assembly: Wrench,
  acceptance: CheckCircle,
  payment: CreditCard
};

const eventTypeLabels = {
  delivery: 'Lieferung',
  assembly: 'Montage',
  acceptance: 'Abnahme',
  payment: 'Zahlung'
};

export const TimetableModule: React.FC<TimetableModuleProps> = ({ userRole }) => {
  const { items } = useProjectData();
  const [view, setView] = useState<'list' | 'gantt'>('list');
  const [events, setEvents] = useState<TimetableEvent[]>([
    {
      id: '1',
      itemId: '1',
      type: 'delivery',
      startDate: '2024-02-01',
      endDate: '2024-02-03',
      status: 'planned',
      assignedTo: 'Vendor A',
      notes: 'Lieferung Büromöbel'
    },
    {
      id: '2',
      itemId: '2',
      type: 'assembly',
      startDate: '2024-02-05',
      endDate: '2024-02-07',
      status: 'in-progress',
      assignedTo: 'Vendor B',
      notes: 'Montage Beleuchtung'
    }
  ]);

  const filteredEvents = events.filter(event => {
    if (userRole === 'VENDOR') {
      return event.assignedTo === 'Current Vendor';
    }
    if (userRole === 'CLIENT') {
      return event.status !== 'planned';
    }
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projektzeitplan</h2>
        <div className="flex gap-2">
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            onClick={() => setView('list')}
          >
            <Clock className="w-4 h-4 mr-2" />
            Listenansicht
          </Button>
          <Button
            variant={view === 'gantt' ? 'default' : 'outline'}
            onClick={() => setView('gantt')}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Gantt-Chart
          </Button>
        </div>
      </div>

      {view === 'list' ? (
        <Card>
          <CardHeader>
            <CardTitle>Zeitplan - Listenansicht</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead>Ereignis</TableHead>
                  <TableHead>Startdatum</TableHead>
                  <TableHead>Enddatum</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Zugewiesen</TableHead>
                  <TableHead>Notizen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => {
                  const item = items.find(i => i.id === event.itemId);
                  const Icon = eventTypeIcons[event.type];
                  return (
                    <TableRow key={event.id}>
                      <TableCell>
                        {item?.costGroupPosition} - {item?.description}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {eventTypeLabels[event.type]}
                        </div>
                      </TableCell>
                      <TableCell>{event.startDate}</TableCell>
                      <TableCell>{event.endDate}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{event.assignedTo}</TableCell>
                      <TableCell>{event.notes}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Zeitplan - Gantt-Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4" />
              <p>Gantt-Chart Ansicht wird geladen...</p>
              <p className="text-sm mt-2">Hier würde eine interaktive Gantt-Chart-Visualisierung angezeigt.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};