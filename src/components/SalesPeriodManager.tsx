import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Mail, Download, Settings, Send, AlertCircle, CheckCircle, Users, DollarSign, FileText, Globe } from 'lucide-react';
import type { Event, Participant } from '../types';

interface SalesPeriod {
  id: string;
  eventId: string;
  salesStart: string;
  salesEnd: string;
  presaleStart?: string;
  presaleEnd?: string;
  isActive: boolean;
  autoExportEnabled: boolean;
  exportEmails: string[];
  reportSchedule: ReportSchedule;
  taxSettings: TaxSettings;
}

interface ReportSchedule {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'custom';
  customDays: number[];
  time: string;
  emails: string[];
  includeMetrics: string[];
}

interface TaxSettings {
  vatRate: number;
  vatNumber?: string;
  taxExempt: boolean;
  shopifyTaxSync: boolean;
  customTaxRules: CustomTaxRule[];
}

interface CustomTaxRule {
  id: string;
  country: string;
  region?: string;
  taxRate: number;
  taxName: string;
  isDefault: boolean;
}

interface SalesPeriodManagerProps {
  event: Event;
  onSalesPeriodUpdate?: (salesPeriod: SalesPeriod) => void;
}

const SalesPeriodManager: React.FC<SalesPeriodManagerProps> = ({ event, onSalesPeriodUpdate }) => {
  const [salesPeriod, setSalesPeriod] = useState<SalesPeriod>({
    id: '1',
    eventId: event.id,
    salesStart: '',
    salesEnd: '',
    presaleStart: '',
    presaleEnd: '',
    isActive: false,
    autoExportEnabled: true,
    exportEmails: [],
    reportSchedule: {
      enabled: false,
      frequency: 'daily',
      customDays: [],
      time: '09:00',
      emails: [],
      includeMetrics: ['tickets_sold', 'revenue', 'categories']
    },
    taxSettings: {
      vatRate: 19,
      vatNumber: '',
      taxExempt: false,
      shopifyTaxSync: true,
      customTaxRules: []
    }
  });

  const [newEmail, setNewEmail] = useState('');
  const [newReportEmail, setNewReportEmail] = useState('');
  const [showTaxSettings, setShowTaxSettings] = useState(false);
  const [showReportSettings, setShowReportSettings] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Standard MwSt.-Sätze für verschiedene Länder
  const standardTaxRates = [
    { country: 'Deutschland', rate: 19, name: 'MwSt.' },
    { country: 'Österreich', rate: 20, name: 'USt.' },
    { country: 'Schweiz', rate: 7.7, name: 'MwSt.' },
    { country: 'USA', rate: 0, name: 'Sales Tax (varies by state)' },
    { country: 'Vereinigtes Königreich', rate: 20, name: 'VAT' },
    { country: 'Frankreich', rate: 20, name: 'TVA' },
    { country: 'Italien', rate: 22, name: 'IVA' },
    { country: 'Spanien', rate: 21, name: 'IVA' },
    { country: 'Niederlande', rate: 21, name: 'BTW' }
  ];

  const reportMetrics = [
    { id: 'tickets_sold', label: 'Verkaufte Tickets', description: 'Anzahl verkaufter Tickets pro Kategorie' },
    { id: 'revenue', label: 'Umsatz', description: 'Brutto- und Netto-Umsatz' },
    { id: 'categories', label: 'Kategorien-Performance', description: 'Verkaufszahlen pro Ticket-Kategorie' },
    { id: 'daily_sales', label: 'Tägliche Verkäufe', description: 'Verkaufsverlauf über Zeit' },
    { id: 'customer_segments', label: 'Kundensegmente', description: 'Aufschlüsselung nach Kundentypen' },
    { id: 'payment_methods', label: 'Zahlungsmethoden', description: 'Verwendete Zahlungsarten' },
    { id: 'refunds', label: 'Stornierungen', description: 'Rückerstattungen und Stornos' }
  ];

  const weekdays = [
    { id: 1, label: 'Montag' },
    { id: 2, label: 'Dienstag' },
    { id: 3, label: 'Mittwoch' },
    { id: 4, label: 'Donnerstag' },
    { id: 5, label: 'Freitag' },
    { id: 6, label: 'Samstag' },
    { id: 0, label: 'Sonntag' }
  ];

  const addExportEmail = () => {
    if (newEmail && !salesPeriod.exportEmails.includes(newEmail)) {
      setSalesPeriod(prev => ({
        ...prev,
        exportEmails: [...prev.exportEmails, newEmail]
      }));
      setNewEmail('');
    }
  };

  const removeExportEmail = (email: string) => {
    setSalesPeriod(prev => ({
      ...prev,
      exportEmails: prev.exportEmails.filter(e => e !== email)
    }));
  };

  const addReportEmail = () => {
    if (newReportEmail && !salesPeriod.reportSchedule.emails.includes(newReportEmail)) {
      setSalesPeriod(prev => ({
        ...prev,
        reportSchedule: {
          ...prev.reportSchedule,
          emails: [...prev.reportSchedule.emails, newReportEmail]
        }
      }));
      setNewReportEmail('');
    }
  };

  const removeReportEmail = (email: string) => {
    setSalesPeriod(prev => ({
      ...prev,
      reportSchedule: {
        ...prev.reportSchedule,
        emails: prev.reportSchedule.emails.filter(e => e !== email)
      }
    }));
  };

  const toggleReportMetric = (metricId: string) => {
    setSalesPeriod(prev => ({
      ...prev,
      reportSchedule: {
        ...prev.reportSchedule,
        includeMetrics: prev.reportSchedule.includeMetrics.includes(metricId)
          ? prev.reportSchedule.includeMetrics.filter(m => m !== metricId)
          : [...prev.reportSchedule.includeMetrics, metricId]
      }
    }));
  };

  const toggleCustomDay = (day: number) => {
    setSalesPeriod(prev => ({
      ...prev,
      reportSchedule: {
        ...prev.reportSchedule,
        customDays: prev.reportSchedule.customDays.includes(day)
          ? prev.reportSchedule.customDays.filter(d => d !== day)
          : [...prev.reportSchedule.customDays, day]
      }
    }));
  };

  const syncWithShopifyTax = async () => {
    try {
      // Simuliere Shopify Tax API Call
      const shopifyTaxSettings = {
        defaultRate: 19,
        vatNumber: 'DE123456789',
        taxRules: [
          { country: 'Deutschland', rate: 19 },
          { country: 'Österreich', rate: 20 },
          { country: 'EU', rate: 19 }
        ]
      };

      setSalesPeriod(prev => ({
        ...prev,
        taxSettings: {
          ...prev.taxSettings,
          vatRate: shopifyTaxSettings.defaultRate,
          vatNumber: shopifyTaxSettings.vatNumber,
          customTaxRules: shopifyTaxSettings.taxRules.map((rule, index) => ({
            id: index.toString(),
            country: rule.country,
            taxRate: rule.rate,
            taxName: rule.country === 'Deutschland' ? 'MwSt.' : 'VAT',
            isDefault: rule.country === 'Deutschland'
          }))
        }
      }));

      alert('✅ MwSt.-Einstellungen erfolgreich mit Shopify synchronisiert!');
    } catch (error) {
      alert('❌ Fehler bei Shopify-Synchronisation');
    }
  };

  const exportParticipantData = async () => {
    setIsExporting(true);
    
    // Simuliere Teilnehmer-Export mit EAN-Codes
    const participantData = [
      {
        name: 'Anna Müller',
        email: 'anna.mueller@email.com',
        eanCode: '4012345678901',
        ticketCategory: 'VIP',
        purchaseDate: '2024-01-15',
        price: 299
      },
      {
        name: 'Thomas Schmidt', 
        email: 'thomas.schmidt@email.com',
        eanCode: '4012345678902',
        ticketCategory: 'General',
        purchaseDate: '2024-01-16',
        price: 89
      }
    ];

    // CSV-Export erstellen
    const csvContent = [
      'Name,Email,EAN-Code,Ticket-Kategorie,Kaufdatum,Preis',
      ...participantData.map(p => `${p.name},${p.email},${p.eanCode},${p.ticketCategory},${p.purchaseDate},€${p.price}`)
    ].join('\n');

    // E-Mail-Versand simulieren
    for (const email of salesPeriod.exportEmails) {
      console.log(`📧 Sende Teilnehmerdaten an: ${email}`);
      // Hier würde der echte E-Mail-Versand erfolgen
    }

    setIsExporting(false);
    alert(`✅ Teilnehmerdaten erfolgreich an ${salesPeriod.exportEmails.length} E-Mail-Adressen versendet!`);
  };

  const generateFinalInvoice = async () => {
    const grossRevenue = event.revenue;
    const vatAmount = grossRevenue * (salesPeriod.taxSettings.vatRate / 100);
    const netRevenue = grossRevenue - vatAmount;
    const ticketFees = event.soldTickets * 0.50; // Beispiel-Gebühr
    const finalAmount = netRevenue - ticketFees;

    const invoiceData = {
      eventTitle: event.title,
      eventDate: event.date,
      venue: event.venue.name,
      totalTicketsSold: event.soldTickets,
      grossRevenue,
      vatRate: salesPeriod.taxSettings.vatRate,
      vatAmount,
      netRevenue,
      ticketFees,
      finalAmount,
      vatNumber: salesPeriod.taxSettings.vatNumber,
      generatedAt: new Date().toISOString()
    };

    // PDF-Rechnung generieren (vereinfacht)
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Endabrechnung - ${event.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #3B82F6; padding-bottom: 20px; }
          .invoice-details { margin-bottom: 30px; }
          .summary-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .summary-table th, .summary-table td { border: 1px solid #ddd; padding: 12px; text-align: right; }
          .summary-table th { background-color: #f8f9fa; text-align: left; }
          .total-row { background-color: #3B82F6; color: white; font-weight: bold; }
          .tax-info { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📊 ENDABRECHNUNG</h1>
          <h2>${event.title}</h2>
          <p>Erstellt am: ${new Date().toLocaleDateString('de-DE')}</p>
        </div>
        
        <div class="invoice-details">
          <h3>Event-Details</h3>
          <p><strong>Veranstaltung:</strong> ${event.title}</p>
          <p><strong>Datum:</strong> ${new Date(event.date).toLocaleDateString('de-DE')}</p>
          <p><strong>Venue:</strong> ${event.venue.name}</p>
          <p><strong>Verkaufszeitraum:</strong> ${new Date(salesPeriod.salesStart).toLocaleDateString('de-DE')} - ${new Date(salesPeriod.salesEnd).toLocaleDateString('de-DE')}</p>
        </div>

        <table class="summary-table">
          <tr><th>Position</th><th>Betrag</th></tr>
          <tr><td>Brutto-Umsatz</td><td>€${grossRevenue.toFixed(2)}</td></tr>
          <tr><td>MwSt. (${salesPeriod.taxSettings.vatRate}%)</td><td>€${vatAmount.toFixed(2)}</td></tr>
          <tr><td>Netto-Umsatz</td><td>€${netRevenue.toFixed(2)}</td></tr>
          <tr><td>Ticket-Gebühren</td><td>-€${ticketFees.toFixed(2)}</td></tr>
          <tr class="total-row"><td>Endauszahlung</td><td>€${finalAmount.toFixed(2)}</td></tr>
        </table>

        <div class="tax-info">
          <h4>Steuerliche Informationen</h4>
          <p><strong>USt-IdNr.:</strong> ${salesPeriod.taxSettings.vatNumber || 'Nicht angegeben'}</p>
          <p><strong>MwSt.-Satz:</strong> ${salesPeriod.taxSettings.vatRate}%</p>
          <p><strong>Shopify-Sync:</strong> ${salesPeriod.taxSettings.shopifyTaxSync ? 'Aktiviert' : 'Deaktiviert'}</p>
        </div>

        <div style="margin-top: 40px; text-align: center; color: #666; font-size: 12px;">
          Generiert von TicketForge - Professionelles Event-Ticketing
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();

    // E-Mail-Versand an alle konfigurierten Adressen
    for (const email of salesPeriod.exportEmails) {
      console.log(`📧 Sende Endabrechnung an: ${email}`);
    }

    alert(`✅ Endabrechnung erstellt und an ${salesPeriod.exportEmails.length} E-Mail-Adressen versendet!`);
  };

  const sendTestReport = async () => {
    const reportData = {
      eventTitle: event.title,
      reportDate: new Date().toISOString(),
      metrics: {
        ticketsSold: event.soldTickets,
        revenue: event.revenue,
        categories: event.ticketCategories.map(cat => ({
          name: cat.name,
          sold: cat.sold,
          capacity: cat.capacity,
          revenue: cat.sold * cat.price
        }))
      }
    };

    console.log('📊 Test-Report wird versendet:', reportData);
    alert(`✅ Test-Report an ${salesPeriod.reportSchedule.emails.length} E-Mail-Adressen versendet!`);
  };

  const checkSalesStatus = () => {
    const now = new Date();
    const salesStart = new Date(salesPeriod.salesStart);
    const salesEnd = new Date(salesPeriod.salesEnd);

    if (now < salesStart) return 'not_started';
    if (now > salesEnd) return 'ended';
    return 'active';
  };

  const getSalesStatusBadge = () => {
    const status = checkSalesStatus();
    switch (status) {
      case 'not_started':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">⏳ Noch nicht gestartet</span>;
      case 'active':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">🟢 Verkauf aktiv</span>;
      case 'ended':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">🔴 Verkauf beendet</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Calendar className="w-7 h-7 text-blue-600" />
            <span>📅 Verkaufszeitraum & Export-Management</span>
          </h3>
          <p className="text-gray-600 mt-1">Konfigurieren Sie Verkaufszeiten und automatische Datenexporte</p>
        </div>
        <div className="flex items-center space-x-3">
          {getSalesStatusBadge()}
          <button
            onClick={() => setShowTaxSettings(!showTaxSettings)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <Settings className="w-4 h-4" />
            <span>🧾 MwSt.-Einstellungen</span>
          </button>
        </div>
      </div>

      {/* Verkaufszeitraum */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <span>⏰ Verkaufszeitraum definieren</span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hauptverkauf */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h5 className="font-semibold text-gray-900 mb-3">🎫 Hauptverkauf</h5>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Verkaufsstart</label>
                <input
                  type="datetime-local"
                  value={salesPeriod.salesStart}
                  onChange={(e) => setSalesPeriod(prev => ({ ...prev, salesStart: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Verkaufsende</label>
                <input
                  type="datetime-local"
                  value={salesPeriod.salesEnd}
                  onChange={(e) => setSalesPeriod(prev => ({ ...prev, salesEnd: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Presale */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h5 className="font-semibold text-gray-900 mb-3">🎟️ Presale (Optional)</h5>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Presale-Start</label>
                <input
                  type="datetime-local"
                  value={salesPeriod.presaleStart || ''}
                  onChange={(e) => setSalesPeriod(prev => ({ ...prev, presaleStart: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Presale-Ende</label>
                <input
                  type="datetime-local"
                  value={salesPeriod.presaleEnd || ''}
                  onChange={(e) => setSalesPeriod(prev => ({ ...prev, presaleEnd: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Automatischer Export nach Verkaufsende */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Mail className="w-5 h-5 text-emerald-600" />
          <span>📧 Automatischer Export nach Verkaufsende</span>
        </h4>
        
        <div className="space-y-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={salesPeriod.autoExportEnabled}
              onChange={(e) => setSalesPeriod(prev => ({ ...prev, autoExportEnabled: e.target.checked }))}
              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="font-medium text-gray-900">Automatischen Export aktivieren</span>
          </label>
          
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <h6 className="font-semibold text-emerald-900 mb-2">📋 Export-Inhalt:</h6>
            <ul className="text-emerald-800 text-sm space-y-1">
              <li>• Vollständige Teilnehmerliste mit Namen</li>
              <li>• EAN-Codes für alle verkauften Tickets</li>
              <li>• Ticket-Kategorien und Preise</li>
              <li>• Kaufdaten und Zahlungsstatus</li>
              <li>• CSV-Format für Excel-Import</li>
            </ul>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">📧 E-Mail-Adressen für Export</label>
            <div className="flex items-center space-x-2 mb-3">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addExportEmail()}
                placeholder="email@example.com"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <button
                onClick={addExportEmail}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Hinzufügen
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {salesPeriod.exportEmails.map((email, index) => (
                <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm flex items-center space-x-2">
                  <span>{email}</span>
                  <button
                    onClick={() => removeExportEmail(email)}
                    className="text-emerald-600 hover:text-emerald-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={exportParticipantData}
              disabled={isExporting || salesPeriod.exportEmails.length === 0}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Exportiere...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>📤 Jetzt exportieren (Test)</span>
                </>
              )}
            </button>
            
            <button
              onClick={generateFinalInvoice}
              disabled={salesPeriod.exportEmails.length === 0}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>📊 Endabrechnung erstellen</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report-Scheduling */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Send className="w-5 h-5 text-blue-600" />
            <span>📈 Report-Scheduling</span>
          </h4>
          <button
            onClick={() => setShowReportSettings(!showReportSettings)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <label className="flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            checked={salesPeriod.reportSchedule.enabled}
            onChange={(e) => setSalesPeriod(prev => ({
              ...prev,
              reportSchedule: { ...prev.reportSchedule, enabled: e.target.checked }
            }))}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="font-medium text-gray-900">Automatische Berichte aktivieren</span>
        </label>

        {showReportSettings && (
          <div className="space-y-6 border-t border-gray-200 pt-6">
            {/* Frequenz */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">📅 Berichts-Frequenz</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['daily', 'weekly', 'custom'].map(freq => (
                  <label key={freq} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="frequency"
                      value={freq}
                      checked={salesPeriod.reportSchedule.frequency === freq}
                      onChange={(e) => setSalesPeriod(prev => ({
                        ...prev,
                        reportSchedule: { ...prev.reportSchedule, frequency: e.target.value as any }
                      }))}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">
                      {freq === 'daily' ? 'Täglich' : freq === 'weekly' ? 'Wöchentlich' : 'Benutzerdefiniert'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Days */}
            {salesPeriod.reportSchedule.frequency === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">📆 Wochentage auswählen</label>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                  {weekdays.map(day => (
                    <label key={day.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={salesPeriod.reportSchedule.customDays.includes(day.id)}
                        onChange={() => toggleCustomDay(day.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{day.label.slice(0, 2)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Uhrzeit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">⏰ Versand-Uhrzeit</label>
              <input
                type="time"
                value={salesPeriod.reportSchedule.time}
                onChange={(e) => setSalesPeriod(prev => ({
                  ...prev,
                  reportSchedule: { ...prev.reportSchedule, time: e.target.value }
                }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Report-Metriken */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">📊 Report-Inhalte</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {reportMetrics.map(metric => (
                  <label key={metric.id} className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      checked={salesPeriod.reportSchedule.includeMetrics.includes(metric.id)}
                      onChange={() => toggleReportMetric(metric.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">{metric.label}</span>
                      <p className="text-xs text-gray-600">{metric.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Report E-Mails */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">📧 Report-Empfänger</label>
              <div className="flex items-center space-x-2 mb-3">
                <input
                  type="email"
                  value={newReportEmail}
                  onChange={(e) => setNewReportEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addReportEmail()}
                  placeholder="report@example.com"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={addReportEmail}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Hinzufügen
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {salesPeriod.reportSchedule.emails.map((email, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center space-x-2">
                    <span>{email}</span>
                    <button
                      onClick={() => removeReportEmail(email)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={sendTestReport}
              disabled={salesPeriod.reportSchedule.emails.length === 0}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>📊 Test-Report senden</span>
            </button>
          </div>
        )}
      </div>

      {/* MwSt.-Einstellungen */}
      {showTaxSettings && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span>🧾 Mehrwertsteuer-Einstellungen</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">MwSt.-Satz (%)</label>
              <input
                type="number"
                min="0"
                max="30"
                step="0.1"
                value={salesPeriod.taxSettings.vatRate}
                onChange={(e) => setSalesPeriod(prev => ({
                  ...prev,
                  taxSettings: { ...prev.taxSettings, vatRate: parseFloat(e.target.value) || 0 }
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">USt-IdNr. / VAT Number</label>
              <input
                type="text"
                value={salesPeriod.taxSettings.vatNumber || ''}
                onChange={(e) => setSalesPeriod(prev => ({
                  ...prev,
                  taxSettings: { ...prev.taxSettings, vatNumber: e.target.value }
                }))}
                placeholder="DE123456789"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={salesPeriod.taxSettings.shopifyTaxSync}
                onChange={(e) => setSalesPeriod(prev => ({
                  ...prev,
                  taxSettings: { ...prev.taxSettings, shopifyTaxSync: e.target.checked }
                }))}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="font-medium text-gray-900">🛍️ Mit Shopify Steuerregeln synchronisieren</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={salesPeriod.taxSettings.taxExempt}
                onChange={(e) => setSalesPeriod(prev => ({
                  ...prev,
                  taxSettings: { ...prev.taxSettings, taxExempt: e.target.checked }
                }))}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="font-medium text-gray-900">Steuerbefreit (z.B. gemeinnützige Events)</span>
            </label>
          </div>

          {/* Standard-Steuersätze */}
          <div className="mt-6">
            <h6 className="font-semibold text-gray-900 mb-3">🌍 Standard-Steuersätze nach Land</h6>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {standardTaxRates.map((tax, index) => (
                <button
                  key={index}
                  onClick={() => setSalesPeriod(prev => ({
                    ...prev,
                    taxSettings: { ...prev.taxSettings, vatRate: tax.rate }
                  }))}
                  className="text-left p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">{tax.country}</div>
                  <div className="text-sm text-gray-600">{tax.rate}% {tax.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={syncWithShopifyTax}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Globe className="w-4 h-4" />
              <span>🛍️ Shopify synchronisieren</span>
            </button>
          </div>
        </div>
      )}

      {/* Verkaufs-Status Dashboard */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">📊 Verkaufs-Status</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{event.soldTickets}</div>
            <div className="text-blue-800">Tickets verkauft</div>
          </div>
          <div className="text-center p-4 bg-emerald-50 rounded-lg">
            <div className="text-2xl font-bold text-emerald-600">€{event.revenue.toLocaleString()}</div>
            <div className="text-emerald-800">Brutto-Umsatz</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              €{(event.revenue * (1 - salesPeriod.taxSettings.vatRate / 100)).toFixed(0)}
            </div>
            <div className="text-purple-800">Netto-Umsatz</div>
          </div>
        </div>

        {checkSalesStatus() === 'ended' && (
          <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-red-800">🔴 Verkauf beendet</span>
            </div>
            <p className="text-red-700 text-sm mb-3">
              Der Verkaufszeitraum ist abgelaufen. Automatische Exports und Endabrechnung sind verfügbar.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={exportParticipantData}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>📤 Finaler Export</span>
              </button>
              <button
                onClick={generateFinalInvoice}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>📊 Endabrechnung</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesPeriodManager;