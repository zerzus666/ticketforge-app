import React, { useState } from 'react';
import { Plus, Settings, CheckCircle, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';
import type { ShopifyStore } from '../types';

const ShopifyIntegration: React.FC = () => {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreUrl, setNewStoreUrl] = useState('');

  const stores: ShopifyStore[] = [
    {
      id: '1',
      domain: 'example-store.myshopify.com',
      accessToken: 'shpat_xxxxx',
      name: 'Example Fashion Store',
      plan: 'Shopify Plus',
      isActive: true,
      lastSync: '2024-01-20T10:30:00Z'
    },
    {
      id: '2',
      domain: 'gadget-shop.myshopify.com',
      accessToken: 'shpat_yyyyy',
      name: 'Tech Gadget Shop',
      plan: 'Advanced Shopify',
      isActive: true,
      lastSync: '2024-01-20T09:15:00Z'
    },
    {
      id: '3',
      domain: 'inactive-store.myshopify.com',
      accessToken: 'shpat_zzzzz',
      name: 'Inactive Test Store',
      plan: 'Basic Shopify',
      isActive: false,
      lastSync: '2024-01-18T15:45:00Z'
    }
  ];

  const footerLinkOptions = [
    {
      title: 'Best Practices for Footer Links',
      description: 'Strategic placement of high-quality backlinks in your Shopify store footer',
      tips: [
        'Use descriptive anchor text that matches your target keywords',
        'Limit footer links to 10-15 high-quality domains',
        'Prioritize relevant, authoritative sites in your niche',
        'Regularly audit and update footer links for quality'
      ]
    },
    {
      title: 'Automated Link Management',
      description: 'Our system automatically manages your footer links based on quality scores',
      features: [
        'Auto-remove broken or low-quality links',
        'Dynamic positioning based on link authority',
        'A/B testing for optimal link placement',
        'Performance tracking and reporting'
      ]
    }
  ];

  const handleConnectStore = () => {
    // This would typically redirect to Shopify OAuth
    console.log('Connecting store:', newStoreName, newStoreUrl);
    setShowConnectModal(false);
    setNewStoreName('');
    setNewStoreUrl('');
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shopify Integration</h1>
          <p className="text-gray-600 mt-1">Connect and manage your Shopify stores for automated backlink optimization</p>
        </div>
        <button
          onClick={() => setShowConnectModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Connect Store</span>
        </button>
      </div>

      {/* Connected Stores */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Connected Stores</h3>
        <div className="space-y-4">
          {stores.map((store) => (
            <div key={store.id} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-4 h-4 rounded-full ${store.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{store.name}</h4>
                    <p className="text-gray-600 text-sm">{store.domain}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {store.plan} • Last synced: {new Date(store.lastSync).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                    store.isActive 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {store.isActive ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span>{store.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                  <button className="text-blue-600 hover:text-blue-800 transition-colors">
                    <RefreshCw className="w-5 h-5" />
                  </button>
                  <button className="text-blue-600 hover:text-blue-800 transition-colors">
                    <ExternalLink className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Store Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-gray-600">Footer Links</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">8.7</div>
                  <div className="text-sm text-gray-600">Avg Quality</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">+15%</div>
                  <div className="text-sm text-gray-600">Traffic Growth</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">4.2K</div>
                  <div className="text-sm text-gray-600">Monthly Views</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Link Optimization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {footerLinkOptions.map((option, index) => (
          <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{option.title}</h3>
            <p className="text-gray-600 mb-6">{option.description}</p>
            <div className="space-y-3">
              {(option.tips || option.features)?.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Integration Guide */}
      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-8 border border-blue-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Integration Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="font-bold">1</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Connect Your Store</h4>
            <p className="text-gray-600 text-sm">Securely connect your Shopify store using our OAuth integration</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="font-bold">2</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Configure Settings</h4>
            <p className="text-gray-600 text-sm">Set up your footer link preferences and quality thresholds</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="font-bold">3</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Monitor & Optimize</h4>
            <p className="text-gray-600 text-sm">Track performance and let our AI optimize your link placement</p>
          </div>
        </div>
      </div>

      {/* Connect Store Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Connect Shopify Store</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                <input
                  type="text"
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  placeholder="My Awesome Store"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store URL</label>
                <input
                  type="url"
                  value={newStoreUrl}
                  onChange={(e) => setNewStoreUrl(e.target.value)}
                  placeholder="https://your-store.myshopify.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => setShowConnectModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConnectStore}
                disabled={!newStoreName || !newStoreUrl}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Connect Store
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopifyIntegration;