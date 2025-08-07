import React, { useState } from 'react';
import { Plus, Package, Percent, DollarSign, Users, AlertTriangle, CheckCircle, Edit, Trash2, Eye } from 'lucide-react';
import type { TicketBundle, TicketCategory, Event } from '../types';

interface TicketBundleManagerProps {
  event: Event;
  onBundleCreate?: (bundle: TicketBundle) => void;
  onBundleUpdate?: (bundle: TicketBundle) => void;
  onBundleDelete?: (bundleId: string) => void;
}

const TicketBundleManager: React.FC<TicketBundleManagerProps> = ({
  event,
  onBundleCreate,
  onBundleUpdate,
  onBundleDelete
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBundle, setEditingBundle] = useState<TicketBundle | null>(null);
  const [bundleName, setBundleName] = useState('');
  const [bundleDescription, setBundleDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<{[key: string]: number}>({});
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(0);
  const [maxQuantity, setMaxQuantity] = useState(100);
  const [validFrom, setValidFrom] = useState('');
  const [validUntil, setValidUntil] = useState('');

  // Mock bundles for demonstration
  const mockBundles: TicketBundle[] = [
    {
      id: '1',
      name: 'VIP Experience Package',
      description: 'Complete VIP experience with premium seating and exclusive perks',
      categories: [
        { categoryId: '1', quantity: 1, name: 'VIP Seating', price: 299 },
        { categoryId: '2', quantity: 1, name: 'Meet & Greet', price: 150 },
        { categoryId: '3', quantity: 1, name: 'Exclusive Merchandise', price: 75 }
      ],
      originalPrice: 524,
      bundlePrice: 449,
      discount: 75,
      discountType: 'fixed',
      maxQuantity: 50,
      sold: 23,
      isActive: true,
      validFrom: '2024-01-01',
      validUntil: '2024-12-31'
    },
    {
      id: '2',
      name: 'Family Pack',
      description: 'Perfect for families - 4 tickets with special pricing',
      categories: [
        { categoryId: '4', quantity: 4, name: 'General Admission', price: 89 }
      ],
      originalPrice: 356,
      bundlePrice: 299,
      discount: 16,
      discountType: 'percentage',
      maxQuantity: 100,
      sold: 67,
      isActive: true
    },
    {
      id: '3',
      name: 'Student Group Special',
      description: 'Discounted tickets for student groups (minimum 6 people)',
      categories: [
        { categoryId: '4', quantity: 6, name: 'General Admission', price: 89 }
      ],
      originalPrice: 534,
      bundlePrice: 399,
      discount: 25,
      discountType: 'percentage',
      maxQuantity: 25,
      sold: 8,
      isActive: false
    }
  ];

  const calculateOriginalPrice = () => {
    return Object.entries(selectedCategories).reduce((total, [categoryId, quantity]) => {
      const category = event.ticketCategories.find(c => c.id === categoryId);
      return total + (category ? category.price * quantity : 0);
    }, 0);
  };

  const calculateBundlePrice = (originalPrice: number) => {
    if (discountType === 'percentage') {
      return originalPrice * (1 - discountValue / 100);
    } else {
      return originalPrice - discountValue;
    }
  };

  const calculateInventoryImpact = (bundle: TicketBundle) => {
    return bundle.categories.map(cat => {
      const category = event.ticketCategories.find(c => c.id === cat.categoryId);
      const available = category ? category.capacity - category.sold - category.reserved : 0;
      const maxBundlesSellable = Math.floor(available / cat.quantity);
      return {
        categoryName: cat.name,
        available,
        requiredPerBundle: cat.quantity,
        maxBundlesSellable
      };
    });
  };

  const getInventoryStatus = (bundle: TicketBundle) => {
    const impacts = calculateInventoryImpact(bundle);
    const minAvailable = Math.min(...impacts.map(i => i.maxBundlesSellable));
    const remaining = bundle.maxQuantity - bundle.sold;
    const actualAvailable = Math.min(minAvailable, remaining);
    
    if (actualAvailable === 0) return { status: 'sold_out', color: 'text-red-600 bg-red-100' };
    if (actualAvailable <= 5) return { status: 'low_stock', color: 'text-yellow-600 bg-yellow-100' };
    return { status: 'available', color: 'text-emerald-600 bg-emerald-100' };
  };

  const handleCreateBundle = () => {
    const originalPrice = calculateOriginalPrice();
    const bundlePrice = calculateBundlePrice(originalPrice);
    
    const newBundle: TicketBundle = {
      id: Date.now().toString(),
      name: bundleName,
      description: bundleDescription,
      categories: Object.entries(selectedCategories).map(([categoryId, quantity]) => {
        const category = event.ticketCategories.find(c => c.id === categoryId)!;
        return {
          categoryId,
          quantity,
          name: category.name,
          price: category.price
        };
      }),
      originalPrice,
      bundlePrice,
      discount: discountType === 'percentage' ? discountValue : originalPrice - bundlePrice,
      discountType,
      maxQuantity,
      sold: 0,
      isActive: true,
      validFrom: validFrom || undefined,
      validUntil: validUntil || undefined
    };

    onBundleCreate?.(newBundle);
    resetForm();
    setShowCreateModal(false);
  };

  const resetForm = () => {
    setBundleName('');
    setBundleDescription('');
    setSelectedCategories({});
    setDiscountType('percentage');
    setDiscountValue(0);
    setMaxQuantity(100);
    setValidFrom('');
    setValidUntil('');
    setEditingBundle(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Package className="w-7 h-7 text-purple-600" />
            <span>Ticket Bundles</span>
          </h3>
          <p className="text-gray-600 mt-1">Create discounted ticket packages to increase sales</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Bundle</span>
        </button>
      </div>

      {/* Bundle Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-2">
            <Package className="w-6 h-6 text-purple-600" />
            <span className="font-semibold text-gray-900">Active Bundles</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">{mockBundles.filter(b => b.isActive).length}</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-2">
            <Users className="w-6 h-6 text-emerald-600" />
            <span className="font-semibold text-gray-900">Bundles Sold</span>
          </div>
          <div className="text-2xl font-bold text-emerald-600">{mockBundles.reduce((sum, b) => sum + b.sold, 0)}</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-2">
            <DollarSign className="w-6 h-6 text-blue-600" />
            <span className="font-semibold text-gray-900">Bundle Revenue</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            ${mockBundles.reduce((sum, b) => sum + (b.bundlePrice * b.sold), 0).toLocaleString()}
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-2">
            <Percent className="w-6 h-6 text-orange-600" />
            <span className="font-semibold text-gray-900">Avg Discount</span>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            {Math.round(mockBundles.reduce((sum, b) => sum + ((b.originalPrice - b.bundlePrice) / b.originalPrice * 100), 0) / mockBundles.length)}%
          </div>
        </div>
      </div>

      {/* Bundle List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">Current Bundles</h4>
        </div>
        
        <div className="divide-y divide-gray-200">
          {mockBundles.map((bundle) => {
            const inventoryStatus = getInventoryStatus(bundle);
            const inventoryImpacts = calculateInventoryImpact(bundle);
            
            return (
              <div key={bundle.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h5 className="text-xl font-semibold text-gray-900">{bundle.name}</h5>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${inventoryStatus.color}`}>
                        {inventoryStatus.status === 'sold_out' ? 'Sold Out' : 
                         inventoryStatus.status === 'low_stock' ? 'Low Stock' : 'Available'}
                      </span>
                      {!bundle.isActive && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          Inactive
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-4">{bundle.description}</p>
                    
                    {/* Bundle Contents */}
                    <div className="mb-4">
                      <h6 className="font-medium text-gray-900 mb-2">Bundle Contents:</h6>
                      <div className="space-y-1">
                        {bundle.categories.map((cat, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                            <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-medium">
                              {cat.quantity}
                            </span>
                            <span>{cat.name} (${cat.price} each)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Pricing */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="text-sm text-gray-500">
                        <span className="line-through">${bundle.originalPrice}</span>
                      </div>
                      <div className="text-xl font-bold text-purple-600">
                        ${bundle.bundlePrice}
                      </div>
                      <div className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-sm font-medium">
                        Save {bundle.discountType === 'percentage' ? `${bundle.discount}%` : `$${bundle.discount}`}
                      </div>
                    </div>
                    
                    {/* Inventory Impact */}
                    <div className="mb-4">
                      <h6 className="font-medium text-gray-900 mb-2">Inventory Impact:</h6>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {inventoryImpacts.map((impact, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-3">
                            <div className="text-sm font-medium text-gray-900">{impact.categoryName}</div>
                            <div className="text-xs text-gray-600">
                              {impact.available} available • {impact.requiredPerBundle} per bundle
                            </div>
                            <div className="text-xs font-medium text-purple-600">
                              Max {impact.maxBundlesSellable} bundles
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Sales Stats */}
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span>Sold: {bundle.sold}/{bundle.maxQuantity}</span>
                      <span>Revenue: ${(bundle.bundlePrice * bundle.sold).toLocaleString()}</span>
                      {bundle.validFrom && (
                        <span>Valid: {new Date(bundle.validFrom).toLocaleDateString()} - {bundle.validUntil ? new Date(bundle.validUntil).toLocaleDateString() : 'Ongoing'}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button className="text-blue-600 hover:text-blue-800 transition-colors p-2">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setEditingBundle(bundle)}
                      className="text-gray-600 hover:text-gray-800 transition-colors p-2"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onBundleDelete?.(bundle.id)}
                      className="text-red-600 hover:text-red-800 transition-colors p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create/Edit Bundle Modal */}
      {(showCreateModal || editingBundle) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingBundle ? 'Edit Bundle' : 'Create New Bundle'}
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bundle Name</label>
                  <input
                    type="text"
                    value={bundleName}
                    onChange={(e) => setBundleName(e.target.value)}
                    placeholder="VIP Experience Package"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Quantity</label>
                  <input
                    type="number"
                    value={maxQuantity}
                    onChange={(e) => setMaxQuantity(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={bundleDescription}
                  onChange={(e) => setBundleDescription(e.target.value)}
                  placeholder="Complete VIP experience with premium seating and exclusive perks"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              {/* Ticket Categories Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Select Ticket Categories</label>
                <div className="space-y-3">
                  {event.ticketCategories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h6 className="font-medium text-gray-900">{category.name}</h6>
                        <p className="text-sm text-gray-600">${category.price} each • {category.capacity - category.sold - category.reserved} available</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <label className="text-sm text-gray-700">Quantity:</label>
                        <input
                          type="number"
                          min="0"
                          max={category.capacity - category.sold - category.reserved}
                          value={selectedCategories[category.id] || 0}
                          onChange={(e) => setSelectedCategories(prev => ({
                            ...prev,
                            [category.id]: parseInt(e.target.value) || 0
                          }))}
                          className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Discount Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Value {discountType === 'percentage' ? '(%)' : '($)'}
                  </label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                    min="0"
                    max={discountType === 'percentage' ? 100 : calculateOriginalPrice()}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex flex-col justify-end">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600">Bundle Price Preview</div>
                    <div className="text-lg font-bold text-purple-600">
                      ${calculateBundlePrice(calculateOriginalPrice()).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Original: ${calculateOriginalPrice().toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Validity Period */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valid From (Optional)</label>
                  <input
                    type="date"
                    value={validFrom}
                    onChange={(e) => setValidFrom(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valid Until (Optional)</label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => {
                  resetForm();
                  setShowCreateModal(false);
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBundle}
                disabled={!bundleName || Object.keys(selectedCategories).length === 0 || calculateOriginalPrice() === 0}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {editingBundle ? 'Update Bundle' : 'Create Bundle'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketBundleManager;