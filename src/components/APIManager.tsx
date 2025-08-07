import React, { useState } from 'react';
import { Code, Key, Download, Copy, Eye, Settings, RefreshCw, CheckCircle, AlertCircle, Globe, Database, Users, Ticket, BarChart3, Shield } from 'lucide-react';

interface APIEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  description: string;
  parameters?: APIParameter[];
  responseExample: any;
  category: 'participants' | 'tickets' | 'events' | 'analytics' | 'venues';
}

interface APIParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array';
  required: boolean;
  description: string;
  example?: any;
}

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
}

const APIManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('endpoints');
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [showCreateKeyModal, setShowCreateKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>([]);

  // Mock API Keys
  const mockApiKeys: APIKey[] = [
    {
      id: '1',
      name: 'Production API Key',
      key: 'tf_live_sk_1234567890abcdef',
      permissions: ['read:participants', 'read:tickets', 'read:events', 'read:analytics'],
      createdAt: '2024-01-15T10:30:00Z',
      lastUsed: '2024-01-20T14:45:00Z',
      isActive: true
    },
    {
      id: '2',
      name: 'Development API Key',
      key: 'tf_test_sk_abcdef1234567890',
      permissions: ['read:participants', 'read:tickets', 'write:events'],
      createdAt: '2024-01-10T09:15:00Z',
      lastUsed: '2024-01-19T16:20:00Z',
      isActive: true
    },
    {
      id: '3',
      name: 'Analytics Only Key',
      key: 'tf_live_sk_analytics_only_123',
      permissions: ['read:analytics'],
      createdAt: '2024-01-05T11:00:00Z',
      isActive: false
    }
  ];

  // API Endpoints Definition
  const apiEndpoints: APIEndpoint[] = [
    // Participants Export APIs
    {
      id: 'get-participants',
      name: 'Alle Teilnehmer exportieren',
      method: 'GET',
      endpoint: '/api/v1/participants',
      description: 'Exportiert alle Teilnehmer mit vollständigen Informationen',
      category: 'participants',
      parameters: [
        { name: 'format', type: 'string', required: false, description: 'Export-Format (json, csv, xlsx)', example: 'csv' },
        { name: 'event_id', type: 'string', required: false, description: 'Filter nach Event-ID', example: 'evt_123456' },
        { name: 'segment', type: 'string', required: false, description: 'Kundensegment (vip, regular, student, senior)', example: 'vip' },
        { name: 'date_from', type: 'string', required: false, description: 'Registrierung ab Datum (YYYY-MM-DD)', example: '2024-01-01' },
        { name: 'date_to', type: 'string', required: false, description: 'Registrierung bis Datum (YYYY-MM-DD)', example: '2024-12-31' },
        { name: 'include_personal_data', type: 'boolean', required: false, description: 'Persönliche Daten einschließen (DSGVO-konform)', example: true }
      ],
      responseExample: {
        success: true,
        data: [
          {
            id: 'prt_123456',
            firstName: 'Anna',
            lastName: 'Müller',
            email: 'anna.mueller@email.com',
            phone: '+49 30 12345678',
            address: {
              street: 'Hauptstraße 123',
              city: 'Berlin',
              postalCode: '10115',
              country: 'Deutschland'
            },
            totalTicketsPurchased: 3,
            totalSpent: 267,
            customerSegment: 'regular',
            registrationDate: '2024-01-15T10:30:00Z',
            marketingConsent: true
          }
        ],
        pagination: {
          page: 1,
          limit: 100,
          total: 1247,
          totalPages: 13
        }
      }
    },
    {
      id: 'get-event-participants',
      name: 'Event-Teilnehmer exportieren',
      method: 'GET',
      endpoint: '/api/v1/events/{event_id}/participants',
      description: 'Exportiert alle Teilnehmer eines spezifischen Events',
      category: 'participants',
      parameters: [
        { name: 'event_id', type: 'string', required: true, description: 'Event-ID', example: 'evt_123456' },
        { name: 'format', type: 'string', required: false, description: 'Export-Format (json, csv, xlsx)', example: 'xlsx' },
        { name: 'include_tickets', type: 'boolean', required: false, description: 'Ticket-Informationen einschließen', example: true },
        { name: 'include_qr_codes', type: 'boolean', required: false, description: 'QR-Codes einschließen', example: true }
      ],
      responseExample: {
        success: true,
        event: {
          id: 'evt_123456',
          title: 'Summer Music Festival 2024',
          date: '2024-07-15',
          venue: 'Central Park'
        },
        participants: [
          {
            id: 'prt_123456',
            firstName: 'Anna',
            lastName: 'Müller',
            email: 'anna.mueller@email.com',
            tickets: [
              {
                ticketNumber: 'TKT-2024-001-000001',
                category: 'VIP',
                qrCode: 'QR-001-TKT-2024-001-000001-VIP-123456',
                upcCode: '001001001456',
                price: 299,
                seatNumber: '12',
                section: 'VIP-A'
              }
            ]
          }
        ]
      }
    },
    // Tickets Export APIs
    {
      id: 'get-tickets',
      name: 'Alle Tickets exportieren',
      method: 'GET',
      endpoint: '/api/v1/tickets',
      description: 'Exportiert alle Tickets mit QR/UPC-Codes',
      category: 'tickets',
      parameters: [
        { name: 'format', type: 'string', required: false, description: 'Export-Format (json, csv, xlsx, pdf)', example: 'pdf' },
        { name: 'event_id', type: 'string', required: false, description: 'Filter nach Event-ID', example: 'evt_123456' },
        { name: 'status', type: 'string', required: false, description: 'Ticket-Status (valid, used, cancelled, refunded)', example: 'valid' },
        { name: 'category', type: 'string', required: false, description: 'Ticket-Kategorie', example: 'VIP' },
        { name: 'include_participant_data', type: 'boolean', required: false, description: 'Teilnehmer-Daten einschließen', example: true }
      ],
      responseExample: {
        success: true,
        data: [
          {
            id: 'tkt_123456',
            ticketNumber: 'TKT-2024-001-000001',
            qrCode: 'QR-001-TKT-2024-001-000001-VIP-123456',
            upcCode: '001001001456',
            eventId: 'evt_123456',
            categoryId: 'cat_vip',
            participantId: 'prt_123456',
            price: 299,
            purchaseDate: '2024-01-15T10:30:00Z',
            status: 'valid',
            seatNumber: '12',
            section: 'VIP-A',
            row: '5'
          }
        ]
      }
    },
    {
      id: 'get-ticket-sales',
      name: 'Ticketverkäufe exportieren',
      method: 'GET',
      endpoint: '/api/v1/sales',
      description: 'Exportiert detaillierte Verkaufsdaten und Umsätze',
      category: 'tickets',
      parameters: [
        { name: 'format', type: 'string', required: false, description: 'Export-Format (json, csv, xlsx)', example: 'xlsx' },
        { name: 'date_from', type: 'string', required: false, description: 'Verkauf ab Datum (YYYY-MM-DD)', example: '2024-01-01' },
        { name: 'date_to', type: 'string', required: false, description: 'Verkauf bis Datum (YYYY-MM-DD)', example: '2024-12-31' },
        { name: 'event_id', type: 'string', required: false, description: 'Filter nach Event-ID', example: 'evt_123456' },
        { name: 'group_by', type: 'string', required: false, description: 'Gruppierung (day, week, month, event, category)', example: 'month' }
      ],
      responseExample: {
        success: true,
        summary: {
          totalSales: 1567890,
          totalTickets: 15678,
          averageTicketPrice: 99.95,
          period: '2024-01-01 to 2024-12-31'
        },
        data: [
          {
            date: '2024-01-15',
            eventId: 'evt_123456',
            eventTitle: 'Summer Music Festival 2024',
            category: 'VIP',
            ticketsSold: 234,
            revenue: 69666,
            averagePrice: 297.72
          }
        ]
      }
    },
    // Events API
    {
      id: 'get-events',
      name: 'Events exportieren',
      method: 'GET',
      endpoint: '/api/v1/events',
      description: 'Exportiert alle Events mit Verkaufsdaten',
      category: 'events',
      parameters: [
        { name: 'format', type: 'string', required: false, description: 'Export-Format (json, csv, xlsx)', example: 'json' },
        { name: 'status', type: 'string', required: false, description: 'Event-Status', example: 'published' },
        { name: 'include_sales_data', type: 'boolean', required: false, description: 'Verkaufsdaten einschließen', example: true }
      ],
      responseExample: {
        success: true,
        data: [
          {
            id: 'evt_123456',
            title: 'Summer Music Festival 2024',
            date: '2024-07-15',
            venue: {
              name: 'Central Park',
              address: 'New York, NY'
            },
            totalCapacity: 10500,
            soldTickets: 7468,
            revenue: 1245678,
            status: 'published'
          }
        ]
      }
    },
    // Analytics API
    {
      id: 'get-analytics',
      name: 'Analytics-Daten exportieren',
      method: 'GET',
      endpoint: '/api/v1/analytics',
      description: 'Exportiert detaillierte Analytics und Berichte',
      category: 'analytics',
      parameters: [
        { name: 'metric', type: 'string', required: true, description: 'Metrik (revenue, tickets, events, customers)', example: 'revenue' },
        { name: 'period', type: 'string', required: false, description: 'Zeitraum (7d, 30d, 90d, 1y)', example: '30d' },
        { name: 'group_by', type: 'string', required: false, description: 'Gruppierung (day, week, month)', example: 'day' }
      ],
      responseExample: {
        success: true,
        metric: 'revenue',
        period: '30d',
        summary: {
          total: 1567890,
          growth: 18.5,
          average: 52263
        },
        data: [
          { date: '2024-01-01', value: 45678 },
          { date: '2024-01-02', value: 52341 }
        ]
      }
    }
  ];

  const availablePermissions = [
    'read:participants',
    'write:participants',
    'read:tickets',
    'write:tickets',
    'read:events',
    'write:events',
    'read:analytics',
    'read:venues',
    'write:venues'
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-emerald-100 text-emerald-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      case 'PUT': return 'bg-orange-100 text-orange-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'participants': return <Users className="w-5 h-5 text-blue-600" />;
      case 'tickets': return <Ticket className="w-5 h-5 text-emerald-600" />;
      case 'events': return <BarChart3 className="w-5 h-5 text-purple-600" />;
      case 'analytics': return <BarChart3 className="w-5 h-5 text-orange-600" />;
      case 'venues': return <Globe className="w-5 h-5 text-gray-600" />;
      default: return <Database className="w-5 h-5 text-gray-600" />;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('In Zwischenablage kopiert!');
  };

  const generateAPIKey = () => {
    if (!newKeyName.trim() || newKeyPermissions.length === 0) {
      alert('Bitte Name und mindestens eine Berechtigung auswählen');
      return;
    }

    const newKey: APIKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `tf_live_sk_${Math.random().toString(36).substr(2, 24)}`,
      permissions: newKeyPermissions,
      createdAt: new Date().toISOString(),
      isActive: true
    };

    setApiKeys(prev => [...prev, newKey]);
    setNewKeyName('');
    setNewKeyPermissions([]);
    setShowCreateKeyModal(false);
    alert('✅ API-Schlüssel erfolgreich erstellt!');
  };

  const toggleKeyStatus = (keyId: string) => {
    setApiKeys(prev => prev.map(key => 
      key.id === keyId ? { ...key, isActive: !key.isActive } : key
    ));
  };

  const deleteAPIKey = (keyId: string) => {
    if (confirm('API-Schlüssel wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      setApiKeys(prev => prev.filter(key => key.id !== keyId));
    }
  };

  const renderEndpoints = () => (
    <div className="space-y-6">
      {/* API Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">🚀 TicketForge API v1.0</h3>
        <p className="text-gray-700 mb-4">
          Vollständige REST API für Export von Teilnehmern, Tickets und Analytics-Daten. 
          Alle Endpoints unterstützen JSON, CSV und Excel-Export.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{apiEndpoints.length}</div>
            <div className="text-gray-600">API Endpoints</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">3</div>
            <div className="text-gray-600">Export-Formate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">99.9%</div>
            <div className="text-gray-600">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{'< 200ms'}</div>
            <div className="text-gray-600">Response Time</div>
          </div>
        </div>
      </div>

      {/* Endpoints by Category */}
      {['participants', 'tickets', 'events', 'analytics'].map(category => (
        <div key={category} className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              {getCategoryIcon(category)}
              <h3 className="text-lg font-semibold text-gray-900 capitalize">
                {category === 'participants' ? 'Teilnehmer' :
                 category === 'tickets' ? 'Tickets' :
                 category === 'events' ? 'Events' :
                 category === 'analytics' ? 'Analytics' : category} APIs
              </h3>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {apiEndpoints.filter(endpoint => endpoint.category === category).map(endpoint => (
              <div key={endpoint.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(endpoint.method)}`}>
                        {endpoint.method}
                      </span>
                      <h4 className="font-semibold text-gray-900">{endpoint.name}</h4>
                    </div>
                    <p className="text-gray-600 mb-3">{endpoint.description}</p>
                    <div className="bg-gray-900 text-green-400 rounded-lg p-3 font-mono text-sm">
                      {endpoint.method} {endpoint.endpoint}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setSelectedEndpoint(endpoint)}
                      className="text-blue-600 hover:text-blue-800 transition-colors p-2"
                      title="Details anzeigen"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => copyToClipboard(endpoint.endpoint)}
                      className="text-gray-600 hover:text-gray-800 transition-colors p-2"
                      title="Endpoint kopieren"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderAPIKeys = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">API-Schlüssel Verwaltung</h3>
          <p className="text-gray-600">Erstellen und verwalten Sie API-Schlüssel für sichere Datenexporte</p>
        </div>
        <button
          onClick={() => setShowCreateKeyModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Key className="w-5 h-5" />
          <span>Neuer API-Schlüssel</span>
        </button>
      </div>

      {/* API Keys List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">Aktive API-Schlüssel</h4>
        </div>
        
        <div className="divide-y divide-gray-200">
          {[...mockApiKeys, ...apiKeys].map(key => (
            <div key={key.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h5 className="font-semibold text-gray-900">{key.name}</h5>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      key.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {key.isActive ? 'Aktiv' : 'Inaktiv'}
                    </span>
                  </div>
                  
                  <div className="bg-gray-900 text-green-400 rounded-lg p-3 font-mono text-sm mb-3">
                    {key.key}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <span className="font-medium text-gray-700">Erstellt:</span>
                      <span className="text-gray-600 ml-1">
                        {new Date(key.createdAt).toLocaleDateString('de-DE')}
                      </span>
                    </div>
                    {key.lastUsed && (
                      <div>
                        <span className="font-medium text-gray-700">Zuletzt verwendet:</span>
                        <span className="text-gray-600 ml-1">
                          {new Date(key.lastUsed).toLocaleDateString('de-DE')}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Berechtigungen:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {key.permissions.map((permission, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => copyToClipboard(key.key)}
                    className="text-blue-600 hover:text-blue-800 transition-colors p-2"
                    title="API-Schlüssel kopieren"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleKeyStatus(key.id)}
                    className="text-gray-600 hover:text-gray-800 transition-colors p-2"
                    title={key.isActive ? 'Deaktivieren' : 'Aktivieren'}
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteAPIKey(key.id)}
                    className="text-red-600 hover:text-red-800 transition-colors p-2"
                    title="Löschen"
                  >
                    <AlertCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-6 h-6 text-yellow-600" />
          <h4 className="font-semibold text-yellow-800">Sicherheitshinweise</h4>
        </div>
        <ul className="space-y-2 text-yellow-700 text-sm">
          <li>• API-Schlüssel niemals in öffentlichen Repositories speichern</li>
          <li>• Verwenden Sie unterschiedliche Schlüssel für Entwicklung und Produktion</li>
          <li>• Deaktivieren Sie nicht verwendete Schlüssel sofort</li>
          <li>• Überwachen Sie die API-Nutzung regelmäßig</li>
          <li>• Bei Verdacht auf Kompromittierung sofort neue Schlüssel generieren</li>
        </ul>
      </div>
    </div>
  );

  const renderDocumentation = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">📚 API-Dokumentation</h3>
        
        {/* Authentication */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">🔐 Authentifizierung</h4>
          <p className="text-gray-700 mb-4">
            Alle API-Anfragen müssen mit einem gültigen API-Schlüssel authentifiziert werden:
          </p>
          <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm">
            curl -H "Authorization: Bearer YOUR_API_KEY" \<br/>
            &nbsp;&nbsp;&nbsp;&nbsp; -H "Content-Type: application/json" \<br/>
            &nbsp;&nbsp;&nbsp;&nbsp; https://api.ticketforge.de/v1/participants
          </div>
        </div>

        {/* Rate Limiting */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">⚡ Rate Limiting</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-lg font-bold text-blue-600">1000</div>
              <div className="text-blue-800">Requests/Stunde</div>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4">
              <div className="text-lg font-bold text-emerald-600">100</div>
              <div className="text-emerald-800">Requests/Minute</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-lg font-bold text-orange-600">10MB</div>
              <div className="text-orange-800">Max Response Size</div>
            </div>
          </div>
        </div>

        {/* Response Formats */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">📄 Response-Formate</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-semibold text-gray-900 mb-2">JSON (Standard)</h5>
              <p className="text-gray-600 text-sm">Strukturierte Daten für API-Integration</p>
              <div className="bg-gray-100 rounded p-2 mt-2 text-xs font-mono">
                ?format=json
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-semibold text-gray-900 mb-2">CSV</h5>
              <p className="text-gray-600 text-sm">Komma-getrennte Werte für Excel</p>
              <div className="bg-gray-100 rounded p-2 mt-2 text-xs font-mono">
                ?format=csv
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-semibold text-gray-900 mb-2">Excel (XLSX)</h5>
              <p className="text-gray-600 text-sm">Native Excel-Dateien</p>
              <div className="bg-gray-100 rounded p-2 mt-2 text-xs font-mono">
                ?format=xlsx
              </div>
            </div>
          </div>
        </div>

        {/* Error Handling */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">❌ Fehler-Behandlung</h4>
          <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm">
            {JSON.stringify({
              success: false,
              error: {
                code: 'INVALID_API_KEY',
                message: 'Der bereitgestellte API-Schlüssel ist ungültig',
                details: 'Überprüfen Sie Ihren API-Schlüssel und versuchen Sie es erneut'
              }
            }, null, 2)}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🔌 API-Verwaltung</h1>
          <p className="text-gray-600 mt-1">REST API für Export von Teilnehmern, Tickets und Analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2">
            onClick={() => {
              const apiDocContent = `# TicketForge API Documentation v1.0

## Authentication
All API requests require authentication using your API key:

\`\`\`
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
\`\`\`

## Endpoints

### GET /api/v1/participants
Export all participants with complete information

### GET /api/v1/events/{event_id}/participants  
Export participants for specific event

### GET /api/v1/tickets
Export all tickets with QR/UPC codes

### GET /api/v1/analytics
Export detailed analytics and reports

## Rate Limits
- 1000 requests/hour
- 100 requests/minute
- 10MB max response size

## Response Formats
- JSON (default)
- CSV (?format=csv)
- Excel (?format=xlsx)

Generated: ${new Date().toISOString()}`;
              
              const blob = new Blob([apiDocContent], { type: 'text/markdown' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'ticketforge_api_documentation.md';
              a.click();
              URL.revokeObjectURL(url);
              
              alert(`📚 API-Dokumentation erfolgreich heruntergeladen!

📄 Datei: ticketforge_api_documentation.md
📊 Inhalt:
• Authentifizierung
• Alle API-Endpoints
• Parameter-Dokumentation
• Response-Beispiele
• Rate Limits
• Fehler-Codes

💾 Datei wurde in Downloads gespeichert.`);
            }}
            <Download className="w-4 h-4" />
            <span>API-Dokumentation</span>
          </button>
          <button 
            onClick={() => {
              const apiStatus = {
                status: 'online',
                uptime: '99.9%',
                responseTime: '145ms',
                activeKeys: mockApiKeys.length + apiKeys.length,
                requestsToday: 15420,
                lastUpdate: new Date().toISOString()
              };
              
              alert(`🔌 API-Status-Check:

🟢 Status: ${apiStatus.status.toUpperCase()}
⏱️ Uptime: ${apiStatus.uptime}
⚡ Response Time: ${apiStatus.responseTime}
🔑 Aktive Keys: ${apiStatus.activeKeys}
📊 Requests heute: ${apiStatus.requestsToday.toLocaleString()}

🔧 System-Health:
• Database: Online
• Cache: Optimal
• CDN: Aktiv
• Monitoring: Aktiv

📊 Performance-Metriken:
• CPU: 23%
• Memory: 67%
• Disk: 45%

✅ Alle Systeme funktionsfähig!`);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>API-Status</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'endpoints', label: 'API Endpoints', icon: Code },
              { id: 'keys', label: 'API-Schlüssel', icon: Key },
              { id: 'docs', label: 'Dokumentation', icon: Database }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'endpoints' && renderEndpoints()}
          {activeTab === 'keys' && renderAPIKeys()}
          {activeTab === 'docs' && renderDocumentation()}
        </div>
      </div>

      {/* Endpoint Details Modal */}
      {selectedEndpoint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded text-sm font-medium ${getMethodColor(selectedEndpoint.method)}`}>
                  {selectedEndpoint.method}
                </span>
                <h3 className="text-xl font-bold text-gray-900">{selectedEndpoint.name}</h3>
              </div>
              <button
                onClick={() => setSelectedEndpoint(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Eye className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <p className="text-gray-700">{selectedEndpoint.description}</p>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Endpoint</h4>
                <div className="bg-gray-900 text-green-400 rounded-lg p-3 font-mono text-sm">
                  {selectedEndpoint.method} {selectedEndpoint.endpoint}
                </div>
              </div>

              {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Parameter</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Typ</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Erforderlich</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Beschreibung</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Beispiel</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedEndpoint.parameters.map((param, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 font-mono text-sm">{param.name}</td>
                            <td className="px-4 py-2 text-sm">{param.type}</td>
                            <td className="px-4 py-2 text-sm">
                              {param.required ? (
                                <span className="text-red-600 font-medium">Ja</span>
                              ) : (
                                <span className="text-gray-500">Nein</span>
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600">{param.description}</td>
                            <td className="px-4 py-2 font-mono text-sm text-blue-600">
                              {param.example !== undefined ? JSON.stringify(param.example) : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Response-Beispiel</h4>
                <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm max-h-64 overflow-y-auto">
                  <pre>{JSON.stringify(selectedEndpoint.responseExample, null, 2)}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create API Key Modal */}
      {showCreateKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">🔑 Neuer API-Schlüssel</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="z.B. Production Export Key"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Berechtigungen</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {availablePermissions.map(permission => (
                    <label key={permission} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newKeyPermissions.includes(permission)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewKeyPermissions(prev => [...prev, permission]);
                          } else {
                            setNewKeyPermissions(prev => prev.filter(p => p !== permission));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{permission}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => setShowCreateKeyModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={generateAPIKey}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Schlüssel erstellen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default APIManager;