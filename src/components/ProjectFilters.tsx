import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';

interface ProjectFiltersProps {
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  costGroupFilter: string;
  setCostGroupFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onClearFilters: () => void;
}

export const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  categoryFilter,
  setCategoryFilter,
  costGroupFilter,
  setCostGroupFilter,
  statusFilter,
  setStatusFilter,
  searchTerm,
  setSearchTerm,
  onClearFilters
}) => {
  return (
    <div className="bg-white p-4 border-b sticky top-0 z-10">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Kategorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Kategorien</SelectItem>
            <SelectItem value="FF&E">FF&E</SelectItem>
            <SelectItem value="Construction">Construction</SelectItem>
            <SelectItem value="Services">Services</SelectItem>
          </SelectContent>
        </Select>

        <Select value={costGroupFilter} onValueChange={setCostGroupFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Kostengruppe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Gruppen</SelectItem>
            <SelectItem value="610">610 - Ausstattung</SelectItem>
            <SelectItem value="611">611 - Allgemeine Einrichtung</SelectItem>
            <SelectItem value="612">612 - Besondere Einrichtung</SelectItem>
            <SelectItem value="620">620 - Sonstige Maßnahmen</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Status</SelectItem>
            <SelectItem value="draft">Entwurf</SelectItem>
            <SelectItem value="submitted">Eingereicht</SelectItem>
            <SelectItem value="approved">Freigegeben</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={onClearFilters}>
          <Filter className="h-4 w-4 mr-2" />
          Zurücksetzen
        </Button>
      </div>
    </div>
  );
};