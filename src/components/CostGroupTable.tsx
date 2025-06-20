import React from 'react';
import { ProjectItem, UserRole } from '@/types';
import { CostGroupSection } from './CostGroupSection';
import { WelcomeMessage } from './WelcomeMessage';
import { ProjectTotalSummary } from './ProjectTotalSummary';

interface CostGroupTableProps {
  items: ProjectItem[];
  userRole: UserRole;
  onUpdateItem: (id: string, updates: Partial<ProjectItem>) => void;
  onApproveForClient: (id: string) => void;
  onAddItemToCostGroup: (costGroup: string) => void;
}

export const CostGroupTable: React.FC<CostGroupTableProps> = ({
  items,
  userRole,
  onUpdateItem,
  onApproveForClient,
  onAddItemToCostGroup
}) => {
  // Group items by cost group - only show groups that have items
  const groupedItems = items.reduce((groups, item) => {
    const group = item.costGroup;
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
    return groups;
  }, {} as Record<string, ProjectItem[]>);

  // Sort cost groups and only include those with items
  const sortedGroups = Object.keys(groupedItems)
    .filter(group => groupedItems[group].length > 0)
    .sort();

  return (
    <div className="space-y-6">
      <ProjectTotalSummary items={items} userRole={userRole} position="top" />
      
      <WelcomeMessage userRole={userRole} />
      
      <div className="space-y-4">
        {sortedGroups.map(costGroup => (
          <CostGroupSection
            key={costGroup}
            costGroup={costGroup}
            items={groupedItems[costGroup]}
            userRole={userRole}
            onUpdateItem={onUpdateItem}
            onApproveForClient={onApproveForClient}
            onAddItemToCostGroup={onAddItemToCostGroup}
          />
        ))}
      </div>
      
      <ProjectTotalSummary items={items} userRole={userRole} position="bottom" />
    </div>
  );
};