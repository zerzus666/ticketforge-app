import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Download, 
  Filter, 
  Calendar, 
  Globe, 
  Users, 
  Ticket, 
  DollarSign,
  MapPin,
  Building,
  Search,
  X,
  CheckCircle,
  AlertTriangle,
  FileText,
  TrendingUp,
  Eye,
  RefreshCw
} from 'lucide-react';

interface ReportFilters {
  // Zeitraum
  dateFrom: string;
  dateTo: string;
  quickPeriod: string;
  
  // Geografie
  countries: string[];
  states: string[];
  cities: string[];
  postalCodes: string;
  regions: string[];
  
  // Kunden
  customerTypes: string[];
  ageGroups: string[];
  lifetimeValueMin: number;
  lifetimeValueMax: number;
  orderCountMin: number;
  orderCountMax: number;
  
  // Events
  eventIds: string[];
  categories: string[];
  venueTypes: string[];
  
  // Verhalten
  paymentMethods: string[];
  deviceTypes: string[];
  trafficSources: string[];
  
  // Anzeige
  groupBy: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface ParticipantData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  region: string;
  customerType: string;
  ageGroup: string;
  lifetimeValue: number;
  orderCount: number;
  eventId: string;
  eventTitle: string;
  category: string;
  venueType: string;
  paymentMethod: string;
  deviceType: string;
  trafficSource: string;
  purchaseDate: string;
  ticketPrice: number;
}

const ReportsAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('zeitraum');
  const [filters, setFilters] = useState<ReportFilters>({
    dateFrom: '',
    dateTo: '',
    quickPeriod: '30d',
    countries: [],
    states: [],
    cities: [],
    postalCodes: '',
    regions: [],
    customerTypes: [],
    ageGroups: [],
    lifetimeValueMin: 0,
    lifetimeValueMax: 10000,
    orderCountMin: 1,
    orderCountMax: 100,
    eventIds: [],
    categories: [],
    venueTypes: [],
    paymentMethods: [],
    deviceTypes: [],
    trafficSources: [],
    groupBy: 'month',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  // Mock Teilnehmer-Daten mit geografischen Informationen
  const mockParticipants: ParticipantData[] = [
    {
      id: '1',
      firstName: 'Anna',
      lastName: 'Müller',
      email: 'anna.mueller@email.com',
      city: 'Berlin',
      state: 'Berlin',
      country: 'Deutschland',
      postalCode: '10115',
      region: 'Ostdeutschland',
      customerType: 'Stammkunde',
      ageGroup: '25-34',
      lifetimeValue: 567,
      orderCount: 3,
      eventId: '1',
      eventTitle: 'Summer Music Festival 2024',
      category: 'Musik',
      venueType: 'outdoor',
      paymentMethod: 'Kreditkarte',
      deviceType: 'Desktop',
      trafficSource: 'Google',
      purchaseDate: '2024-01-15',
      ticketPrice: 89
    },
    {
      id: '2',
      firstName: 'Thomas',
      lastName: 'Schmidt',
      email: 'thomas.schmidt@email.com',
      city: 'München',
      state: 'Bayern',
      country: 'Deutschland',
      postalCode: '80331',
      region: 'Süddeutschland',
      customerType: 'VIP-Kunde',
      ageGroup: '35-44',
      lifetimeValue: 1245,
      orderCount: 8,
      eventId: '2',
      eventTitle: 'Jazz Night at Blue Note',
      category: 'Musik',
      venueType: 'club',
      paymentMethod: 'PayPal',
      deviceType: 'Mobile',
      trafficSource: 'Facebook',
      purchaseDate: '2024-01-10',
      ticketPrice: 85
    },
    {
      id: '3',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@email.com',
      city: 'Hamburg',
      state: 'Hamburg',
      country: 'Deutschland',
      postalCode: '20095',
      region: 'Norddeutschland',
      customerType: 'Neukunde',
      ageGroup: '18-24',
      lifetimeValue: 178,
      orderCount: 2,
      eventId: '3',
      eventTitle: 'Corporate Conference 2024',
      category: 'Business',
      venueType: 'conference',
      paymentMethod: 'Überweisung',
      deviceType: 'Tablet',
      trafficSource: 'Direkt',
      purchaseDate: '2024-01-08',
      ticketPrice: 150
    },
    {
      id: '4',
      firstName: 'Klaus',
      lastName: 'Weber',
      email: 'klaus.weber@email.com',
      city: 'Köln',
      state: 'Nordrhein-Westfalen',
      country: 'Deutschland',
      postalCode: '50667',
      region: 'Westdeutschland',
      customerType: 'Premium-Kunde',
      ageGroup: '45-54',
      lifetimeValue: 2890,
      orderCount: 12,
      eventId: '1',
      eventTitle: 'Summer Music Festival 2024',
      category: 'Musik',
      venueType: 'outdoor',
      paymentMethod: 'Kreditkarte',
      deviceType: 'Desktop',
      trafficSource: 'E-Mail',
      purchaseDate: '2023-12-20',
      ticketPrice: 299
    },
    {
      id: '5',
      firstName: 'Maria',
      lastName: 'Gonzalez',
      email: 'maria.gonzalez@email.com',
      city: 'Frankfurt',
      state: 'Hessen',
      country: 'Deutschland',
      postalCode: '60311',
      region: 'Westdeutschland',
      customerType: 'Wiederkäufer',
      ageGroup: '25-34',
      lifetimeValue: 445,
      orderCount: 4,
      eventId: '4',
      eventTitle: 'Tech Conference 2024',
      category: 'Business',
      venueType: 'conference',
      paymentMethod: 'PayPal',
      deviceType: 'Mobile',
      trafficSource: 'LinkedIn',
      purchaseDate: '2024-01-12',
      ticketPrice: 180
    }
  ];

  // Filter-Optionen
  const filterOptions = {
    countries: ['Deutschland', 'Österreich', 'Schweiz', 'USA', 'Vereinigtes Königreich', 'Frankreich', 'Italien', 'Spanien'],
    states: ['Bayern', 'Nordrhein-Westfalen', 'Baden-Württemberg', 'Berlin', 'Hamburg', 'Hessen', 'Sachsen', 'Niedersachsen'],
    cities: ['Berlin', 'München', 'Hamburg', 'Köln', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Leipzig', 'Dortmund', 'Essen'],
    regions: ['Norddeutschland', 'Süddeutschland', 'Westdeutschland', 'Ostdeutschland'],
    customerTypes: ['Neukunde', 'Wiederkäufer', 'Stammkunde', 'VIP-Kunde', 'Premium-Kunde'],
    ageGroups: ['13-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
    categories: ['Musik', 'Business', 'Sport', 'Kultur', 'Comedy', 'Theater'],
    venueTypes: ['arena', 'stadium', 'theater', 'club', 'outdoor', 'conference'],
    paymentMethods: ['Kreditkarte', 'PayPal', 'Überweisung', 'SEPA-Lastschrift'],
    deviceTypes: ['Desktop', 'Mobile', 'Tablet'],
    trafficSources: ['Google', 'Facebook', 'Instagram', 'E-Mail', 'Direkt', 'LinkedIn']
  };

  // Gefilterte Daten berechnen
  const filteredData = useMemo(() => {
    return mockParticipants.filter(participant => {
      // Länder-Filter
      if (filters.countries.length > 0 && !filters.countries.includes(participant.country)) {
        return false;
      }

      // Bundesländer-Filter
      if (filters.states.length > 0 && !filters.states.includes(participant.state)) {
        return false;
      }

      // Städte-Filter
      if (filters.cities.length > 0 && !filters.cities.includes(participant.city)) {
        return false;
      }

      // PLZ-Filter
      if (filters.postalCodes.trim()) {
        const plzList = filters.postalCodes.split(',').map(plz => plz.trim());
        const matchesPlz = plzList.some(plz => {
          if (plz.endsWith('*')) {
            // Wildcard-Unterstützung (z.B. "10*" für alle Berlin PLZ)
            const prefix = plz.slice(0, -1);
            return participant.postalCode.startsWith(prefix);
          }
          return participant.postalCode === plz;
        });
        if (!matchesPlz) return false;
      }

      // Regionen-Filter
      if (filters.regions.length > 0 && !filters.regions.includes(participant.region)) {
        return false;
      }

      // Kundentyp-Filter
      if (filters.customerTypes.length > 0 && !filters.customerTypes.includes(participant.customerType)) {
        return false;
      }

      // Altersgruppen-Filter
      if (filters.ageGroups.length > 0 && !filters.ageGroups.includes(participant.ageGroup)) {
        return false;
      }

      // Lifetime Value Filter
      if (participant.lifetimeValue < filters.lifetimeValueMin || participant.lifetimeValue > filters.lifetimeValueMax) {
        return false;
      }

      // Bestellanzahl-Filter
      if (participant.orderCount < filters.orderCountMin || participant.orderCount > filters.orderCountMax) {
        return false;
      }

      // Event-Filter
      if (filters.eventIds.length > 0 && !filters.eventIds.includes(participant.eventId)) {
        return false;
      }

      // Kategorie-Filter
      if (filters.categories.length > 0 && !filters.categories.includes(participant.category)) {
        return false;
      }

      // Venue-Typ-Filter
      if (filters.venueTypes.length > 0 && !filters.venueTypes.includes(participant.venueType)) {
        return false;
      }

      // Zahlungsmethoden-Filter
      if (filters.paymentMethods.length > 0 && !filters.paymentMethods.includes(participant.paymentMethod)) {
        return false;
      }

      // Gerätetyp-Filter
      if (filters.deviceTypes.length > 0 && !filters.deviceTypes.includes(participant.deviceType)) {
        return false;
      }

      // Traffic-Source-Filter
      if (filters.trafficSources.length > 0 && !filters.trafficSources.includes(participant.trafficSource)) {
        return false;
      }

      return true;
    });
  }, [filters, mockParticipants]);

  // Statistiken berechnen
  const statistics = useMemo(() => {
    const totalRevenue = filteredData.reduce((sum, p) => sum + p.ticketPrice, 0);
    const totalTickets = filteredData.length;
    const avgTicketPrice = totalTickets > 0 ? totalRevenue / totalTickets : 0;
    const uniqueCustomers = new Set(filteredData.map(p => p.email)).size;

    return {
      totalRevenue,
      totalTickets,
      avgTicketPrice,
      uniqueCustomers
    };
  }, [filteredData]);

  // Geografische Aufschlüsselung
  const geoBreakdown = useMemo(() => {
    const cityBreakdown = filteredData.reduce((acc, p) => {
      acc[p.city] = (acc[p.city] || 0) + p.ticketPrice;
      return acc;
    }, {} as {[key: string]: number});

    const stateBreakdown = filteredData.reduce((acc, p) => {
      acc[p.state] = (acc[p.state] || 0) + p.ticketPrice;
      return acc;
    }, {} as {[key: string]: number});

    return { cityBreakdown, stateBreakdown };
  }, [filteredData]);

  const updateFilter = (key: keyof ReportFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: keyof ReportFilters, value: string) => {
    setFilters(prev => {
      const currentArray = prev[key] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [key]: newArray };
    });
  };

  const resetFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      quickPeriod: '30d',
      countries: [],
      states: [],
      cities: [],
      postalCodes: '',
      regions: [],
      customerTypes: [],
      ageGroups: [],
      lifetimeValueMin: 0,
      lifetimeValueMax: 10000,
      orderCountMin: 1,
      orderCountMax: 100,
      eventIds: [],
      categories: [],
      venueTypes: [],
      paymentMethods: [],
      deviceTypes: [],
      trafficSources: [],
      groupBy: 'month',
      sortBy: 'date',
      sortOrder: 'desc'
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.countries.length > 0) count++;
    if (filters.states.length > 0) count++;
    if (filters.cities.length > 0) count++;
    if (filters.postalCodes.trim()) count++;
    if (filters.regions.length > 0) count++;
    if (filters.customerTypes.length > 0) count++;
    if (filters.ageGroups.length > 0) count++;
    if (filters.eventIds.length > 0) count++;
    if (filters.categories.length > 0) count++;
    if (filters.venueTypes.length > 0) count++;
    if (filters.paymentMethods.length > 0) count++;
    if (filters.deviceTypes.length > 0) count++;
    if (filters.trafficSources.length > 0) count++;
    return count;
  };

  const exportPDF = () => {
    const activeFilters = getActiveFilterCount();
    const filterSummary = [
      filters.countries.length > 0 ? `Länder: ${filters.countries.join(', ')}` : '',
      filters.states.length > 0 ? `Bundesländer: ${filters.states.join(', ')}` : '',
      filters.cities.length > 0 ? `Städte: ${filters.cities.join(', ')}` : '',
      filters.postalCodes.trim() ? `PLZ: ${filters.postalCodes}` : '',
      filters.regions.length > 0 ? `Regionen: ${filters.regions.join(', ')}` : '',
      filters.customerTypes.length > 0 ? `Kundentypen: ${filters.customerTypes.join(', ')}` : ''
    ].filter(Boolean);

    alert(`📄 PDF-Bericht wird erstellt...

📊 Gefilterte Daten:
• ${filteredData.length} Teilnehmer
• €${statistics.totalRevenue.toLocaleString()} Umsatz
• ${statistics.uniqueCustomers} einzigartige Kunden
• €${statistics.avgTicketPrice.toFixed(2)} Ø Ticketpreis

🔍 Aktive Filter (${activeFilters}):
${filterSummary.length > 0 ? filterSummary.join('\n') : 'Keine Filter aktiv'}

🗺️ Geografische Aufschlüsselung:
${Object.entries(geoBreakdown.cityBreakdown).slice(0, 5).map(([city, revenue]) => 
  `• ${city}: €${revenue.toLocaleString()}`
).join('\n')}

📄 PDF-Inhalt:
• Zusammenfassung der Filter
• Geografische Analysen
• Kundensegment-Aufschlüsselung
• Umsatz-Trends
• Detaillierte Tabellen

💾 PDF wird heruntergeladen...`);
  };

  const exportExcel = () => {
    const csvContent = [
      'Name,E-Mail,Stadt,Bundesland,PLZ,Land,Region,Kundentyp,Altersgruppe,Lifetime Value,Bestellungen,Event,Kategorie,Zahlungsmethode,Gerät,Traffic Source,Kaufdatum,Ticketpreis',
      ...filteredData.map(p => 
        `"${p.firstName} ${p.lastName}","${p.email}","${p.city}","${p.state}","${p.postalCode}","${p.country}","${p.region}","${p.customerType}","${p.ageGroup}",${p.lifetimeValue},${p.orderCount},"${p.eventTitle}","${p.category}","${p.paymentMethod}","${p.deviceType}","${p.trafficSource}","${p.purchaseDate}",${p.ticketPrice}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `berichte_gefiltert_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`📊 Excel-Export erfolgreich!

📄 Datei: berichte_gefiltert_${new Date().toISOString().split('T')[0]}.csv
📊 Inhalt: ${filteredData.length} gefilterte Datensätze

🌍 Geografische Spalten:
• Stadt, Bundesland, PLZ, Land, Region

👥 Kundendaten:
• Name, E-Mail, Kundentyp, Altersgruppe
• Lifetime Value, Bestellanzahl

🎫 Event-Daten:
• Event-Titel, Kategorie, Venue-Typ
• Ticketpreis, Kaufdatum

📱 Verhaltensdaten:
• Zahlungsmethode, Gerät, Traffic-Quelle

💾 Datei wurde in Downloads gespeichert.`);
  };

  const createShopifySegments = async () => {
    const segments = [
      // Geografische Segmente
      { name: 'Kunden Berlin', query: 'city:Berlin', type: 'geographic' },
      { name: 'Kunden München', query: 'city:München', type: 'geographic' },
      { name: 'Kunden Hamburg', query: 'city:Hamburg', type: 'geographic' },
      { name: 'Kunden Bayern', query: 'state:Bayern', type: 'geographic' },
      { name: 'Kunden NRW', query: 'state:"Nordrhein-Westfalen"', type: 'geographic' },
      { name: 'PLZ 10xxx (Berlin)', query: 'postal_code:10*', type: 'geographic' },
      { name: 'PLZ 80xxx (München)', query: 'postal_code:80*', type: 'geographic' },
      { name: 'PLZ 20xxx (Hamburg)', query: 'postal_code:20*', type: 'geographic' },

      // Verhaltens-Segmente
      { name: 'Event Neukunden', query: 'orders_count:1 AND tags:event', type: 'behavioral' },
      { name: 'Event Stammkunden', query: 'orders_count:>=5 AND tags:event', type: 'behavioral' },
      { name: 'VIP Event Kunden', query: 'total_spent:>=1000 AND tags:vip', type: 'behavioral' },
      { name: 'Festival Liebhaber', query: 'tags:festival OR tags:musik', type: 'behavioral' },
      { name: 'Business Event Kunden', query: 'tags:business OR tags:conference', type: 'behavioral' },

      // Wert-Segmente
      { name: 'High Value Kunden (>€1000)', query: 'total_spent:>=1000', type: 'value' },
      { name: 'Medium Value Kunden (€300-€1000)', query: 'total_spent:300..1000', type: 'value' },
      { name: 'Frequent Buyers (5+ Bestellungen)', query: 'orders_count:>=5', type: 'value' },

      // Zeit-Segmente
      { name: 'Aktive Kunden (90 Tage)', query: 'last_order_date:>=-90d', type: 'temporal' },
      { name: 'Inaktive Kunden (180+ Tage)', query: 'last_order_date:<=-180d', type: 'temporal' },
      { name: 'Neue Kunden (30 Tage)', query: 'created_date:>=-30d', type: 'temporal' }
    ];

    let successCount = 0;
    let errorCount = 0;

    for (const segment of segments) {
      try {
        // Simuliere Shopify Admin API Call
        console.log('🛍️ Erstelle Shopify Segment:', {
          customer_segment: {
            name: segment.name,
            query: segment.query
          }
        });
        
        // Simuliere API-Antwort
        await new Promise(resolve => setTimeout(resolve, 200));
        successCount++;
      } catch (error) {
        errorCount++;
      }
    }

    alert(`✅ Shopify-Segmente erstellt!

📊 Ergebnis:
• ${successCount} Segmente erfolgreich erstellt
• ${errorCount} Fehler

🌍 Geografische Segmente (8):
• Stadt-basiert: Berlin, München, Hamburg
• Bundesland-basiert: Bayern, NRW
• PLZ-basiert: 10xxx, 80xxx, 20xxx

👥 Verhaltens-Segmente (5):
• Event Neukunden, Stammkunden, VIP-Kunden
• Festival Liebhaber, Business Event Kunden

💰 Wert-Segmente (3):
• High Value (>€1000), Medium Value (€300-€1000)
• Frequent Buyers (5+ Bestellungen)

⏰ Zeit-Segmente (3):
• Aktive (90 Tage), Inaktive (180+ Tage), Neue (30 Tage)

🛍️ Segmente sind jetzt in Shopify verfügbar für:
• Zielgerichtete E-Mail-Kampagnen
• Personalisierte Angebote
• Retargeting-Kampagnen`);
  };

  const tabs = [
    { id: 'zeitraum', label: '📅 Zeitraum', icon: Calendar },
    { id: 'geografie', label: '🌍 Geografie', icon: Globe },
    { id: 'kunden', label: '👥 Kunden', icon: Users },
    { id: 'events', label: '🎫 Events', icon: Ticket },
    { id: 'verhalten', label: '📱 Verhalten', icon: TrendingUp },
    { id: 'anzeige', label: '📊 Anzeige', icon: BarChart3 }
  ];

  const renderZeitraumTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { id: '7d', label: 'Letzte 7 Tage' },
          { id: '30d', label: 'Letzte 30 Tage' },
          { id: '90d', label: 'Letzte 90 Tage' },
          { id: '1y', label: 'Letztes Jahr' }
        ].map(period => (
          <button
            key={period.id}
            onClick={() => updateFilter('quickPeriod', period.id)}
            className={`p-3 rounded-lg border-2 transition-colors ${
              filters.quickPeriod === period.id
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Von Datum</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => updateFilter('dateFrom', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bis Datum</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => updateFilter('dateTo', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderGeografieTab = () => (
    <div className="space-y-6">
      {/* Länder */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">🌍 Länder</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {filterOptions.countries.map(country => (
            <label key={country} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                checked={filters.countries.includes(country)}
                onChange={() => toggleArrayFilter('countries', country)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{country}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Bundesländer */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">🏛️ Bundesländer (Deutschland)</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {filterOptions.states.map(state => (
            <label key={state} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                checked={filters.states.includes(state)}
                onChange={() => toggleArrayFilter('states', state)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{state}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Städte */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">🏙️ Städte</label>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
          {filterOptions.cities.map(city => (
            <label key={city} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                checked={filters.cities.includes(city)}
                onChange={() => toggleArrayFilter('cities', city)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{city}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Postleitzahlen */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">📮 Postleitzahlen</label>
        <input
          type="text"
          value={filters.postalCodes}
          onChange={(e) => updateFilter('postalCodes', e.target.value)}
          placeholder="10115, 80331, 20095 oder 10* für alle Berlin PLZ"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          Komma-getrennt oder mit Wildcard (z.B. "10*" für alle Berlin PLZ)
        </p>
      </div>

      {/* Regionen */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">🗺️ Regionen</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {filterOptions.regions.map(region => (
            <label key={region} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                checked={filters.regions.includes(region)}
                onChange={() => toggleArrayFilter('regions', region)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{region}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderKundenTab = () => (
    <div className="space-y-6">
      {/* Kundentypen */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">👥 Kundentypen</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {filterOptions.customerTypes.map(type => (
            <label key={type} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                checked={filters.customerTypes.includes(type)}
                onChange={() => toggleArrayFilter('customerTypes', type)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Altersgruppen */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">🎂 Altersgruppen</label>
        <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
          {filterOptions.ageGroups.map(age => (
            <label key={age} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                checked={filters.ageGroups.includes(age)}
                onChange={() => toggleArrayFilter('ageGroups', age)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{age}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Lifetime Value */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">💰 Lifetime Value (€)</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Minimum</label>
            <input
              type="number"
              value={filters.lifetimeValueMin}
              onChange={(e) => updateFilter('lifetimeValueMin', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Maximum</label>
            <input
              type="number"
              value={filters.lifetimeValueMax}
              onChange={(e) => updateFilter('lifetimeValueMax', parseInt(e.target.value) || 10000)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Bestellanzahl */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">🛒 Anzahl Bestellungen</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Minimum</label>
            <input
              type="number"
              value={filters.orderCountMin}
              onChange={(e) => updateFilter('orderCountMin', parseInt(e.target.value) || 1)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Maximum</label>
            <input
              type="number"
              value={filters.orderCountMax}
              onChange={(e) => updateFilter('orderCountMax', parseInt(e.target.value) || 100)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderEventsTab = () => (
    <div className="space-y-6">
      {/* Event-Kategorien */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">🎭 Event-Kategorien</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {filterOptions.categories.map(category => (
            <label key={category} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => toggleArrayFilter('categories', category)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Venue-Typen */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">🏟️ Venue-Typen</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {filterOptions.venueTypes.map(type => (
            <label key={type} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                checked={filters.venueTypes.includes(type)}
                onChange={() => toggleArrayFilter('venueTypes', type)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderVerhaltenTab = () => (
    <div className="space-y-6">
      {/* Zahlungsmethoden */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">💳 Zahlungsmethoden</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {filterOptions.paymentMethods.map(method => (
            <label key={method} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                checked={filters.paymentMethods.includes(method)}
                onChange={() => toggleArrayFilter('paymentMethods', method)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{method}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Gerätetypen */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">📱 Gerätetypen</label>
        <div className="grid grid-cols-3 gap-2">
          {filterOptions.deviceTypes.map(device => (
            <label key={device} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                checked={filters.deviceTypes.includes(device)}
                onChange={() => toggleArrayFilter('deviceTypes', device)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{device}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Traffic-Quellen */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">🔗 Traffic-Quellen</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {filterOptions.trafficSources.map(source => (
            <label key={source} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                checked={filters.trafficSources.includes(source)}
                onChange={() => toggleArrayFilter('trafficSources', source)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{source}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnzeigeTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">📊 Gruppierung</label>
          <select
            value={filters.groupBy}
            onChange={(e) => updateFilter('groupBy', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="day">Nach Tag</option>
            <option value="week">Nach Woche</option>
            <option value="month">Nach Monat</option>
            <option value="city">Nach Stadt</option>
            <option value="state">Nach Bundesland</option>
            <option value="customerType">Nach Kundentyp</option>
            <option value="event">Nach Event</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">🔢 Sortierung</label>
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilter('sortBy', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="date">Nach Datum</option>
            <option value="revenue">Nach Umsatz</option>
            <option value="tickets">Nach Tickets</option>
            <option value="customers">Nach Kunden</option>
            <option value="city">Nach Stadt</option>
            <option value="state">Nach Bundesland</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">↕️ Reihenfolge</label>
          <select
            value={filters.sortOrder}
            onChange={(e) => updateFilter('sortOrder', e.target.value as 'asc' | 'desc')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="desc">Absteigend</option>
            <option value="asc">Aufsteigend</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'zeitraum': return renderZeitraumTab();
      case 'geografie': return renderGeografieTab();
      case 'kunden': return renderKundenTab();
      case 'events': return renderEventsTab();
      case 'verhalten': return renderVerhaltenTab();
      case 'anzeige': return renderAnzeigeTab();
      default: return renderZeitraumTab();
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📊 Berichte & Analytics</h1>
          <p className="text-gray-600 mt-1">Detaillierte Analysen mit geografischen und demografischen Filtern</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={createShopifySegments}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Building className="w-4 h-4" />
            <span>🛍️ Shopify-Segmente erstellen</span>
          </button>
        </div>
      </div>

      {/* Live-Statistiken */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{filteredData.length}</div>
          <div className="text-gray-600">Gefilterte Teilnehmer</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-2xl font-bold text-emerald-600">€{statistics.totalRevenue.toLocaleString()}</div>
          <div className="text-gray-600">Gefilterter Umsatz</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">{statistics.uniqueCustomers}</div>
          <div className="text-gray-600">Einzigartige Kunden</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">€{statistics.avgTicketPrice.toFixed(2)}</div>
          <div className="text-gray-600">Ø Ticketpreis</div>
        </div>
      </div>

      {/* Filter-Interface */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">🔍 Erweiterte Filter</h3>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                {getActiveFilterCount()} aktive Filter • {filteredData.length} Datensätze
              </span>
              <button
                onClick={resetFilters}
                className="text-red-600 hover:text-red-800 transition-colors flex items-center space-x-1"
              >
                <X className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter-Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-0 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Filter-Inhalt */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Geografische Aufschlüsselung */}
      {(filters.cities.length > 0 || filters.states.length > 0) && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🗺️ Geografische Aufschlüsselung</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stadt-Breakdown */}
            {Object.keys(geoBreakdown.cityBreakdown).length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">🏙️ Umsatz nach Stadt</h4>
                <div className="space-y-2">
                  {Object.entries(geoBreakdown.cityBreakdown)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 10)
                    .map(([city, revenue]) => (
                      <div key={city} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium text-gray-900">{city}</span>
                        <span className="text-sm text-blue-600">€{revenue.toLocaleString()}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Bundesland-Breakdown */}
            {Object.keys(geoBreakdown.stateBreakdown).length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">🏛️ Umsatz nach Bundesland</h4>
                <div className="space-y-2">
                  {Object.entries(geoBreakdown.stateBreakdown)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 10)
                    .map(([state, revenue]) => (
                      <div key={state} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium text-gray-900">{state}</span>
                        <span className="text-sm text-emerald-600">€{revenue.toLocaleString()}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Export-Aktionen */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">📤 Export-Optionen</h3>
            <p className="text-gray-600 text-sm">
              {filteredData.length} Datensätze • {getActiveFilterCount()} aktive Filter
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={exportPDF}
              disabled={filteredData.length === 0}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>📄 PDF ({filteredData.length})</span>
            </button>
            
            <button
              onClick={exportExcel}
              disabled={filteredData.length === 0}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>📊 Excel ({filteredData.length})</span>
            </button>
          </div>
        </div>

        {filteredData.length === 0 && getActiveFilterCount() > 0 && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-yellow-800">⚠️ Keine Daten gefunden</span>
            </div>
            <p className="text-yellow-700 text-sm mt-1">
              Ihre Filter-Kombination ergab keine Ergebnisse. Versuchen Sie weniger restriktive Filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsAnalytics;