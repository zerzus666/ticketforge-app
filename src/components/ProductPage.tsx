import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users, DollarSign, ShoppingCart, Info, FileText, Shield, CheckCircle, AlertTriangle, Star, Share2, Heart } from 'lucide-react';
import type { Event } from '../types';

interface ProductPageProps {
  event: Event;
  onAddToCart?: (categoryId: string, quantity: number) => void;
}

const ProductPage: React.FC<ProductPageProps> = ({ event, onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [showTerms, setShowTerms] = useState(false);
  const [showCancellationPolicy, setShowCancellationPolicy] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToPrivacy, setAgreeToPrivacy] = useState(false);

  const getTicketAvailability = (category: any) => {
    const available = category.capacity - category.sold - category.reserved;
    const percentage = (available / category.capacity) * 100;
    
    if (available === 0) return { 
      status: 'AUSVERKAUFT', 
      color: 'bg-red-600 text-white', 
      available: 0 
    };
    if (percentage <= 5) return { 
      status: `NUR ${available} ÜBRIG`, 
      color: 'bg-orange-600 text-white animate-pulse', 
      available 
    };
    if (percentage <= 15) return { 
      status: 'WENIGE TICKETS', 
      color: 'bg-yellow-600 text-white', 
      available 
    };
    return { 
      status: 'Verfügbar', 
      color: 'bg-emerald-600 text-white', 
      available 
    };
  };

  const handleAddToCart = () => {
    if (!selectedCategory) {
      alert('Bitte wählen Sie eine Ticket-Kategorie aus');
      return;
    }

    if (!agreeToTerms || !agreeToPrivacy) {
      alert('Bitte stimmen Sie den AGB und der Datenschutzerklärung zu');
      return;
    }

    const category = event.ticketCategories.find(c => c.id === selectedCategory);
    if (!category) return;

    const availability = getTicketAvailability(category);
    if (availability.available < quantity) {
      alert(`Nur noch ${availability.available} Tickets verfügbar`);
      return;
    }

    onAddToCart?.(selectedCategory, quantity);
    alert(`✅ ${quantity}x ${category.name} Ticket(s) zum Warenkorb hinzugefügt!`);
  };

  // Standard AGB Template
  const standardTerms = `
    <h2>Allgemeine Geschäftsbedingungen</h2>
    
    <h3>§1 Geltungsbereich</h3>
    <p>Diese AGB gelten für alle Ticket-Käufe über TicketForge für die Veranstaltung "${event.title}".</p>
    
    <h3>§2 Vertragsschluss</h3>
    <p>Der Kaufvertrag kommt durch Ihre Bestellung und unsere Bestätigung zustande.</p>
    
    <h3>§3 Preise und Zahlung</h3>
    <p>Alle Preise verstehen sich inklusive der gesetzlichen Mehrwertsteuer. Die Zahlung erfolgt über die angebotenen Zahlungsmethoden.</p>
    
    <h3>§4 Einlass und Veranstaltung</h3>
    <p>Das Ticket berechtigt zum einmaligen Einlass zur Veranstaltung am ${new Date(event.date).toLocaleDateString('de-DE')} um ${event.time} Uhr im ${event.venue.name}.</p>
    
    <h3>§5 Stornierung und Rückgabe</h3>
    <p>Tickets können bis 24 Stunden vor Veranstaltungsbeginn kostenfrei storniert werden. Bei späteren Stornierungen wird eine Bearbeitungsgebühr von 10% erhoben.</p>
    
    <h3>§6 Haftung</h3>
    <p>Die Haftung des Veranstalters ist auf Vorsatz und grobe Fahrlässigkeit beschränkt.</p>
  `;

  const cancellationPolicy = `
    <h2>Widerrufsbelehrung</h2>
    
    <h3>Widerrufsrecht</h3>
    <p>Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.</p>
    
    <h3>Widerrufsfrist</h3>
    <p>Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses.</p>
    
    <h3>Folgen des Widerrufs</h3>
    <p>Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen zurückzuzahlen.</p>
    
    <h3>Ausschluss des Widerrufsrechts</h3>
    <p>Das Widerrufsrecht erlischt bei Dienstleistungen, wenn der Unternehmer die Dienstleistung vollständig erbracht hat und mit der Ausführung der Dienstleistung erst begonnen hat, nachdem der Verbraucher dazu seine ausdrückliche Zustimmung gegeben hat.</p>
    
    <h3>Muster-Widerrufsformular</h3>
    <p>Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück an: support@ticketforge.com</p>
  `;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
              <div className="space-y-3 text-blue-100">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(event.date).toLocaleDateString('de-DE', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>{event.time} Uhr</span>
                  {event.doorsOpen && <span>• Einlass: {event.doorsOpen} Uhr</span>}
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>{event.venue.name}, {event.venue.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>{event.totalCapacity.toLocaleString()} Plätze</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mt-6">
                <button className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-2">
                  <Share2 className="w-4 h-4" />
                  <span>Teilen</span>
                </button>
                <button className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors flex items-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span>Merken</span>
                </button>
              </div>
            </div>
            
            {event.images && event.images.length > 0 && (
              <div className="relative">
                <img 
                  src={event.images[0]} 
                  alt={event.title}
                  className="w-full h-80 object-cover rounded-xl shadow-2xl"
                />
                <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                  {event.images.length} Bilder
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Description */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 Event-Beschreibung</h2>
              <div 
                className="prose prose-blue max-w-none"
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
            </div>

            {/* Venue Information */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">🏟️ Veranstaltungsort</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{event.venue.name}</h3>
                  <p className="text-gray-600 mb-4">{event.venue.address}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>Kapazität: {event.venue.capacity.toLocaleString()} Personen</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>Typ: {event.venue.type}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">🎯 Ausstattung</h4>
                  <div className="flex flex-wrap gap-2">
                    {event.venue.amenities.map((amenity, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Documents */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">📄 Rechtliche Hinweise</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">📋 Allgemeine Geschäftsbedingungen</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Wichtige Informationen zu Ihrem Ticket-Kauf, Einlassbedingungen und Stornierungsrichtlinien.
                  </p>
                  <button
                    onClick={() => setShowTerms(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>📖 AGB lesen</span>
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Shield className="w-6 h-6 text-emerald-600" />
                    <h3 className="font-semibold text-gray-900">🔄 Widerrufsbelehrung</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Ihre Rechte bei Online-Käufen und Informationen zum 14-tägigen Widerrufsrecht.
                  </p>
                  <button
                    onClick={() => setShowCancellationPolicy(true)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span>🔄 Widerrufsrecht lesen</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Ticket Selection */}
          <div className="space-y-6">
            {/* Ticket Categories */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">🎫 Tickets auswählen</h2>
              
              <div className="space-y-4 mb-6">
                {event.ticketCategories.map((category) => {
                  const availability = getTicketAvailability(category);
                  
                  return (
                    <div 
                      key={category.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedCategory === category.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${availability.color}`}>
                          {availability.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-2xl font-bold text-gray-900">€{category.price}</div>
                        <div className="text-sm text-gray-600">
                          {availability.available} von {category.capacity} verfügbar
                        </div>
                      </div>

                      {category.benefits && category.benefits.length > 0 && (
                        <div className="space-y-1">
                          {category.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                              <CheckCircle className="w-3 h-3 text-emerald-500" />
                              <span>{benefit}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            availability.available === 0 ? 'bg-red-500' :
                            (availability.available / category.capacity) * 100 <= 15 ? 'bg-yellow-500' :
                            'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.max(5, (availability.available / category.capacity) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quantity Selection */}
              {selectedCategory && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Anzahl Tickets</label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Array.from({ length: Math.min(10, getTicketAvailability(event.ticketCategories.find(c => c.id === selectedCategory)!).available) }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Legal Checkboxes */}
              <div className="space-y-3 mb-6">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                  />
                  <div className="text-sm">
                    <span className="text-gray-700">Ich stimme den </span>
                    <button
                      onClick={() => setShowTerms(true)}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      📋 Allgemeinen Geschäftsbedingungen
                    </button>
                    <span className="text-gray-700"> zu *</span>
                  </div>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={agreeToPrivacy}
                    onChange={(e) => setAgreeToPrivacy(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                  />
                  <div className="text-sm">
                    <span className="text-gray-700">Ich habe die </span>
                    <button
                      onClick={() => setShowCancellationPolicy(true)}
                      className="text-emerald-600 hover:text-emerald-800 underline"
                    >
                      🔄 Widerrufsbelehrung
                    </button>
                    <span className="text-gray-700"> gelesen und verstanden *</span>
                  </div>
                </label>
              </div>

              {/* Total Price */}
              {selectedCategory && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">Gesamtpreis:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      €{(event.ticketCategories.find(c => c.id === selectedCategory)!.price * quantity).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {quantity}x {event.ticketCategories.find(c => c.id === selectedCategory)!.name} à €{event.ticketCategories.find(c => c.id === selectedCategory)!.price}
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!selectedCategory || !agreeToTerms || !agreeToPrivacy || getTicketAvailability(event.ticketCategories.find(c => c.id === selectedCategory)!).available === 0}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 text-lg font-semibold"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>🛒 In den Warenkorb</span>
              </button>

              {(!agreeToTerms || !agreeToPrivacy) && (
                <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-yellow-800 text-sm font-medium">
                      ⚠️ Bitte stimmen Sie den AGB und der Widerrufsbelehrung zu
                    </span>
                  </div>
                </div>
              )}

              {/* Trust Signals */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <Shield className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-gray-900">🔒 Sicher</div>
                    <div className="text-xs text-gray-600">SSL-verschlüsselt</div>
                  </div>
                  <div>
                    <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <div className="text-sm font-medium text-gray-900">⭐ Vertrauenswürdig</div>
                    <div className="text-xs text-gray-600">1000+ Events</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Bundles */}
            {event.ticketBundles && event.ticketBundles.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6">📦 Ticket-Pakete</h2>
                <div className="space-y-4">
                  {event.ticketBundles.map((bundle) => (
                    <div key={bundle.id} className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{bundle.name}</h3>
                        <div className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-sm font-medium">
                          Spare €{(bundle.originalPrice - bundle.bundlePrice).toFixed(2)}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{bundle.description}</p>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-500">
                          <span className="line-through">€{bundle.originalPrice}</span>
                        </div>
                        <div className="text-xl font-bold text-purple-600">
                          €{bundle.bundlePrice}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Event Info Card */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">ℹ️ Event-Informationen</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Kategorie:</span>
                  <span className="font-medium">{event.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Sprache:</span>
                  <span className="font-medium">{event.language || 'Deutsch'}</span>
                </div>
                {event.minAge && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Mindestalter:</span>
                    <span className="font-medium">{event.minAge} Jahre</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Veranstalter:</span>
                  <span className="font-medium">{event.organizer?.name || 'TicketForge'}</span>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            {event.organizer && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">📞 Kontakt</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">Veranstalter:</span>
                    <div className="font-medium">{event.organizer.name}</div>
                    {event.organizer.company && (
                      <div className="text-gray-600">{event.organizer.company}</div>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-600">E-Mail:</span>
                    <div className="font-medium">{event.organizer.email}</div>
                  </div>
                  {event.organizer.phone && (
                    <div>
                      <span className="text-gray-600">Telefon:</span>
                      <div className="font-medium">{event.organizer.phone}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">📋 Allgemeine Geschäftsbedingungen</h3>
              <button
                onClick={() => setShowTerms(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div 
                className="prose prose-blue max-w-none"
                dangerouslySetInnerHTML={{ __html: event.terms || standardTerms }}
              />
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => {
                  setAgreeToTerms(true);
                  setShowTerms(false);
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                ✅ Verstanden und akzeptiert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Policy Modal */}
      {showCancellationPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">🔄 Widerrufsbelehrung</h3>
              <button
                onClick={() => setShowCancellationPolicy(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div 
                className="prose prose-blue max-w-none"
                dangerouslySetInnerHTML={{ __html: cancellationPolicy }}
              />
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => {
                  setAgreeToPrivacy(true);
                  setShowCancellationPolicy(false);
                }}
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                ✅ Verstanden und akzeptiert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;