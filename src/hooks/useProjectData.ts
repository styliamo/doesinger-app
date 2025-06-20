import { useState, useCallback } from 'react';
import { ProjectItem } from '@/types';

// Sample data based on real project structure with HOAI cost group positions
const mockData: ProjectItem[] = [
  {
    id: '1',
    costGroup: '610',
    costGroupPosition: '610.1',
    description: 'Büromöbel Set - Schreibtische',
    quantity: 5,
    unit: 'Stk',
    purchasePrice: 800,
    totalPurchasePrice: 4000,
    markupPercent: 25,
    sellingPriceUnit: 1000,
    totalSellingPrice: 5000,
    category: 'FF&E',
    status: 'APPROVED',
    approvedForClient: true,
    vendorId: 'vendor-a',
    pdfUrl: '/sample.pdf'
  },
  {
    id: '2',
    costGroup: '610',
    costGroupPosition: '610.1.99',
    description: 'Konferenztisch - Eiche massiv',
    quantity: 2,
    unit: 'Stk',
    purchasePrice: 1200,
    totalPurchasePrice: 2400,
    markupPercent: 30,
    sellingPriceUnit: 1560,
    totalSellingPrice: 3120,
    category: 'FF&E',
    status: 'SUBMITTED',
    approvedForClient: true,
    vendorId: 'vendor-b',
    pdfUrl: '/sample2.pdf'
  },
  {
    id: '3',
    costGroup: '610',
    costGroupPosition: '610.5.1',
    description: 'Designer Stühle - Ergonomisch',
    quantity: 8,
    unit: 'Stk',
    purchasePrice: 450,
    totalPurchasePrice: 3600,
    markupPercent: 50,
    sellingPriceUnit: 675,
    totalSellingPrice: 5400,
    category: 'FF&E',
    status: 'SUBMITTED',
    approvedForClient: true,
    vendorId: 'vendor-b',
    pdfUrl: '/sample3.pdf'
  },
  {
    id: '4',
    costGroup: '611',
    costGroupPosition: '611.2',
    description: 'LED Beleuchtung - Deckenleuchten',
    quantity: 10,
    unit: 'Stk',
    purchasePrice: 150,
    totalPurchasePrice: 1500,
    markupPercent: 40,
    sellingPriceUnit: 210,
    totalSellingPrice: 2100,
    category: 'Standard',
    status: 'DRAFT',
    approvedForClient: false,
    vendorId: 'vendor-c'
  },
  {
    id: '5',
    costGroup: '612',
    costGroupPosition: '612.3.1',
    description: 'Teppichboden - Hochflor',
    quantity: 100,
    unit: 'm²',
    purchasePrice: 45,
    totalPurchasePrice: 4500,
    markupPercent: 35,
    sellingPriceUnit: 60.75,
    totalSellingPrice: 6075,
    category: 'Standard',
    status: 'APPROVED',
    approvedForClient: true,
    vendorId: 'vendor-a'
  }
];

export const useProjectData = () => {
  const [items, setItems] = useState<ProjectItem[]>(mockData);

  const addItemToCostGroup = useCallback((costGroup: string) => {
    const newId = Date.now().toString();
    const nextPosition = getNextPositionForCostGroup(costGroup, items);
    
    const newItem: ProjectItem = {
      id: newId,
      costGroup,
      costGroupPosition: nextPosition,
      description: '',
      quantity: 1,
      unit: 'Stk',
      purchasePrice: 0,
      totalPurchasePrice: 0,
      markupPercent: 25,
      sellingPriceUnit: 0,
      totalSellingPrice: 0,
      category: 'Standard',
      status: 'DRAFT',
      approvedForClient: false
    };
    
    setItems(prevItems => [...prevItems, newItem]);
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<ProjectItem>) => {
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, ...updates };
          
          if ('purchasePrice' in updates || 'quantity' in updates) {
            updatedItem.totalPurchasePrice = updatedItem.purchasePrice * updatedItem.quantity;
            updatedItem.sellingPriceUnit = updatedItem.purchasePrice * (1 + updatedItem.markupPercent / 100);
            updatedItem.totalSellingPrice = updatedItem.sellingPriceUnit * updatedItem.quantity;
          }
          
          if (updates.purchasePrice && item.vendorId) {
            updatedItem.status = 'SUBMITTED';
          }
          
          return updatedItem;
        }
        return item;
      })
    );
  }, []);

  const approveForClient = useCallback((id: string) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { ...item, approvedForClient: !item.approvedForClient, status: item.approvedForClient ? 'DRAFT' : 'APPROVED' }
          : item
      )
    );
  }, []);

  const selectVendor = useCallback((itemId: string, vendorId: string) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, selectedVendor: vendorId, status: 'APPROVED' }
          : item
      )
    );
  }, []);

  return {
    items,
    updateItem,
    approveForClient,
    selectVendor,
    addItemToCostGroup
  };
};

// Helper function to generate next position number for a cost group
function getNextPositionForCostGroup(costGroup: string, items: ProjectItem[]): string {
  const groupItems = items.filter(item => item.costGroup === costGroup);
  const positions = groupItems.map(item => item.costGroupPosition);
  
  // Find the highest sub-position number
  let maxSubPosition = 0;
  positions.forEach(pos => {
    const parts = pos.split('.');
    if (parts.length >= 2) {
      const subPos = parseInt(parts[parts.length - 1]);
      if (!isNaN(subPos) && subPos > maxSubPosition) {
        maxSubPosition = subPos;
      }
    }
  });
  
  return `${costGroup}.${maxSubPosition + 1}`;
}