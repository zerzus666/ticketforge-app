import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingDown, Package, Users, RefreshCw, Bell, Settings } from 'lucide-react';
import type { Event, TicketCategory, TicketBundle } from '../types';

interface InventoryManagerProps {
  event: Event;
  onInventoryUpdate?: (categoryId: string, newInventory: Partial<TicketCategory>) => void;
  onLowStockAlert?: (alerts: InventoryAlert[]) => void;
}

interface InventoryAlert {
  id: string;
  type: 'low_stock' | 'sold_out' | 'bundle_conflict';
  categoryId?: string;
  bundleId?: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
}

interface InventoryTransaction {
  id: string;
  type: 'sale' | 'reservation' | 'release' | 'adjustment';
  categoryId: string;
  bundleId?: string;
  quantity: number;
  timestamp: string;
  reference: string;
}

const InventoryManager: React.FC<InventoryManagerProps> = ({
  event,
  onInventoryUpdate,
  onLowStockAlert
}) => {
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [autoAlerts, setAutoAlerts] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Mock data for demonstration
  const mockTransactions: InventoryTransaction[] = [
    {
      id: '1',
      type: 'sale',
      categoryId: '1',
      quantity: 2,
      timestamp: '2024-01-20T14:30:00Z',
      reference: 'ORDER-12345'
    },
    {
      id: '2',
      type: 'reservation',
      categoryId: '2',
      bundleId: '1',
      quantity: 1,
      timestamp: '2024-01-20T14:25:00Z',
      reference: 'BUNDLE-VIP-001'
    },
    {
      id: '3',
      type: 'release',
      categoryId: '1',
      quantity: 1,
      timestamp: '2024-01-20T14:20:00Z',
      reference: 'TIMEOUT-98765'
    }
  ];

  useEffect(() => {
    setTransactions(mockTransactions);
    checkInventoryAlerts();
  }, [event, lowStockThreshold]);

  const checkInventoryAlerts = () => {
    const newAlerts: InventoryAlert[] = [];

    // Check individual categories
    event.ticketCategories.forEach(category => {
      const available = category.capacity - category.sold - category.reserved;
      
      if (available === 0) {
        newAlerts.push({
          id: `sold-out-${category.id}`,
          type: 'sold_out',
          categoryId: category.id,
          message: `${category.name} is sold out`,
          severity: 'high',
          timestamp: new Date().toISOString()
        });
      } else if (available <= lowStockThreshold) {
        newAlerts.push({
          id: `low-stock-${category.id}`,
          type: 'low_stock',
          categoryId: category.id,
          message: `${category.name} has only ${available} tickets remaining`,
          severity: available <= 5 ? 'high' : 'medium',
          timestamp: new Date().toISOString()
        });
      }
    });

    // Check bundle availability
    if (event.ticketBundles) {
      event.ticketBundles.forEach(bundle => {
        const bundleAvailability = calculateBundleAvailability(bundle);
        if (bundleAvailability === 0) {
          newAlerts.push({
            id: `bundle-unavailable-${bundle.id}`,
            type: 'sold_out',
            bundleId: bundle.id,
            message: `Bundle "${bundle.name}" is no longer available due to inventory constraints`,
            severity: 'high',
            timestamp: new Date().toISOString()
          });
        }
      });
    }

    setAlerts(newAlerts);
    if (autoAlerts && newAlerts.length > 0) {
      onLowStockAlert?.(newAlerts);
    }
  };

  const handleRefreshInventory = () => {
    // Simulate inventory refresh with loading state
    setIsRefreshing(true);
    
    // Re-check all inventory alerts
    checkInventoryAlerts();
    
    // Simulate API call delay
    setTimeout(() => {
      setIsRefreshing(false);
      
      // Show success message with current status
      const totalAvailable = event.ticketCategories.reduce((sum, cat) => 
        sum + (cat.capacity - cat.sold - cat.reserved), 0
      );
      
      const criticalCategories = event.ticketCategories.filter(cat => {
        const available = cat.capacity - cat.sold - cat.reserved;
        return available === 0 || (available / cat.capacity) * 100 <= 15;
      });
      
      alert(`🔄 Inventory aktualisiert!

📊 Aktueller Status:
• ${totalAvailable} Tickets verfügbar
• ${alerts.length} aktive Warnungen
• ${criticalCategories.length} kritische Kategorien

⏰ Letzte Aktualisierung: ${new Date().toLocaleTimeString('de-DE')}

${criticalCategories.length > 0 ? 
  `⚠️ Kritische Kategorien:\n${criticalCategories.map(cat => 
    `• ${cat.name}: ${cat.capacity - cat.sold - cat.reserved} übrig`
  ).join('\n')}` : 
  '✅ Alle Kategorien haben ausreichend Tickets'
}`);
    }, 1500);
  };

  const [isRefreshing, setIsRefreshing] = useState(false);

  const calculateBundleAvailability = (bundle: TicketBundle): number => {
    return Math.min(
      ...bundle.categories.map(cat => {
        const category = event.ticketCategories.find(c => c.id === cat.categoryId);
        if (!category) return 0;
        const available = category.capacity - category.sold - category.reserved;
        return Math.floor(available / cat.quantity);
      }),
      bundle.maxQuantity - bundle.sold
    );
  };

  const getInventoryStatus = (category: TicketCategory) => {
    const available = category.capacity - category.sold - category.reserved;
    const percentage = (available / category.capacity) * 100;
    
    if (available === 0) return { status: 'sold_out', color: 'bg-red-500', textColor: 'text-red-600' };
    if (percentage <= 10) return { status: 'critical', color: 'bg-red-400', textColor: 'text-red-600' };
    if (percentage <= 25) return { status: 'low', color: 'bg-yellow-400', textColor: 'text-yellow-600' };
    if (percentage <= 50) return { status: 'medium', color: 'bg-blue-400', textColor: 'text-blue-600' };
    return { status: 'good', color: 'bg-emerald-400', textColor: 'text-emerald-600' };
  };

  const getInventoryWarningBadge = (category: TicketCategory) => {
    const available = category.capacity - category.sold - category.reserved;
    const percentage = (available / category.capacity) * 100;
    
    if (available === 0) {
      return (
        <div className="px-2 py-1 bg-red-600 text-white rounded-full text-xs font-bold animate-pulse">
          SOLD OUT
        </div>
      );
    } else if (percentage <= 5) {
      return (
        <div className="px-2 py-1 bg-orange-600 text-white rounded-full text-xs font-bold animate-pulse">
          CRITICAL: {available} LEFT
        </div>
      );
    } else if (percentage <= 15) {
      return (
        <div className="px-2 py-1 bg-yellow-600 text-white rounded-full text-xs font-bold">
          LOW: {available} LEFT
        </div>
      );
    }
    return null;
  };
  const simulateTransaction = (type: InventoryTransaction['type'], categoryId: string, quantity: number) => {
    const newTransaction: InventoryTransaction = {
      id: Date.now().toString(),
      type,
      categoryId,
      quantity,
      timestamp: new Date().toISOString(),
      reference: `SIM-${Date.now()}`
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Update category inventory
    const category = event.ticketCategories.find(c => c.id === categoryId);
    if (category) {
      let updates: Partial<TicketCategory> = {};
      
      switch (type) {
        case 'sale':
          updates = { sold: category.sold + quantity };
          break;
        case 'reservation':
          updates = { reserved: category.reserved + quantity };
          break;
        case 'release':
          updates = { reserved: Math.max(0, category.reserved - quantity) };
          break;
      }
      
      onInventoryUpdate?.(categoryId, updates);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Package className="w-7 h-7 text-blue-600" />
            <span>Inventory Management</span>
          </h3>
          <p className="text-gray-600 mt-1">Monitor and manage ticket inventory across all categories and bundles</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-gray-600 hover:text-gray-800 transition-colors p-2"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={handleRefreshInventory}
            disabled={isRefreshing}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Aktualisiere...' : '🔄 Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h4 className="text-lg font-semibold text-gray-900">Inventory Alerts</h4>
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
              {alerts.length}
            </span>
          </div>
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                alert.severity === 'high' ? 'bg-red-50 border-red-400' :
                alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                'bg-blue-50 border-blue-400'
              }`}>
                <div className="flex items-center justify-between">
                  <p className={`font-medium ${
                    alert.severity === 'high' ? 'text-red-800' :
                    alert.severity === 'medium' ? 'text-yellow-800' :
                    'text-blue-800'
                  }`}>
                    {alert.message}
                  </p>
                  <span className="text-sm text-gray-500">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Inventory Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Low Stock Threshold
              </label>
              <input
                type="number"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 10)}
                min="1"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">Alert when tickets remaining fall below this number</p>
            </div>
            
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={autoAlerts}
                  onChange={(e) => setAutoAlerts(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Enable Automatic Alerts</span>
              </label>
              <p className="text-sm text-gray-500 mt-1">Automatically notify when inventory issues are detected</p>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Overview */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">Category Inventory Status</h4>
        </div>
        
        <div className="divide-y divide-gray-200">
          {event.ticketCategories.map(category => {
            const available = category.capacity - category.sold - category.reserved;
            const status = getInventoryStatus(category);
            const percentage = (available / category.capacity) * 100;
            
            return (
              <div key={category.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h5 className="text-lg font-semibold text-gray-900">{category.name}</h5>
                    <p className="text-sm text-gray-600">${category.price} per ticket</p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${status.textColor} bg-opacity-10`}>
                      {available} Available
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Inventory Status</span>
                    <span>{percentage.toFixed(1)}% remaining</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${status.color}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Detailed Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">{category.capacity}</div>
                    <div className="text-sm text-gray-600">Total Capacity</div>
                  </div>
                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                    <div className="text-lg font-bold text-emerald-600">{category.sold}</div>
                    <div className="text-sm text-gray-600">Sold</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-lg font-bold text-yellow-600">{category.reserved}</div>
                    <div className="text-sm text-gray-600">Reserved</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">{available}</div>
                    <div className="text-sm text-gray-600">Available</div>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => simulateTransaction('sale', category.id, 1)}
                    disabled={available === 0}
                    className="px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Simulate Sale
                  </button>
                  <button
                    onClick={() => simulateTransaction('reservation', category.id, 1)}
                    disabled={available === 0}
                    className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Reserve
                  </button>
                  <button
                    onClick={() => simulateTransaction('release', category.id, 1)}
                    disabled={category.reserved === 0}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Release
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bundle Inventory Impact */}
      {event.ticketBundles && event.ticketBundles.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900">Bundle Inventory Impact</h4>
          </div>
          
          <div className="divide-y divide-gray-200">
            {event.ticketBundles.map(bundle => {
              const availability = calculateBundleAvailability(bundle);
              
              return (
                <div key={bundle.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h5 className="text-lg font-semibold text-gray-900">{bundle.name}</h5>
                      <p className="text-sm text-gray-600">${bundle.bundlePrice} per bundle</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        availability === 0 ? 'text-red-600 bg-red-100' :
                        availability <= 5 ? 'text-yellow-600 bg-yellow-100' :
                        'text-emerald-600 bg-emerald-100'
                      }`}>
                        {availability} Bundles Available
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bundle.categories.map(cat => {
                      const category = event.ticketCategories.find(c => c.id === cat.categoryId);
                      if (!category) return null;
                      
                      const categoryAvailable = category.capacity - category.sold - category.reserved;
                      const maxBundlesFromCategory = Math.floor(categoryAvailable / cat.quantity);
                      
                      return (
                        <div key={cat.categoryId} className="bg-gray-50 rounded-lg p-4">
                          <div className="font-medium text-gray-900">{cat.name}</div>
                          <div className="text-sm text-gray-600 mb-2">
                            {cat.quantity} per bundle • {categoryAvailable} available
                          </div>
                          <div className="text-sm font-medium text-blue-600">
                            Limits to {maxBundlesFromCategory} bundles
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">Recent Inventory Transactions</h4>
        </div>
        
        <div className="divide-y divide-gray-200">
          {transactions.slice(0, 10).map(transaction => {
            const category = event.ticketCategories.find(c => c.id === transaction.categoryId);
            
            return (
              <div key={transaction.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    transaction.type === 'sale' ? 'bg-emerald-500' :
                    transaction.type === 'reservation' ? 'bg-yellow-500' :
                    transaction.type === 'release' ? 'bg-blue-500' :
                    'bg-gray-500'
                  }`}></div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} - {category?.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {transaction.quantity} ticket{transaction.quantity !== 1 ? 's' : ''} • {transaction.reference}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(transaction.timestamp).toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InventoryManager;