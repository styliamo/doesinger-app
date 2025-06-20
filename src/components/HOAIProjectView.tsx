import React from 'react';
import { CostGroupTable } from './CostGroupTable';
import { ProjectFilters } from './ProjectFilters';
import { ProjectSummary } from './ProjectSummary';
import { ComparisonView } from './ComparisonView';
import { TimetableModule } from './TimetableModule';
import { PaymentModule } from './PaymentModule';
import { UserRole } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProjectData } from '@/hooks/useProjectData';
import { useState, useMemo } from 'react';
import { Calculator, Calendar, CreditCard } from 'lucide-react';

interface HOAIProjectViewProps {
  userRole: UserRole;
}

const HOAIProjectView: React.FC<HOAIProjectViewProps> = ({ userRole }) => {
  const { items, updateItem, approveForClient, addItemToCostGroup } = useProjectData();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [costGroupFilter, setCostGroupFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesCostGroup = costGroupFilter === 'all' || item.costGroup.startsWith(costGroupFilter);
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesSearch = searchTerm === '' || 
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.costGroup.includes(searchTerm) ||
        item.costGroupPosition.includes(searchTerm);
      
      return matchesCategory && matchesCostGroup && matchesStatus && matchesSearch;
    });
  }, [items, categoryFilter, costGroupFilter, statusFilter, searchTerm]);

  const handleClearFilters = () => {
    setCategoryFilter('all');
    setCostGroupFilter('all');
    setStatusFilter('all');
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">HOAI Projektplattform</h1>
      </div>

      <Tabs defaultValue="calculation" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calculation" className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Kalkulation & Angebote
          </TabsTrigger>
          <TabsTrigger value="timetable" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Zeitplan
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Rechnungen
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="calculation" className="space-y-4">
          <ProjectSummary items={filteredItems} userRole={userRole} />
          
          <Tabs defaultValue="table" className="w-full">
            <TabsList>
              <TabsTrigger value="table">Projektübersicht</TabsTrigger>
              {userRole === 'ADMIN' && (
                <TabsTrigger value="comparison">Angebotsvergleich</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="table" className="space-y-4">
              <ProjectFilters
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                costGroupFilter={costGroupFilter}
                setCostGroupFilter={setCostGroupFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onClearFilters={handleClearFilters}
              />
              
              <CostGroupTable
                items={filteredItems}
                userRole={userRole}
                onUpdateItem={updateItem}
                onApproveForClient={approveForClient}
                onAddItemToCostGroup={addItemToCostGroup}
              />
            </TabsContent>
            
            {userRole === 'ADMIN' && (
              <TabsContent value="comparison">
                <ComparisonView items={items} />
              </TabsContent>
            )}
          </Tabs>
        </TabsContent>
        
        <TabsContent value="timetable">
          <TimetableModule userRole={userRole} />
        </TabsContent>
        
        <TabsContent value="payments">
          <PaymentModule userRole={userRole} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { HOAIProjectView };