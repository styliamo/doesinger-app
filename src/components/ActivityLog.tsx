import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Activity } from 'lucide-react';

interface ActivityLogEntry {
  id: string;
  user_id: string;
  action: string;
  details: any;
  created_at: string;
  user?: {
    email: string;
    role: string;
  };
}

export const ActivityLog = () => {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('user_activity_logs')
        .select(`
          *,
          users!user_id (
            email,
            role
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      setLogs(data || []);
    } catch (error: any) {
      toast({
        title: 'Fehler',
        description: 'Aktivitätslogs konnten nicht geladen werden.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action: string) => {
    const actionColors: Record<string, 'default' | 'secondary' | 'destructive'> = {
      'price_update': 'default',
      'file_upload': 'secondary',
      'timetable_update': 'default',
      'user_login': 'secondary',
      'user_logout': 'secondary',
    };
    return <Badge variant={actionColors[action] || 'default'}>{action}</Badge>;
  };

  const formatDetails = (details: any) => {
    if (!details) return '-';
    if (typeof details === 'string') return details;
    if (details.position) return `Position: ${details.position}`;
    if (details.filename) return `Datei: ${details.filename}`;
    return JSON.stringify(details).substring(0, 50) + '...';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Lade Aktivitätslogs...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Aktivitätslogs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Zeitpunkt</TableHead>
              <TableHead>Benutzer</TableHead>
              <TableHead>Rolle</TableHead>
              <TableHead>Aktion</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  {new Date(log.created_at).toLocaleString('de-DE')}
                </TableCell>
                <TableCell>{log.user?.email || 'Unbekannt'}</TableCell>
                <TableCell>
                  <Badge variant="outline">{log.user?.role || 'N/A'}</Badge>
                </TableCell>
                <TableCell>{getActionBadge(log.action)}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {formatDetails(log.details)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {logs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Keine Aktivitäten gefunden.
          </div>
        )}
      </CardContent>
    </Card>
  );
};