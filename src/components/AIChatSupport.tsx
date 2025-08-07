import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, X, HelpCircle, Book, Video, Search, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: string;
  isTyping?: boolean;
}

interface AIChatSupportProps {
  userSubscription: 'basic' | 'advanced' | 'premium' | 'enterprise';
  userName?: string;
  userEmail?: string;
}

const AIChatSupport: React.FC<AIChatSupportProps> = ({
  userSubscription = 'basic',
  userName = 'Benutzer',
  userEmail
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [blockedAttempts, setBlockedAttempts] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sicherheits-Keywords für Finanz-Transaktionen
  const financialKeywords = [
    'zahlung', 'payment', 'bezahlen', 'pay', 'kreditkarte', 'credit card', 'paypal',
    'rechnung', 'invoice', 'billing', 'abrechnung', 'geld', 'money', 'euro', 'dollar',
    'überweisung', 'transfer', 'bank', 'iban', 'konto', 'account', 'subscription',
    'abo', 'kündigen', 'cancel', 'refund', 'erstattung', 'rückerstattung',
    'upgrade', 'downgrade', 'plan', 'tarif', 'kosten', 'cost', 'preis', 'price'
  ];

  // Vordefinierte Antworten für häufige Fragen
  const predefinedResponses = {
    greeting: `👋 Hallo ${userName}! Ich bin der TicketForge AI-Support-Assistent. 

Ich helfe Ihnen gerne bei:
• 📋 Bedienung der App
• 🎫 Event-Erstellung
• 🏟️ Venue-Management  
• 📊 Berichte und Analytics
• 🔧 Technische Fragen

⚠️ **Wichtiger Hinweis:** Aus Sicherheitsgründen kann ich keine Finanz-Transaktionen, Zahlungen oder Abo-Änderungen durchführen. Für Billing-Fragen wenden Sie sich bitte an: billing@ticketforge.com

Wie kann ich Ihnen heute helfen?`,

    eventCreation: `🎫 **Event erstellen - Schritt für Schritt:**

1. **📋 Grunddaten eingeben:**
   • Event-Titel und Beschreibung
   • Datum und Uhrzeit
   • Kategorie auswählen

2. **🏟️ Venue auswählen:**
   • Aus Datenbank wählen oder neue Venue erstellen
   • Adresse und Kapazität prüfen

3. **🎟️ Ticket-Kategorien definieren:**
   • Namen, Preise und Kapazitäten festlegen
   • VIP, Standard, Student-Tickets etc.

4. **📸 Bilder hinzufügen:**
   • Event-Bilder für bessere Vermarktung
   • Empfohlen: 3-5 hochwertige Bilder

5. **✅ Event veröffentlichen:**
   • Vorschau prüfen
   • Event aktivieren

💡 **Tipp:** Nutzen Sie den AI Event Assistant für automatische Vorschläge!`,

    inventory: `📊 **Inventory Management:**

**🚨 Automatische Warnungen:**
• **AUSVERKAUFT** - Rote Badges mit Animation
• **KRITISCH** - Orange Warnung bei ≤5% verfügbar
• **WENIGE TICKETS** - Gelbe Warnung bei ≤15%

**📈 Echtzeit-Tracking:**
• Verkaufte Tickets werden sofort aktualisiert
• Reservierte Tickets werden berücksichtigt
• Bundle-Auswirkungen automatisch berechnet

**⚙️ Einstellungen:**
• Low-Stock Schwellenwerte anpassbar
• Automatische E-Mail-Benachrichtigungen
• Dashboard-Alerts konfigurierbar

Möchten Sie wissen, wie Sie die Warnschwellen anpassen können?`,

    venues: `🏟️ **Venue Management:**

**🌍 Globale Venue-Datenbank:**
• 50.000+ Venues weltweit
• Automatische Adress-Parsing
• Geografische Kategorisierung

**📍 Location Intelligence:**
• Stadt, Bundesland, Region, County
• SEO-optimierte Standort-Keywords
• Zeitzone-Erkennung

**📥 Bulk-Import:**
• CSV/Excel-Upload
• Template-Download verfügbar
• Automatische Validierung

**🔍 Smart Search:**
• Venue-Vorschläge basierend auf Event-Kontext
• Kapazitäts-Matching
• Typ-basierte Empfehlungen

Benötigen Sie Hilfe beim Venue-Import?`,

    analytics: `📊 **Berichte & Analytics:**

**📈 Verfügbare Berichte:**
• Umsatz-Entwicklung
• Ticket-Verkäufe
• Event-Performance
• Kunden-Segmentierung

**📤 Export-Optionen:**
• PDF-Berichte mit Grafiken
• Excel-Export für weitere Analysen
• CSV-Daten für externe Tools

**🔄 Automatische Berichte:**
• Tägliche/wöchentliche E-Mail-Reports
• Anpassbare Metriken
• Mehrere Empfänger möglich

**📊 Dashboard-Widgets:**
• Echtzeit-Statistiken
• Trend-Analysen
• Alert-Übersicht

Welche Berichte interessieren Sie am meisten?`,

    api: `🔌 **API & Integrationen:**

**📡 REST API Features:**
• Teilnehmer-Export mit EAN-Codes
• Vorverkaufszahlen abrufen
• Event-Daten synchronisieren
• Analytics-Daten exportieren

**🔐 Sicherheit:**
• API-Schlüssel-Verwaltung
• Rate Limiting (1000/Stunde)
• HTTPS-only Verbindungen

**📋 Unterstützte Formate:**
• JSON (Standard)
• CSV für Excel
• XML für Legacy-Systeme

**📚 Dokumentation:**
• Vollständige API-Docs
• Code-Beispiele (JS, Python)
• Postman-Collection

Benötigen Sie Hilfe bei der API-Integration?`,

    billing_blocked: `🚫 **Finanz-Anfragen nicht möglich**

Aus Sicherheitsgründen kann ich keine Hilfe bei folgenden Themen bieten:
• 💳 Zahlungen und Abrechnungen
• 📋 Abo-Verwaltung
• 💰 Preisänderungen
• 🔄 Plan-Upgrades/Downgrades

**📞 Für Billing-Fragen kontaktieren Sie:**
• **E-Mail:** billing@ticketforge.com
• **Telefon:** +49 30 12345678 (Mo-Fr 9-17 Uhr)
• **Live-Chat:** Premium/Enterprise Kunden

Kann ich Ihnen bei anderen Themen helfen?`
  };

  useEffect(() => {
    if (messages.length === 0) {
      // Begrüßungsnachricht
      setMessages([{
        id: '1',
        type: 'ai',
        content: predefinedResponses.greeting,
        timestamp: new Date().toISOString()
      }]);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Sicherheitsprüfung für Finanz-Keywords
  const containsFinancialKeywords = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    return financialKeywords.some(keyword => lowerMessage.includes(keyword));
  };

  // AI-Antwort generieren
  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Sicherheitsprüfung
    if (containsFinancialKeywords(userMessage)) {
      setBlockedAttempts(prev => [...prev, userMessage]);
      return predefinedResponses.billing_blocked;
    }

    // Pattern-basierte Antworten
    if (lowerMessage.includes('event') && (lowerMessage.includes('erstellen') || lowerMessage.includes('create'))) {
      return predefinedResponses.eventCreation;
    }

    if (lowerMessage.includes('inventory') || lowerMessage.includes('lager') || lowerMessage.includes('bestand')) {
      return predefinedResponses.inventory;
    }

    if (lowerMessage.includes('venue') || lowerMessage.includes('veranstaltungsort')) {
      return predefinedResponses.venues;
    }

    if (lowerMessage.includes('bericht') || lowerMessage.includes('analytics') || lowerMessage.includes('report')) {
      return predefinedResponses.analytics;
    }

    if (lowerMessage.includes('api') || lowerMessage.includes('integration')) {
      return predefinedResponses.api;
    }

    if (lowerMessage.includes('ticket') && lowerMessage.includes('design')) {
      return `🎨 **Ticket Designer:**

**🖌️ Drag & Drop Editor:**
• Event-Felder einfach platzieren
• Text, Bilder, QR-Codes hinzufügen
• Verschiedene Druckformate

**📏 Formate:**
• Standard Ticket (10cm x 5cm)
• Mini Ticket (7.5cm x 3.75cm)
• Wristband (15cm x 2.5cm)
• Benutzerdefiniert

**🎯 Features:**
• QR-Code automatisch generiert
• UPC/EAN-Codes inklusive
• Professionelle Templates
• Live-Vorschau

Möchten Sie wissen, wie Sie ein Custom-Design erstellen?`;
    }

    if (lowerMessage.includes('bundle') || lowerMessage.includes('paket')) {
      return `📦 **Ticket-Bundles:**

**💰 Rabatt-Pakete erstellen:**
• Mehrere Ticket-Kategorien kombinieren
• Prozentuale oder feste Rabatte
• Automatische Preisberechnung

**📊 Inventory-Impact:**
• Automatische Verfügbarkeits-Prüfung
• Bundle-Limits basierend auf Einzeltickets
• Echtzeit-Aktualisierung

**⚙️ Konfiguration:**
• Gültigkeitszeitraum festlegen
• Maximale Bundle-Anzahl
• Beschreibung und Benefits

Soll ich Ihnen zeigen, wie Sie Ihr erstes Bundle erstellen?`;
    }

    if (lowerMessage.includes('import') || lowerMessage.includes('csv') || lowerMessage.includes('bulk')) {
      return `📥 **Bulk Import:**

**📊 CSV/Excel Import:**
• Template herunterladen
• Drag & Drop Upload
• Automatische Validierung

**✅ Unterstützte Daten:**
• Events mit allen Details
• Venues mit Geodaten
• Teilnehmer-Listen

**🔍 Intelligente Prüfung:**
• Duplikat-Erkennung
• Venue-Matching aus Datenbank
• Fehler-Korrektur-Vorschläge

**📋 Import-Formate:**
• CSV (empfohlen)
• Excel (.xlsx)
• Google Sheets Export

Benötigen Sie das Import-Template?`;
    }

    if (lowerMessage.includes('hilfe') || lowerMessage.includes('help') || lowerMessage.includes('anleitung')) {
      return `📚 **Hilfe & Anleitungen:**

**📖 Verfügbare Ressourcen:**
• Schritt-für-Schritt Anleitungen
• Video-Tutorials
• FAQ-Bereich
• Best Practices

**🎥 Video-Tutorials:**
• Event-Erstellung (5 Min)
• Ticket-Design (8 Min)
• Inventory-Management (6 Min)
• Analytics-Berichte (7 Min)

**📞 Support-Kanäle:**
• AI-Chat (24/7)
• E-Mail: support@ticketforge.com
• Telefon: Premium/Enterprise Kunden
• Live-Chat: Enterprise Kunden

Welches Thema interessiert Sie am meisten?`;
    }

    // Fallback-Antwort
    return `🤖 Vielen Dank für Ihre Frage! 

Ich verstehe, dass Sie Hilfe benötigen. Hier sind einige Bereiche, bei denen ich Ihnen helfen kann:

**📋 Häufige Themen:**
• 🎫 Event-Erstellung und -Verwaltung
• 🏟️ Venue-Management
• 📊 Inventory und Warnungen
• 🎨 Ticket-Design
• 📈 Berichte und Analytics
• 📥 Bulk-Import von Daten
• 🔌 API-Integration

**📚 Weitere Hilfe:**
• Geben Sie "Hilfe" ein für alle Anleitungen
• Besuchen Sie unsere Dokumentation
• Schauen Sie sich die Video-Tutorials an

Können Sie Ihre Frage spezifischer stellen? Zum Beispiel: "Wie erstelle ich ein Event?" oder "Wie funktioniert das Inventory-System?"`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simuliere AI-Antwortzeit
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(userMessage.content),
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      type: 'ai',
      content: predefinedResponses.greeting,
      timestamp: new Date().toISOString()
    }]);
    setBlockedAttempts([]);
  };

  const quickActions = [
    { label: '🎫 Event erstellen', query: 'Wie erstelle ich ein neues Event?' },
    { label: '📊 Inventory-Warnungen', query: 'Wie funktionieren die Inventory-Warnungen?' },
    { label: '🏟️ Venue hinzufügen', query: 'Wie füge ich eine neue Venue hinzu?' },
    { label: '📈 Berichte exportieren', query: 'Wie exportiere ich Berichte?' },
    { label: '🎨 Ticket designen', query: 'Wie erstelle ich ein Ticket-Design?' },
    { label: '📥 Bulk Import', query: 'Wie funktioniert der Bulk Import?' }
  ];

  const getSupportLevel = () => {
    switch (userSubscription) {
      case 'basic':
        return { level: 'AI-Chat', color: 'bg-blue-100 text-blue-800', response: '24h' };
      case 'advanced':
        return { level: 'Priority AI + E-Mail', color: 'bg-emerald-100 text-emerald-800', response: '12h' };
      case 'premium':
        return { level: 'Phone + Chat', color: 'bg-purple-100 text-purple-800', response: '4h' };
      case 'enterprise':
        return { level: 'Dedicated Support', color: 'bg-orange-100 text-orange-800', response: '1h' };
      default:
        return { level: 'AI-Chat', color: 'bg-gray-100 text-gray-800', response: '24h' };
    }
  };

  const supportLevel = getSupportLevel();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110 z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold">🤖 TicketForge AI-Support</h3>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${supportLevel.color} text-gray-800`}>
                  {supportLevel.level}
                </span>
                <span className="text-blue-100 text-xs">⚡ {supportLevel.response} Response</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Security Notice */}
      <div className="p-3 bg-yellow-50 border-b border-yellow-200">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-yellow-600" />
          <span className="text-yellow-800 text-xs font-medium">
            🔒 Sicherheitshinweis: Keine Finanz-Transaktionen über Chat möglich
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 ${
              message.type === 'user' 
                ? 'bg-blue-600 text-white' 
                : message.type === 'system'
                ? 'bg-red-50 text-red-800 border border-red-200'
                : 'bg-gray-100 text-gray-800'
            }`}>
              <div className="flex items-start space-x-2">
                {message.type === 'ai' && <Bot className="w-4 h-4 mt-1 text-blue-600" />}
                {message.type === 'user' && <User className="w-4 h-4 mt-1" />}
                {message.type === 'system' && <AlertTriangle className="w-4 h-4 mt-1 text-red-600" />}
                <div className="flex-1">
                  <div className="text-sm whitespace-pre-line">{message.content}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString('de-DE')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-lg p-3 max-w-[80%]">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-blue-600" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600 mb-2">💡 Schnelle Hilfe:</div>
        <div className="flex flex-wrap gap-1">
          {quickActions.slice(0, 3).map((action, index) => (
            <button
              key={index}
              onClick={() => {
                setInputMessage(action.query);
                setTimeout(() => handleSendMessage(), 100);
              }}
              className="text-xs bg-white border border-gray-200 rounded-full px-2 py-1 hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Frage eingeben... (keine Finanz-Themen)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <button
            onClick={clearChat}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            🗑️ Chat löschen
          </button>
          <div className="text-xs text-gray-500">
            🔒 Finanz-Anfragen: {blockedAttempts.length} blockiert
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatSupport;