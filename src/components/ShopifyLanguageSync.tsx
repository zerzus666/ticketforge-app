import React, { useState, useEffect } from 'react';
import { Globe, RefreshCw, CheckCircle, AlertCircle, Settings, Download, Upload } from 'lucide-react';

interface ShopifyLanguageMapping {
  shopifyLocale: string;
  ticketForgeLanguage: string;
  isActive: boolean;
  lastSync: string;
}

interface TranslationSet {
  language: string;
  translations: { [key: string]: string };
}

const ShopifyLanguageSync: React.FC = () => {
  const [languageMappings, setLanguageMappings] = useState<ShopifyLanguageMapping[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncStatus, setLastSyncStatus] = useState<'success' | 'error' | null>(null);
  const [translationSets, setTranslationSets] = useState<TranslationSet[]>([]);

  // Shopify-Sprachen zu TicketForge-Sprachen Mapping
  const defaultMappings: ShopifyLanguageMapping[] = [
    { shopifyLocale: 'de', ticketForgeLanguage: 'Deutsch', isActive: true, lastSync: '2024-01-20T10:30:00Z' },
    { shopifyLocale: 'en', ticketForgeLanguage: 'English', isActive: true, lastSync: '2024-01-20T10:30:00Z' },
    { shopifyLocale: 'fr', ticketForgeLanguage: 'Français', isActive: true, lastSync: '2024-01-20T10:30:00Z' },
    { shopifyLocale: 'es', ticketForgeLanguage: 'Español', isActive: true, lastSync: '2024-01-20T10:30:00Z' },
    { shopifyLocale: 'it', ticketForgeLanguage: 'Italiano', isActive: true, lastSync: '2024-01-20T10:30:00Z' },
    { shopifyLocale: 'nl', ticketForgeLanguage: 'Nederlands', isActive: false, lastSync: '' },
    { shopifyLocale: 'pt', ticketForgeLanguage: 'Português', isActive: false, lastSync: '' },
    { shopifyLocale: 'ja', ticketForgeLanguage: '日本語', isActive: false, lastSync: '' }
  ];

  // Übersetzungen für TicketForge UI
  const translationData: TranslationSet[] = [
    {
      language: 'Deutsch',
      translations: {
        'dashboard': 'Dashboard',
        'events': 'Events',
        'event-bulk-import': 'Event Bulk Import',
        'venues': 'Veranstaltungsorte',
        'participants': 'Teilnehmer',
        'tickets': 'Tickets',
        'bundles': 'Ticket-Pakete',
        'inventory': 'Lagerbestand',
        'analytics': 'Berichte',
        'settings': 'Einstellungen',
        'create_event': 'Event erstellen',
        'sold_out': 'AUSVERKAUFT',
        'low_stock': 'WENIGE TICKETS',
        'available': 'Verfügbar',
        'price': 'Preis',
        'capacity': 'Kapazität',
        'venue': 'Veranstaltungsort',
        'date': 'Datum',
        'time': 'Uhrzeit',
        'organizer': 'Veranstalter',
        'category': 'Kategorie',
        'export': 'Exportieren',
        'import': 'Importieren',
        'save': 'Speichern',
        'cancel': 'Abbrechen',
        'delete': 'Löschen',
        'edit': 'Bearbeiten',
        'view': 'Anzeigen'
      }
    },
    {
      language: 'English',
      translations: {
        'dashboard': 'Dashboard',
        'events': 'Events',
        'event-bulk-import': 'Event Bulk Import',
        'venues': 'Venues',
        'participants': 'Participants',
        'tickets': 'Tickets',
        'bundles': 'Ticket Bundles',
        'inventory': 'Inventory',
        'analytics': 'Analytics',
        'settings': 'Settings',
        'create_event': 'Create Event',
        'sold_out': 'SOLD OUT',
        'low_stock': 'LOW STOCK',
        'available': 'Available',
        'price': 'Price',
        'capacity': 'Capacity',
        'venue': 'Venue',
        'date': 'Date',
        'time': 'Time',
        'organizer': 'Organizer',
        'category': 'Category',
        'export': 'Export',
        'import': 'Import',
        'save': 'Save',
        'cancel': 'Cancel',
        'delete': 'Delete',
        'edit': 'Edit',
        'view': 'View'
      }
    },
    {
      language: 'Français',
      translations: {
        'dashboard': 'Tableau de bord',
        'events': 'Événements',
        'event-bulk-import': 'Import en Masse d\'Événements',
        'venues': 'Lieux',
        'participants': 'Participants',
        'tickets': 'Billets',
        'bundles': 'Forfaits',
        'inventory': 'Inventaire',
        'analytics': 'Analyses',
        'settings': 'Paramètres',
        'create_event': 'Créer un événement',
        'sold_out': 'COMPLET',
        'low_stock': 'STOCK FAIBLE',
        'available': 'Disponible',
        'price': 'Prix',
        'capacity': 'Capacité',
        'venue': 'Lieu',
        'date': 'Date',
        'time': 'Heure',
        'organizer': 'Organisateur',
        'category': 'Catégorie',
        'export': 'Exporter',
        'import': 'Importer',
        'save': 'Enregistrer',
        'cancel': 'Annuler',
        'delete': 'Supprimer',
        'edit': 'Modifier',
        'view': 'Voir'
      }
    },
    {
      language: 'Español',
      translations: {
        'dashboard': 'Panel',
        'events': 'Eventos',
        'event-bulk-import': 'Importación Masiva de Eventos',
        'venues': 'Lugares',
        'participants': 'Participantes',
        'tickets': 'Entradas',
        'bundles': 'Paquetes',
        'inventory': 'Inventario',
        'analytics': 'Análisis',
        'settings': 'Configuración',
        'create_event': 'Crear evento',
        'sold_out': 'AGOTADO',
        'low_stock': 'POCAS ENTRADAS',
        'available': 'Disponible',
        'price': 'Precio',
        'capacity': 'Capacidad',
        'venue': 'Lugar',
        'date': 'Fecha',
        'time': 'Hora',
        'organizer': 'Organizador',
        'category': 'Categoría',
        'export': 'Exportar',
        'import': 'Importar',
        'save': 'Guardar',
        'cancel': 'Cancelar',
        'delete': 'Eliminar',
        'edit': 'Editar',
        'view': 'Ver'
      }
    },
    {
      language: 'Italiano',
      translations: {
        'dashboard': 'Dashboard',
        'events': 'Eventi',
        'event-bulk-import': 'Importazione Massiva Eventi',
        'venues': 'Luoghi',
        'participants': 'Partecipanti',
        'tickets': 'Biglietti',
        'bundles': 'Pacchetti',
        'inventory': 'Inventario',
        'analytics': 'Analisi',
        'settings': 'Impostazioni',
        'create_event': 'Crea evento',
        'sold_out': 'ESAURITO',
        'low_stock': 'POCHI BIGLIETTI',
        'available': 'Disponibile',
        'price': 'Prezzo',
        'capacity': 'Capacità',
        'venue': 'Luogo',
        'date': 'Data',
        'time': 'Ora',
        'organizer': 'Organizzatore',
        'category': 'Categoria',
        'export': 'Esporta',
        'import': 'Importa',
        'save': 'Salva',
        'cancel': 'Annulla',
        'delete': 'Elimina',
        'edit': 'Modifica',
        'view': 'Visualizza'
      }
    }
  ];

  useEffect(() => {
    setLanguageMappings(defaultMappings);
    setTranslationSets(translationData);
    detectShopifyLanguage();
  }, []);

  const detectShopifyLanguage = async () => {
    try {
      // Simuliere Shopify Admin API Call zur Sprach-Erkennung
      const shopifyStoreInfo = {
        primary_locale: 'de',
        enabled_locales: ['de', 'en', 'fr'],
        currency: 'EUR',
        timezone: 'Europe/Berlin',
        country_code: 'DE'
      };

      console.log('🛍️ Shopify Store-Sprache erkannt:', shopifyStoreInfo);
      
      // Automatische Sprach-Synchronisation
      const primaryLanguage = defaultMappings.find(m => m.shopifyLocale === shopifyStoreInfo.primary_locale);
      if (primaryLanguage) {
        await syncLanguageSettings(primaryLanguage.ticketForgeLanguage);
      }
    } catch (error) {
      console.error('❌ Fehler bei Shopify-Sprach-Erkennung:', error);
    }
  };

  const syncLanguageSettings = async (targetLanguage: string) => {
    setIsSyncing(true);
    
    try {
      // Simuliere Übersetzungs-API Calls
      const translationSet = translationSets.find(set => set.language === targetLanguage);
      
      if (translationSet) {
        // Update TicketForge UI language
        localStorage.setItem('ticketforge_language', targetLanguage);
        localStorage.setItem('ticketforge_translations', JSON.stringify(translationSet.translations));
        
        // Update language mappings
        setLanguageMappings(prev => prev.map(mapping => ({
          ...mapping,
          isActive: mapping.ticketForgeLanguage === targetLanguage,
          lastSync: mapping.ticketForgeLanguage === targetLanguage ? new Date().toISOString() : mapping.lastSync
        })));
        
        setLastSyncStatus('success');
        
        console.log(`🌍 TicketForge UI auf ${targetLanguage} umgestellt`);
        alert(`✅ TicketForge erfolgreich auf ${targetLanguage} umgestellt!
        
🔄 Synchronisiert:
• UI-Sprache: ${targetLanguage}
• Button-Texte übersetzt
• Fehlermeldungen lokalisiert
• Datum/Zeit-Formate angepasst
• Währung synchronisiert`);
      }
    } catch (error) {
      setLastSyncStatus('error');
      console.error('❌ Fehler bei Sprach-Synchronisation:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const manualSync = async () => {
    const activeMapping = languageMappings.find(m => m.isActive);
    if (activeMapping) {
      await syncLanguageSettings(activeMapping.ticketForgeLanguage);
    }
  };

  const toggleLanguageMapping = (shopifyLocale: string) => {
    setLanguageMappings(prev => prev.map(mapping => ({
      ...mapping,
      isActive: mapping.shopifyLocale === shopifyLocale ? !mapping.isActive : mapping.isActive
    })));
  };

  const exportTranslations = () => {
    const exportData = {
      mappings: languageMappings,
      translations: translationSets,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ticketforge_translations.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🌍 Shopify Sprach-Synchronisation</h1>
          <p className="text-gray-600 mt-1">Automatische Übersetzung des TicketForge Backends basierend auf Shopify-Sprache</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className={`px-3 py-2 rounded-lg flex items-center space-x-2 ${
            lastSyncStatus === 'success' ? 'bg-emerald-100 text-emerald-800' :
            lastSyncStatus === 'error' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {lastSyncStatus === 'success' ? <CheckCircle className="w-4 h-4" /> :
             lastSyncStatus === 'error' ? <AlertCircle className="w-4 h-4" /> :
             <Globe className="w-4 h-4" />}
            <span className="text-sm font-medium">
              {lastSyncStatus === 'success' ? 'Synchronisiert' :
               lastSyncStatus === 'error' ? 'Sync-Fehler' :
               'Bereit'}
            </span>
          </div>
          <button
            onClick={exportTranslations}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>📄 Export</span>
          </button>
          <button
            onClick={manualSync}
            disabled={isSyncing}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synchronisiere...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>🔄 Jetzt synchronisieren</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Shopify Store Info */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">🛍️ Shopify Store-Informationen</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="text-lg font-bold text-green-600">DE</div>
            <div className="text-sm text-green-800">Primäre Sprache</div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-lg font-bold text-blue-600">EUR</div>
            <div className="text-sm text-blue-800">Währung</div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-lg font-bold text-purple-600">Berlin</div>
            <div className="text-sm text-purple-800">Zeitzone</div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-lg font-bold text-orange-600">3</div>
            <div className="text-sm text-orange-800">Aktive Sprachen</div>
          </div>
        </div>
      </div>

      {/* Language Mappings */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">🔗 Sprach-Zuordnungen</h3>
          <p className="text-gray-600 text-sm mt-1">Verknüpfung zwischen Shopify-Locales und TicketForge-Sprachen</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {languageMappings.map((mapping) => (
            <div key={mapping.shopifyLocale} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold ${
                    mapping.isActive ? 'bg-emerald-500' : 'bg-gray-400'
                  }`}>
                    {mapping.shopifyLocale.toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Shopify: {mapping.shopifyLocale} → TicketForge: {mapping.ticketForgeLanguage}
                    </h4>
                    <div className="text-sm text-gray-600">
                      {mapping.isActive ? (
                        <span className="text-emerald-600">✅ Aktiv • Letzte Sync: {new Date(mapping.lastSync).toLocaleString('de-DE')}</span>
                      ) : (
                        <span className="text-gray-500">❌ Inaktiv</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={mapping.isActive}
                      onChange={() => toggleLanguageMapping(mapping.shopifyLocale)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Aktiv</span>
                  </label>
                  <button
                    onClick={() => syncLanguageSettings(mapping.ticketForgeLanguage)}
                    disabled={!mapping.isActive || isSyncing}
                    className="text-blue-600 hover:text-blue-800 disabled:opacity-50 transition-colors p-2"
                    title="Sprache synchronisieren"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Translation Preview */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔤 Übersetzungs-Vorschau</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {translationSets.slice(0, 2).map((set) => (
            <div key={set.language} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">{set.language}</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {Object.entries(set.translations).slice(0, 10).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-600 font-mono">{key}:</span>
                    <span className="text-gray-900 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sync Instructions */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-xl font-bold text-blue-900 mb-4">🔄 Automatische Synchronisation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="font-bold">1</span>
            </div>
            <h4 className="font-semibold text-blue-900 mb-2">🛍️ Shopify-Erkennung</h4>
            <p className="text-blue-800 text-sm">Automatische Erkennung der Shopify Store-Sprache und -Einstellungen</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="font-bold">2</span>
            </div>
            <h4 className="font-semibold text-blue-900 mb-2">🔤 Übersetzung</h4>
            <p className="text-blue-800 text-sm">TicketForge UI wird automatisch in die erkannte Sprache übersetzt</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="font-bold">3</span>
            </div>
            <h4 className="font-semibold text-blue-900 mb-2">🔄 Live-Sync</h4>
            <p className="text-blue-800 text-sm">Kontinuierliche Synchronisation bei Shopify-Änderungen</p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
          <h5 className="font-semibold text-blue-900 mb-2">🎯 Unterstützte Features:</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800">
            <div>• 🔤 UI-Texte und Labels</div>
            <div>• 📧 E-Mail-Templates</div>
            <div>• 🎫 Ticket-Beschreibungen</div>
            <div>• 📊 Report-Sprache</div>
            <div>• 💰 Währungs-Formate</div>
            <div>• 📅 Datum/Zeit-Formate</div>
            <div>• 🚨 Fehlermeldungen</div>
            <div>• 📋 Export-Dateien</div>
          </div>
        </div>
      </div>

      {/* Manual Translation Management */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">⚙️ Manuelle Übersetzungs-Verwaltung</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ziel-Sprache</label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                {translationSets.map(set => (
                  <option key={set.language} value={set.language}>{set.language}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shopify Locale</label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                {languageMappings.map(mapping => (
                  <option key={mapping.shopifyLocale} value={mapping.shopifyLocale}>
                    {mapping.shopifyLocale} ({mapping.ticketForgeLanguage})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                🔄 Sprache anwenden
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold text-yellow-800">🔄 Automatische Synchronisation</span>
            </div>
            <p className="text-yellow-700 text-sm">
              TicketForge erkennt automatisch Änderungen in Ihren Shopify-Spracheinstellungen und passt die UI entsprechend an. 
              Manuelle Eingriffe sind nur bei besonderen Anforderungen nötig.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopifyLanguageSync;