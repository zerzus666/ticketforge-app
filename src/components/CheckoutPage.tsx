import React, { useState } from 'react';
import { CreditCard, Shield, Lock, CheckCircle, AlertTriangle, X, FileText, ArrowLeft, ShoppingCart } from 'lucide-react';

interface CheckoutItem {
  id: string;
  eventTitle: string;
  categoryName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface CheckoutPageProps {
  items: CheckoutItem[];
  onBack?: () => void;
  onComplete?: (orderData: any) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ items, onBack, onComplete }) => {
  const [customerData, setCustomerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: 'Deutschland'
    }
  });

  const [paymentData, setPaymentData] = useState({
    method: 'credit_card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    cancellation: false,
    marketing: false
  });

  const [showTerms, setShowTerms] = useState(false);
  const [showCancellationPolicy, setShowCancellationPolicy] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = subtotal * 0.19; // 19% MwSt.
  const total = subtotal + tax;

  const standardTerms = `
    <h2>Allgemeine Geschäftsbedingungen - Checkout</h2>
    
    <h3>§1 Vertragsschluss</h3>
    <p>Mit dem Klick auf "Jetzt kaufen" geben Sie eine verbindliche Bestellung ab. Der Kaufvertrag kommt durch unsere Bestätigung per E-Mail zustande.</p>
    
    <h3>§2 Zahlungsbedingungen</h3>
    <p>Die Zahlung erfolgt sofort bei Bestellung über die gewählte Zahlungsmethode. Alle Preise verstehen sich inklusive der gesetzlichen Mehrwertsteuer.</p>
    
    <h3>§3 Ticket-Lieferung</h3>
    <p>Die Tickets werden unmittelbar nach Zahlungseingang per E-Mail als PDF zugestellt. Zusätzlich erhalten Sie QR-Codes für den mobilen Einlass.</p>
    
    <h3>§4 Einlassbedingungen</h3>
    <p>Das Ticket berechtigt zum einmaligen Einlass zur Veranstaltung. Bitte bringen Sie das Ticket ausgedruckt oder auf dem Smartphone mit.</p>
    
    <h3>§5 Stornierung</h3>
    <p>Tickets können bis 24 Stunden vor Veranstaltungsbeginn kostenfrei storniert werden. Bei späteren Stornierungen wird eine Bearbeitungsgebühr von 10% erhoben.</p>
  `;

  const cancellationPolicy = `
    <h2>Widerrufsbelehrung für Online-Käufe</h2>
    
    <h3>Widerrufsrecht</h3>
    <p>Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.</p>
    
    <h3>Widerrufsfrist</h3>
    <p>Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses.</p>
    
    <h3>Ausübung des Widerrufsrechts</h3>
    <p>Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.</p>
    
    <h3>Folgen des Widerrufs</h3>
    <p>Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen unverzüglich und spätestens binnen vierzehn Tagen zurückzuzahlen.</p>
    
    <h3>Besondere Hinweise für Veranstaltungstickets</h3>
    <p>Bei Tickets für Veranstaltungen zu einem bestimmten Zeitpunkt erlischt das Widerrufsrecht, wenn die Veranstaltung bereits stattgefunden hat.</p>
    
    <p><strong>Kontakt für Widerruf:</strong><br/>
    E-Mail: widerruf@ticketforge.com<br/>
    Telefon: +49 30 12345678</p>
  `;

  const handleCompleteOrder = async () => {
    // Validierung
    if (!customerData.firstName || !customerData.lastName || !customerData.email) {
      alert('❌ Bitte füllen Sie alle Pflichtfelder aus');
      return;
    }

    if (!agreements.terms || !agreements.privacy || !agreements.cancellation) {
      alert('❌ Bitte stimmen Sie allen erforderlichen Bedingungen zu');
      return;
    }

    if (paymentData.method === 'credit_card' && (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv)) {
      alert('❌ Bitte geben Sie vollständige Kreditkarten-Daten ein');
      return;
    }

    setIsProcessing(true);

    // Simuliere Zahlungsverarbeitung
    setTimeout(() => {
      const orderData = {
        orderId: `ORD-${Date.now()}`,
        customer: customerData,
        items,
        payment: {
          method: paymentData.method,
          amount: total,
          currency: 'EUR'
        },
        agreements,
        timestamp: new Date().toISOString()
      };

      onComplete?.(orderData);
      setIsProcessing(false);
      
      alert(`✅ Bestellung erfolgreich abgeschlossen!

📧 Bestätigung wird an ${customerData.email} gesendet
🎫 Tickets werden als PDF zugestellt
📱 QR-Codes für mobilen Einlass inklusive
💳 Zahlung über ${paymentData.method === 'credit_card' ? 'Kreditkarte' : paymentData.method} verarbeitet

Bestellnummer: ${orderData.orderId}
Gesamtbetrag: €${total.toFixed(2)}`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Zurück</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">🛒 Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Customer Information */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">👤 Persönliche Daten</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vorname *</label>
                  <input
                    type="text"
                    value={customerData.firstName}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nachname *</label>
                  <input
                    type="text"
                    value={customerData.lastName}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-Mail *</label>
                  <input
                    type="email"
                    value={customerData.email}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                  <input
                    type="tel"
                    value={customerData.phone}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">💳 Zahlungsinformationen</h2>
              
              {/* Payment Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Zahlungsmethode</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={paymentData.method === 'credit_card'}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, method: e.target.value }))}
                      className="text-blue-600 focus:ring-blue-500 mb-2"
                    />
                    <div className="font-medium text-gray-900">💳 Kreditkarte</div>
                    <div className="text-sm text-gray-600">Visa, Mastercard, Amex</div>
                  </label>
                  
                  <label className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentData.method === 'paypal'}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, method: e.target.value }))}
                      className="text-blue-600 focus:ring-blue-500 mb-2"
                    />
                    <div className="font-medium text-gray-900">🅿️ PayPal</div>
                    <div className="text-sm text-gray-600">Sicher mit PayPal</div>
                  </label>
                  
                  <label className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={paymentData.method === 'bank_transfer'}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, method: e.target.value }))}
                      className="text-blue-600 focus:ring-blue-500 mb-2"
                    />
                    <div className="font-medium text-gray-900">🏦 Überweisung</div>
                    <div className="text-sm text-gray-600">SEPA-Überweisung</div>
                  </label>
                </div>
              </div>

              {/* Credit Card Form */}
              {paymentData.method === 'credit_card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Karteninhaber *</label>
                    <input
                      type="text"
                      value={paymentData.cardholderName}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, cardholderName: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Max Mustermann"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kartennummer *</label>
                    <input
                      type="text"
                      value={paymentData.cardNumber}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, cardNumber: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ablaufdatum *</label>
                      <input
                        type="text"
                        value={paymentData.expiryDate}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, expiryDate: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                      <input
                        type="text"
                        value={paymentData.cvv}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, cvv: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Legal Agreements - REQUIRED STEP */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">📋 Rechtliche Bestätigungen</h2>
              
              <div className="space-y-4">
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-800">⚠️ Erforderliche Zustimmungen</span>
                  </div>
                  <p className="text-red-700 text-sm">
                    Alle folgenden Punkte müssen bestätigt werden, um die Bestellung abzuschließen.
                  </p>
                </div>

                <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={agreements.terms}
                    onChange={(e) => setAgreements(prev => ({ ...prev, terms: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                    required
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-1">
                      📋 Allgemeine Geschäftsbedingungen *
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Ich stimme den AGB zu und erkenne sie als verbindlich an.
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowTerms(true)}
                      className="text-blue-600 hover:text-blue-800 underline text-sm"
                    >
                      📖 AGB vollständig lesen
                    </button>
                  </div>
                  {agreements.terms && <CheckCircle className="w-5 h-5 text-emerald-600 mt-1" />}
                </label>

                <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={agreements.cancellation}
                    onChange={(e) => setAgreements(prev => ({ ...prev, cancellation: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                    required
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-1">
                      🔄 Widerrufsbelehrung *
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Ich habe die Widerrufsbelehrung gelesen und verstanden.
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCancellationPolicy(true)}
                      className="text-emerald-600 hover:text-emerald-800 underline text-sm"
                    >
                      🔄 Widerrufsbelehrung vollständig lesen
                    </button>
                  </div>
                  {agreements.cancellation && <CheckCircle className="w-5 h-5 text-emerald-600 mt-1" />}
                </label>

                <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={agreements.privacy}
                    onChange={(e) => setAgreements(prev => ({ ...prev, privacy: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                    required
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-1">
                      🔒 Datenschutzerklärung *
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Ich stimme der Verarbeitung meiner Daten gemäß Datenschutzerklärung zu.
                    </div>
                    <a
                      href="/datenschutz"
                      target="_blank"
                      className="text-blue-600 hover:text-blue-800 underline text-sm"
                    >
                      🔒 Datenschutzerklärung lesen
                    </a>
                  </div>
                  {agreements.privacy && <CheckCircle className="w-5 h-5 text-emerald-600 mt-1" />}
                </label>

                <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={agreements.marketing}
                    onChange={(e) => setAgreements(prev => ({ ...prev, marketing: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-1">
                      📧 Marketing-E-Mails (Optional)
                    </div>
                    <div className="text-sm text-gray-600">
                      Ich möchte über neue Events und Angebote informiert werden.
                    </div>
                  </div>
                  {agreements.marketing && <CheckCircle className="w-5 h-5 text-emerald-600 mt-1" />}
                </label>
              </div>

              {/* Agreement Status */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">📋 Bestätigungsstatus:</span>
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center space-x-1 ${agreements.terms ? 'text-emerald-600' : 'text-red-600'}`}>
                      {agreements.terms ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                      <span className="text-sm">AGB</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${agreements.cancellation ? 'text-emerald-600' : 'text-red-600'}`}>
                      {agreements.cancellation ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                      <span className="text-sm">Widerruf</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${agreements.privacy ? 'text-emerald-600' : 'text-red-600'}`}>
                      {agreements.privacy ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                      <span className="text-sm">Datenschutz</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">📊 Bestellübersicht</h2>
              
              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{item.categoryName}</div>
                      <div className="text-sm text-gray-600">{item.eventTitle}</div>
                      <div className="text-sm text-gray-600">{item.quantity}x €{item.unitPrice}</div>
                    </div>
                    <div className="font-bold text-gray-900">€{item.totalPrice.toFixed(2)}</div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Zwischensumme:</span>
                  <span className="font-medium">€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">MwSt. (19%):</span>
                  <span className="font-medium">€{tax.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-lg font-bold border-t border-gray-200 pt-2">
                  <span>Gesamtbetrag:</span>
                  <span className="text-blue-600">€{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Complete Order Button */}
              <button
                onClick={handleCompleteOrder}
                disabled={!agreements.terms || !agreements.privacy || !agreements.cancellation || isProcessing}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 text-lg font-semibold mt-6"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Verarbeitung...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>🔒 Jetzt sicher kaufen</span>
                  </>
                )}
              </button>

              {/* Security Info */}
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-green-800 text-sm font-medium">🔒 Sichere Zahlung</span>
                </div>
                <div className="text-green-700 text-xs mt-1">
                  SSL-verschlüsselt • PCI DSS zertifiziert • 256-Bit Verschlüsselung
                </div>
              </div>
            </div>
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
                dangerouslySetInnerHTML={{ __html: standardTerms }}
              />
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => setShowTerms(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Schließen
              </button>
              <button
                onClick={() => {
                  setAgreements(prev => ({ ...prev, terms: true }));
                  setShowTerms(false);
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                ✅ Akzeptieren und schließen
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
            
            <div className="p-6 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => setShowCancellationPolicy(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Schließen
              </button>
              <button
                onClick={() => {
                  setAgreements(prev => ({ ...prev, cancellation: true }));
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

export default CheckoutPage;