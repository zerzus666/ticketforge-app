import React, { useState } from 'react';
import { Book, Video, Search, Download, ExternalLink, Play, Clock, Users, Star, ChevronRight, FileText, Lightbulb, Target, Settings, BarChart3 } from 'lucide-react';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Anfänger' | 'Fortgeschritten' | 'Experte';
  category: string;
  videoUrl?: string;
  thumbnailUrl: string;
  steps: TutorialStep[];
  views: number;
  rating: number;
}

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  code?: string;
  tips?: string[];
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  views: number;
}

const HelpCenter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  // Video-Tutorials
  const tutorials: Tutorial[] = [
    {
      id: '1',
      title: 'TicketForge Grundlagen - Erste Schritte',
      description: 'Lernen Sie die Grundlagen von TicketForge kennen und erstellen Sie Ihr erstes Event',
      duration: '8:45',
      difficulty: 'Anfänger',
      category: 'Grundlagen',
      thumbnailUrl: 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg',
      views: 15420,
      rating: 4.8,
      steps: [
        {
          id: '1',
          title: 'Dashboard-Übersicht',
          description: 'Verstehen Sie die wichtigsten Bereiche des TicketForge Dashboards',
          tips: ['Nutzen Sie die Suchfunktion für schnelle Navigation', 'Bookmarken Sie häufig verwendete Bereiche']
        },
        {
          id: '2',
          title: 'Erstes Event erstellen',
          description: 'Schritt-für-Schritt Anleitung zur Event-Erstellung',
          tips: ['Bereiten Sie alle Event-Daten vor dem Start vor', 'Nutzen Sie aussagekräftige Titel für bessere SEO']
        },
        {
          id: '3',
          title: 'Ticket-Kategorien definieren',
          description: 'Verschiedene Ticket-Typen und Preisstrukturen einrichten',
          tips: ['Planen Sie verschiedene Preisstufen für maximalen Umsatz', 'Berücksichtigen Sie Frühbucher-Rabatte']
        }
      ]
    },
    {
      id: '2',
      title: 'Inventory-Management & Automatische Warnungen',
      description: 'Meistern Sie das Inventory-System mit automatischen Low-Stock und Sold-Out Alerts',
      duration: '12:30',
      difficulty: 'Fortgeschritten',
      category: 'Inventory',
      thumbnailUrl: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg',
      views: 8934,
      rating: 4.9,
      steps: [
        {
          id: '1',
          title: 'Automatische Warnungen verstehen',
          description: 'Wie funktionieren SOLD OUT, CRITICAL und LOW STOCK Alerts',
          tips: ['Konfigurieren Sie Warnschwellen nach Ihren Bedürfnissen', 'Nutzen Sie E-Mail-Benachrichtigungen für wichtige Events']
        },
        {
          id: '2',
          title: 'Bundle-Inventory-Impact',
          description: 'Verstehen Sie, wie Ticket-Bundles das Inventory beeinflussen',
          tips: ['Überwachen Sie Bundle-Verfügbarkeit regelmäßig', 'Planen Sie Bundle-Limits konservativ']
        },
        {
          id: '3',
          title: 'Echtzeit-Monitoring',
          description: 'Dashboard-Alerts und Live-Updates nutzen',
          tips: ['Nutzen Sie das Dashboard für schnelle Übersichten', 'Setzen Sie mobile Benachrichtigungen ein']
        }
      ]
    },
    {
      id: '3',
      title: 'Professionelles Ticket-Design',
      description: 'Erstellen Sie beeindruckende Ticket-Designs mit dem Drag & Drop Editor',
      duration: '15:20',
      difficulty: 'Fortgeschritten',
      category: 'Design',
      thumbnailUrl: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg',
      views: 12567,
      rating: 4.7,
      steps: [
        {
          id: '1',
          title: 'Drag & Drop Editor',
          description: 'Nutzen Sie den visuellen Editor für professionelle Designs',
          tips: ['Verwenden Sie Raster für präzise Platzierung', 'Testen Sie verschiedene Druckformate']
        },
        {
          id: '2',
          title: 'QR & UPC Codes',
          description: 'Automatische Code-Generierung und Platzierung',
          tips: ['QR-Codes sollten mindestens 2cm groß sein', 'Testen Sie Codes vor dem Druck']
        },
        {
          id: '3',
          title: 'Druckoptimierung',
          description: 'Optimale Einstellungen für verschiedene Drucker',
          tips: ['Verwenden Sie 300 DPI für professionelle Qualität', 'Testen Sie mit Ihrem Drucker vor Großauflagen']
        }
      ]
    },
    {
      id: '4',
      title: 'Analytics & Berichte meistern',
      description: 'Nutzen Sie erweiterte Analytics für datengetriebene Entscheidungen',
      duration: '10:15',
      difficulty: 'Fortgeschritten',
      category: 'Analytics',
      thumbnailUrl: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg',
      views: 6789,
      rating: 4.6,
      steps: [
        {
          id: '1',
          title: 'Dashboard-Metriken verstehen',
          description: 'Wichtige KPIs und deren Interpretation',
          tips: ['Fokussieren Sie sich auf Conversion-Raten', 'Vergleichen Sie Events ähnlicher Größe']
        },
        {
          id: '2',
          title: 'Export-Funktionen',
          description: 'PDF-Berichte und Excel-Exports erstellen',
          tips: ['Automatisieren Sie wiederkehrende Berichte', 'Nutzen Sie Filter für spezifische Analysen']
        }
      ]
    },
    {
      id: '5',
      title: 'API-Integration für Entwickler',
      description: 'Integrieren Sie TicketForge in Ihre bestehenden Systeme',
      duration: '18:45',
      difficulty: 'Experte',
      category: 'API',
      thumbnailUrl: 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg',
      views: 3456,
      rating: 4.9,
      steps: [
        {
          id: '1',
          title: 'API-Schlüssel generieren',
          description: 'Sichere API-Authentifizierung einrichten',
          code: `const response = await fetch('https://api.ticketforge.de/v1/events', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});`,
          tips: ['Verwenden Sie verschiedene Keys für Dev/Prod', 'Rotieren Sie API-Keys regelmäßig']
        },
        {
          id: '2',
          title: 'Teilnehmer-Export',
          description: 'Automatisierte Datenexporte implementieren',
          tips: ['Nutzen Sie Webhooks für Echtzeit-Updates', 'Implementieren Sie Retry-Logic für API-Calls']
        }
      ]
    }
  ];

  // FAQ-Datenbank
  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'Wie erstelle ich mein erstes Event?',
      answer: `**Schritt-für-Schritt Anleitung:**

1. **📋 Klicken Sie auf "Event erstellen"** im Dashboard
2. **📝 Grunddaten eingeben:**
   • Event-Titel (SEO-optimiert)
   • Beschreibung (mindestens 150 Wörter)
   • Datum und Uhrzeit
   • Kategorie auswählen

3. **🏟️ Venue auswählen:**
   • Aus globaler Datenbank wählen
   • Oder neue Venue erstellen
   • Adresse und Kapazität prüfen

4. **🎫 Ticket-Kategorien definieren:**
   • VIP, Premium, Standard etc.
   • Preise und Kapazitäten festlegen
   • Benefits für jede Kategorie

5. **📸 Event-Bilder hinzufügen** (optional aber empfohlen)
6. **✅ Event veröffentlichen**

**💡 Tipp:** Nutzen Sie den AI Event Assistant für automatische Vorschläge!`,
      category: 'Events',
      helpful: 234,
      views: 1567
    },
    {
      id: '2',
      question: 'Wie funktionieren die automatischen Inventory-Warnungen?',
      answer: `**🚨 Automatische Alert-System:**

**Alert-Stufen:**
• **🔴 AUSVERKAUFT** - 0 Tickets verfügbar (rote Animation)
• **🟠 KRITISCH** - ≤5% verfügbar (orange Animation)  
• **🟡 WENIGE TICKETS** - ≤15% verfügbar (gelbe Warnung)
• **🔵 BEGRENZT** - ≤30% verfügbar (blaue Info)
• **🟢 VERFÜGBAR** - >30% verfügbar (grüner Status)

**Wo erscheinen Alerts:**
• Event-Liste (prominente Badges)
• Dashboard (Alert-Karten)
• Inventory-Manager (Warnungen)
• E-Mail-Benachrichtigungen

**⚙️ Konfiguration:**
• Warnschwellen anpassbar
• E-Mail-Benachrichtigungen ein/aus
• Alert-Frequenz einstellbar

Die Warnungen aktualisieren sich automatisch bei jedem Ticket-Verkauf!`,
      category: 'Inventory',
      helpful: 189,
      views: 892
    },
    {
      id: '3',
      question: 'Kann ich mehrere Events gleichzeitig importieren?',
      answer: `**📥 Ja! Bulk-Import Features:**

**📊 CSV/Excel Import:**
• Template herunterladen
• Bis zu 1000 Events gleichzeitig
• Automatische Validierung
• Fehler-Korrektur-Vorschläge

**🔍 Intelligente Prüfung:**
• Duplikat-Erkennung
• Venue-Matching aus Datenbank
• Automatische Geodaten-Ergänzung

**📋 Import-Prozess:**
1. Template herunterladen
2. Daten in Excel/CSV eingeben
3. Datei hochladen (Drag & Drop)
4. Validierung abwarten
5. Fehler korrigieren
6. Import bestätigen

**💡 Tipp:** Nutzen Sie das Event Import Sheet für Google Sheets-ähnliche Bearbeitung!`,
      category: 'Import',
      helpful: 156,
      views: 678
    },
    {
      id: '4',
      question: 'Welche Zahlungsmethoden werden unterstützt?',
      answer: `**💳 Unterstützte Zahlungsmethoden:**

**Kreditkarten:**
• Visa, Mastercard, American Express
• 3D Secure für erhöhte Sicherheit
• Automatische Fraud-Detection

**Digital Wallets:**
• PayPal (weltweit)
• Apple Pay (iOS)
• Google Pay (Android)
• Shop Pay (Shopify)

**Lokale Methoden:**
• SEPA-Lastschrift (Deutschland/EU)
• Sofortüberweisung (Deutschland)
• iDEAL (Niederlande)
• Bancontact (Belgien)

**Business:**
• Banküberweisung
• Rechnung (Enterprise)
• Purchase Orders

**🔒 Sicherheit:**
• PCI DSS Level 1 zertifiziert
• SSL-Verschlüsselung
• Fraud-Protection inklusive`,
      category: 'Zahlungen',
      helpful: 298,
      views: 1234
    },
    {
      id: '5',
      question: 'Wie kann ich meine Ticket-Designs anpassen?',
      answer: `**🎨 Ticket Designer Features:**

**🖌️ Drag & Drop Editor:**
• Event-Felder einfach platzieren
• Text, Bilder, Formen hinzufügen
• QR/UPC-Codes automatisch generieren

**📏 Druckformate:**
• Standard Ticket (10cm x 5cm)
• Mini Ticket (7.5cm x 3.75cm)  
• Wristband (15cm x 2.5cm)
• Benutzerdefinierte Größen

**🎯 Design-Elemente:**
• Event-Titel, Datum, Uhrzeit
• Venue-Informationen
• Preise und Kategorien
• QR-Codes für Validierung
• Custom Grafiken und Logos

**💡 Profi-Tipps:**
• Verwenden Sie kontrastreiche Farben
• QR-Codes mindestens 2cm groß
• Testen Sie Designs vor dem Druck
• Nutzen Sie Templates als Ausgangspunkt`,
      category: 'Design',
      helpful: 167,
      views: 543
    }
  ];

  // Bedienungsanleitungen
  const guides = [
    {
      id: '1',
      title: '📋 Komplette Bedienungsanleitung',
      description: 'Vollständige Anleitung für alle TicketForge Features',
      icon: Book,
      sections: [
        'Dashboard und Navigation',
        'Event-Management',
        'Venue-Verwaltung', 
        'Ticket-Design',
        'Inventory-System',
        'Berichte und Analytics',
        'API-Integration',
        'Troubleshooting'
      ]
    },
    {
      id: '2',
      title: '🚀 Quick Start Guide',
      description: 'In 10 Minuten zum ersten Event',
      icon: Target,
      sections: [
        'Account-Setup',
        'Erstes Event erstellen',
        'Tickets verkaufen',
        'Erfolg messen'
      ]
    },
    {
      id: '3',
      title: '⚙️ Erweiterte Konfiguration',
      description: 'Profi-Features und Anpassungen',
      icon: Settings,
      sections: [
        'API-Konfiguration',
        'Webhook-Setup',
        'Custom Branding',
        'Multi-User Management'
      ]
    },
    {
      id: '4',
      title: '📊 Analytics Best Practices',
      description: 'Datengetriebene Event-Optimierung',
      icon: BarChart3,
      sections: [
        'KPI-Definition',
        'Report-Automatisierung',
        'Trend-Analyse',
        'ROI-Optimierung'
      ]
    }
  ];

  const categories = ['all', 'Grundlagen', 'Events', 'Inventory', 'Design', 'Analytics', 'API', 'Zahlungen', 'Import'];

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredFAQs = faqItems.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Anfänger': return 'bg-green-100 text-green-800';
      case 'Fortgeschritten': return 'bg-yellow-100 text-yellow-800';
      case 'Experte': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadPDF = (guideId: string) => {
    // Simuliere PDF-Download
    alert(`📄 PDF-Anleitung wird heruntergeladen...
    
Guide: ${guides.find(g => g.id === guideId)?.title}
Format: PDF (ca. 2-5 MB)
Sprache: Deutsch
Offline verfügbar: Ja`);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📚 Hilfe & Support</h1>
          <p className="text-gray-600 mt-1">Umfassende Anleitungen, Video-Tutorials und FAQ für TicketForge</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <ExternalLink className="w-4 h-4" />
            <span>📞 Live-Support</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Hilfe-Themen durchsuchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'Alle Kategorien' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Start Guides */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">📖 Bedienungsanleitungen</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guides.map((guide) => {
            const Icon = guide.icon;
            return (
              <div key={guide.id} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">{guide.title}</h4>
                    <p className="text-gray-600 text-sm mb-4">{guide.description}</p>
                    
                    <div className="space-y-1 mb-4">
                      {guide.sections.map((section, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                          <ChevronRight className="w-3 h-3" />
                          <span>{section}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => downloadPDF(guide.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm"
                      >
                        <Download className="w-4 h-4" />
                        <span>📄 PDF Download</span>
                      </button>
                      <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                        📖 Online lesen
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Tutorials */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">🎥 Video-Tutorials</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map((tutorial) => (
            <div key={tutorial.id} className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors">
              <div className="relative">
                <img 
                  src={tutorial.thumbnailUrl} 
                  alt={tutorial.title}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setSelectedTutorial(tutorial)}
                    className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Play className="w-6 h-6" />
                  </button>
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                  {tutorial.duration}
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                    {tutorial.difficulty}
                  </span>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{tutorial.rating}</span>
                  </div>
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{tutorial.title}</h4>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{tutorial.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{tutorial.views.toLocaleString()} Aufrufe</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{tutorial.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">❓ Häufig gestellte Fragen (FAQ)</h3>
        <div className="space-y-4">
          {filteredFAQs.map((faq) => (
            <div key={faq.id} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                className="w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{faq.question}</h4>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span>👍 {faq.helpful} hilfreich</span>
                    <span>👁️ {faq.views} Aufrufe</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {faq.category}
                    </span>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
                  expandedFAQ === faq.id ? 'rotate-90' : ''
                }`} />
              </button>
              
              {expandedFAQ === faq.id && (
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-line text-gray-700">{faq.answer}</div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">War diese Antwort hilfreich?</div>
                    <div className="flex space-x-2">
                      <button className="bg-emerald-600 text-white px-3 py-1 rounded text-sm hover:bg-emerald-700 transition-colors">
                        👍 Ja
                      </button>
                      <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors">
                        👎 Nein
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-8 border border-blue-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">📞 Weitere Unterstützung benötigt?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">🤖 AI-Chat Support</h4>
            <p className="text-gray-600 text-sm mb-3">24/7 verfügbar für alle Pläne</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
              Chat starten
            </button>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">📧 E-Mail Support</h4>
            <p className="text-gray-600 text-sm mb-3">support@ticketforge.com</p>
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm">
              E-Mail senden
            </button>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
              <Video className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">📹 Screen-Sharing</h4>
            <p className="text-gray-600 text-sm mb-3">Premium/Enterprise</p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm">
              onClick={() => {
                alert(`📹 Screen-Sharing Session buchen:

👥 Verfügbar für:
• Premium Plan Kunden
• Enterprise Plan Kunden

📅 Buchungsoptionen:
• 30 Min Standard-Session
• 60 Min Intensive-Session
• 90 Min Setup-Session

📋 Session-Inhalte:
• Live-Demonstration
• Persönliche Beratung
• Setup-Unterstützung
• Best Practices

📞 Buchung:
• Telefon: +49 30 12345678
• E-Mail: premium-support@ticketforge.com
• Online: ticketforge.com/book-session

⏰ Verfügbare Zeiten:
Mo-Fr 9-17 Uhr (CET)`);
              }}
              Session buchen
            </button>
          </div>
        </div>
      </div>

      {/* Tutorial Detail Modal */}
      {selectedTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedTutorial.title}</h3>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedTutorial.difficulty)}`}>
                    {selectedTutorial.difficulty}
                  </span>
                  <span className="text-sm text-gray-600">⏱️ {selectedTutorial.duration}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">{selectedTutorial.rating}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedTutorial(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Video Placeholder */}
              <div className="bg-gray-900 rounded-lg mb-6 relative overflow-hidden">
                <img 
                  src={selectedTutorial.thumbnailUrl} 
                  alt={selectedTutorial.title}
                  className="w-full h-64 object-cover opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="bg-white text-gray-900 p-4 rounded-full hover:bg-gray-100 transition-colors">
                    <Play className="w-8 h-8" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded">
                  🎥 {selectedTutorial.duration}
                </div>
              </div>

              <p className="text-gray-700 mb-6">{selectedTutorial.description}</p>

              {/* Tutorial Steps */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">📋 Tutorial-Schritte:</h4>
                {selectedTutorial.steps.map((step, index) => (
                  <div key={step.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 mb-2">{step.title}</h5>
                        <p className="text-gray-600 text-sm mb-3">{step.description}</p>
                        
                        {step.code && (
                          <div className="bg-gray-900 text-green-400 rounded-lg p-3 font-mono text-sm mb-3">
                            <pre>{step.code}</pre>
                          </div>
                        )}
                        
                        {step.tips && step.tips.length > 0 && (
                          <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                            <div className="flex items-center space-x-2 mb-2">
                              <Lightbulb className="w-4 h-4 text-yellow-600" />
                              <span className="font-medium text-yellow-800">💡 Profi-Tipps:</span>
                            </div>
                            <ul className="space-y-1">
                              {step.tips.map((tip, tipIndex) => (
                                <li key={tipIndex} className="text-yellow-700 text-sm">• {tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpCenter;