import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface Milestone {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  assigned_user_id?: string;
  project_id: string;
  payment_amount?: number;
  payment_due_date?: string;
  payment_status?: 'PENDING' | 'PAID' | 'OVERDUE';
}

interface TimelineViewProps {
  projectId: string;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ projectId }) => {
  const { user } = useAuth();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    assigned_user_id: '',
    payment_amount: 0,
    payment_due_date: ''
  });

  useEffect(() => {
    loadMilestones();
  }, [projectId]);

  const loadMilestones = async () => {
    try {
      const { data, error } = await supabase
        .from('project_milestones')
        .select('*')
        .eq('project_id', projectId)
        .order('start_date', { ascending: true });

      if (error) throw error;
      if (data) {
        setMilestones(data.map(milestone => ({
          ...milestone,
          status: getStatusFromDates(milestone.start_date, milestone.end_date)
        })));
      }
    } catch (error) {
      console.error('Error loading milestones:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusFromDates = (startDate: string, endDate: string): Milestone['status'] => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now > end) return 'OVERDUE';
    if (now >= start && now <= end) return 'IN_PROGRESS';
    return 'PENDING';
  };

  const createMilestone = async () => {
    if (!newMilestone.title || !newMilestone.start_date || !newMilestone.end_date) return;

    try {
      const { data, error } = await supabase
        .from('project_milestones')
        .insert({
          ...newMilestone,
          project_id: projectId,
          status: 'PENDING',
          payment_status: newMilestone.payment_amount > 0 ? 'PENDING' : null
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setMilestones([...milestones, {
          ...data,
          status: getStatusFromDates(data.start_date, data.end_date)
        }]);
        setNewMilestone({
          title: '',
          description: '',
          start_date: '',
          end_date: '',
          assigned_user_id: '',
          payment_amount: 0,
          payment_due_date: ''
        });
      }
    } catch (error) {
      console.error('Error creating milestone:', error);
    }
  };

  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-500';
      case 'IN_PROGRESS': return 'bg-blue-500';
      case 'OVERDUE': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusBadge = (status: Milestone['status']) => {
    switch (status) {
      case 'COMPLETED': return <Badge className="bg-green-500">Abgeschlossen</Badge>;
      case 'IN_PROGRESS': return <Badge className="bg-blue-500">Aktiv</Badge>;
      case 'OVERDUE': return <Badge className="bg-red-500">Verspätet</Badge>;
      default: return <Badge variant="secondary">Offen</Badge>;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Lade Zeitplan...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Projekt-Zeitplan
            </span>
            {user?.role === 'ADMIN' && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Meilenstein hinzufügen
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Neuer Meilenstein</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Titel"
                      value={newMilestone.title}
                      onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
                    />
                    <Input
                      placeholder="Beschreibung"
                      value={newMilestone.description}
                      onChange={(e) => setNewMilestone({...newMilestone, description: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        placeholder="Startdatum"
                        value={newMilestone.start_date}
                        onChange={(e) => setNewMilestone({...newMilestone, start_date: e.target.value})}
                      />
                      <Input
                        type="date"
                        placeholder="Enddatum"
                        value={newMilestone.end_date}
                        onChange={(e) => setNewMilestone({...newMilestone, end_date: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Zahlungsbetrag (optional)"
                        value={newMilestone.payment_amount}
                        onChange={(e) => setNewMilestone({...newMilestone, payment_amount: Number(e.target.value)})}
                      />
                      <Input
                        type="date"
                        placeholder="Zahlungsfrist"
                        value={newMilestone.payment_due_date}
                        onChange={(e) => setNewMilestone({...newMilestone, payment_due_date: e.target.value})}
                      />
                    </div>
                    <Button onClick={createMilestone} className="w-full">
                      Meilenstein erstellen
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Keine Meilensteine definiert</p>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                {milestones.map((milestone, index) => (
                  <div key={milestone.id} className="relative flex items-start space-x-4 pb-8">
                    {/* Timeline dot */}
                    <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${getStatusColor(milestone.status)}`}>
                      {milestone.status === 'COMPLETED' ? (
                        <CheckCircle className="h-4 w-4 text-white" />
                      ) : milestone.status === 'OVERDUE' ? (
                        <AlertTriangle className="h-4 w-4 text-white" />
                      ) : (
                        <Clock className="h-4 w-4 text-white" />
                      )}
                    </div>
                    
                    {/* Milestone content */}
                    <div className="flex-1 min-w-0">
                      <Card className="border-l-4" style={{borderLeftColor: getStatusColor(milestone.status).replace('bg-', '#')}}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{milestone.title}</h3>
                              {milestone.description && (
                                <p className="text-gray-600 mt-1">{milestone.description}</p>
                              )}
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                <span>Start: {new Date(milestone.start_date).toLocaleDateString('de-DE')}</span>
                                <span>Ende: {new Date(milestone.end_date).toLocaleDateString('de-DE')}</span>
                              </div>
                              {milestone.payment_amount && milestone.payment_amount > 0 && (
                                <div className="mt-2 p-2 bg-yellow-50 rounded border">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Zahlung fällig:</span>
                                    <span className="font-semibold">€{milestone.payment_amount.toLocaleString('de-DE')}</span>
                                  </div>
                                  {milestone.payment_due_date && (
                                    <div className="text-xs text-gray-600 mt-1">
                                      Fällig: {new Date(milestone.payment_due_date).toLocaleDateString('de-DE')}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              {getStatusBadge(milestone.status)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};