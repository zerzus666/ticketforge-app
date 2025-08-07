import React, { useState } from 'react';
import { X, Save, Calendar, MapPin, Users, DollarSign, Image, Plus, Trash2, Package, Printer, Settings, Percent, Clock, Mail, Send, FileText, Globe } from 'lucide-react';
import type { Event, Venue, TicketCategory } from '../types';
import WysiwygEditor from './WysiwygEditor';

interface EventCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Partial<Event>) => void;
  existingEvent?: Event;
}

const EventCreator: React.FC<EventCreatorProps> = ({
  isOpen,
  onClose,
  onSave,
  existingEvent
}) => {
  const [eventData, setEventData] = useState<Partial<Event>>({
    title: existingEvent?.title || '',
    description: existingEvent?.description || '',
    date: existingEvent?.date || '',
    time: existingEvent?.time || '',
    endTime: existingEvent?.endTime || '',
    doorsOpen: existingEvent?.doorsOpen || '',
    category: existingEvent?.category || 'Musik',
    images: existingEvent?.images || [],
    tags: existingEvent?.tags || [],
    hardticketSettings: existingEvent?.hardticketSettings || {
      enabled: false,
      shippingRequired: true,
      printingEnabled: true,
      includeQRCode: true,
      includeUPCCode: true,
      customMessage: ''
    }
  });

  const [ticketCategories, setTicketCategories] = useState<TicketCategory[]>(
    existingEvent?.ticketCategories || [
      { id: '1', name: 'General Admission', price: 50, capacity: 100, sold: 0, reserved: 0, description: '', benefits: [], color: '#3B82F6' }
    ]
  );

  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(existingEvent?.venue || null);
  const [showHardticketSettings, setShowHardticketSettings] = useState(false);
  const [showBundleCreator, setShowBundleCreator] = useState(false);
  const [showSalesPeriodSettings, setShowSalesPeriodSettings] = useState(false);
  const [bundles, setBundles] = useState<any[]>(existingEvent?.ticketBundles || []);
  const [currentBundle, setCurrentBundle] = useState({
    name: '',
    description: '',
    categories: {} as {[key: string]: number},
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    maxQuantity: 100,
    validFrom: '',
    validUntil: ''
  });

  const [salesPeriod, setSalesPeriod] = useState({
    salesStart: existingEvent?.salesStart || '',
    salesEnd: existingEvent?.salesEnd || '',
    presaleStart: existingEvent?.presaleStart || '',
    presaleEnd: existingEvent?.presaleEnd || '',
    autoExportEnabled: true,
    exportEmails: [] as string[],
    reportSchedule: {
      enabled: false,
      frequency: 'daily' as 'daily' | 'weekly' | 'custom',
      time: '09:00',
      emails: [] as string[]
    },
    taxSettings: {
      vatRate: 19,
      vatNumber: '',
      shopifyTaxSync: true
    }
  });

  const [newExportEmail, setNewExportEmail] = useState('');
  const [newReportEmail, setNewReportEmail] = useState('');

  const categories = ['Musik', 'Business', 'Sport', 'Kultur', 'Comedy', 'Theater', 'Bildung', 'Technologie'];

  const addTicketCategory = () => {
    const newCategory: TicketCategory = {
      id: Date.now().toString(),
      name: '',
      price: 0,
      capacity: 0,
      sold: 0,
      reserved: 0,
      description: '',
      benefits: [],
      color: '#3B82F6'
    };
    setTicketCategories(prev => [...prev, newCategory]);
  };

  const updateTicketCategory = (index: number, updates: Partial<TicketCategory>) => {
    setTicketCategories(prev => prev.map((cat, i) => 
      i === index ? { ...cat, ...updates } : cat
    ));
  };

  const removeTicketCategory = (index: number) => {
    if (ticketCategories.length > 1) {
      setTicketCategories(prev => prev.filter((_, i) => i !== index));
    }
  };

  const calculateBundleOriginalPrice = () => {
    return Object.entries(currentBundle.categories).reduce((total, [categoryId, quantity]) => {
      const category = ticketCategories.find(c => c.id === categoryId);
      return total + (category ? category.price * quantity : 0);
    }, 0);
  };

  const calculateBundlePrice = (originalPrice: number) => {
    if (currentBundle.discountType === 'percentage') {
      return originalPrice * (1 - currentBundle.discountValue / 100);
    } else {
      return originalPrice - currentBundle.discountValue;
    }
  };

  const addBundle = () => {
    if (!currentBundle.name || Object.keys(currentBundle.categories).length === 0) {
      alert('Bitte Bundle-Name und mindestens eine Kategorie auswählen');
      return;
    }

    const originalPrice = calculateBundleOriginalPrice();
    const bundlePrice = calculateBundlePrice(originalPrice);

    const newBundle = {
      id: Date.now().toString(),
      name: currentBundle.name,
      description: currentBundle.description,
      categories: Object.entries(currentBundle.categories).map(([categoryId, quantity]) => {
        const category = ticketCategories.find(c => c.id === categoryId)!;
        return {
          categoryId,
          quantity,
          name: category.name,
          price: category.price
        };
      }),
      originalPrice,
      bundlePrice,
      discount: currentBundle.discountType === 'percentage' ? currentBundle.discountValue : originalPrice - bundlePrice,
      discountType: currentBundle.discountType,
      maxQuantity: currentBundle.maxQuantity,
      sold: 0,
      isActive: true,
      validFrom: currentBundle.validFrom || undefined,
      validUntil: currentBundle.validUntil || undefined
    };

    setBundles(prev => [...prev, newBundle]);
    setCurrentBundle({
      name: '',
      description: '',
      categories: {},
      discountType: 'percentage',
      discountValue: 0,
      maxQuantity: 100,
      validFrom: '',
      validUntil: ''
    });
    setShowBundleCreator(false);
  };

  const addExportEmail = () => {
    if (newExportEmail && !salesPeriod.exportEmails.includes(newExportEmail)) {
      setSalesPeriod(prev => ({
        ...prev,
        exportEmails: [...prev.exportEmails, newExportEmail]
      }));
      setNewExportEmail('');
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

  const exportParticipantData = () => {
    alert(`📤 Teilnehmer-Export wird vorbereitet...

📊 Export-Inhalt:
• Vollständige Teilnehmerliste
• EAN-Codes für alle Tickets
• Ticket-Kategorien und Preise
• Kaufdaten und Zahlungsstatus
• CSV-Format für Excel

📧 Versand an: ${salesPeriod.exportEmails.join(', ')}

✅ Export erfolgreich versendet!`);
  };

  const generateFinalInvoice = () => {
    const grossRevenue = 156890; // Mock revenue
    const vatAmount = grossRevenue * (salesPeriod.taxSettings.vatRate / 100);
    const netRevenue = grossRevenue - vatAmount;
    
    alert(`📊 Endabrechnung wird erstellt...

💰 Finanzübersicht:
• Brutto-Umsatz: €${grossRevenue.toLocaleString()}
• MwSt. (${salesPeriod.taxSettings.vatRate}%): €${vatAmount.toFixed(2)}
• Netto-Umsatz: €${netRevenue.toFixed(2)}
• USt-IdNr.: ${salesPeriod.taxSettings.vatNumber || 'Nicht angegeben'}

📧 PDF-Rechnung versendet an: ${salesPeriod.exportEmails.join(', ')}

✅ Endabrechnung erfolgreich erstellt!`);
  };

  const removeBundle = (bundleId: string) => {
    setBundles(prev => prev.filter(b => b.id !== bundleId));
  };

  const handleSave = () => {
    if (!eventData.title || !eventData.date || !eventData.time || !selectedVenue || !eventData.terms) {
      alert('Bitte füllen Sie alle Pflichtfelder aus (Titel, Datum, Zeit, Venue und AGB)');
      return;
    }

    const totalCapacity = ticketCategories.reduce((sum, cat) => sum + cat.capacity, 0);
    
    const newEvent: Partial<Event> = {
      ...eventData,
      venue: selectedVenue,
      ticketCategories,
      ticketBundles: bundles,
      salesStart: salesPeriod.salesStart,
      salesEnd: salesPeriod.salesEnd,
      presaleStart: salesPeriod.presaleStart || undefined,
      presaleEnd: salesPeriod.presaleEnd || undefined,
      totalCapacity,
      soldTickets: 0,
      reservedTickets: 0,
      revenue: 0,
      status: 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(newEvent);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {existingEvent ? 'Event bearbeiten' : 'Neues Event erstellen'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Event Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event-Titel *</label>
              <input
                type="text"
                value={eventData.title || ''}
                onChange={(e) => setEventData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Summer Music Festival 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategorie</label>
              <select
                value={eventData.category || 'Musik'}
                onChange={(e) => setEventData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Datum *</label>
              <input
                type="date"
                value={eventData.date || ''}
                onChange={(e) => setEventData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Beginn *</label>
              <input
                type="time"
                value={eventData.time || ''}
                onChange={(e) => setEventData(prev => ({ ...prev, time: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Einlass</label>
              <input
                type="time"
                value={eventData.doorsOpen || ''}
                onChange={(e) => setEventData(prev => ({ ...prev, doorsOpen: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Beschreibung</label>
            <WysiwygEditor
              value={eventData.description || ''}
              onChange={(value) => setEventData(prev => ({ ...prev, description: value }))}
              placeholder="Event-Beschreibung eingeben..."
              eventTitle={eventData.title}
              eventCategory={eventData.category}
              venue={selectedVenue?.name}
            />
          </div>

          {/* Terms and Conditions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allgemeine Geschäftsbedingungen (AGB) *
            </label>
            <WysiwygEditor
              value={eventData.terms || ''}
              onChange={(value) => setEventData(prev => ({ ...prev, terms: value }))}
              placeholder="AGB für dieses Event eingeben..."
              eventTitle={eventData.title}
              eventCategory={eventData.category}
              venue={selectedVenue?.name}
            />
            <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h5 className="font-semibold text-blue-900 mb-2">📋 AGB-Hinweise:</h5>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Rücktrittsrecht und Stornierungsbedingungen</li>
                <li>• Einlassbedingungen und Altersbeschränkungen</li>
                <li>• Haftungsausschluss und Verantwortlichkeiten</li>
                <li>• Datenschutz und Bildrechte</li>
                <li>• Widerrufsbelehrung für Online-Käufe</li>
              </ul>
            </div>
          </div>

          {/* Verkaufszeitraum */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">📅 Verkaufszeitraum & Export</h3>
              </div>
              <button
                onClick={() => setShowSalesPeriodSettings(!showSalesPeriodSettings)}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

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
                      value={salesPeriod.presaleStart}
                      onChange={(e) => setSalesPeriod(prev => ({ ...prev, presaleStart: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Presale-Ende</label>
                    <input
                      type="datetime-local"
                      value={salesPeriod.presaleEnd}
                      onChange={(e) => setSalesPeriod(prev => ({ ...prev, presaleEnd: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Erweiterte Verkaufszeitraum-Einstellungen */}
            {showSalesPeriodSettings && (
              <div className="mt-6 space-y-6 border-t border-gray-200 pt-6">
                {/* Automatischer Export */}
                <div className="bg-white rounded-lg p-4 border border-emerald-200">
                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-emerald-600" />
                    <span>📧 Automatischer Export nach Verkaufsende</span>
                  </h5>
                  
                  <label className="flex items-center space-x-2 mb-4">
                    <input
                      type="checkbox"
                      checked={salesPeriod.autoExportEnabled}
                      onChange={(e) => setSalesPeriod(prev => ({ ...prev, autoExportEnabled: e.target.checked }))}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-medium text-gray-900">Automatischen Export aktivieren</span>
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">📧 E-Mail-Adressen für Export</label>
                    <div className="flex items-center space-x-2 mb-3">
                      <input
                        type="email"
                        value={newExportEmail}
                        onChange={(e) => setNewExportEmail(e.target.value)}
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

                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={exportParticipantData}
                      disabled={salesPeriod.exportEmails.length === 0}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>📤 Test-Export</span>
                    </button>
                    
                    <button
                      onClick={generateFinalInvoice}
                      disabled={salesPeriod.exportEmails.length === 0}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>📊 Endabrechnung</span>
                    </button>
                  </div>
                </div>

                {/* MwSt.-Einstellungen */}
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    <span>🧾 Steuer-Einstellungen</span>
                  </h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">USt-IdNr.</label>
                      <input
                        type="text"
                        value={salesPeriod.taxSettings.vatNumber}
                        onChange={(e) => setSalesPeriod(prev => ({
                          ...prev,
                          taxSettings: { ...prev.taxSettings, vatNumber: e.target.value }
                        }))}
                        placeholder="DE123456789"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <label className="flex items-center space-x-2 mt-4">
                    <input
                      type="checkbox"
                      checked={salesPeriod.taxSettings.shopifyTaxSync}
                      onChange={(e) => setSalesPeriod(prev => ({
                        ...prev,
                        taxSettings: { ...prev.taxSettings, shopifyTaxSync: e.target.checked }
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-medium text-gray-900">🛍️ Mit Shopify Steuerregeln synchronisieren</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Hardticket Settings */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Package className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">🎫 Hardticket-Einstellungen</h3>
              </div>
              <button
                onClick={() => setShowHardticketSettings(!showHardticketSettings)}
                className="text-purple-600 hover:text-purple-800 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={eventData.hardticketSettings?.enabled || false}
                  onChange={(e) => setEventData(prev => ({
                    ...prev,
                    hardticketSettings: {
                      ...prev.hardticketSettings,
                      enabled: e.target.checked,
                      shippingRequired: true,
                      printingEnabled: true,
                      includeQRCode: true,
                      includeUPCCode: true,
                      customMessage: ''
                    }
                  }))}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <span className="font-medium text-gray-900">🎫 Hardticket-Versand für dieses Event aktivieren</span>
                  <p className="text-sm text-gray-600">Physische Tickets werden gedruckt und per Post versendet</p>
                </div>
              </label>

              {eventData.hardticketSettings?.enabled && showHardticketSettings && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-4 bg-white rounded-lg border border-purple-200">
                  <div>
                    <label className="flex items-center space-x-2 mb-3">
                      <input
                        type="checkbox"
                        checked={eventData.hardticketSettings?.shippingRequired || false}
                        onChange={(e) => setEventData(prev => ({
                          ...prev,
                          hardticketSettings: {
                            ...prev.hardticketSettings!,
                            shippingRequired: e.target.checked
                          }
                        }))}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-900">📦 Versand erforderlich</span>
                    </label>

                    <label className="flex items-center space-x-2 mb-3">
                      <input
                        type="checkbox"
                        checked={eventData.hardticketSettings?.printingEnabled || false}
                        onChange={(e) => setEventData(prev => ({
                          ...prev,
                          hardticketSettings: {
                            ...prev.hardticketSettings!,
                            printingEnabled: e.target.checked
                          }
                        }))}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-900">🖨️ Lokales Drucken aktivieren</span>
                    </label>

                    <label className="flex items-center space-x-2 mb-3">
                      <input
                        type="checkbox"
                        checked={eventData.hardticketSettings?.includeQRCode || false}
                        onChange={(e) => setEventData(prev => ({
                          ...prev,
                          hardticketSettings: {
                            ...prev.hardticketSettings!,
                            includeQRCode: e.target.checked
                          }
                        }))}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-900">📱 QR-Code auf Hardticket</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={eventData.hardticketSettings?.includeUPCCode || false}
                        onChange={(e) => setEventData(prev => ({
                          ...prev,
                          hardticketSettings: {
                            ...prev.hardticketSettings!,
                            includeUPCCode: e.target.checked
                          }
                        }))}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-900">📊 UPC/EAN-Code auf Hardticket</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">🎨 Hardticket-Design</label>
                    <select
                      value={eventData.hardticketSettings?.hardticketDesign || 'standard'}
                      onChange={(e) => setEventData(prev => ({
                        ...prev,
                        hardticketSettings: {
                          ...prev.hardticketSettings!,
                          hardticketDesign: e.target.value
                        }
                      }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="standard">Standard Design</option>
                      <option value="premium">Premium Design</option>
                      <option value="custom">Custom Design</option>
                    </select>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">💬 Custom Nachricht (optional)</label>
                      <textarea
                        value={eventData.hardticketSettings?.customMessage || ''}
                        onChange={(e) => setEventData(prev => ({
                          ...prev,
                          hardticketSettings: {
                            ...prev.hardticketSettings!,
                            customMessage: e.target.value
                          }
                        }))}
                        placeholder="z.B. 'Vielen Dank für Ihren Kauf! Wir freuen uns auf Sie.'"
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {eventData.hardticketSettings?.enabled && (
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h5 className="font-semibold text-purple-900 mb-2">🎫 Hardticket-Vorschau</h5>
                  <div className="text-sm text-purple-800 space-y-1">
                    <div>• 📦 Versand: {eventData.hardticketSettings.shippingRequired ? 'Aktiviert' : 'Deaktiviert'}</div>
                    <div>• 🖨️ Lokaler Druck: {eventData.hardticketSettings.printingEnabled ? 'Aktiviert' : 'Deaktiviert'}</div>
                    <div>• 📱 QR-Code: {eventData.hardticketSettings.includeQRCode ? 'Inklusive' : 'Nicht enthalten'}</div>
                    <div>• 📊 UPC-Code: {eventData.hardticketSettings.includeUPCCode ? 'Inklusive' : 'Nicht enthalten'}</div>
                    <div>• 🎨 Design: {eventData.hardticketSettings.hardticketDesign || 'Standard'}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ticket Categories */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">🎫 Ticket-Kategorien</h3>
              <button
                onClick={addTicketCategory}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Kategorie hinzufügen</span>
              </button>
            </div>

            <div className="space-y-4">
              {ticketCategories.map((category, index) => (
                <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={category.name}
                        onChange={(e) => updateTicketCategory(index, { name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="VIP, General..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preis (€)</label>
                      <input
                        type="number"
                        value={category.price}
                        onChange={(e) => updateTicketCategory(index, { price: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Kapazität</label>
                      <input
                        type="number"
                        value={category.capacity}
                        onChange={(e) => updateTicketCategory(index, { capacity: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="1"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={() => removeTicketCategory(index)}
                        disabled={ticketCategories.length === 1}
                        className="w-full bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Entfernen</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ticket Bundles */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Package className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">📦 Ticket-Bundles</h3>
              </div>
              <button
                onClick={() => setShowBundleCreator(true)}
                disabled={ticketCategories.length === 0 || ticketCategories.some(cat => !cat.name || cat.price <= 0)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Bundle erstellen</span>
              </button>
            </div>

            {/* Existing Bundles */}
            {bundles.length > 0 && (
              <div className="space-y-4 mb-6">
                {bundles.map((bundle) => (
                  <div key={bundle.id} className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{bundle.name}</h4>
                        <p className="text-gray-600 text-sm mb-3">{bundle.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <span className="font-medium text-gray-700">Enthält:</span>
                            <div className="space-y-1 mt-1">
                              {bundle.categories.map((cat: any, index: number) => (
                                <div key={index} className="text-sm text-gray-600">
                                  • {cat.quantity}x {cat.name} (€{cat.price} je Ticket)
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center space-x-4">
                              <div className="text-sm text-gray-500">
                                <span className="line-through">€{bundle.originalPrice}</span>
                              </div>
                              <div className="text-lg font-bold text-purple-600">
                                €{bundle.bundlePrice}
                              </div>
                              <div className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">
                                Spare {bundle.discountType === 'percentage' ? `${bundle.discount}%` : `€${bundle.discount}`}
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              Max. {bundle.maxQuantity} Bundles
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => removeBundle(bundle.id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bundle Creator Modal */}
            {showBundleCreator && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">📦 Neues Ticket-Bundle erstellen</h3>
                    <button
                      onClick={() => setShowBundleCreator(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {/* Bundle Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bundle-Name</label>
                        <input
                          type="text"
                          value={currentBundle.name}
                          onChange={(e) => setCurrentBundle(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="VIP Experience Package"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max. Anzahl</label>
                        <input
                          type="number"
                          value={currentBundle.maxQuantity}
                          onChange={(e) => setCurrentBundle(prev => ({ ...prev, maxQuantity: parseInt(e.target.value) || 0 }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Beschreibung</label>
                      <textarea
                        value={currentBundle.description}
                        onChange={(e) => setCurrentBundle(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Komplettes VIP-Erlebnis mit Premium-Sitzplätzen und exklusiven Vorteilen"
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    {/* Category Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">🎫 Ticket-Kategorien auswählen</label>
                      <div className="space-y-3">
                        {ticketCategories.filter(cat => cat.name && cat.price > 0).map((category) => (
                          <div key={category.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div className="flex-1">
                              <h6 className="font-medium text-gray-900">{category.name}</h6>
                              <p className="text-sm text-gray-600">€{category.price} pro Ticket • {category.capacity} verfügbar</p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <label className="text-sm text-gray-700">Anzahl:</label>
                              <input
                                type="number"
                                min="0"
                                max={category.capacity}
                                value={currentBundle.categories[category.id] || 0}
                                onChange={(e) => setCurrentBundle(prev => ({
                                  ...prev,
                                  categories: {
                                    ...prev.categories,
                                    [category.id]: parseInt(e.target.value) || 0
                                  }
                                }))}
                                className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Discount Configuration */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rabatt-Typ</label>
                        <select
                          value={currentBundle.discountType}
                          onChange={(e) => setCurrentBundle(prev => ({ ...prev, discountType: e.target.value as 'percentage' | 'fixed' }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="percentage">Prozentual (%)</option>
                          <option value="fixed">Fester Betrag (€)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rabatt {currentBundle.discountType === 'percentage' ? '(%)' : '(€)'}
                        </label>
                        <input
                          type="number"
                          value={currentBundle.discountValue}
                          onChange={(e) => setCurrentBundle(prev => ({ ...prev, discountValue: parseFloat(e.target.value) || 0 }))}
                          min="0"
                          max={currentBundle.discountType === 'percentage' ? 100 : calculateBundleOriginalPrice()}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div className="flex flex-col justify-end">
                        <div className="bg-purple-50 rounded-lg p-4">
                          <div className="text-sm text-gray-600">Bundle-Preis</div>
                          <div className="text-lg font-bold text-purple-600">
                            €{calculateBundlePrice(calculateBundleOriginalPrice()).toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Original: €{calculateBundleOriginalPrice().toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Validity Period */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gültig ab (Optional)</label>
                        <input
                          type="date"
                          value={currentBundle.validFrom}
                          onChange={(e) => setCurrentBundle(prev => ({ ...prev, validFrom: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gültig bis (Optional)</label>
                        <input
                          type="date"
                          value={currentBundle.validUntil}
                          onChange={(e) => setCurrentBundle(prev => ({ ...prev, validUntil: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
                    <button
                      onClick={() => setShowBundleCreator(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Abbrechen
                    </button>
                    <button
                      onClick={addBundle}
                      disabled={!currentBundle.name || Object.keys(currentBundle.categories).length === 0 || calculateBundleOriginalPrice() === 0}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Bundle erstellen
                    </button>
                  </div>
                </div>
              </div>
            )}

            {ticketCategories.length === 0 && (
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <p className="text-yellow-800 text-sm">
                  💡 Erstellen Sie zuerst Ticket-Kategorien, um Bundles zu konfigurieren.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{existingEvent ? 'Aktualisieren' : 'Event erstellen'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCreator;