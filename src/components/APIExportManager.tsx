import React, { useState } from 'react';
import { Code, Download, Copy, Key, Globe, BarChart3, Users, Ticket, Calendar, DollarSign, RefreshCw } from 'lucide-react';

interface APIEndpoint {
  method: 'GET' | 'POST';
  endpoint: string;
  description: string;
  parameters: APIParameter[];
  responseExample: any;
  requiresAuth: boolean;
}

interface APIParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  required: boolean;
  description: string;
  example: any;
}

const APIExportManager: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);
  const [apiKey, setApiKey] = useState('tf_live_sk_1234567890abcdef');

  // API-Endpunkte für Vorverkaufszahlen
  const apiEndpoints: APIEndpoint[] = [
    {
      method: 'GET',
      endpoint: '/api/v1/events/{event_id}/presales',
      description: 'Exportiert aktuelle Vorverkaufszahlen für ein spezifisches Event',
      requiresAuth: true,
      parameters: [
        { name: 'event_id', type: 'string', required: true, description: 'Event-ID', example: 'evt_123456' },
        { name: 'format', type: 'string', required: false, description: 'Export-Format (json, csv, xml)', example: 'json' },
        { name: 'include_categories', type: 'boolean', required: false, description: 'Ticket-Kategorien einschließen', example: true },
        { name: 'include_revenue', type: 'boolean', required: false, description: 'Umsatz-Details einschließen', example: true },
        { name: 'date_from', type: 'date', required: false, description: 'Verkäufe ab Datum', example: '2024-01-01' },
        { name: 'date_to', type: 'date', required: false, description: 'Verkäufe bis Datum', example: '2024-12-31' }
      ],
      responseExample: {
        success: true,
        event: {
          id: 'evt_123456',
          title: 'Summer Music Festival 2024',
          salesPeriod: {
            start: '2024-01-01T00:00:00Z',
            end: '2024-07-15T18:00:00Z',
            isActive: true
          }
        },
        presales: {
          totalTicketsSold: 7468,
          totalRevenue: 1245678.50,
          grossRevenue: 1245678.50,
          vatAmount: 236728.92,
          netRevenue: 1008949.58,
          vatRate: 19,
          categories: [
            {
              id: 'cat_vip',
              name: 'VIP',
              ticketsSold: 234,
              capacity: 500,
              revenue: 69666,
              averagePrice: 297.72,
              soldPercentage: 46.8
            },
            {
              id: 'cat_general',
              name: 'General Admission',
              ticketsSold: 7234,
              capacity: 10000,
              revenue: 644426,
              averagePrice: 89.08,
              soldPercentage: 72.34
            }
          ],
          dailySales: [
            { date: '2024-01-15', tickets: 234, revenue: 20826 },
            { date: '2024-01-16', tickets: 456, revenue: 40584 }
          ],
          paymentMethods: [
            { method: 'credit_card', count: 5234, percentage: 70.1 },
            { method: 'paypal', count: 1567, percentage: 21.0 },
            { method: 'bank_transfer', count: 667, percentage: 8.9 }
          ]
        },
        metadata: {
          generatedAt: '2024-01-20T10:30:00Z',
          currency: 'EUR',
          timezone: 'Europe/Berlin'
        }
      }
    },
    {
      method: 'GET',
      endpoint: '/api/v1/events/{event_id}/participants/export',
      description: 'Exportiert Teilnehmerdaten mit EAN-Codes nach Verkaufsende',
      requiresAuth: true,
      parameters: [
        { name: 'event_id', type: 'string', required: true, description: 'Event-ID', example: 'evt_123456' },
        { name: 'format', type: 'string', required: false, description: 'Export-Format (json, csv, xlsx)', example: 'csv' },
        { name: 'include_ean', type: 'boolean', required: false, description: 'EAN-Codes einschließen', example: true },
        { name: 'include_personal_data', type: 'boolean', required: false, description: 'Persönliche Daten (DSGVO-konform)', example: true },
        { name: 'email_delivery', type: 'string', required: false, description: 'E-Mail-Adressen für automatischen Versand', example: 'admin@example.com,manager@example.com' }
      ],
      responseExample: {
        success: true,
        export: {
          eventId: 'evt_123456',
          eventTitle: 'Summer Music Festival 2024',
          exportedAt: '2024-07-16T00:00:00Z',
          totalParticipants: 7468,
          format: 'csv'
        },
        participants: [
          {
            id: 'prt_123456',
            name: 'Anna Müller',
            email: 'anna.mueller@email.com',
            eanCode: '4012345678901',
            ticketNumber: 'TKT-2024-001-000001',
            category: 'VIP',
            purchaseDate: '2024-01-15T10:30:00Z',
            price: 299,
            paymentStatus: 'paid'
          }
        ],
        delivery: {
          emailsSent: ['admin@example.com', 'manager@example.com'],
          deliveryStatus: 'success',
          sentAt: '2024-07-16T00:05:00Z'
        }
      }
    },
    {
      method: 'GET',
      endpoint: '/api/v1/events/{event_id}/final-invoice',
      description: 'Generiert PDF-Endabrechnung mit Umsätzen, MwSt. und Gebühren',
      requiresAuth: true,
      parameters: [
        { name: 'event_id', type: 'string', required: true, description: 'Event-ID', example: 'evt_123456' },
        { name: 'include_tax_breakdown', type: 'boolean', required: false, description: 'Detaillierte Steuer-Aufschlüsselung', example: true },
        { name: 'include_fees', type: 'boolean', required: false, description: 'Gebühren-Details einschließen', example: true },
        { name: 'email_delivery', type: 'string', required: false, description: 'E-Mail-Adressen für PDF-Versand', example: 'finance@example.com' },
        { name: 'language', type: 'string', required: false, description: 'Sprache der Rechnung (de, en, fr)', example: 'de' }
      ],
      responseExample: {
        success: true,
        invoice: {
          invoiceNumber: 'INV-2024-001234',
          eventId: 'evt_123456',
          eventTitle: 'Summer Music Festival 2024',
          period: {
            salesStart: '2024-01-01T00:00:00Z',
            salesEnd: '2024-07-15T18:00:00Z'
          },
          financial: {
            grossRevenue: 1245678.50,
            vatRate: 19,
            vatAmount: 236728.92,
            netRevenue: 1008949.58,
            platformFees: 3734,
            paymentProcessingFees: 18685.18,
            finalPayout: 986530.40
          },
          tickets: {
            totalSold: 7468,
            categories: [
              { name: 'VIP', sold: 234, revenue: 69666 },
              { name: 'General', sold: 7234, revenue: 644426 }
            ]
          },
          taxDetails: {
            vatNumber: 'DE123456789',
            taxExempt: false,
            shopifyTaxSync: true
          }
        },
        pdf: {
          url: 'https://api.ticketforge.de/invoices/INV-2024-001234.pdf',
          size: '245KB',
          pages: 3
        },
        delivery: {
          emailsSent: ['finance@example.com'],
          deliveryStatus: 'success'
        }
      }
    },
    {
      method: 'POST',
      endpoint: '/api/v1/reports/schedule',
      description: 'Erstellt oder aktualisiert einen Report-Schedule für automatische Berichte',
      requiresAuth: true,
      parameters: [
        { name: 'event_id', type: 'string', required: true, description: 'Event-ID', example: 'evt_123456' },
        { name: 'frequency', type: 'string', required: true, description: 'Berichts-Frequenz (daily, weekly, custom)', example: 'daily' },
        { name: 'time', type: 'string', required: true, description: 'Versand-Uhrzeit (HH:MM)', example: '09:00' },
        { name: 'emails', type: 'string', required: true, description: 'E-Mail-Adressen (komma-getrennt)', example: 'manager@example.com,admin@example.com' },
        { name: 'metrics', type: 'string', required: false, description: 'Metriken (komma-getrennt)', example: 'tickets_sold,revenue,categories' },
        { name: 'custom_days', type: 'string', required: false, description: 'Wochentage für custom frequency (0=So, 1=Mo)', example: '1,3,5' }
      ],
      responseExample: {
        success: true,
        schedule: {
          id: 'sched_789012',
          eventId: 'evt_123456',
          frequency: 'daily',
          time: '09:00',
          emails: ['manager@example.com', 'admin@example.com'],
          metrics: ['tickets_sold', 'revenue', 'categories'],
          isActive: true,
          nextRun: '2024-01-21T09:00:00Z',
          createdAt: '2024-01-20T10:30:00Z'
        },
        message: 'Report-Schedule erfolgreich erstellt'
      }
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('📋 In Zwischenablage kopiert!');
  };

  const generateAPIKey = () => {
    const newKey = `tf_live_sk_${Math.random().toString(36).substr(2, 24)}`;
    setApiKey(newKey);
    alert('🔑 Neuer API-Schlüssel generiert!');
  };

  const testAPIEndpoint = async (endpoint: APIEndpoint) => {
    console.log('🧪 Teste API-Endpoint:', endpoint.endpoint);
    
    // Simuliere API-Call
    setTimeout(() => {
      alert(`✅ API-Test erfolgreich!\n\nEndpoint: ${endpoint.endpoint}\nResponse: 200 OK\nDaten: ${JSON.stringify(endpoint.responseExample).length} Zeichen`);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Code className="w-7 h-7 text-blue-600" />
            <span>🔌 API Export & Dokumentation</span>
          </h3>
          <p className="text-gray-600 mt-1">REST API für Vorverkaufszahlen und automatische Exports</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-gray-900 text-green-400 rounded-lg px-3 py-2 font-mono text-sm">
            API Status: 🟢 Online
          </div>
          <button
            onClick={generateAPIKey}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Key className="w-4 h-4" />
            <span>🔑 Neuer API-Key</span>
          </button>
        </div>
      </div>

      {/* API-Schlüssel */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">🔐 API-Authentifizierung</h4>
        <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm mb-4">
          <div className="flex items-center justify-between">
            <span>API-Key: {apiKey}</span>
            <button
              onClick={() => copyToClipboard(apiKey)}
              className="text-green-300 hover:text-green-100 transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <p className="text-yellow-800 text-sm">
            <strong>⚠️ Sicherheitshinweis:</strong> Bewahren Sie Ihren API-Schlüssel sicher auf und teilen Sie ihn niemals öffentlich.
          </p>
        </div>
      </div>

      {/* API-Endpunkte */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">📡 Verfügbare API-Endpunkte</h4>
        </div>
        
        <div className="divide-y divide-gray-200">
          {apiEndpoints.map((endpoint, index) => (
            <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      endpoint.method === 'GET' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {endpoint.method}
                    </span>
                    <h5 className="font-semibold text-gray-900">{endpoint.endpoint}</h5>
                    {endpoint.requiresAuth && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium">
                        🔐 Auth Required
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-3">{endpoint.description}</p>
                  
                  <div className="bg-gray-900 text-green-400 rounded-lg p-3 font-mono text-sm">
                    curl -H "Authorization: Bearer {apiKey}" \<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp; -H "Content-Type: application/json" \<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp; https://api.ticketforge.de{endpoint.endpoint}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => setSelectedEndpoint(endpoint)}
                    className="text-blue-600 hover:text-blue-800 transition-colors p-2"
                    title="Details anzeigen"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => testAPIEndpoint(endpoint)}
                    className="text-emerald-600 hover:text-emerald-800 transition-colors p-2"
                    title="API testen"
                  >
                    <RefreshCw className="w-4 h-4" />
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

      {/* API-Dokumentation */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">📚 API-Dokumentation</h4>
        
        <div className="space-y-6">
          {/* Authentifizierung */}
          <div>
            <h5 className="font-semibold text-gray-900 mb-2">🔐 Authentifizierung</h5>
            <p className="text-gray-700 mb-3">
              Alle API-Anfragen müssen mit einem gültigen API-Schlüssel im Authorization-Header authentifiziert werden:
            </p>
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm">
              Authorization: Bearer YOUR_API_KEY
            </div>
          </div>

          {/* Rate Limiting */}
          <div>
            <h5 className="font-semibold text-gray-900 mb-2">⚡ Rate Limiting</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">1000</div>
                <div className="text-blue-800 text-sm">Requests/Stunde</div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600">100</div>
                <div className="text-emerald-800 text-sm">Requests/Minute</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">10MB</div>
                <div className="text-orange-800 text-sm">Max Response</div>
              </div>
            </div>
          </div>

          {/* Response-Formate */}
          <div>
            <h5 className="font-semibold text-gray-900 mb-2">📄 Response-Formate</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h6 className="font-semibold text-gray-900 mb-2">JSON (Standard)</h6>
                <p className="text-gray-600 text-sm mb-2">Strukturierte Daten für API-Integration</p>
                <div className="bg-gray-100 rounded p-2 text-xs font-mono">?format=json</div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h6 className="font-semibold text-gray-900 mb-2">CSV</h6>
                <p className="text-gray-600 text-sm mb-2">Komma-getrennte Werte für Excel</p>
                <div className="bg-gray-100 rounded p-2 text-xs font-mono">?format=csv</div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h6 className="font-semibold text-gray-900 mb-2">XML</h6>
                <p className="text-gray-600 text-sm mb-2">XML-Format für Legacy-Systeme</p>
                <div className="bg-gray-100 rounded p-2 text-xs font-mono">?format=xml</div>
              </div>
            </div>
          </div>

          {/* Fehler-Codes */}
          <div>
            <h5 className="font-semibold text-gray-900 mb-2">❌ HTTP-Status-Codes</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-mono">200</span>
                  <span className="text-emerald-600">✅ Erfolgreich</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono">400</span>
                  <span className="text-red-600">❌ Ungültige Anfrage</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono">401</span>
                  <span className="text-red-600">🔐 Nicht authentifiziert</span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-mono">403</span>
                  <span className="text-red-600">🚫 Nicht autorisiert</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono">404</span>
                  <span className="text-red-600">🔍 Nicht gefunden</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono">429</span>
                  <span className="text-yellow-600">⚡ Rate Limit erreicht</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Endpoint-Details Modal */}
      {selectedEndpoint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  selectedEndpoint.method === 'GET' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {selectedEndpoint.method}
                </span>
                <h3 className="text-xl font-bold text-gray-900">{selectedEndpoint.endpoint}</h3>
              </div>
              <button
                onClick={() => setSelectedEndpoint(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <p className="text-gray-700">{selectedEndpoint.description}</p>
              
              {/* Parameter */}
              <div>
                <h5 className="font-semibold text-gray-900 mb-3">📋 Parameter</h5>
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
                              <span className="text-red-600 font-medium">✅ Ja</span>
                            ) : (
                              <span className="text-gray-500">❌ Nein</span>
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-600">{param.description}</td>
                          <td className="px-4 py-2 font-mono text-sm text-blue-600">
                            {JSON.stringify(param.example)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Response-Beispiel */}
              <div>
                <h5 className="font-semibold text-gray-900 mb-2">📤 Response-Beispiel</h5>
                <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm max-h-64 overflow-y-auto">
                  <pre>{JSON.stringify(selectedEndpoint.responseExample, null, 2)}</pre>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => testAPIEndpoint(selectedEndpoint)}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>🧪 API testen</span>
                </button>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(selectedEndpoint.responseExample, null, 2))}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>📋 Response kopieren</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API-Nutzungsstatistiken */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">📊 API-Nutzung (Letzten 30 Tage)</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">15,420</div>
            <div className="text-blue-800 text-sm">API-Calls</div>
          </div>
          <div className="text-center p-4 bg-emerald-50 rounded-lg">
            <div className="text-2xl font-bold text-emerald-600">99.8%</div>
            <div className="text-emerald-800 text-sm">Uptime</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">145ms</div>
            <div className="text-orange-800 text-sm">Ø Response Time</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">2.3GB</div>
            <div className="text-purple-800 text-sm">Daten exportiert</div>
          </div>
        </div>
      </div>

      {/* Code-Beispiele */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">💻 Code-Beispiele</h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* JavaScript */}
          <div>
            <h5 className="font-semibold text-gray-900 mb-2">JavaScript (Fetch)</h5>
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <pre>{`const response = await fetch(
  'https://api.ticketforge.de/api/v1/events/evt_123456/presales',
  {
    headers: {
      'Authorization': 'Bearer ${apiKey}',
      'Content-Type': 'application/json'
    }
  }
);

const data = await response.json();
console.log('Vorverkaufszahlen:', data.presales);`}</pre>
            </div>
          </div>

          {/* Python */}
          <div>
            <h5 className="font-semibold text-gray-900 mb-2">Python (Requests)</h5>
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <pre>{`import requests

headers = {
    'Authorization': 'Bearer ${apiKey}',
    'Content-Type': 'application/json'
}

response = requests.get(
    'https://api.ticketforge.de/api/v1/events/evt_123456/presales',
    headers=headers
)

data = response.json()
print(f"Tickets verkauft: {data['presales']['totalTicketsSold']}")`}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIExportManager;