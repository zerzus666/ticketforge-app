# 📋 LASTENHEFT: TicketForge - Shopify Event Ticketing App

**Projekt:** Event Ticketing Pro - Professionelles Event-Management für Shopify  
**Version:** 1.0  
**Datum:** Januar 2025  
**Auftraggeber:** TicketForge GmbH  
**Ziel:** Shopify App Store Veröffentlichung  

---

## 📖 Inhaltsverzeichnis

1. [Projektübersicht](#1-projektübersicht)
2. [Funktionale Anforderungen](#2-funktionale-anforderungen)
3. [Technische Anforderungen](#3-technische-anforderungen)
4. [UI/UX Spezifikationen](#4-uiux-spezifikationen)
5. [Shopify-Integration](#5-shopify-integration)
6. [Datenmodell](#6-datenmodell)
7. [API-Spezifikationen](#7-api-spezifikationen)
8. [Deployment & Hosting](#8-deployment--hosting)
9. [Testing & QA](#9-testing--qa)
10. [Monetarisierung](#10-monetarisierung)
11. [Zeitplan & Meilensteine](#11-zeitplan--meilensteine)

---

## 1. Projektübersicht

### 1.1 Projektziel
Entwicklung einer vollständigen Event-Ticketing-Lösung als Shopify-App, die es Shopify-Store-Betreibern ermöglicht, Events zu erstellen, Tickets zu verkaufen und physische Hardtickets zu versenden.

### 1.2 Zielgruppe
- **Primär:** Event-Veranstalter mit Shopify-Stores
- **Sekundär:** Konzert-Promoter, Konferenz-Organisatoren, Theater-Betreiber
- **Tertiär:** Event-Agenturen und Ticket-Wiederverkäufer

### 1.3 Alleinstellungsmerkmale (USP)
1. **📦 Einzige Shopify-App** mit echtem Hardticket-Versand
2. **🗺️ Geografische Event-Sortierung** für lokale Suche
3. **🚨 Automatische Inventory-Alerts** mit visuellen Animationen
4. **🤖 AI-gestützte Event-Erstellung** mit Pattern Recognition
5. **🌍 Multi-Market-Versand** mit lokalen Carriern

### 1.4 Erfolgs-Metriken
- **📈 500+ Installationen** in ersten 3 Monaten
- **⭐ 4.5+ Sterne** Durchschnittsbewertung
- **💰 €25,000+ Umsatz** durch Transaktionsgebühren
- **🏆 Top 10** in "Sales & Conversion" Kategorie

---

## 2. Funktionale Anforderungen

### 2.1 Event-Management

#### 2.1.1 Event-Erstellung
**Beschreibung:** Benutzer können Events mit allen relevanten Details erstellen.

**Eingabefelder:**
- **📋 Event-Titel** (Pflichtfeld, max. 100 Zeichen)
- **📝 Beschreibung** (WYSIWYG-Editor, min. 150 Wörter für SEO)
- **📅 Datum** (Datepicker, nicht in Vergangenheit)
- **⏰ Uhrzeit** (Timepicker, Format: HH:MM)
- **🚪 Einlass-Zeit** (optional)
- **🏁 End-Zeit** (optional)
- **🏟️ Venue-Auswahl** (aus Datenbank oder neu erstellen)
- **👤 Veranstalter-Informationen** (Name, E-Mail, Telefon)
- **🎭 Event-Kategorie** (Musik, Business, Sport, Kultur, Comedy, Theater)
- **🖼️ Event-Bilder** (min. 1, max. 5, JPG/PNG, max. 5MB)
- **🏷️ Tags** (für bessere Auffindbarkeit)
- **🔞 Mindestalter** (optional)
- **🌐 Sprache** (Deutsch, Englisch, etc.)

**Validierung:**
- Titel darf nicht leer sein
- Datum muss in der Zukunft liegen
- Mindestens eine Ticket-Kategorie erforderlich
- Venue-Name und Adresse erforderlich
- E-Mail-Format validieren

**Ausgabe:**
- Event wird in PostgreSQL-Datenbank gespeichert
- Automatische Shopify-Produkt-Erstellung
- SEO-optimierte URLs generieren
- Geografische Daten parsen und speichern

#### 2.1.2 Ticket-Kategorien
**Beschreibung:** Jedes Event kann mehrere Ticket-Kategorien haben.

**Kategorie-Felder:**
- **📛 Name** (z.B. "VIP", "General Admission", "Student")
- **📝 Beschreibung** (optional, max. 500 Zeichen)
- **💰 Preis** (Dezimalzahl, min. 0.01)
- **👥 Kapazität** (Ganzzahl, min. 1)
- **🎨 Farbe** (Hex-Code für UI-Darstellung)
- **✨ Vorteile** (Array von Strings, z.B. "Meet & Greet", "VIP Lounge")
- **🪑 Sitzplatz-Informationen** (Sektion, Reihe, Platz - optional)

**Geschäftslogik:**
- Mindestens eine Kategorie pro Event
- Gesamtkapazität = Summe aller Kategorien
- Preise müssen aufsteigend sortierbar sein
- Automatische Shopify-Varianten-Erstellung

#### 2.1.3 Event-Status-Management
**Status-Optionen:**
- **📝 DRAFT** - Event in Bearbeitung
- **✅ PUBLISHED** - Event öffentlich verfügbar
- **🔴 SOLD_OUT** - Alle Tickets verkauft
- **❌ CANCELLED** - Event abgesagt
- **✅ COMPLETED** - Event erfolgreich durchgeführt

**Automatische Status-Änderungen:**
- PUBLISHED → SOLD_OUT (wenn alle Tickets verkauft)
- PUBLISHED → COMPLETED (nach Event-Datum)

### 2.2 Inventory-Management mit Alerts

#### 2.2.1 Automatische Warnungen
**Beschreibung:** System überwacht kontinuierlich Ticket-Verfügbarkeit und zeigt prominente Warnungen.

**Alert-Stufen:**
1. **🔴 SOLD OUT** (0 Tickets verfügbar)
   - Rote Badges mit Pulsing-Animation
   - Prominente Platzierung in Event-Liste
   - Automatische E-Mail-Benachrichtigung
   - Shopify-Produkt als "Ausverkauft" markieren

2. **🟠 CRITICAL** (≤5% verfügbar)
   - Orange Badges mit Pulsing-Animation
   - "NUR X ÜBRIG" Text
   - Sofortige E-Mail-Warnung
   - Dashboard-Alert-Karte

3. **🟡 LOW STOCK** (≤15% verfügbar)
   - Gelbe Warnungs-Badges
   - "WENIGE TICKETS" Text
   - Tägliche E-Mail-Zusammenfassung

4. **🔵 MEDIUM** (≤30% verfügbar)
   - Blaue Info-Badges
   - Keine E-Mail-Benachrichtigung

5. **🟢 AVAILABLE** (>30% verfügbar)
   - Grüne Status-Anzeige
   - Keine besonderen Warnungen

**Technische Implementierung:**
```typescript
interface InventoryAlert {
  id: string;
  eventId: string;
  categoryId: string;
  alertType: 'sold_out' | 'critical' | 'low_stock';
  availableTickets: number;
  totalCapacity: number;
  percentage: number;
  timestamp: string;
  emailSent: boolean;
}

function calculateInventoryStatus(category: TicketCategory): InventoryStatus {
  const available = category.capacity - category.sold - category.reserved;
  const percentage = (available / category.capacity) * 100;
  
  if (available === 0) return 'sold_out';
  if (percentage <= 5) return 'critical';
  if (percentage <= 15) return 'low_stock';
  if (percentage <= 30) return 'medium';
  return 'available';
}
```

#### 2.2.2 Echtzeit-Updates
**Beschreibung:** Inventory-Status wird bei jedem Ticket-Verkauf sofort aktualisiert.

**Update-Trigger:**
- Shopify-Webhook "orders/paid"
- Manuelle Inventory-Anpassungen
- Bundle-Verkäufe (mehrere Kategorien betroffen)
- Stornierungen und Rückerstattungen

**UI-Updates:**
- Dashboard-Badges sofort aktualisieren
- Progress-Bars neu berechnen
- Alert-Karten ein/ausblenden
- E-Mail-Benachrichtigungen versenden

### 2.3 Hardticket-Versand-System

#### 2.3.1 Hardticket-Addon
**Beschreibung:** Kostenpflichtiges Addon für physische Ticket-Sendungen.

**Addon-Konfiguration:**
- **💰 Preis:** €4.99 pro Bestellung (konfigurierbar)
- **🌍 Verfügbare Länder:** Abhängig von Subscription-Plan
- **📦 Max. Tickets:** 10 pro Hardticket-Bestellung
- **⏰ Lieferzeit:** 3-5 Werktage (je nach Carrier)
- **🚚 Versandarten:** Standard, Express, Einschreiben

**Shopify-Integration:**
- Automatische Produkt-Erstellung als "Hardticket-Versand"
- Shopify-Variante mit konfigurierbarem Preis
- Metafields für Addon-Konfiguration
- Inventory-Management über Shopify

#### 2.3.2 Multi-Carrier-Versand
**Unterstützte Carrier nach Markt:**

**🇩🇪 Deutschland:**
- DHL Paket (2-3 Werktage, €4.99)
- DHL Express (1-2 Werktage, €9.99)
- Deutsche Post Brief (3-5 Werktage, €1.85)
- Deutsche Post Einschreiben (2-3 Werktage, €2.65)

**🇺🇸 USA:**
- USPS First-Class (3-5 days, $3.50)
- USPS Priority (1-3 days, $8.95)
- UPS Ground (1-5 days, $12.50)
- UPS Next Day Air (1 day, $45.00)

**🇬🇧 UK:**
- Royal Mail First Class (1-2 days, £2.20)
- Royal Mail Tracked 24 (1 day, £4.20)
- DPD Next Day (1 day, £8.50)

**🇫🇷 Frankreich:**
- La Poste Colissimo (2-3 jours, €6.90)
- Chronopost (1 jour, €15.50)

#### 2.3.3 Versand-Workflow
**Schritt 1: Bestellung**
- Kunde wählt Hardticket-Option im Checkout
- Lieferadresse wird erfasst und validiert
- Versandkosten automatisch berechnet
- Bestellung in Versand-Queue eingereiht

**Schritt 2: Druck-Vorbereitung**
- Hardtickets im professionellen Design generieren
- QR-Codes für Einlass-Validierung
- UPC-Codes für Inventory-Tracking
- Event-Details und Teilnehmer-Informationen

**Schritt 3: Versand-Abwicklung**
- Automatische Versandetikett-Generierung
- Tracking-Nummer von Carrier abrufen
- Lieferschein im Hardticket-Format erstellen
- Drucker-Integration für Bulk-Druck

**Schritt 4: Tracking & Benachrichtigung**
- Tracking-Nummer an Kunden senden
- Live-Tracking-Updates über Carrier-APIs
- Zustellungs-Benachrichtigung
- Feedback-Anfrage nach Zustellung

#### 2.3.4 Druck-System
**Drucker-Integration:**
- **🖨️ Netzwerk-Drucker** (HP, Brother, Canon)
- **📄 Papierformate** (A4, Letter, Legal)
- **🎯 Druckqualität** (Normal, Hoch, Foto)
- **📋 Bulk-Druck** für mehrere Bestellungen

**Druck-Layouts:**
- **🎫 Hardtickets:** 4 pro Seite (A4)
- **📋 Versandetiketten:** 1 pro Seite
- **📄 Lieferscheine:** 1 pro Seite (Hardticket-Format)

### 2.4 Geografische Features

#### 2.4.1 Location Intelligence
**Beschreibung:** Automatische Extraktion und Anreicherung geografischer Daten.

**Adress-Parsing:**
```typescript
interface ParsedLocation {
  street?: string;
  city: string;
  state: string;
  zipCode?: string;
  county?: string;
  country: string;
  region?: string;
  timezone?: string;
}

// Beispiel: "Madison Square Garden, 4 Pennsylvania Plaza, New York, NY 10001"
// Ergebnis:
{
  street: "4 Pennsylvania Plaza",
  city: "New York",
  state: "NY", 
  zipCode: "10001",
  county: "New York County",
  country: "United States",
  region: "Northeast",
  timezone: "America/New_York"
}
```

**SEO-Location-Generierung:**
```typescript
interface SEOLocation {
  primaryLocation: string;      // "New York, NY"
  secondaryLocation: string;    // "New York County, NY"
  locationKeywords: string[];   // ["new york events", "nyc concerts", ...]
  nearbyLandmarks?: string[];   // ["Times Square", "Central Park", ...]
}
```

#### 2.4.2 Event-Sortierung
**Sortier-Optionen:**
- **🏙️ Nach Stadt** - Alphabetisch sortiert
- **🏛️ Nach Bundesland/State** - Regional gruppiert
- **🌎 Nach Region** - Großräumige Kategorisierung
- **📮 Nach PLZ** - Lokale Nähe-Suche
- **🏞️ Nach County** - US-spezifische Sortierung

**UI-Implementation:**
```typescript
// Event-Liste mit geografischer Sortierung
<div className="event-list">
  <div className="sort-controls">
    <select onChange={handleSortChange}>
      <option value="city">Nach Stadt</option>
      <option value="state">Nach Bundesland</option>
      <option value="region">Nach Region</option>
      <option value="zipCode">Nach PLZ</option>
    </select>
  </div>
  
  {sortedEvents.map(event => (
    <EventCard 
      key={event.id}
      event={event}
      showLocation={true}
      locationFormat="primary" // "New York, NY"
    />
  ))}
</div>
```

### 2.5 AI Event Assistant

#### 2.5.1 Artist Information Scraper
**Beschreibung:** Automatische Extraktion von Künstler-Informationen aus öffentlichen Quellen.

**Datenquellen:**
- **🎵 Spotify API** - Monatliche Hörer, Top-Songs, Alben
- **📖 Wikipedia** - Biografie, Diskografie, Awards
- **📱 Social Media APIs** - Follower-Zahlen, Engagement
- **🎼 Music Databases** - AllMusic, Discogs, Last.fm
- **🔍 SEO Tools** - Keyword-Vorschläge, Suchvolumen

**Generierte Inhalte:**
```typescript
interface ArtistInfo {
  name: string;
  genre: string[];
  biography: string;
  imageUrl: string;
  socialMedia: {
    spotify: string;
    instagram: string;
    twitter: string;
    facebook: string;
    youtube: string;
  };
  popularSongs: string[];
  albums: string[];
  awards: string[];
  fanBase: {
    monthlyListeners: number;
    followers: number;
    demographics: {
      ageGroups: Array<{range: string; percentage: number}>;
      topCountries: string[];
    };
  };
  seoKeywords: string[];
  relatedArtists: string[];
}
```

**SEO-Content-Generierung:**
```typescript
interface GeneratedSEOContent {
  productTitle: string;        // "Taylor Swift Eras Tour 2024 - Official Tickets"
  metaDescription: string;     // 155 Zeichen optimiert
  productDescription: string; // 500+ Wörter mit Keywords
  keywords: string[];         // SEO-optimierte Keywords
  hashtags: string[];         // Social Media Hashtags
  structuredData: object;     // JSON-LD für Rich Snippets
}
```

#### 2.5.2 Pattern Recognition
**Beschreibung:** KI erkennt wiederkehrende Event-Muster und schlägt automatische Erstellung vor.

**Pattern-Typen:**
- **🔄 Recurring Events** - Monatliche Jazz Nights, wöchentliche Club Events
- **🎪 Tour Events** - Künstler-Tourneen mit mehreren Städten
- **📅 Seasonal Events** - Jährliche Festivals, Weihnachtsmärkte
- **🏢 Corporate Events** - Regelmäßige Firmen-Veranstaltungen

**Pattern-Erkennung:**
```typescript
interface EventPattern {
  id: string;
  patternType: 'recurring' | 'tour' | 'seasonal' | 'corporate';
  name: string;
  frequency: string;
  venues: string[];
  artists: string[];
  ticketCategories: TicketCategory[];
  pricing: {
    basePrice: number;
    priceIncrease: number;
    earlyBirdDiscount: number;
  };
  marketing: {
    keywords: string[];
    description: string;
    hashtags: string[];
  };
  confidence: number; // 0-100%
  lastUsed: string;
  usage: number;
}
```

### 2.6 Venue-Management

#### 2.6.1 Globale Venue-Datenbank
**Beschreibung:** Umfassende Datenbank mit weltweiten Veranstaltungsorten.

**Venue-Datenstruktur:**
```typescript
interface Venue {
  id: string;
  name: string;
  address: string;
  capacity: number;
  type: 'arena' | 'stadium' | 'theater' | 'club' | 'outdoor' | 'conference';
  coordinates: {
    lat: number;
    lng: number;
  };
  amenities: string[];
  seatingChart?: string;
  geographic?: ParsedLocation;
  seoLocation?: SEOLocation;
}
```

**Venue-Typen:**
- **🏟️ Arena** - 10,000-30,000 Kapazität
- **🏈 Stadium** - 30,000+ Kapazität  
- **🎭 Theater** - 500-3,000 Kapazität
- **🍸 Club** - 100-1,000 Kapazität
- **🌳 Outdoor** - Variable Kapazität
- **🏢 Conference** - 50-2,000 Kapazität

#### 2.6.2 Venue-Suche und Matching
**Smart Search Features:**
- **🔍 Fuzzy Search** - Ähnliche Namen finden
- **📍 Geo-Search** - Nach Entfernung sortieren
- **🎯 Kapazitäts-Matching** - Passende Größe vorschlagen
- **🏢 Typ-Filter** - Nach Venue-Typ filtern
- **⭐ Bewertungs-System** - Venue-Qualität bewerten

**Auto-Suggestions:**
```typescript
function getVenueSuggestions(eventContext: {
  title?: string;
  category?: string;
  expectedAttendance?: number;
  location?: string;
}): Venue[] {
  // KI-basierte Venue-Vorschläge
  // Berücksichtigt Event-Typ, Größe, Standort
}
```

### 2.7 Bulk-Import System

#### 2.7.1 CSV/Excel Import
**Beschreibung:** Massenimport von Events aus CSV/Excel-Dateien.

**CSV-Template:**
```csv
Event Title,Description,Date,Time,End Time,Doors Open,Venue Name,Venue Address,Venue Capacity,Venue Type,Organizer Name,Organizer Email,Organizer Phone,Category,Image URL 1,Image URL 2,Image URL 3,Ticket Category 1 Name,Ticket Category 1 Price,Ticket Category 1 Capacity,Ticket Category 2 Name,Ticket Category 2 Price,Ticket Category 2 Capacity,Ticket Category 3 Name,Ticket Category 3 Price,Ticket Category 3 Capacity
Summer Music Festival 2024,"Das größte Musikfestival des Jahres",2024-07-15,18:00,23:00,17:00,Central Park,Central Park New York NY 10024,50000,outdoor,MusicEvents GmbH,info@musicevents.de,+49 30 12345678,Musik,https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg,https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg,https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg,VIP,299,500,Premium,149,2000,General Admission,89,10000
```

**Import-Validierung:**
- **📋 Pflichtfelder prüfen** - Titel, Datum, Venue
- **📅 Datum-Validierung** - Nicht in Vergangenheit
- **💰 Preis-Validierung** - Positive Zahlen
- **🏟️ Venue-Matching** - Aus bestehender Datenbank
- **🖼️ Bild-URL-Validierung** - Gültige HTTPS-URLs
- **📧 E-Mail-Validierung** - Korrekte E-Mail-Formate

**Duplikat-Erkennung:**
```typescript
interface DuplicateDetection {
  titleSimilarity: number;    // Levenshtein-Distanz
  dateSimilarity: number;     // Gleicher Tag/Woche
  venueSimilarity: number;    // Gleiche/ähnliche Venue
  overallScore: number;       // Gesamt-Ähnlichkeit 0-100%
}

// Events mit >80% Ähnlichkeit als Duplikate markieren
```

#### 2.7.2 Google Sheets-ähnlicher Editor
**Beschreibung:** Inline-Editor für Event-Daten mit Spreadsheet-Funktionalität.

**Features:**
- **📊 Tabellen-View** - Alle Events in Tabellenform
- **✏️ Inline-Editing** - Direkte Bearbeitung in Zellen
- **🔍 Venue-Suggestions** - Dropdown mit Datenbank-Matches
- **✅ Live-Validierung** - Sofortige Fehler-Anzeige
- **📋 Copy/Paste** - Zeilen duplizieren und bearbeiten
- **💾 Auto-Save** - Automatisches Speichern bei Änderungen

### 2.8 Ticket-Design-System

#### 2.8.1 Drag & Drop Editor
**Beschreibung:** Visueller Editor für professionelle Ticket-Designs.

**Design-Elemente:**
- **📝 Text-Felder** - Frei positionierbar
- **📅 Event-Felder** - Automatische Daten (Titel, Datum, Venue)
- **🖼️ Bilder** - Upload und Positionierung
- **📊 QR-Codes** - Automatische Generierung
- **🔢 UPC-Codes** - EAN-13 Format für Scanning
- **🎨 Formen** - Rechtecke, Kreise, Linien
- **🎭 Custom Graphics** - Emojis, Symbole, Logos

**Ticket-Formate:**
- **📏 Standard Ticket** - 10cm x 5cm (Kreditkarten-Format)
- **📱 Mini Ticket** - 7.5cm x 3.75cm (Kompakt)
- **⌚ Wristband** - 15cm x 2.5cm (Festival-Band)
- **📐 Custom** - Benutzerdefinierte Größen

**Export-Optionen:**
- **📄 PDF** - Druckfertig mit 300 DPI
- **🖼️ PNG** - Vorschau-Bilder
- **🎨 SVG** - Vektorgrafiken für Skalierung
- **🖨️ Print-Ready** - CMYK-Farbraum für professionellen Druck

#### 2.8.2 Template-System
**Vordefinierte Templates:**
- **🎵 Musik-Events** - Konzert-optimierte Layouts
- **🏢 Business-Events** - Professionelle Corporate-Designs
- **🎭 Theater-Events** - Klassische, elegante Designs
- **🎪 Festival-Events** - Bunte, lebendige Layouts
- **🎓 Bildungs-Events** - Saubere, informative Designs

### 2.9 Analytics & Reporting

#### 2.9.1 Dashboard-Analytics
**Echtzeit-Metriken:**
- **📊 Verkaufte Tickets** - Gesamt und pro Kategorie
- **💰 Umsatz** - Brutto, Netto, MwSt.-Aufschlüsselung
- **📈 Verkaufstrend** - Tägliche/wöchentliche Entwicklung
- **👥 Teilnehmer** - Anzahl und Segmentierung
- **🎯 Conversion-Rate** - Besucher zu Käufer
- **📱 Device-Split** - Desktop vs. Mobile Käufe
- **🌍 Geografische Verteilung** - Verkäufe nach Standort

**Visualisierungen:**
- **📊 Balken-Charts** - Kategorie-Vergleiche
- **📈 Linien-Charts** - Zeitbasierte Trends
- **🥧 Pie-Charts** - Anteil-Darstellungen
- **🗺️ Geo-Maps** - Verkäufe auf Karte
- **📊 Progress-Bars** - Inventory-Status

#### 2.9.2 Export-Funktionen
**PDF-Berichte:**
- **📊 Executive Summary** - Übersicht für Management
- **📈 Detailed Analytics** - Vollständige Statistiken
- **👥 Participant Lists** - Teilnehmer mit EAN-Codes
- **💰 Financial Reports** - Umsatz und Steuern
- **📦 Shipping Reports** - Hardticket-Versand-Status

**Excel-Exports:**
- **📋 Event-Liste** - Alle Events mit Verkaufsdaten
- **👥 Teilnehmer-Export** - Mit EAN-Codes für Abrechnung
- **📊 Sales-Data** - Detaillierte Verkaufs-Transaktionen
- **🌍 Geographic-Data** - Standort-basierte Analysen

---

## 3. Technische Anforderungen

### 3.1 Frontend-Technologien

#### 3.1.1 React-Stack
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "typescript": "^5.5.3",
  "tailwindcss": "^3.4.10",
  "lucide-react": "^0.263.1",
  "react-router-dom": "^6.8.0",
  "react-hook-form": "^7.43.0",
  "react-query": "^3.39.0"
}
```

#### 3.1.2 Shopify Admin Integration
```json
{
  "@shopify/polaris": "^12.0.0",
  "@shopify/app-bridge": "^3.7.0",
  "@shopify/app-bridge-react": "^3.7.0"
}
```

#### 3.1.3 Styling & UI
```json
{
  "tailwindcss": "^3.4.10",
  "autoprefixer": "^10.4.20",
  "postcss": "^8.4.41"
}
```

### 3.2 Backend-Technologien

#### 3.2.1 Remix Full-Stack Framework
```json
{
  "@remix-run/node": "^2.0.0",
  "@remix-run/react": "^2.0.0",
  "@remix-run/serve": "^2.0.0"
}
```

#### 3.2.2 Database & ORM
```json
{
  "@prisma/client": "^5.0.0",
  "prisma": "^5.0.0",
  "postgresql": "latest"
}
```

#### 3.2.3 Shopify Integration
```json
{
  "@shopify/shopify-api": "^8.0.0",
  "@shopify/shopify-app-remix": "^2.0.0",
  "@shopify/shopify-app-session-storage-prisma": "^3.0.0"
}
```

### 3.3 Database-Schema

#### 3.3.1 Core Tables
```sql
-- Events Table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  venue VARCHAR(255) NOT NULL,
  address TEXT,
  date TIMESTAMP NOT NULL,
  time VARCHAR(10) NOT NULL,
  end_time VARCHAR(10),
  doors_open VARCHAR(10),
  status event_status DEFAULT 'DRAFT',
  total_capacity INTEGER DEFAULT 0,
  sold_tickets INTEGER DEFAULT 0,
  reserved_tickets INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  shopify_product_id VARCHAR(255),
  geographic_data JSONB,
  seo_location JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Ticket Categories Table
CREATE TABLE ticket_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(8,2) NOT NULL,
  capacity INTEGER NOT NULL,
  sold INTEGER DEFAULT 0,
  reserved INTEGER DEFAULT 0,
  color VARCHAR(7) DEFAULT '#3B82F6',
  benefits TEXT[],
  shopify_variant_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Venues Table
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  type venue_type NOT NULL,
  coordinates JSONB,
  amenities TEXT[],
  seating_chart TEXT,
  geographic_data JSONB,
  seo_location JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Event Orders Table
CREATE TABLE event_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id),
  shopify_order_id VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255),
  total_amount DECIMAL(10,2) NOT NULL,
  status order_status DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Hardticket Orders Table
CREATE TABLE hardticket_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_order_id UUID REFERENCES event_orders(id),
  participant_name VARCHAR(255) NOT NULL,
  shipping_address JSONB NOT NULL,
  shipping_method VARCHAR(100) NOT NULL,
  tracking_number VARCHAR(255),
  shipping_cost DECIMAL(6,2) NOT NULL,
  status shipping_status DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT NOW(),
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP
);
```

#### 3.3.2 Enums
```sql
CREATE TYPE event_status AS ENUM ('DRAFT', 'PUBLISHED', 'SOLD_OUT', 'CANCELLED', 'COMPLETED');
CREATE TYPE venue_type AS ENUM ('arena', 'stadium', 'theater', 'club', 'outdoor', 'conference');
CREATE TYPE order_status AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'REFUNDED');
CREATE TYPE shipping_status AS ENUM ('PENDING', 'PRINTED', 'SHIPPED', 'DELIVERED', 'FAILED');
```

### 3.4 API-Spezifikationen

#### 3.4.1 REST API Endpoints
```typescript
// Events API
GET    /api/v1/events                    // Alle Events
POST   /api/v1/events                    // Event erstellen
GET    /api/v1/events/:id                // Event Details
PUT    /api/v1/events/:id                // Event aktualisieren
DELETE /api/v1/events/:id                // Event löschen

// Participants API
GET    /api/v1/events/:id/participants   // Teilnehmer exportieren
POST   /api/v1/participants/export       // Bulk-Export

// Analytics API
GET    /api/v1/analytics                 // Analytics-Daten
GET    /api/v1/analytics/revenue         // Umsatz-Daten
GET    /api/v1/analytics/geographic      // Geo-Daten

// Shipping API
GET    /api/v1/shipping/orders           // Hardticket-Bestellungen
POST   /api/v1/shipping/labels           // Versandetiketten erstellen
GET    /api/v1/shipping/tracking/:number // Tracking-Status
```

#### 3.4.2 Webhook-Integration
```typescript
// Shopify Webhooks
POST /webhooks/orders/paid               // Ticket-Verkauf verarbeiten
POST /webhooks/orders/cancelled          // Stornierung handhaben
POST /webhooks/app/uninstalled           // Cleanup bei Deinstallation
POST /webhooks/fulfillments/create       // Versand-Updates
POST /webhooks/fulfillments/update       // Tracking-Updates

// Outgoing Webhooks (zu Kunden-Systemen)
POST customer-url/ticket-sold            // Ticket verkauft
POST customer-url/event-sold-out         // Event ausverkauft
POST customer-url/hardticket-shipped     // Hardticket versendet
```

### 3.5 Performance-Anforderungen

#### 3.5.1 Response-Zeiten
- **🏠 Dashboard-Load:** < 2 Sekunden
- **🎫 Event-Erstellung:** < 3 Sekunden
- **📊 API-Responses:** < 200ms
- **🔄 Inventory-Updates:** < 500ms
- **📦 Webhook-Processing:** < 5 Sekunden

#### 3.5.2 Skalierbarkeit
- **👥 Concurrent Users:** 1,000+
- **🎫 Events pro Store:** Unbegrenzt (Enterprise)
- **📦 Orders pro Minute:** 100+
- **🗄️ Database-Size:** 100GB+ (mit Backups)
- **📊 API-Calls:** 1 Million/Monat (Enterprise)

---

## 4. UI/UX Spezifikationen

### 4.1 Design-System

#### 4.1.1 Farbpalette
```css
/* Primary Colors */
--blue-600: #3B82F6;    /* Buttons, Links, Primary Actions */
--emerald-600: #10B981; /* Success States, Available Tickets */
--yellow-600: #F59E0B;  /* Low Stock Warnings */
--red-600: #EF4444;     /* Sold Out, Critical Alerts */
--purple-600: #8B5CF6;  /* Bundles, Premium Features */

/* Alert Colors */
--sold-out: #DC2626;    /* Sold Out Badges */
--critical: #EA580C;    /* Critical Stock Alerts */
--low-stock: #D97706;   /* Low Stock Warnings */
--available: #059669;   /* Available Status */

/* Neutral Colors */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-600: #4B5563;
--gray-900: #111827;
```

#### 4.1.2 Typography
```css
/* Font Family */
font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

#### 4.1.3 Spacing-System
```css
/* 8px Base Unit */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
```

### 4.2 Component-Spezifikationen

#### 4.2.1 Inventory-Alert-Badges
**SOLD OUT Badge:**
```css
.sold-out-badge {
  background: linear-gradient(45deg, #DC2626, #EF4444);
  color: white;
  padding: 8px 16px;
  border-radius: 9999px;
  font-weight: 800;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  animation: pulse 2s infinite;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

**CRITICAL Badge:**
```css
.critical-badge {
  background: linear-gradient(45deg, #EA580C, #F97316);
  color: white;
  padding: 6px 12px;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 11px;
  animation: pulse 1.5s infinite;
  box-shadow: 0 2px 8px rgba(234, 88, 12, 0.3);
}
```

**LOW STOCK Badge:**
```css
.low-stock-badge {
  background: linear-gradient(45deg, #D97706, #F59E0B);
  color: white;
  padding: 4px 10px;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 10px;
  box-shadow: 0 2px 6px rgba(217, 119, 6, 0.2);
}
```

#### 4.2.2 Event-Cards
```typescript
interface EventCardProps {
  event: Event;
  showInventoryAlerts: boolean;
  showGeographicInfo: boolean;
  layout: 'grid' | 'list';
}

// Event-Card mit Inventory-Alerts
<div className="event-card">
  <div className="event-image">
    <img src={event.images[0]} alt={event.title} />
    {getInventoryAlert(event) && (
      <div className="alert-overlay">
        {renderInventoryBadge(event)}
      </div>
    )}
  </div>
  
  <div className="event-content">
    <h3>{event.title}</h3>
    <div className="event-meta">
      <span className="date">{formatDate(event.date)}</span>
      <span className="venue">{event.venue.name}</span>
      <span className="location">{event.venue.seoLocation.primaryLocation}</span>
    </div>
    
    <div className="ticket-categories">
      {event.ticketCategories.map(category => (
        <div key={category.id} className="category">
          <span className="name">{category.name}</span>
          <span className="price">€{category.price}</span>
          {getInventoryWarningBadge(category)}
        </div>
      ))}
    </div>
  </div>
</div>
```

### 4.3 Responsive Design

#### 4.3.1 Breakpoints
```css
/* Mobile First Approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

#### 4.3.2 Mobile-Optimierungen
- **📱 Touch-Targets:** Mindestens 44px Höhe
- **👆 Swipe-Gestures:** Für Event-Navigation
- **📊 Simplified Tables:** Auf Mobile gestapelt
- **🔍 Search-First:** Prominente Suchfunktion
- **⚡ Fast Loading:** Lazy Loading für Bilder

---

## 5. Shopify-Integration

### 5.1 App-Architektur

#### 5.1.1 Embedded App
```typescript
// App läuft eingebettet im Shopify Admin
const app = createApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  host: shopifyHost,
  forceRedirect: true
});

// Navigation im Shopify Admin
app.subscribe(Redirect.Action.APP, (payload) => {
  // Handle navigation within Shopify Admin
});
```

#### 5.1.2 OAuth-Flow
```typescript
// 1. Installation-URL generieren
const installUrl = `https://ihre-domain.com/auth?shop=${shopDomain}`;

// 2. OAuth-Callback verarbeiten
app.get('/auth/callback', async (req, res) => {
  const { code, shop, state } = req.query;
  
  // Exchange code for access token
  const accessToken = await exchangeCodeForToken(code, shop);
  
  // Store session in database
  await storeSession(shop, accessToken);
  
  // Redirect to app
  res.redirect(`https://${shop}/admin/apps/${appHandle}`);
});
```

### 5.2 Shopify Admin API Integration

#### 5.2.1 Product Management
```typescript
// Event als Shopify-Produkt erstellen
async function createShopifyProduct(event: Event): Promise<string> {
  const productData = {
    product: {
      title: event.title,
      body_html: generateProductDescription(event),
      vendor: 'TicketForge',
      product_type: 'Event Ticket',
      tags: generateProductTags(event),
      published: event.status === 'PUBLISHED',
      variants: event.ticketCategories.map(category => ({
        title: category.name,
        price: category.price.toFixed(2),
        sku: `${event.id}-${category.id}`,
        inventory_management: 'shopify',
        inventory_policy: 'deny',
        inventory_quantity: category.capacity - category.sold,
        weight: 0,
        requires_shipping: false,
        taxable: true
      })),
      options: [{
        name: 'Ticket Category',
        values: event.ticketCategories.map(cat => cat.name)
      }],
      metafields: [
        {
          namespace: 'ticketforge',
          key: 'event_id',
          value: event.id,
          type: 'single_line_text_field'
        },
        {
          namespace: 'ticketforge',
          key: 'event_date',
          value: event.date,
          type: 'date'
        },
        {
          namespace: 'ticketforge',
          key: 'venue_name',
          value: event.venue.name,
          type: 'single_line_text_field'
        }
      ]
    }
  };

  const response = await shopifyAPI.rest.Product.save({
    session,
    ...productData
  });

  return response.id.toString();
}
```

#### 5.2.2 Inventory-Synchronisation
```typescript
// Inventory bei Ticket-Verkauf aktualisieren
async function updateShopifyInventory(
  variantId: string, 
  newQuantity: number
): Promise<void> {
  await shopifyAPI.rest.InventoryLevel.adjust({
    session,
    body: {
      location_id: primaryLocationId,
      inventory_item_id: variantId,
      available_adjustment: -1 // Reduziere um 1
    }
  });
}

// Webhook-Handler für Bestellungen
app.post('/webhooks/orders/paid', async (req, res) => {
  const order = req.body;
  
  for (const lineItem of order.line_items) {
    // Prüfe ob es ein TicketForge-Produkt ist
    if (lineItem.vendor === 'TicketForge') {
      await processTicketSale(lineItem);
      await updateInventoryAlerts(lineItem.product_id);
    }
  }
  
  res.status(200).send('OK');
});
```

### 5.3 Hardticket-Addon Integration

#### 5.3.1 Addon-Produkt-Erstellung
```typescript
async function createHardticketAddon(): Promise<void> {
  const addonProduct = {
    product: {
      title: 'Hardticket-Versand',
      body_html: `
        <h3>🎫 Erhalten Sie Ihre Tickets als hochwertige Hardtickets!</h3>
        <ul>
          <li>✅ Professionell gedruckte Tickets</li>
          <li>✅ Sichere Verpackung</li>
          <li>✅ Tracking-Nummer inklusive</li>
          <li>✅ Lieferung in 3-5 Werktagen</li>
        </ul>
      `,
      vendor: 'TicketForge',
      product_type: 'Service',
      tags: 'hardticket,versand,addon',
      published: true,
      variants: [{
        title: 'Hardticket-Versand',
        price: '4.99',
        sku: 'HARDTICKET-ADDON',
        inventory_management: 'shopify',
        inventory_policy: 'continue',
        inventory_quantity: 9999,
        requires_shipping: true,
        taxable: true
      }],
      metafields: [
        {
          namespace: 'ticketforge',
          key: 'addon_type',
          value: 'hardticket_shipping',
          type: 'single_line_text_field'
        }
      ]
    }
  };

  await shopifyAPI.rest.Product.save({ session, ...addonProduct });
}
```

---

## 6. Datenmodell

### 6.1 Entity-Relationship-Diagram

```
┌─────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Events    │    │ Ticket Categories│    │   Event Orders  │
├─────────────┤    ├──────────────────┤    ├─────────────────┤
│ id (PK)     │───▶│ id (PK)          │    │ id (PK)         │
│ shop        │    │ event_id (FK)    │    │ event_id (FK)   │
│ title       │    │ name             │    │ shopify_order_id│
│ description │    │ price            │    │ customer_email  │
│ venue       │    │ capacity         │    │ total_amount    │
│ date        │    │ sold             │    │ status          │
│ time        │    │ reserved         │    │ created_at      │
│ status      │    │ color            │    └─────────────────┘
│ capacity    │    │ benefits         │              │
│ sold        │    │ shopify_variant  │              │
│ revenue     │    └──────────────────┘              │
│ shopify_id  │                                      │
│ geographic  │    ┌─────────────────┐              │
│ seo_data    │    │     Venues      │              │
│ created_at  │    ├─────────────────┤              │
└─────────────┘    │ id (PK)         │              │
        │          │ name            │              │
        │          │ address         │              │
        └─────────▶│ capacity        │              │
                   │ type            │              │
                   │ coordinates     │              │
                   │ amenities       │              │
                   │ geographic      │              │
                   └─────────────────┘              │
                                                    │
┌─────────────────┐    ┌──────────────────┐       │
│ Hardticket Orders│    │   Participants   │       │
├─────────────────┤    ├──────────────────┤       │
│ id (PK)         │    │ id (PK)          │       │
│ order_id (FK)   │◀───│ order_id (FK)    │◀──────┘
│ participant     │    │ first_name       │
│ shipping_addr   │    │ last_name        │
│ shipping_method │    │ email            │
│ tracking_number │    │ phone            │
│ cost            │    │ address          │
│ status          │    │ segment          │
│ created_at      │    │ created_at       │
│ shipped_at      │    └──────────────────┘
└─────────────────┘
```

### 6.2 Datentypen und Constraints

#### 6.2.1 Events Table
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL CHECK (length(title) >= 3),
  description TEXT CHECK (length(description) >= 150),
  venue VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  date TIMESTAMP NOT NULL CHECK (date > NOW()),
  time VARCHAR(10) NOT NULL CHECK (time ~ '^[0-2][0-9]:[0-5][0-9]$'),
  end_time VARCHAR(10) CHECK (end_time ~ '^[0-2][0-9]:[0-5][0-9]$'),
  doors_open VARCHAR(10) CHECK (doors_open ~ '^[0-2][0-9]:[0-5][0-9]$'),
  status event_status DEFAULT 'DRAFT',
  total_capacity INTEGER DEFAULT 0 CHECK (total_capacity >= 0),
  sold_tickets INTEGER DEFAULT 0 CHECK (sold_tickets >= 0),
  reserved_tickets INTEGER DEFAULT 0 CHECK (reserved_tickets >= 0),
  revenue DECIMAL(10,2) DEFAULT 0 CHECK (revenue >= 0),
  shopify_product_id VARCHAR(255),
  geographic_data JSONB,
  seo_location JSONB,
  images TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  organizer JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT valid_capacity CHECK (sold_tickets + reserved_tickets <= total_capacity),
  CONSTRAINT valid_times CHECK (
    (end_time IS NULL) OR 
    (time < end_time) OR 
    (date + time::time < date + end_time::time)
  )
);

-- Indexes für Performance
CREATE INDEX idx_events_shop ON events(shop);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_geographic ON events USING GIN (geographic_data);
CREATE INDEX idx_events_search ON events USING GIN (to_tsvector('german', title || ' ' || description));
```

#### 6.2.2 Ticket Categories Table
```sql
CREATE TABLE ticket_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL CHECK (length(name) >= 2),
  description TEXT,
  price DECIMAL(8,2) NOT NULL CHECK (price >= 0.01),
  capacity INTEGER NOT NULL CHECK (capacity >= 1),
  sold INTEGER DEFAULT 0 CHECK (sold >= 0),
  reserved INTEGER DEFAULT 0 CHECK (reserved >= 0),
  color VARCHAR(7) DEFAULT '#3B82F6' CHECK (color ~ '^#[0-9A-Fa-f]{6}$'),
  benefits TEXT[] DEFAULT '{}',
  shopify_variant_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT valid_category_capacity CHECK (sold + reserved <= capacity),
  CONSTRAINT unique_category_name UNIQUE (event_id, name)
);

-- Indexes
CREATE INDEX idx_categories_event ON ticket_categories(event_id);
CREATE INDEX idx_categories_shopify ON ticket_categories(shopify_variant_id);
```

### 6.3 Geographic Data Structure

#### 6.3.1 Location Parsing
```typescript
interface GeographicData {
  // Parsed Address Components
  street?: string;
  city: string;
  state: string;
  zipCode?: string;
  county?: string;
  country: string;
  region?: string;
  timezone?: string;
  
  // Coordinates
  coordinates?: {
    lat: number;
    lng: number;
  };
  
  // Administrative Divisions
  administrativeDivisions?: {
    level1?: string; // State/Province
    level2?: string; // County/District
    level3?: string; // City/Municipality
  };
}

interface SEOLocationData {
  primaryLocation: string;      // "New York, NY"
  secondaryLocation: string;    // "New York County, NY"
  locationKeywords: string[];   // ["new york events", "nyc concerts"]
  nearbyLandmarks?: string[];   // ["Times Square", "Central Park"]
  metroArea?: string;          // "New York Metropolitan Area"
  touristRegion?: string;      // "Northeast United States"
}
```

---

## 7. API-Spezifikationen

### 7.1 REST API Endpoints

#### 7.1.1 Events API
```typescript
// GET /api/v1/events
interface EventsListResponse {
  success: boolean;
  data: Event[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters?: {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

// POST /api/v1/events
interface CreateEventRequest {
  title: string;
  description: string;
  venue: {
    name: string;
    address: string;
    capacity: number;
    type: VenueType;
  };
  date: string; // ISO 8601
  time: string; // HH:MM
  ticketCategories: Array<{
    name: string;
    price: number;
    capacity: number;
    description?: string;
    benefits?: string[];
  }>;
  organizer?: {
    name: string;
    email: string;
    phone?: string;
  };
  images?: string[];
  tags?: string[];
}
```

#### 7.1.2 Participants Export API
```typescript
// GET /api/v1/events/{event_id}/participants
interface ParticipantsExportResponse {
  success: boolean;
  event: {
    id: string;
    title: string;
    date: string;
    venue: string;
  };
  participants: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
    };
    tickets: Array<{
      ticketNumber: string;
      category: string;
      eanCode: string;
      qrCode: string;
      price: number;
      purchaseDate: string;
      status: 'valid' | 'used' | 'cancelled';
    }>;
    customerSegment: 'vip' | 'regular' | 'student' | 'senior';
    totalSpent: number;
    orderCount: number;
  }>;
  summary: {
    totalParticipants: number;
    totalRevenue: number;
    averageTicketPrice: number;
    exportFormat: 'json' | 'csv' | 'xlsx';
    generatedAt: string;
  };
}
```

#### 7.1.3 Shipping API
```typescript
// GET /api/v1/shipping/orders
interface ShippingOrdersResponse {
  success: boolean;
  orders: Array<{
    id: string;
    orderNumber: string;
    participant: {
      name: string;
      email: string;
      address: ShippingAddress;
    };
    tickets: Array<{
      ticketNumber: string;
      category: string;
      eanCode: string;
      qrCode: string;
    }>;
    shipping: {
      method: string;
      carrier: string;
      trackingNumber?: string;
      cost: number;
      estimatedDelivery?: string;
    };
    status: 'pending' | 'printed' | 'shipped' | 'delivered' | 'failed';
    createdAt: string;
    shippedAt?: string;
  }>;
}

// POST /api/v1/shipping/labels
interface CreateShippingLabelRequest {
  orderIds: string[];
  shippingMethod: string;
  printerSettings?: {
    printerId: string;
    format: 'A4' | 'Letter';
    quality: 'normal' | 'high';
  };
}
```

### 7.2 Webhook-Spezifikationen

#### 7.2.1 Shopify Webhooks (Incoming)
```typescript
// orders/paid - Ticket-Verkauf verarbeiten
interface OrderPaidWebhook {
  id: number;
  email: string;
  created_at: string;
  updated_at: string;
  total_price: string;
  currency: string;
  financial_status: string;
  customer: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    default_address?: ShopifyAddress;
  };
  line_items: Array<{
    id: number;
    variant_id: number;
    title: string;
    quantity: number;
    price: string;
    vendor: string;
    product_id: number;
    sku: string;
  }>;
  shipping_address?: ShopifyAddress;
  billing_address?: ShopifyAddress;
}

// Webhook-Handler
async function handleOrderPaid(webhook: OrderPaidWebhook): Promise<void> {
  for (const lineItem of webhook.line_items) {
    if (lineItem.vendor === 'TicketForge') {
      // Parse SKU to get event and category
      const [eventId, categoryId] = lineItem.sku.split('-');
      
      // Update inventory
      await updateTicketInventory(eventId, categoryId, lineItem.quantity);
      
      // Check for hardticket addon
      const hasHardticketAddon = webhook.line_items.some(
        item => item.sku === 'HARDTICKET-ADDON'
      );
      
      if (hasHardticketAddon) {
        await createHardticketOrder(webhook, lineItem);
      }
      
      // Send confirmation email
      await sendTicketConfirmation(webhook.customer, lineItem);
    }
  }
}
```

#### 7.2.2 Outgoing Webhooks (zu Kunden-Systemen)
```typescript
// Webhook an Kunden-System bei Ticket-Verkauf
interface TicketSoldWebhook {
  event: 'ticket.sold';
  timestamp: string;
  data: {
    eventId: string;
    eventTitle: string;
    ticketId: string;
    participantId: string;
    category: string;
    price: number;
    quantity: number;
    orderNumber: string;
    customerEmail: string;
  };
}

// Webhook bei Event ausverkauft
interface EventSoldOutWebhook {
  event: 'event.sold_out';
  timestamp: string;
  data: {
    eventId: string;
    eventTitle: string;
    venue: string;
    date: string;
    totalTicketsSold: number;
    totalRevenue: number;
    soldOutAt: string;
  };
}
```

---

## 8. Deployment & Hosting

### 8.1 Heroku-Deployment

#### 8.1.1 Heroku-Konfiguration
```json
// app.json
{
  "name": "Event Ticketing Pro",
  "description": "Professional event ticketing app for Shopify stores",
  "keywords": ["shopify", "events", "tickets", "hardticket", "shipping"],
  "buildpacks": [
    {
      "url": "heroku/nodejs"
    }
  ],
  "addons": [
    {
      "plan": "heroku-postgresql:mini"
    },
    {
      "plan": "heroku-redis:mini"
    }
  ],
  "env": {
    "SHOPIFY_API_KEY": {
      "description": "Shopify App API Key from Partner Dashboard"
    },
    "SHOPIFY_API_SECRET": {
      "description": "Shopify App Secret from Partner Dashboard"
    },
    "HOST": {
      "description": "App URL (e.g., https://your-app.herokuapp.com)"
    }
  }
}
```

```bash
# Procfile
web: npm run start
release: npx prisma migrate deploy && npx prisma generate
```

#### 8.1.2 Environment Variables
```bash
# Shopify App Configuration
SHOPIFY_API_KEY=f1563c8fd966ad4ca7732c765e3de444
SHOPIFY_API_SECRET=35b9241ee6b8ca3d457b026b5675148f
SCOPES=write_products,read_products,write_orders,read_orders,read_customers,write_customers,read_inventory,write_inventory
HOST=https://ticket-forge-5e4b7e5068d7.herokuapp.com

# Database (automatisch von Heroku gesetzt)
DATABASE_URL=postgresql://username:password@hostname:port/database

# Session Storage
SHOPIFY_APP_URL=https://ticket-forge-5e4b7e5068d7.herokuapp.com

# Hardticket Configuration
HARDTICKET_ADDON_PRICE=4.99
HARDTICKET_MAX_COUNTRIES=9
HARDTICKET_DEFAULT_DELIVERY_DAYS=3

# Shipping API Keys
DHL_API_KEY=your_dhl_api_key
DEUTSCHE_POST_API_KEY=your_post_api_key
USPS_API_KEY=your_usps_api_key
UPS_API_KEY=your_ups_api_key
ROYAL_MAIL_API_KEY=your_royal_mail_api_key

# Email Configuration
SENDGRID_API_KEY=your_sendgrid_key
FROM_EMAIL=noreply@ticketforge.com

# Analytics
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
MIXPANEL_TOKEN=your_mixpanel_token
```

### 8.2 Performance-Optimierung

#### 8.2.1 Caching-Strategie
```typescript
// Redis-Caching für häufige Abfragen
const cacheKeys = {
  events: (shop: string) => `events:${shop}`,
  venues: 'venues:global',
  inventory: (eventId: string) => `inventory:${eventId}`,
  analytics: (shop: string, period: string) => `analytics:${shop}:${period}`
};

// Cache-Implementation
async function getCachedEvents(shop: string): Promise<Event[]> {
  const cacheKey = cacheKeys.events(shop);
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const events = await db.event.findMany({ where: { shop } });
  await redis.setex(cacheKey, 300, JSON.stringify(events)); // 5 Min Cache
  
  return events;
}
```

#### 8.2.2 Database-Optimierung
```sql
-- Partitionierung für große Event-Tabellen
CREATE TABLE events_2024 PARTITION OF events
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE events_2025 PARTITION OF events  
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- Materialized Views für Analytics
CREATE MATERIALIZED VIEW event_analytics AS
SELECT 
  e.shop,
  e.id,
  e.title,
  e.date,
  e.total_capacity,
  e.sold_tickets,
  e.revenue,
  (e.sold_tickets::float / e.total_capacity) * 100 as sold_percentage,
  v.name as venue_name,
  v.type as venue_type,
  (e.geographic_data->>'city') as city,
  (e.geographic_data->>'state') as state,
  (e.geographic_data->>'country') as country
FROM events e
LEFT JOIN venues v ON v.name = e.venue
WHERE e.status = 'PUBLISHED';

-- Refresh täglich
CREATE OR REPLACE FUNCTION refresh_analytics()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY event_analytics;
END;
$$ LANGUAGE plpgsql;

-- Cron Job für automatisches Refresh
SELECT cron.schedule('refresh-analytics', '0 2 * * *', 'SELECT refresh_analytics();');
```

---

## 9. Testing & QA

### 9.1 Test-Strategie

#### 9.1.1 Unit Tests
```typescript
// Event-Erstellung Tests
describe('Event Creation', () => {
  test('should create event with valid data', async () => {
    const eventData = {
      title: 'Test Concert',
      venue: 'Test Venue',
      date: '2024-12-31',
      time: '20:00',
      ticketCategories: [
        { name: 'General', price: 50, capacity: 100 }
      ]
    };
    
    const event = await createEvent(eventData);
    expect(event.id).toBeDefined();
    expect(event.status).toBe('DRAFT');
  });
  
  test('should reject event with past date', async () => {
    const eventData = {
      title: 'Past Event',
      date: '2020-01-01',
      // ... other fields
    };
    
    await expect(createEvent(eventData)).rejects.toThrow('Date must be in the future');
  });
});

// Inventory-Alert Tests
describe('Inventory Alerts', () => {
  test('should trigger SOLD OUT alert when capacity reached', () => {
    const category = {
      capacity: 100,
      sold: 100,
      reserved: 0
    };
    
    const status = calculateInventoryStatus(category);
    expect(status).toBe('sold_out');
  });
  
  test('should trigger CRITICAL alert at 5% remaining', () => {
    const category = {
      capacity: 100,
      sold: 95,
      reserved: 0
    };
    
    const status = calculateInventoryStatus(category);
    expect(status).toBe('critical');
  });
});
```

#### 9.1.2 Integration Tests
```typescript
// Shopify-Integration Tests
describe('Shopify Integration', () => {
  test('should create Shopify product when event published', async () => {
    const event = await createEvent(validEventData);
    await publishEvent(event.id);
    
    const shopifyProduct = await getShopifyProduct(event.shopifyProductId);
    expect(shopifyProduct.title).toBe(event.title);
    expect(shopifyProduct.variants).toHaveLength(event.ticketCategories.length);
  });
  
  test('should update inventory on order webhook', async () => {
    const webhook = createMockOrderWebhook();
    await handleOrderPaidWebhook(webhook);
    
    const updatedEvent = await getEvent(eventId);
    expect(updatedEvent.soldTickets).toBe(1);
  });
});

// Hardticket-Versand Tests
describe('Hardticket Shipping', () => {
  test('should create shipping label for hardticket order', async () => {
    const order = await createHardticketOrder(mockOrderData);
    const label = await generateShippingLabel(order.id);
    
    expect(label.trackingNumber).toBeDefined();
    expect(label.labelUrl).toMatch(/^https:\/\//);
  });
});
```

#### 9.1.3 E2E Tests
```typescript
// Playwright E2E Tests
import { test, expect } from '@playwright/test';

test('complete event creation flow', async ({ page }) => {
  // Login to Shopify Admin
  await page.goto('/auth?shop=test-store.myshopify.com');
  
  // Navigate to event creation
  await page.click('[data-testid="create-event"]');
  
  // Fill event form
  await page.fill('[name="title"]', 'Test Concert');
  await page.fill('[name="venue"]', 'Test Venue');
  await page.fill('[name="date"]', '2024-12-31');
  await page.fill('[name="time"]', '20:00');
  
  // Add ticket category
  await page.fill('[name="category_0_name"]', 'General');
  await page.fill('[name="category_0_price"]', '50');
  await page.fill('[name="category_0_capacity"]', '100');
  
  // Submit form
  await page.click('[type="submit"]');
  
  // Verify event created
  await expect(page.locator('.event-card')).toContainText('Test Concert');
});

test('inventory alerts display correctly', async ({ page }) => {
  // Create event with low stock
  const event = await createTestEvent({ soldTickets: 95, capacity: 100 });
  
  await page.goto('/dashboard');
  
  // Check for LOW STOCK badge
  await expect(page.locator('.low-stock-badge')).toBeVisible();
  await expect(page.locator('.low-stock-badge')).toContainText('LOW STOCK');
});
```

### 9.2 QA-Checkliste

#### 9.2.1 Funktionale Tests
- [ ] **Event-Erstellung** funktioniert mit allen Feldern
- [ ] **Ticket-Kategorien** werden korrekt angelegt
- [ ] **Inventory-Alerts** erscheinen bei richtigen Schwellenwerten
- [ ] **Shopify-Produkte** werden automatisch erstellt
- [ ] **Hardticket-Versand** funktioniert Ende-zu-Ende
- [ ] **Bulk-Import** verarbeitet CSV-Dateien korrekt
- [ ] **AI Event Assistant** generiert sinnvolle Vorschläge
- [ ] **Geografische Sortierung** funktioniert
- [ ] **Export-Funktionen** erstellen korrekte Dateien
- [ ] **Webhook-Verarbeitung** aktualisiert Inventory

#### 9.2.2 UI/UX Tests
- [ ] **Responsive Design** auf allen Geräten
- [ ] **Accessibility** WCAG 2.1 AA konform
- [ ] **Loading States** für alle Async-Operationen
- [ ] **Error Handling** mit benutzerfreundlichen Meldungen
- [ ] **Form Validation** mit sofortiger Rückmeldung
- [ ] **Navigation** intuitiv und konsistent
- [ ] **Performance** < 3s Ladezeit auf 3G

#### 9.2.3 Security Tests
- [ ] **SQL-Injection** Schutz durch Prisma ORM
- [ ] **XSS-Schutz** in React-Komponenten
- [ ] **CSRF-Schutz** für Formulare
- [ ] **API-Rate-Limiting** funktioniert
- [ ] **Webhook-Verifizierung** validiert Shopify-Signaturen
- [ ] **Environment Variables** sicher gespeichert
- [ ] **HTTPS** für alle Verbindungen

---

## 10. Monetarisierung

### 10.1 Subscription-Modell

#### 10.1.1 Plan-Struktur
```typescript
interface SubscriptionPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  ticketFee: number;
  features: string[];
  limits: {
    events: number;        // -1 = unlimited
    venues: number;
    participants: number;
    storage: string;
    apiCalls: number;
    customBranding: boolean;
    prioritySupport: boolean;
    analytics: boolean;
    bulkImport: boolean;
    aiAssistant: boolean;
    whiteLabel: boolean;
    hardticketShipping: boolean;
  };
}

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    monthlyPrice: 29,
    ticketFee: 1.00,
    features: [
      'Bis zu 10 Events pro Monat',
      'Bis zu 5 Venues',
      'Bis zu 1.000 Teilnehmer',
      '5GB Speicher',
      'Basis Ticket-Design',
      'E-Mail Support'
    ],
    limits: {
      events: 10,
      venues: 5,
      participants: 1000,
      storage: '5GB',
      apiCalls: 10000,
      customBranding: false,
      prioritySupport: false,
      analytics: false,
      bulkImport: false,
      aiAssistant: false,
      whiteLabel: false,
      hardticketShipping: false
    }
  },
  {
    id: 'advanced',
    name: 'Advanced',
    monthlyPrice: 99,
    ticketFee: 0.50,
    features: [
      'Bis zu 50 Events pro Monat',
      'Bis zu 25 Venues',
      'Bis zu 10.000 Teilnehmer',
      '50GB Speicher',
      'Hardticket-Versand (DACH)',
      'Erweiterte Analytics',
      'Priority Support',
      'Bulk Import/Export',
      'API Zugang (50k Calls)'
    ],
    limits: {
      events: 50,
      venues: 25,
      participants: 10000,
      storage: '50GB',
      apiCalls: 50000,
      customBranding: true,
      prioritySupport: true,
      analytics: true,
      bulkImport: true,
      aiAssistant: false,
      whiteLabel: false,
      hardticketShipping: true
    }
  },
  {
    id: 'premium',
    name: 'Premium',
    monthlyPrice: 299,
    ticketFee: 0.20,
    features: [
      'Bis zu 200 Events pro Monat',
      'Bis zu 100 Venues',
      'Bis zu 100.000 Teilnehmer',
      '500GB Speicher',
      'AI Event Assistant',
      'Hardticket-Versand (Europa + USA)',
      'White-Label Option',
      'Telefon & Chat Support',
      'API Zugang (200k Calls)'
    ],
    limits: {
      events: 200,
      venues: 100,
      participants: 100000,
      storage: '500GB',
      apiCalls: 200000,
      customBranding: true,
      prioritySupport: true,
      analytics: true,
      bulkImport: true,
      aiAssistant: true,
      whiteLabel: true,
      hardticketShipping: true
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 599,
    ticketFee: 0.10,
    features: [
      'Unbegrenzte Events',
      'Unbegrenzte Venues',
      'Unbegrenzte Teilnehmer',
      'Unbegrenzter Speicher',
      'Vollständige AI-Suite',
      'Hardticket-Versand weltweit',
      'Dedicated Account Manager',
      '24/7 Priority Support',
      'Custom Entwicklung',
      'Unbegrenzte API Calls'
    ],
    limits: {
      events: -1,
      venues: -1,
      participants: -1,
      storage: 'Unlimited',
      apiCalls: -1,
      customBranding: true,
      prioritySupport: true,
      analytics: true,
      bulkImport: true,
      aiAssistant: true,
      whiteLabel: true,
      hardticketShipping: true
    }
  }
];
```

#### 10.1.2 Usage-Tracking
```typescript
// Subscription-Limits überwachen
interface UsageStats {
  currentPlan: string;
  eventsThisMonth: number;
  participantsTotal: number;
  storageUsed: number; // in GB
  apiCallsThisMonth: number;
  billingCycle: 'monthly' | 'yearly';
}

function checkUsageLimits(usage: UsageStats, plan: SubscriptionPlan): {
  isOverLimit: boolean;
  warnings: string[];
  blockedFeatures: string[];
} {
  const warnings = [];
  const blockedFeatures = [];
  
  // Events-Limit prüfen
  if (plan.limits.events !== -1 && usage.eventsThisMonth >= plan.limits.events) {
    blockedFeatures.push('event_creation');
    warnings.push(`Event-Limit erreicht: ${usage.eventsThisMonth}/${plan.limits.events}`);
  }
  
  // API-Calls prüfen
  if (plan.limits.apiCalls !== -1 && usage.apiCallsThisMonth >= plan.limits.apiCalls) {
    blockedFeatures.push('api_access');
    warnings.push(`API-Limit erreicht: ${usage.apiCallsThisMonth}/${plan.limits.apiCalls}`);
  }
  
  return {
    isOverLimit: blockedFeatures.length > 0,
    warnings,
    blockedFeatures
  };
}
```

### 10.2 Revenue-Streams

#### 10.2.1 Transaktionsgebühren
```typescript
// Automatische Gebühren-Berechnung
interface TransactionFee {
  orderId: string;
  eventId: string;
  ticketQuantity: number;
  ticketPrice: number;
  feePerTicket: number;
  totalFee: number;
  currency: string;
  processedAt: string;
}

async function calculateTransactionFee(
  order: ShopifyOrder,
  userPlan: string
): Promise<TransactionFee> {
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === userPlan);
  const feePerTicket = plan?.ticketFee || 1.00;
  
  const ticketLineItems = order.line_items.filter(
    item => item.vendor === 'TicketForge' && item.sku !== 'HARDTICKET-ADDON'
  );
  
  const totalTickets = ticketLineItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalFee = totalTickets * feePerTicket;
  
  return {
    orderId: order.id.toString(),
    eventId: extractEventIdFromSKU(ticketLineItems[0].sku),
    ticketQuantity: totalTickets,
    ticketPrice: parseFloat(ticketLineItems[0].price),
    feePerTicket,
    totalFee,
    currency: order.currency,
    processedAt: new Date().toISOString()
  };
}
```

#### 10.2.2 Hardticket-Addon Revenue
```typescript
// Hardticket-Addon Umsatz-Tracking
interface HardticketRevenue {
  orderId: string;
  addonPrice: number;
  shippingCost: number;
  totalRevenue: number;
  margin: number;
  carrier: string;
  country: string;
  processedAt: string;
}

async function trackHardticketRevenue(order: HardticketOrder): Promise<void> {
  const addonRevenue: HardticketRevenue = {
    orderId: order.id,
    addonPrice: 4.99,
    shippingCost: order.shippingCost,
    totalRevenue: 4.99,
    margin: 4.99 - order.shippingCost, // Gewinn nach Versandkosten
    carrier: order.shippingMethod.carrier,
    country: order.participant.address.country,
    processedAt: new Date().toISOString()
  };
  
  await db.hardticketRevenue.create({ data: addonRevenue });
}
```

---

## 11. Zeitplan & Meilensteine

### 11.1 Entwicklungs-Phasen

#### 11.1.1 Phase 1: Core Development (Wochen 1-4)
**Woche 1-2: Backend-Foundation**
- [ ] Remix-App Setup mit Shopify-Integration
- [ ] PostgreSQL Database-Schema implementieren
- [ ] OAuth-Authentifizierung mit Shopify
- [ ] Basis Event-CRUD-Operationen
- [ ] Shopify Product-API Integration

**Woche 3-4: Frontend-Core**
- [ ] React-Dashboard mit Polaris-Komponenten
- [ ] Event-Erstellung-Formular
- [ ] Ticket-Kategorien-Management
- [ ] Basis Inventory-Anzeige
- [ ] Responsive Design-Implementation

#### 11.1.2 Phase 2: Advanced Features (Wochen 5-8)
**Woche 5-6: Inventory-Alert-System**
- [ ] Automatische Alert-Berechnung
- [ ] Visuelle Badge-Komponenten mit Animationen
- [ ] E-Mail-Benachrichtigungs-System
- [ ] Dashboard-Alert-Karten
- [ ] Echtzeit-Updates via WebSockets

**Woche 7-8: Geografische Features**
- [ ] Location-Parser für Adressen
- [ ] SEO-Location-Generator
- [ ] Geografische Event-Sortierung
- [ ] Venue-Datenbank mit 50k+ Locations
- [ ] Smart Venue-Search und Matching

#### 11.1.3 Phase 3: Premium Features (Wochen 9-12)
**Woche 9-10: Hardticket-Versand**
- [ ] Multi-Carrier-API-Integration (DHL, USPS, Royal Mail)
- [ ] Automatische Versandetikett-Generierung
- [ ] Tracking-Integration mit Live-Updates
- [ ] Drucker-Integration für Bulk-Druck
- [ ] Lieferschein-Generierung im Ticket-Format

**Woche 11-12: AI-Features**
- [ ] Artist Information Scraper
- [ ] SEO-Content-Generator
- [ ] Event-Pattern-Recognition
- [ ] AI Event Assistant Interface
- [ ] Smart Venue-Suggestions

#### 11.1.4 Phase 4: Polish & Launch (Wochen 13-16)
**Woche 13-14: UI/UX Polish**
- [ ] Design-System finalisieren
- [ ] Micro-Interactions und Animationen
- [ ] Accessibility-Optimierungen
- [ ] Performance-Optimierungen
- [ ] Mobile-Experience verfeinern

**Woche 15-16: App Store Vorbereitung**
- [ ] Screenshots in professioneller Qualität
- [ ] Demo-Video produzieren
- [ ] App-Beschreibungen schreiben (DE/EN)
- [ ] Datenschutzerklärung und AGB
- [ ] Support-Dokumentation erstellen
- [ ] Beta-Testing mit echten Shopify-Stores

### 11.2 Meilenstein-Kriterien

#### 11.2.1 Meilenstein 1: MVP Ready (Woche 4)
**Akzeptanzkriterien:**
- [ ] Benutzer kann Events erstellen und bearbeiten
- [ ] Events werden automatisch als Shopify-Produkte erstellt
- [ ] Ticket-Verkäufe aktualisieren Inventory korrekt
- [ ] Basis-Dashboard zeigt Event-Übersicht
- [ ] OAuth-Installation funktioniert mit Test-Store

**Deliverables:**
- Funktionsfähige Remix-App
- Shopify-Integration getestet
- Database-Schema implementiert
- Basis-UI mit Polaris-Komponenten

#### 11.2.2 Meilenstein 2: Advanced Features (Woche 8)
**Akzeptanzkriterien:**
- [ ] Inventory-Alerts erscheinen automatisch bei Low Stock
- [ ] SOLD OUT Badges mit Pulsing-Animation
- [ ] E-Mail-Benachrichtigungen bei kritischen Beständen
- [ ] Geografische Event-Sortierung funktioniert
- [ ] Venue-Datenbank mit Smart-Search

**Deliverables:**
- Vollständiges Alert-System
- Geografische Features implementiert
- E-Mail-Integration funktionsfähig
- Performance-optimierte Venue-Suche

#### 11.2.3 Meilenstein 3: Premium Ready (Woche 12)
**Akzeptanzkriterien:**
- [ ] Hardticket-Versand funktioniert Ende-zu-Ende
- [ ] Multi-Carrier-Integration (mindestens DE, US, UK)
- [ ] AI Event Assistant generiert sinnvolle Vorschläge
- [ ] Bulk-Import verarbeitet CSV-Dateien fehlerfrei
- [ ] Subscription-System mit Plan-Limits

**Deliverables:**
- Vollständiges Hardticket-System
- AI-Features implementiert
- Subscription-Management
- Multi-Market-Versand-Support

#### 11.2.4 Meilenstein 4: App Store Ready (Woche 16)
**Akzeptanzkriterien:**
- [ ] Alle Features funktionieren in Produktionsumgebung
- [ ] Performance-Benchmarks erfüllt (< 2s Dashboard-Load)
- [ ] Security-Audit bestanden
- [ ] App Store Assets erstellt (Screenshots, Video, Beschreibungen)
- [ ] Beta-Testing mit 10+ echten Shopify-Stores erfolgreich

**Deliverables:**
- Produktionsreife App auf Heroku
- Vollständige App Store Submission
- Support-Dokumentation
- Marketing-Materialien

---

## 12. Risiken & Mitigation

### 12.1 Technische Risiken

#### 12.1.1 Shopify API-Änderungen
**Risiko:** Shopify ändert API-Versionen oder Funktionalität
**Wahrscheinlichkeit:** Mittel
**Impact:** Hoch
**Mitigation:**
- Verwendung der neuesten stabilen API-Version
- Regelmäßige Updates und Tests
- Fallback-Mechanismen für kritische Features
- Monitoring von Shopify Developer-Announcements

#### 12.1.2 Performance bei Skalierung
**Risiko:** App wird langsam bei vielen Events/Teilnehmern
**Wahrscheinlichkeit:** Hoch
**Impact:** Mittel
**Mitigation:**
- Database-Indexing und Query-Optimierung
- Redis-Caching für häufige Abfragen
- CDN für statische Assets
- Horizontal Scaling auf Heroku

#### 12.1.3 Versand-API-Ausfälle
**Risiko:** DHL/USPS/Royal Mail APIs nicht verfügbar
**Wahrscheinlichkeit:** Niedrig
**Impact:** Mittel
**Mitigation:**
- Fallback auf alternative Carrier
- Retry-Mechanismen mit exponential backoff
- Manuelle Versandetikett-Erstellung als Backup
- Status-Page für Service-Verfügbarkeit

### 12.2 Business-Risiken

#### 12.2.1 App Store Ablehnung
**Risiko:** Shopify lehnt App-Submission ab
**Wahrscheinlichkeit:** Mittel
**Impact:** Hoch
**Mitigation:**
- Gründliche Review der App Store Guidelines
- Beta-Testing mit echten Shopify-Stores
- Professionelle Screenshots und Demo-Video
- Vollständige Dokumentation und Support

#### 12.2.2 Konkurrenz
**Risiko:** Andere Apps mit ähnlichen Features
**Wahrscheinlichkeit:** Hoch
**Impact:** Mittel
**Mitigation:**
- Fokus auf Alleinstellungsmerkmale (Hardticket-Versand)
- Kontinuierliche Feature-Entwicklung
- Starker Kundensupport
- Competitive Pricing

---

## 13. Qualitätssicherung

### 13.1 Code-Qualität

#### 13.1.1 Coding Standards
```typescript
// ESLint-Konfiguration
{
  "extends": [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "prefer-const": "error",
    "no-console": "warn",
    "react-hooks/exhaustive-deps": "error"
  }
}

// Prettier-Konfiguration
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

#### 13.1.2 Type Safety
```typescript
// Strikte TypeScript-Konfiguration
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true
  }
}

// Alle API-Responses typisiert
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### 13.2 Testing-Coverage

#### 13.2.1 Coverage-Ziele
- **Unit Tests:** 90%+ Coverage
- **Integration Tests:** 80%+ Coverage
- **E2E Tests:** Alle kritischen User-Flows
- **API Tests:** Alle Endpoints getestet
- **Performance Tests:** Load-Testing mit 1000+ concurrent users

#### 13.2.2 Test-Automation
```yaml
# GitHub Actions CI/CD
name: TicketForge CI/CD
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Check test coverage
        run: npm run test:coverage
      
      - name: Build app
        run: npm run build
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "ticket-forge-5e4b7e5068d7"
          heroku_email: "deploy@ticketforge.com"
```

---

## 14. Dokumentation & Support

### 14.1 Benutzer-Dokumentation

#### 14.1.1 Quick Start Guide
```markdown
# 🚀 TicketForge Quick Start (10 Minuten)

## Schritt 1: App installieren
1. Gehen Sie zu Shopify App Store
2. Suchen Sie "Event Ticketing Pro"
3. Klicken Sie "App installieren"
4. Bestätigen Sie die Berechtigungen

## Schritt 2: Erstes Event erstellen
1. Klicken Sie "Event erstellen"
2. Füllen Sie Titel, Venue, Datum aus
3. Fügen Sie Ticket-Kategorien hinzu
4. Klicken Sie "Event veröffentlichen"

## Schritt 3: Hardticket-Versand aktivieren (Optional)
1. Gehen Sie zu "Einstellungen" → "Hardticket-Addon"
2. Aktivieren Sie den Hardticket-Versand
3. Wählen Sie verfügbare Länder
4. Konfigurieren Sie Versandmethoden

## Schritt 4: Verkäufe überwachen
1. Dashboard zeigt Echtzeit-Statistiken
2. Inventory-Alerts warnen vor Low Stock
3. Export-Funktionen für Teilnehmerlisten
```

#### 14.1.2 Feature-Dokumentation
```markdown
# 📊 Inventory-Alert-System

## Automatische Warnungen
Das System überwacht kontinuierlich die Ticket-Verfügbarkeit:

### Alert-Stufen:
- **🔴 SOLD OUT** - 0 Tickets verfügbar
- **🟠 CRITICAL** - ≤5% verfügbar  
- **🟡 LOW STOCK** - ≤15% verfügbar

### Wo erscheinen Alerts:
- Event-Liste (prominente Badges)
- Dashboard (Alert-Karten)
- E-Mail-Benachrichtigungen
- Shopify-Produkt-Status

### Konfiguration:
1. Gehen Sie zu "Einstellungen" → "Benachrichtigungen"
2. Stellen Sie Warnschwellen ein
3. Konfigurieren Sie E-Mail-Empfänger
4. Aktivieren Sie gewünschte Alert-Typen
```

### 14.2 Entwickler-Dokumentation

#### 14.2.1 API-Dokumentation
```markdown
# 🔌 TicketForge API v1.0

## Authentifizierung
Alle API-Requests benötigen einen gültigen API-Key:

```bash
curl -H "Authorization: Bearer tf_live_sk_1234567890abcdef" \
     https://api.ticketforge.de/v1/events
```

## Rate Limits
- 1000 Requests/Stunde
- 100 Requests/Minute
- 10MB maximale Response-Größe

## Endpoints

### Events
- `GET /events` - Alle Events
- `POST /events` - Event erstellen
- `GET /events/{id}` - Event-Details
- `PUT /events/{id}` - Event aktualisieren

### Participants
- `GET /events/{id}/participants` - Teilnehmer exportieren
- `POST /participants/export` - Bulk-Export

### Analytics
- `GET /analytics` - Analytics-Daten
- `GET /analytics/revenue` - Umsatz-Daten
```

#### 14.2.2 Webhook-Dokumentation
```markdown
# 🔔 Webhook-Integration

## Shopify Webhooks (Incoming)
TicketForge verarbeitet folgende Shopify-Webhooks:

### orders/paid
Wird ausgelöst wenn eine Bestellung bezahlt wurde:
```json
{
  "id": 12345,
  "email": "customer@example.com",
  "line_items": [
    {
      "vendor": "TicketForge",
      "sku": "evt_123-cat_456",
      "quantity": 2
    }
  ]
}
```

### Verarbeitung:
1. SKU parsen um Event und Kategorie zu identifizieren
2. Inventory entsprechend reduzieren
3. Inventory-Alerts prüfen und ggf. versenden
4. Hardticket-Bestellung erstellen (falls Addon gekauft)
```

---

## 15. Anhang

### 15.1 Glossar

**Event:** Eine Veranstaltung mit Datum, Uhrzeit und Venue  
**Ticket-Kategorie:** Verschiedene Ticket-Typen (VIP, General, etc.)  
**Hardticket:** Physisch gedrucktes Ticket per Post  
**Inventory-Alert:** Automatische Warnung bei niedrigem Bestand  
**Venue:** Veranstaltungsort mit Adresse und Kapazität  
**EAN-Code:** 13-stelliger Barcode für Ticket-Tracking  
**QR-Code:** 2D-Barcode für schnelle Ticket-Validierung  
**Shopify-Variante:** Produkt-Variation für verschiedene Ticket-Kategorien  

### 15.2 Abkürzungen

**API:** Application Programming Interface  
**CRUD:** Create, Read, Update, Delete  
**CSV:** Comma-Separated Values  
**DSGVO:** Datenschutz-Grundverordnung  
**E2E:** End-to-End  
**MVP:** Minimum Viable Product  
**OAuth:** Open Authorization  
**ORM:** Object-Relational Mapping  
**REST:** Representational State Transfer  
**SEO:** Search Engine Optimization  
**UI/UX:** User Interface/User Experience  
**UUID:** Universally Unique Identifier  

### 15.3 Referenzen

**Shopify-Dokumentation:**
- App Development: https://shopify.dev/docs/apps
- Admin API: https://shopify.dev/docs/api/admin
- Polaris Design System: https://polaris.shopify.com

**Framework-Dokumentation:**
- Remix: https://remix.run/docs
- React: https://react.dev
- Prisma: https://www.prisma.io/docs
- TypeScript: https://www.typescriptlang.org/docs

**Deployment-Plattformen:**
- Heroku: https://devcenter.heroku.com
- Vercel: https://vercel.com/docs
- DigitalOcean: https://docs.digitalocean.com

---

**📋 Ende des Lastenhefts**

**Projekt:** TicketForge - Shopify Event Ticketing App  
**Version:** 1.0  
**Datum:** Januar 2025  
**Status:** Bereit für Entwicklung  

**🎯 Nächster Schritt:** Entwicklungs-Team briefen und Phase 1 starten