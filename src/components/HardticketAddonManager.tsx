import React, { useState, useEffect } from 'react';
import { Package, DollarSign, Settings, Globe, Truck, Plus, Edit, Trash2, Eye, CheckCircle, AlertTriangle, Save, RefreshCw, ShoppingCart, Store } from 'lucide-react';
import type { HardticketAddon, ShippingMethod } from '../types';

interface HardticketAddonManagerProps {
  userSubscription: 'basic' | 'advanced' | 'premium' | 'enterprise';
  onAddonUpdate?: (addon: HardticketAddon) => void;
}

const HardticketAddonManager: React.FC<HardticketAddonManagerProps> = ({
  userSubscription = 'basic',
  onAddonUpdate
}) => {
  const [hardticketAddon, setHardticketAddon] = useState<HardticketAddon>({
    id: '1',
    name: 'Hardticket-Versand',
    description: 'Erhalten Sie Ihre Tickets als hochwertige gedruckte Hardtickets per Post',
    price: 4.99,
    isEnabled: false,
    shippingMethods: ['dhl_standard', 'dhl_express', 'deutsche_post'],
    availableCountries: ['DE', 'AT', 'CH'],
    estimatedDeliveryDays: 3,
    maxTicketsPerOrder: 10,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-20T10:30:00Z'
  });

  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [productCreationStatus, setProductCreationStatus] = useState<'idle' | 'creating' | 'success' | 'error'>('idle');

  // Verfügbare Versandmethoden nach Land
  const shippingMethodsByCountry = {
    'DE': [
      { id: 'dhl_standard', name: 'DHL Standard (2-3 Werktage)', price: 4.99 },
      { id: 'dhl_express', name: 'DHL Express (1-2 Werktage)', price: 9.99 },
      { id: 'deutsche_post', name: 'Deutsche Post Brief (3-5 Werktage)', price: 1.85 }
    ],
    'AT': [
      { id: 'osterreichische_post', name: 'Österreichische Post (2-4 Werktage)', price: 3.90 },
      { id: 'dhl_austria', name: 'DHL Austria Express (1-2 Werktage)', price: 12.90 }
    ],
    'CH': [
      { id: 'swiss_post', name: 'Swiss Post (3-5 Werktage)', price: 8.50 },
      { id: 'dhl_swiss', name: 'DHL Swiss Express (1-2 Werktage)', price: 15.90 }
    ],
    'US': [
      { id: 'usps_first_class', name: 'USPS First-Class (3-5 days)', price: 3.50 },
      { id: 'usps_priority', name: 'USPS Priority (1-3 days)', price: 8.95 },
      { id: 'ups_ground', name: 'UPS Ground (1-5 days)', price: 12.50 }
    ],
    'GB': [
      { id: 'royal_mail_first', name: 'Royal Mail First Class (1-2 days)', price: 2.20 },
      { id: 'royal_mail_tracked', name: 'Royal Mail Tracked 24 (1 day)', price: 4.20 },
      { id: 'dpd_uk', name: 'DPD Next Day (1 day)', price: 8.50 }
    ],
    'FR': [
      { id: 'la_poste_colissimo', name: 'Colissimo (2-3 jours)', price: 6.90 },
      { id: 'chronopost', name: 'Chronopost (1 jour)', price: 15.50 }
    ]
  };

  const availableCountries = [
    { code: 'DE', name: 'Deutschland', flag: '🇩🇪' },
    { code: 'AT', name: 'Österreich', flag: '🇦🇹' },
    { code: 'CH', name: 'Schweiz', flag: '🇨🇭' },
    { code: 'US', name: 'USA', flag: '🇺🇸' },
    { code: 'GB', name: 'Vereinigtes Königreich', flag: '🇬🇧' },
    { code: 'FR', name: 'Frankreich', flag: '🇫🇷' },
    { code: 'IT', name: 'Italien', flag: '🇮🇹' },
    { code: 'ES', name: 'Spanien', flag: '🇪🇸' },
    { code: 'NL', name: 'Niederlande', flag: '🇳🇱' }
  ];

  // Feature-Verfügbarkeit nach Subscription
  const getSubscriptionFeatures = () => {
    switch (userSubscription) {
      case 'basic':
        return {
          canEnableHardtickets: false,
          maxCountries: 0,
          customPricing: false,
          description: 'Hardticket-Versand nicht verfügbar'
        };
      case 'advanced':
        return {
          canEnableHardtickets: true,
          maxCountries: 3,
          customPricing: true,
          description: 'Hardticket-Versand für DACH-Region'
        };
      case 'premium':
        return {
          canEnableHardtickets: true,
          maxCountries: 6,
          customPricing: true,
          description: 'Hardticket-Versand für Europa + USA'
        };
      case 'enterprise':
        return {
          canEnableHardtickets: true,
          maxCountries: -1,
          customPricing: true,
          description: 'Hardticket-Versand weltweit'
        };
      default:
        return {
          canEnableHardtickets: false,
          maxCountries: 0,
          customPricing: false,
          description: 'Feature nicht verfügbar'
        };
    }
  };

  const features = getSubscriptionFeatures();

  // Shopify-Produkt für Hardticket-Addon erstellen
  const createShopifyProduct = async () => {
    if (!features.canEnableHardtickets) {
      alert('⚠️ Hardticket-Versand ist in Ihrem Plan nicht verfügbar. Upgrade auf Advanced+ erforderlich.');
      return;
    }

    setIsCreatingProduct(true);
    setProductCreationStatus('creating');

    try {
      // Simuliere Shopify Admin API Call
      const productData = {
        product: {
          title: hardticketAddon.name,
          body_html: `<p>${hardticketAddon.description}</p>
            <h3>🎫 Was ist enthalten:</h3>
            <ul>
              <li>✅ Hochwertige gedruckte Tickets</li>
              <li>✅ Sichere Verpackung</li>
              <li>✅ Tracking-Nummer inklusive</li>
              <li>✅ Versicherter Versand</li>
              <li>✅ Lieferung in ${hardticketAddon.estimatedDeliveryDays} Werktagen</li>
            </ul>
            <h3>📦 Verfügbare Länder:</h3>
            <p>${hardticketAddon.availableCountries.map(code => 
              availableCountries.find(c => c.code === code)?.name
            ).join(', ')}</p>`,
          vendor: 'TicketForge',
          product_type: 'Service',
          tags: 'hardticket,versand,addon,service',
          published: hardticketAddon.isEnabled,
          variants: [
            {
              title: 'Hardticket-Versand',
              price: hardticketAddon.price.toFixed(2),
              sku: `HARDTICKET-ADDON-${hardticketAddon.id}`,
              inventory_management: 'shopify',
              inventory_policy: 'continue',
              inventory_quantity: 9999,
              weight: 0.1,
              weight_unit: 'kg',
              requires_shipping: true,
              taxable: true
            }
          ],
          options: [
            {
              name: 'Service',
              values: ['Hardticket-Versand']
            }
          ],
          metafields: [
            {
              namespace: 'ticketforge',
              key: 'addon_type',
              value: 'hardticket_shipping',
              type: 'single_line_text_field'
            },
            {
              namespace: 'ticketforge',
              key: 'max_tickets_per_order',
              value: hardticketAddon.maxTicketsPerOrder.toString(),
              type: 'number_integer'
            },
            {
              namespace: 'ticketforge',
              key: 'available_countries',
              value: hardticketAddon.availableCountries.join(','),
              type: 'single_line_text_field'
            },
            {
              namespace: 'ticketforge',
              key: 'estimated_delivery_days',
              value: hardticketAddon.estimatedDeliveryDays.toString(),
              type: 'number_integer'
            }
          ]
        }
      };

      console.log('🛍️ Erstelle Shopify Hardticket-Addon Produkt:', productData);

      // Simuliere API-Antwort
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockShopifyResponse = {
        product: {
          id: 8765432109876,
          title: hardticketAddon.name,
          handle: 'hardticket-versand-addon',
          variants: [
            {
              id: 45678901234567,
              title: 'Hardticket-Versand',
              price: hardticketAddon.price.toFixed(2),
              sku: `HARDTICKET-ADDON-${hardticketAddon.id}`
            }
          ]
        }
      };

      // Update addon with Shopify IDs
      const updatedAddon = {
        ...hardticketAddon,
        shopifyProductId: mockShopifyResponse.product.id.toString(),
        shopifyVariantId: mockShopifyResponse.product.variants[0].id.toString(),
        updatedAt: new Date().toISOString()
      };

      setHardticketAddon(updatedAddon);
      setProductCreationStatus('success');
      onAddonUpdate?.(updatedAddon);

      alert(`✅ Hardticket-Addon erfolgreich als Shopify-Produkt erstellt!

🛍️ Shopify-Produkt:
• Produkt-ID: ${mockShopifyResponse.product.id}
• Varianten-ID: ${mockShopifyResponse.product.variants[0].id}
• Handle: ${mockShopifyResponse.product.handle}
• Preis: €${hardticketAddon.price}

📦 Addon-Details:
• Name: ${hardticketAddon.name}
• Beschreibung: ${hardticketAddon.description}
• Verfügbare Länder: ${hardticketAddon.availableCountries.length}
• Max. Tickets: ${hardticketAddon.maxTicketsPerOrder}
• Lieferzeit: ${hardticketAddon.estimatedDeliveryDays} Werktage

🔄 Integration:
• Automatisch bei Event-Checkout verfügbar
• Versandkosten werden automatisch berechnet
• Tracking-Integration aktiviert
• Kunden-Benachrichtigungen eingerichtet

🛒 Das Hardticket-Addon ist jetzt in Ihrem Shopify-Store verfügbar!`);

    } catch (error) {
      setProductCreationStatus('error');
      console.error('❌ Fehler beim Erstellen des Shopify-Produkts:', error);
      alert('❌ Fehler beim Erstellen des Shopify-Produkts. Bitte versuchen Sie es erneut.');
    } finally {
      setIsCreatingProduct(false);
    }
  };

  // Shopify-Produkt aktualisieren
  const updateShopifyProduct = async () => {
    if (!hardticketAddon.shopifyProductId) {
      alert('❌ Kein Shopify-Produkt verknüpft. Bitte erstellen Sie zuerst das Produkt.');
      return;
    }

    try {
      // Simuliere Shopify Product Update API Call
      const updateData = {
        product: {
          id: hardticketAddon.shopifyProductId,
          title: hardticketAddon.name,
          body_html: `<p>${hardticketAddon.description}</p>`,
          published: hardticketAddon.isEnabled,
          variants: [
            {
              id: hardticketAddon.shopifyVariantId,
              price: hardticketAddon.price.toFixed(2)
            }
          ]
        }
      };

      console.log('🛍️ Aktualisiere Shopify Hardticket-Produkt:', updateData);
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      alert(`✅ Shopify-Produkt erfolgreich aktualisiert!

🛍️ Änderungen:
• Preis: €${hardticketAddon.price}
• Status: ${hardticketAddon.isEnabled ? 'Aktiv' : 'Inaktiv'}
• Verfügbare Länder: ${hardticketAddon.availableCountries.length}

🔄 Die Änderungen sind sofort in Ihrem Shopify-Store sichtbar.`);

    } catch (error) {
      console.error('❌ Fehler beim Aktualisieren des Shopify-Produkts:', error);
      alert('❌ Fehler beim Aktualisieren des Shopify-Produkts.');
    }
  };

  // Addon-Einstellungen aktualisieren
  const updateAddonSetting = (key: keyof HardticketAddon, value: any) => {
    setHardticketAddon(prev => ({
      ...prev,
      [key]: value,
      updatedAt: new Date().toISOString()
    }));
  };

  // Land zur Verfügbarkeitsliste hinzufügen/entfernen
  const toggleCountryAvailability = (countryCode: string) => {
    const currentCountries = hardticketAddon.availableCountries;
    const newCountries = currentCountries.includes(countryCode)
      ? currentCountries.filter(code => code !== countryCode)
      : [...currentCountries, countryCode];

    // Prüfe Subscription-Limits
    if (features.maxCountries !== -1 && newCountries.length > features.maxCountries) {
      alert(`⚠️ Ihr ${userSubscription} Plan unterstützt maximal ${features.maxCountries} Länder. Upgrade für mehr Länder erforderlich.`);
      return;
    }

    updateAddonSetting('availableCountries', newCountries);
  };

  // Versandmethode hinzufügen/entfernen
  const toggleShippingMethod = (methodId: string) => {
    const currentMethods = hardticketAddon.shippingMethods;
    const newMethods = currentMethods.includes(methodId)
      ? currentMethods.filter(id => id !== methodId)
      : [...currentMethods, methodId];

    updateAddonSetting('shippingMethods', newMethods);
  };

  // Addon aktivieren/deaktivieren
  const toggleAddonStatus = async () => {
    if (!features.canEnableHardtickets) {
      alert(`⚠️ Hardticket-Versand ist in Ihrem ${userSubscription} Plan nicht verfügbar.

🚀 Upgrade-Optionen:
• Advanced Plan: €99/Monat - DACH-Region (DE, AT, CH)
• Premium Plan: €299/Monat - Europa + USA
• Enterprise Plan: €599/Monat - Weltweit

📞 Upgrade: sales@ticketforge.com`);
      return;
    }

    const newStatus = !hardticketAddon.isEnabled;
    updateAddonSetting('isEnabled', newStatus);

    if (newStatus && hardticketAddon.shopifyProductId) {
      await updateShopifyProduct();
    }

    alert(`${newStatus ? '✅' : '❌'} Hardticket-Addon ${newStatus ? 'aktiviert' : 'deaktiviert'}!

${newStatus ? `🛒 Kunden können jetzt Hardtickets für €${hardticketAddon.price} bestellen.` : '🚫 Hardticket-Option ist nicht mehr verfügbar.'}

🔄 Shopify-Produkt wurde entsprechend ${newStatus ? 'veröffentlicht' : 'versteckt'}.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Package className="w-7 h-7 text-purple-600" />
            <span>🎫 Hardticket-Addon Verwaltung</span>
          </h3>
          <p className="text-gray-600 mt-1">Konfigurieren Sie kostenpflichtige Hardticket-Versand-Optionen</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
            userSubscription === 'basic' ? 'bg-red-100 text-red-800' :
            userSubscription === 'advanced' ? 'bg-emerald-100 text-emerald-800' :
            userSubscription === 'premium' ? 'bg-purple-100 text-purple-800' :
            'bg-orange-100 text-orange-800'
          }`}>
            {userSubscription.charAt(0).toUpperCase() + userSubscription.slice(1)} Plan
          </div>
          <button
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <Settings className="w-4 h-4" />
            <span>⚙️ Erweitert</span>
          </button>
        </div>
      </div>

      {/* Subscription Features Info */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">📋 Plan-Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className={`text-2xl font-bold ${features.canEnableHardtickets ? 'text-emerald-600' : 'text-red-600'}`}>
              {features.canEnableHardtickets ? '✅' : '❌'}
            </div>
            <div className="text-sm text-gray-600">Hardticket-Versand</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {features.maxCountries === -1 ? '∞' : features.maxCountries}
            </div>
            <div className="text-sm text-gray-600">Verfügbare Länder</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${features.customPricing ? 'text-emerald-600' : 'text-red-600'}`}>
              {features.customPricing ? '✅' : '❌'}
            </div>
            <div className="text-sm text-gray-600">Custom Preise</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${hardticketAddon.isEnabled ? 'text-emerald-600' : 'text-red-600'}`}>
              {hardticketAddon.isEnabled ? '🟢' : '🔴'}
            </div>
            <div className="text-sm text-gray-600">Aktueller Status</div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-blue-800 text-sm">{features.description}</p>
        </div>
      </div>

      {/* Hardticket-Addon Konfiguration */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">🎫 Hardticket-Addon Einstellungen</h4>
        
        <div className="space-y-6">
          {/* Basis-Einstellungen */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Addon-Name</label>
              <input
                type="text"
                value={hardticketAddon.name}
                onChange={(e) => updateAddonSetting('name', e.target.value)}
                disabled={!features.canEnableHardtickets}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  !features.canEnableHardtickets ? 'bg-gray-50 text-gray-400' : ''
                }`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preis (€) {!features.customPricing && '(Premium Feature)'}
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={hardticketAddon.price}
                onChange={(e) => updateAddonSetting('price', parseFloat(e.target.value) || 0)}
                disabled={!features.customPricing}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  !features.customPricing ? 'bg-gray-50 text-gray-400' : ''
                }`}
              />
              {!features.customPricing && (
                <p className="text-xs text-red-500 mt-1">⚠️ Custom Preise nur ab Advanced Plan</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Beschreibung</label>
            <textarea
              value={hardticketAddon.description}
              onChange={(e) => updateAddonSetting('description', e.target.value)}
              disabled={!features.canEnableHardtickets}
              rows={3}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                !features.canEnableHardtickets ? 'bg-gray-50 text-gray-400' : ''
              }`}
            />
          </div>

          {/* Verfügbare Länder */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              🌍 Verfügbare Länder {features.maxCountries !== -1 && `(Max. ${features.maxCountries})`}
            </label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {availableCountries.map(country => {
                const isSelected = hardticketAddon.availableCountries.includes(country.code);
                const canSelect = features.canEnableHardtickets && 
                  (isSelected || features.maxCountries === -1 || hardticketAddon.availableCountries.length < features.maxCountries);
                
                return (
                  <label 
                    key={country.code} 
                    className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                      isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                    } ${!canSelect ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => canSelect && toggleCountryAvailability(country.code)}
                      disabled={!canSelect}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="text-center">
                      <div className="text-lg">{country.flag}</div>
                      <div className="text-xs text-gray-700">{country.code}</div>
                    </div>
                  </label>
                );
              })}
            </div>
            {!features.canEnableHardtickets && (
              <p className="text-xs text-red-500 mt-2">⚠️ Hardticket-Versand nur ab Advanced Plan verfügbar</p>
            )}
          </div>

          {/* Erweiterte Einstellungen */}
          {showAdvancedSettings && features.canEnableHardtickets && (
            <div className="border-t border-gray-200 pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Geschätzte Lieferzeit (Werktage)</label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={hardticketAddon.estimatedDeliveryDays}
                    onChange={(e) => updateAddonSetting('estimatedDeliveryDays', parseInt(e.target.value) || 3)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max. Tickets pro Bestellung</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={hardticketAddon.maxTicketsPerOrder}
                    onChange={(e) => updateAddonSetting('maxTicketsPerOrder', parseInt(e.target.value) || 10)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Versandmethoden pro Land */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">🚚 Verfügbare Versandmethoden</label>
                <div className="space-y-4">
                  {hardticketAddon.availableCountries.map(countryCode => {
                    const country = availableCountries.find(c => c.code === countryCode);
                    const methods = shippingMethodsByCountry[countryCode as keyof typeof shippingMethodsByCountry] || [];
                    
                    return (
                      <div key={countryCode} className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-3">
                          {country?.flag} {country?.name}
                        </h5>
                        <div className="space-y-2">
                          {methods.map(method => (
                            <label key={method.id} className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={hardticketAddon.shippingMethods.includes(method.id)}
                                onChange={() => toggleShippingMethod(method.id)}
                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                              />
                              <div className="flex-1">
                                <span className="text-sm font-medium text-gray-900">{method.name}</span>
                                <span className="text-sm text-gray-600 ml-2">€{method.price}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Addon-Status und Shopify-Integration */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-gray-900 mb-2">🛍️ Shopify-Integration</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Shopify-Produkt:</span>
                    {hardticketAddon.shopifyProductId ? (
                      <span className="text-emerald-600 font-medium">✅ Verknüpft (ID: {hardticketAddon.shopifyProductId})</span>
                    ) : (
                      <span className="text-red-600 font-medium">❌ Nicht erstellt</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${hardticketAddon.isEnabled ? 'text-emerald-600' : 'text-red-600'}`}>
                      {hardticketAddon.isEnabled ? '🟢 Aktiv' : '🔴 Inaktiv'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Verfügbare Länder:</span>
                    <span className="text-blue-600 font-medium">{hardticketAddon.availableCountries.length}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={toggleAddonStatus}
                  disabled={!features.canEnableHardtickets}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    hardticketAddon.isEnabled
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  } ${!features.canEnableHardtickets ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {hardticketAddon.isEnabled ? '🔴 Deaktivieren' : '🟢 Aktivieren'}
                </button>
                
                {!hardticketAddon.shopifyProductId ? (
                  <button
                    onClick={createShopifyProduct}
                    disabled={!features.canEnableHardtickets || isCreatingProduct}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    {isCreatingProduct ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Erstelle...</span>
                      </>
                    ) : (
                      <>
                        <Store className="w-4 h-4" />
                        <span>🛍️ Shopify-Produkt erstellen</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={updateShopifyProduct}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>🔄 Shopify aktualisieren</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hardticket-Addon Vorschau */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">👁️ Kunden-Vorschau</h4>
        
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h5 className="text-xl font-bold text-gray-900">{hardticketAddon.name}</h5>
              <p className="text-gray-600">{hardticketAddon.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">€{hardticketAddon.price}</div>
              <div className="text-sm text-gray-600">pro Bestellung</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4">
              <h6 className="font-medium text-gray-900 mb-2">📦 Lieferung</h6>
              <div className="text-sm text-gray-600 space-y-1">
                <div>⏰ {hardticketAddon.estimatedDeliveryDays} Werktage</div>
                <div>📊 Tracking inklusive</div>
                <div>🎫 Max. {hardticketAddon.maxTicketsPerOrder} Tickets</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <h6 className="font-medium text-gray-900 mb-2">🌍 Verfügbare Länder</h6>
              <div className="flex flex-wrap gap-1">
                {hardticketAddon.availableCountries.map(code => {
                  const country = availableCountries.find(c => c.code === code);
                  return (
                    <span key={code} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      {country?.flag} {country?.name}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <h6 className="font-medium text-emerald-900 mb-2">✨ Hardticket-Vorteile:</h6>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-emerald-800">
              <div>• 🎫 Hochwertige gedruckte Tickets</div>
              <div>• 📦 Sichere Verpackung</div>
              <div>• 📊 QR & UPC-Codes für Validierung</div>
              <div>• 🚚 Versicherter Versand</div>
              <div>• 📋 Lieferschein im Ticket-Format</div>
              <div>• 📱 Live-Tracking verfügbar</div>
            </div>
          </div>

          {hardticketAddon.isEnabled ? (
            <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="font-medium text-emerald-800">✅ Hardticket-Option ist für Kunden verfügbar</span>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-800">❌ Hardticket-Option ist deaktiviert</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Shopify-Produkt Status */}
      {hardticketAddon.shopifyProductId && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">🛍️ Shopify-Produkt Status</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-lg font-bold text-blue-600">{hardticketAddon.shopifyProductId}</div>
              <div className="text-sm text-blue-800">Shopify Produkt-ID</div>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4">
              <div className="text-lg font-bold text-emerald-600">{hardticketAddon.shopifyVariantId}</div>
              <div className="text-sm text-emerald-800">Shopify Varianten-ID</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-lg font-bold text-purple-600">€{hardticketAddon.price}</div>
              <div className="text-sm text-purple-800">Aktueller Preis</div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h6 className="font-medium text-gray-900 mb-2">🔗 Shopify-Integration:</h6>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>• 🛒 Automatisch bei Event-Checkout verfügbar</div>
              <div>• 💰 Preis wird automatisch berechnet</div>
              <div>• 📦 Versandkosten nach Land</div>
              <div>• 📧 Kunden-Benachrichtigungen automatisch</div>
              <div>• 📊 Tracking-Integration aktiviert</div>
              <div>• 🔄 Inventory-Sync mit TicketForge</div>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade-Hinweis für Basic Plan */}
      {userSubscription === 'basic' && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8 border border-purple-200">
          <h4 className="text-2xl font-bold text-gray-900 mb-4">🚀 Hardticket-Versand freischalten</h4>
          <p className="text-gray-700 mb-6">
            Bieten Sie Ihren Kunden premium Hardtickets mit professionellem Versand an. 
            Steigern Sie Ihren Umsatz mit diesem beliebten Zusatzservice.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">+€4.99</div>
              <div className="text-purple-800">Pro Hardticket-Bestellung</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">3-5</div>
              <div className="text-blue-800">Werktage Lieferzeit</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">9</div>
              <div className="text-emerald-800">Länder verfügbar</div>
            </div>
          </div>
          
          <div className="text-center">
            <button 
              onClick={() => {
                alert(`🚀 Hardticket-Versand freischalten:

💰 Plan-Vergleich:
• Advanced (€99/Monat): DACH-Region (DE, AT, CH)
• Premium (€299/Monat): Europa + USA (6 Länder)
• Enterprise (€599/Monat): Weltweit (alle Länder)

✨ Hardticket-Features:
• 🎫 Professionelle gedruckte Tickets
• 📦 Automatische Versandetiketten
• 📋 Lieferscheine im Ticket-Format
• 🚚 Multi-Carrier-Support (DHL, Post, UPS, etc.)
• 📊 Live-Tracking für Kunden
• 💰 Zusätzliche Umsatzquelle

📈 Umsatz-Potential:
• Ø 15% der Kunden wählen Hardtickets
• +€4.99 pro Hardticket-Bestellung
• Bei 100 Tickets/Monat = +€75 Zusatzumsatz

📞 Upgrade jetzt:
• Online: ticketforge.com/upgrade
• E-Mail: sales@ticketforge.com
• Telefon: +49 30 12345678`);
              }}
              className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors text-lg font-medium"
            >
              🚀 Jetzt upgraden und Hardtickets aktivieren
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HardticketAddonManager;