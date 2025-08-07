import React, { useState } from 'react';
import { Search, Filter, Plus, ExternalLink, AlertCircle, CheckCircle, Clock, X } from 'lucide-react';
import type { Backlink } from '../types';

const BacklinkManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('quality');

  const backlinks: Backlink[] = [
    {
      id: '1',
      url: 'https://techcrunch.com/article/shopify-success-story',
      domainAuthority: 95,
      pageAuthority: 88,
      trustFlow: 92,
      citationFlow: 85,
      anchorText: 'best Shopify store',
      linkType: 'dofollow',
      status: 'active',
      dateFound: '2024-01-15',
      lastChecked: '2024-01-20',
      qualityScore: 95,
      category: 'Technology',
      sourceType: 'content',
      notes: 'High-quality editorial mention'
    },
    {
      id: '2',
      url: 'https://forbes.com/shopify-ecommerce-guide',
      domainAuthority: 92,
      pageAuthority: 85,
      trustFlow: 89,
      citationFlow: 88,
      anchorText: 'Shopify platform',
      linkType: 'dofollow',
      status: 'active',
      dateFound: '2024-01-10',
      lastChecked: '2024-01-19',
      qualityScore: 92,
      category: 'Business',
      sourceType: 'footer',
      notes: 'Resource page link'
    },
    {
      id: '3',
      url: 'https://smallblog.example.com/shopify-review',
      domainAuthority: 45,
      pageAuthority: 38,
      trustFlow: 42,
      citationFlow: 40,
      anchorText: 'click here',
      linkType: 'nofollow',
      status: 'broken',
      dateFound: '2024-01-05',
      lastChecked: '2024-01-18',
      qualityScore: 35,
      category: 'Review',
      sourceType: 'sidebar',
      notes: 'Link appears to be broken'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'broken':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'lost':
        return <X className="w-5 h-5 text-gray-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const filteredBacklinks = backlinks.filter(link => {
    const matchesSearch = link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.anchorText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || link.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Backlink Manager</h1>
          <p className="text-gray-600 mt-1">Monitor and manage your Shopify store's backlink profile</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Backlink</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search backlinks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="broken">Broken</option>
            <option value="pending">Pending</option>
            <option value="lost">Lost</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="quality">Quality Score</option>
            <option value="domain">Domain Authority</option>
            <option value="date">Date Found</option>
          </select>

          <button className="border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Quality Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-2xl font-bold text-emerald-600">{backlinks.filter(b => b.qualityScore >= 80).length}</div>
          <div className="text-gray-600">High Quality (80+)</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">{backlinks.filter(b => b.qualityScore >= 60 && b.qualityScore < 80).length}</div>
          <div className="text-gray-600">Medium Quality (60-79)</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-2xl font-bold text-red-600">{backlinks.filter(b => b.qualityScore < 60).length}</div>
          <div className="text-gray-600">Low Quality (&lt;60)</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-2xl font-bold text-gray-600">{backlinks.filter(b => b.status === 'broken').length}</div>
          <div className="text-gray-600">Broken Links</div>
        </div>
      </div>

      {/* Backlinks Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Backlink Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quality Metrics
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Link Info
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBacklinks.map((backlink) => (
                <tr key={backlink.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <div className="font-medium text-gray-900 truncate">{backlink.url}</div>
                      <div className="text-sm text-gray-600">"{backlink.anchorText}"</div>
                      <div className="text-xs text-gray-500 mt-1">{backlink.category} • {backlink.sourceType}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(backlink.qualityScore)}`}>
                        Score: {backlink.qualityScore}
                      </div>
                      <div className="text-xs text-gray-600">
                        DA: {backlink.domainAuthority} • PA: {backlink.pageAuthority}
                      </div>
                      <div className="text-xs text-gray-600">
                        TF: {backlink.trustFlow} • CF: {backlink.citationFlow}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        backlink.linkType === 'dofollow' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {backlink.linkType}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Found: {new Date(backlink.dateFound).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(backlink.status)}
                      <span className="text-sm font-medium capitalize text-gray-900">
                        {backlink.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Checked: {new Date(backlink.lastChecked).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800 transition-colors">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-800 transition-colors">
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BacklinkManager;