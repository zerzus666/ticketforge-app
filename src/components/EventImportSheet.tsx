import React, { useState, useRef, useCallback } from 'react';
import { 
  Upload, 
  Download, 
  Save, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Search, 
  Plus,
  Edit,
  Trash2,
  Copy,
  RefreshCw,
  FileSpreadsheet,
  Database,
  MapPin,
  Building,
  Users,
  DollarSign,
  Calendar,
  Clock
} from 'lucide-react';
import type { Event, Venue, TicketCategory } from '../types';
import { enhanceVenueWithLocation } from '../utils/locationParser';
import { searchVenues, VenueSearchResult } from '../utils/venueUtils';

interface ImportRow {
  id: string;
  eventTitle: string;
  description: string;
  date: string;
  time: string;
  endTime: string;
  doorsOpen: string;
  venueName: string;
  venueAddress: string;
  venueCapacity: string;
  venueType: string;
  organizerName: string;
  organizerEmail: string;
  organizerPhone: string;
  category: string;
  imageUrl1: string;
  imageUrl2: string;
  imageUrl3: string;
  ticketCategory1Name: string;
  ticketCategory1Price: string;
  ticketCategory1Capacity: string;
  ticketCategory2Name: string;
  ticketCategory2Price: string;
  ticketCategory2Capacity: string;
  ticketCategory3Name: string;
  ticketCategory3Price: string;
  ticketCategory3Capacity: string;
  status: 'pending' | 'validated' | 'error' | 'venue_suggestion';
  errors: string[];
  venueMatches?: VenueSearchResult[];
  selectedVenueId?: string;
}

interface EventImportSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (events: Partial<Event>[]) => void;
  existingVenues: Venue[];
}

const EventImportSheet: React.FC<EventImportSheetProps> = ({
  isOpen,
  onClose,
  onImport,
  existingVenues
}) => {
  const [importRows, setImportRows] = useState<ImportRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showVenueSuggestions, setShowVenueSuggestions] = useState<{[key: string]: boolean}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Template für CSV-Download
  const csvTemplate = `Event Title,Description,Date,Time,End Time,Doors Open,Venue Name,Venue Address,Venue Capacity,Venue Type,Organizer Name,Organizer Email,Organizer Phone,Category,Image URL 1,Image URL 2,Image URL 3,Ticket Category 1 Name,Ticket Category 1 Price,Ticket Category 1 Capacity,Ticket Category 2 Name,Ticket Category 2 Price,Ticket Category 2 Capacity,Ticket Category 3 Name,Ticket Category 3 Price,Ticket Category 3 Capacity
Summer Music Festival 2024,"Das größte Musikfestival des Jahres mit internationalen Top-Acts",2024-07-15,18:00,23:00,17:00,Central Park,Central Park New York NY 10024,50000,outdoor,MusicEvents GmbH,info@musicevents.de,+49 30 12345678,Musik,https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg,https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg,https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg,VIP,299,500,Premium,149,2000,General Admission,89,10000
Electronic Music Night Leipzig,"Underground Electronic Music Event in der legendären Werk2 Location",2024-06-22,22:00,04:00,21:30,Werk2 - Kulturfabrik Leipzig,"Kochstraße 132, 04277 Leipzig, Deutschland",800,club,Leipzig Electronic Events,info@leipzig-electronic.de,+49 341 98765432,Musik,https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg,https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg,https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg,Early Bird,15,200,Regular,22,400,VIP,45,100
Jazz Night Intimate,"Exklusive Jazz-Performance in intimer Atmosphäre",2024-08-20,20:00,23:30,19:30,Blue Note NYC,131 W 3rd St New York NY 10012,200,club,Jazz Productions,contact@jazzprod.com,+1 555 123 4567,Musik,https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg,https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg,,Table Seating,85,120,Bar Seating,45,80,,,,
Tech Conference 2024,"Führende Technologie-Konferenz mit Branchenexperten",2024-09-10,09:00,18:00,08:30,Convention Center Berlin,Messedamm 22 14055 Berlin,2000,conference,TechEvents Berlin,info@techevents.de,+49 30 98765432,Business,https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg,,,Standard,150,1500,Premium,250,500,,,,`;

  const downloadTemplate = () => {
    const blob = new Blob([csvTemplate], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'event_import_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      alert('Bitte nur CSV-Dateien hochladen');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvContent = event.target?.result as string;
      parseCSV(csvContent);
    };
    reader.readAsText(file);
  };

  const parseCSV = (csvContent: string) => {
    const lines = csvContent.split('\n');
    if (lines.length < 2) {
      alert('CSV-Datei ist leer oder ungültig');
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows: ImportRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      
      const row: ImportRow = {
        id: Date.now().toString() + i,
        eventTitle: values[0] || '',
        description: values[1] || '',
        date: values[2] || '',
        time: values[3] || '',
        endTime: values[4] || '',
        doorsOpen: values[5] || '',
        venueName: values[6] || '',
        venueAddress: values[7] || '',
        venueCapacity: values[8] || '',
        venueType: values[9] || 'outdoor',
        organizerName: values[10] || '',
        organizerEmail: values[11] || '',
        organizerPhone: values[12] || '',
        category: values[13] || '',
        imageUrl1: values[14] || '',
        imageUrl2: values[15] || '',
        imageUrl3: values[16] || '',
        ticketCategory1Name: values[17] || '',
        ticketCategory1Price: values[18] || '',
        ticketCategory1Capacity: values[19] || '',
        ticketCategory2Name: values[20] || '',
        ticketCategory2Price: values[21] || '',
        ticketCategory2Capacity: values[22] || '',
        ticketCategory3Name: values[23] || '',
        ticketCategory3Price: values[24] || '',
        ticketCategory3Capacity: values[25] || '',
        status: 'pending',
        errors: []
      };

      rows.push(row);
    }

    setImportRows(rows);
    validateAndMatchVenues(rows);
  };

  const validateAndMatchVenues = async (rows: ImportRow[]) => {
    setIsProcessing(true);

    const updatedRows = rows.map(row => {
      const errors: string[] = [];
      
      // Validierung
      if (!row.eventTitle.trim()) errors.push('Event-Titel fehlt');
      if (!row.date) errors.push('Datum fehlt');
      if (!row.time) errors.push('Uhrzeit fehlt');
      if (!row.venueName.trim()) errors.push('Venue-Name fehlt');
      if (!row.venueAddress.trim()) errors.push('Venue-Adresse fehlt');
      if (!row.ticketCategory1Name.trim()) errors.push('Mindestens eine Ticket-Kategorie erforderlich');
      if (!row.ticketCategory1Price || isNaN(parseFloat(row.ticketCategory1Price))) errors.push('Gültiger Ticket-Preis erforderlich');
      
      // Bild-URL Validierung (optional aber wenn angegeben, dann gültig)
      [row.imageUrl1, row.imageUrl2, row.imageUrl3].forEach((url, index) => {
        if (url && !url.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i)) {
          errors.push(`Bild URL ${index + 1} ist ungültig (muss https:// und .jpg/.png/.gif/.webp enden)`);
        }
      });

      // Venue-Matching
      let venueMatches: VenueSearchResult[] = [];
      if (row.venueName.trim()) {
        venueMatches = searchVenues(existingVenues, row.venueName, {
          city: row.venueAddress.split(',')[1]?.trim()
        });
      }

      return {
        ...row,
        errors,
        venueMatches,
        status: errors.length > 0 ? 'error' as const : 
                venueMatches.length > 0 ? 'venue_suggestion' as const : 
                'validated' as const
      };
    });

    setImportRows(updatedRows);
    setIsProcessing(false);
  };

  const updateCell = (rowId: string, field: keyof ImportRow, value: string) => {
    setImportRows(prev => prev.map(row => 
      row.id === rowId ? { ...row, [field]: value } : row
    ));
  };

  const selectVenue = (rowId: string, venueId: string) => {
    const venue = existingVenues.find(v => v.id === venueId);
    if (!venue) return;

    setImportRows(prev => prev.map(row => 
      row.id === rowId ? {
        ...row,
        selectedVenueId: venueId,
        venueName: venue.name,
        venueAddress: venue.address,
        venueCapacity: venue.capacity.toString(),
        venueType: venue.type,
        status: 'validated' as const
      } : row
    ));

    setShowVenueSuggestions(prev => ({ ...prev, [rowId]: false }));
  };

  const addNewRow = () => {
    const newRow: ImportRow = {
      id: Date.now().toString(),
      eventTitle: '',
      description: '',
      date: '',
      time: '',
      endTime: '',
      doorsOpen: '',
      venueName: '',
      venueAddress: '',
      venueCapacity: '',
      venueType: 'outdoor',
      organizerName: '',
      organizerEmail: '',
      organizerPhone: '',
      category: '',
      ticketCategory1Name: '',
      ticketCategory1Price: '',
      ticketCategory1Capacity: '',
      ticketCategory2Name: '',
      ticketCategory2Price: '',
      ticketCategory2Capacity: '',
      ticketCategory3Name: '',
      ticketCategory3Price: '',
      ticketCategory3Capacity: '',
      status: 'pending',
      errors: []
    };

    setImportRows(prev => [...prev, newRow]);
  };

  const removeRow = (rowId: string) => {
    setImportRows(prev => prev.filter(row => row.id !== rowId));
  };

  const duplicateRow = (rowId: string) => {
    const rowToDuplicate = importRows.find(row => row.id === rowId);
    if (!rowToDuplicate) return;

    const duplicatedRow: ImportRow = {
      ...rowToDuplicate,
      id: Date.now().toString(),
      eventTitle: rowToDuplicate.eventTitle + ' (Kopie)'
    };

    setImportRows(prev => [...prev, duplicatedRow]);
  };

  const handleImport = () => {
    const validRows = importRows.filter(row => row.status === 'validated' || row.status === 'venue_suggestion');
    
    if (validRows.length === 0) {
      alert('Keine gültigen Events zum Import gefunden');
      return;
    }

    const events: Partial<Event>[] = validRows.map(row => {
      // Venue erstellen oder verwenden
      let venue: Venue;
      if (row.selectedVenueId) {
        venue = existingVenues.find(v => v.id === row.selectedVenueId)!;
      } else {
        venue = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: row.venueName,
          address: row.venueAddress,
          capacity: parseInt(row.venueCapacity) || 0,
          type: row.venueType as any,
          coordinates: { lat: 0, lng: 0 },
          amenities: [],
          seatingChart: ''
        };
      }

      // Ticket-Kategorien erstellen
      const ticketCategories: TicketCategory[] = [];
      
      if (row.ticketCategory1Name && row.ticketCategory1Price && row.ticketCategory1Capacity) {
        ticketCategories.push({
          id: '1',
          name: row.ticketCategory1Name,
          price: parseFloat(row.ticketCategory1Price),
          capacity: parseInt(row.ticketCategory1Capacity),
          sold: 0,
          reserved: 0,
          description: '',
          benefits: [],
          color: '#3B82F6'
        });
      }

      if (row.ticketCategory2Name && row.ticketCategory2Price && row.ticketCategory2Capacity) {
        ticketCategories.push({
          id: '2',
          name: row.ticketCategory2Name,
          price: parseFloat(row.ticketCategory2Price),
          capacity: parseInt(row.ticketCategory2Capacity),
          sold: 0,
          reserved: 0,
          description: '',
          benefits: [],
          color: '#10B981'
        });
      }

      if (row.ticketCategory3Name && row.ticketCategory3Price && row.ticketCategory3Capacity) {
        ticketCategories.push({
          id: '3',
          name: row.ticketCategory3Name,
          price: parseFloat(row.ticketCategory3Price),
          capacity: parseInt(row.ticketCategory3Capacity),
          sold: 0,
          reserved: 0,
          description: '',
          benefits: [],
          color: '#8B5CF6'
        });
      }

      const totalCapacity = ticketCategories.reduce((sum, cat) => sum + cat.capacity, 0);
      
      // Produktbilder aus URLs sammeln
      const productImages = [row.imageUrl1, row.imageUrl2, row.imageUrl3]
        .filter(url => url && url.trim())
        .filter(url => url.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i));

      return {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        title: row.eventTitle,
        description: row.description,
        date: row.date,
        time: row.time,
        endTime: row.endTime || undefined,
        doorsOpen: row.doorsOpen || undefined,
        venue: enhanceVenueWithLocation(venue),
        ticketCategories,
        organizer: {
          name: row.organizerName,
          email: row.organizerEmail,
          phone: row.organizerPhone,
          company: '',
          address: {
            street: '',
            city: '',
            postalCode: '',
            country: 'Deutschland'
          }
        },
        category: row.category,
        status: 'published' as const,
        images: productImages,
        tags: [],
        totalCapacity,
        soldTickets: 0,
        reservedTickets: 0,
        revenue: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    });

    onImport(events);
    onClose();
    setImportRows([]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'validated':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'venue_suggestion':
        return <Search className="w-4 h-4 text-blue-600" />;
      default:
        return <RefreshCw className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'validated':
        return 'bg-emerald-100 text-emerald-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'venue_suggestion':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">📊 Event Import Sheet</h2>
              <p className="text-gray-600">Google Sheets-ähnlicher Event-Import mit Venue-Abgleich</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={downloadTemplate}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>📋 Template</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>📤 CSV Upload</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Import Statistics */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{importRows.length}</div>
              <div className="text-sm text-gray-600">Gesamt Zeilen</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-emerald-600">{importRows.filter(r => r.status === 'validated').length}</div>
              <div className="text-sm text-gray-600">Validiert</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{importRows.filter(r => r.status === 'venue_suggestion').length}</div>
              <div className="text-sm text-gray-600">Venue-Vorschläge</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">{importRows.filter(r => r.status === 'error').length}</div>
              <div className="text-sm text-gray-600">Fehler</div>
            </div>
          </div>
        </div>

        {/* Spreadsheet */}
        <div className="flex-1 overflow-auto">
          {importRows.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <FileSpreadsheet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">📊 Event Import Sheet</h3>
                <p className="text-gray-600 mb-6">Laden Sie eine CSV-Datei hoch oder fügen Sie manuell Events hinzu</p>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Upload className="w-5 h-5" />
                    <span>CSV hochladen</span>
                  </button>
                  <button
                    onClick={addNewRow}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Zeile hinzufügen</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="min-w-full">
              {/* Header */}
              <div className="bg-gray-100 border-b border-gray-300 sticky top-0 z-10">
                <div className="flex">
                  <div className="w-12 p-2 border-r border-gray-300 text-center text-xs font-medium text-gray-600">#</div>
                  <div className="w-48 p-2 border-r border-gray-300 text-xs font-medium text-gray-600">📋 Event Titel</div>
                  <div className="w-32 p-2 border-r border-gray-300 text-xs font-medium text-gray-600">📅 Datum</div>
                  <div className="w-24 p-2 border-r border-gray-300 text-xs font-medium text-gray-600">⏰ Zeit</div>
                  <div className="w-40 p-2 border-r border-gray-300 text-xs font-medium text-gray-600">🏟️ Venue</div>
                  <div className="w-48 p-2 border-r border-gray-300 text-xs font-medium text-gray-600">📍 Adresse</div>
                  <div className="w-32 p-2 border-r border-gray-300 text-xs font-medium text-gray-600">👤 Veranstalter</div>
                  <div className="w-48 p-2 border-r border-gray-300 text-xs font-medium text-gray-600">🖼️ Produktbild</div>
                  <div className="w-32 p-2 border-r border-gray-300 text-xs font-medium text-gray-600">🎫 Kategorie 1</div>
                  <div className="w-24 p-2 border-r border-gray-300 text-xs font-medium text-gray-600">💰 Preis 1</div>
                  <div className="w-24 p-2 border-r border-gray-300 text-xs font-medium text-gray-600">👥 Kapazität 1</div>
                  <div className="w-32 p-2 border-r border-gray-300 text-xs font-medium text-gray-600">🎫 Kategorie 2</div>
                  <div className="w-24 p-2 border-r border-gray-300 text-xs font-medium text-gray-600">💰 Preis 2</div>
                  <div className="w-24 p-2 border-r border-gray-300 text-xs font-medium text-gray-600">👥 Kapazität 2</div>
                  <div className="w-24 p-2 border-r border-gray-300 text-xs font-medium text-gray-600">✅ Status</div>
                  <div className="w-32 p-2 text-xs font-medium text-gray-600">🔧 Aktionen</div>
                </div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-gray-200">
                {importRows.map((row, index) => (
                  <div key={row.id} className="relative">
                    <div className="flex hover:bg-gray-50 transition-colors">
                      <div className="w-12 p-2 border-r border-gray-200 text-center text-xs text-gray-600 bg-gray-50">
                        {index + 1}
                      </div>
                      
                      {/* Event Title */}
                      <div className="w-48 p-1 border-r border-gray-200">
                        <input
                          type="text"
                          value={row.eventTitle}
                          onChange={(e) => updateCell(row.id, 'eventTitle', e.target.value)}
                          className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-blue-500 rounded"
                          placeholder="Event-Titel..."
                        />
                      </div>

                      {/* Date */}
                      <div className="w-32 p-1 border-r border-gray-200">
                        <input
                          type="date"
                          value={row.date}
                          onChange={(e) => updateCell(row.id, 'date', e.target.value)}
                          className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-blue-500 rounded"
                        />
                      </div>

                      {/* Time */}
                      <div className="w-24 p-1 border-r border-gray-200">
                        <input
                          type="time"
                          value={row.time}
                          onChange={(e) => updateCell(row.id, 'time', e.target.value)}
                          className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-blue-500 rounded"
                        />
                      </div>

                      {/* Venue Name */}
                      <div className="w-40 p-1 border-r border-gray-200 relative">
                        <input
                          type="text"
                          value={row.venueName}
                          onChange={(e) => updateCell(row.id, 'venueName', e.target.value)}
                          className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-blue-500 rounded"
                          placeholder="Venue-Name..."
                        />
                        {row.venueMatches && row.venueMatches.length > 0 && (
                          <button
                            onClick={() => setShowVenueSuggestions(prev => ({ ...prev, [row.id]: !prev[row.id] }))}
                            className="absolute right-1 top-1 text-blue-600 hover:text-blue-800"
                          >
                            <Search className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Venue Address */}
                      <div className="w-48 p-1 border-r border-gray-200">
                        <input
                          type="text"
                          value={row.venueAddress}
                          onChange={(e) => updateCell(row.id, 'venueAddress', e.target.value)}
                          className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-blue-500 rounded"
                          placeholder="Venue-Adresse..."
                        />
                      </div>

                      {/* Organizer */}
                      <div className="w-32 p-1 border-r border-gray-200">
                        <input
                          type="text"
                          value={row.organizerName}
                          onChange={(e) => updateCell(row.id, 'organizerName', e.target.value)}
                          className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-blue-500 rounded"
                          placeholder="Veranstalter..."
                        />
                      </div>

                      {/* Image URLs */}
                      <div className="w-48 p-1 border-r border-gray-200">
                        <input
                          type="url"
                          value={row.imageUrl1}
                          onChange={(e) => updateCell(row.id, 'imageUrl1', e.target.value)}
                          className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-blue-500 rounded"
                          placeholder="https://images.pexels.com/..."
                        />
                      </div>

                      {/* Ticket Category 1 */}
                      <div className="w-32 p-1 border-r border-gray-200">
                        <input
                          type="text"
                          value={row.ticketCategory1Name}
                          onChange={(e) => updateCell(row.id, 'ticketCategory1Name', e.target.value)}
                          className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-blue-500 rounded"
                          placeholder="VIP, General..."
                        />
                      </div>

                      <div className="w-24 p-1 border-r border-gray-200">
                        <input
                          type="number"
                          value={row.ticketCategory1Price}
                          onChange={(e) => updateCell(row.id, 'ticketCategory1Price', e.target.value)}
                          className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-blue-500 rounded"
                          placeholder="€"
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <div className="w-24 p-1 border-r border-gray-200">
                        <input
                          type="number"
                          value={row.ticketCategory1Capacity}
                          onChange={(e) => updateCell(row.id, 'ticketCategory1Capacity', e.target.value)}
                          className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-blue-500 rounded"
                          placeholder="100"
                          min="1"
                        />
                      </div>

                      {/* Ticket Category 2 */}
                      <div className="w-32 p-1 border-r border-gray-200">
                        <input
                          type="text"
                          value={row.ticketCategory2Name}
                          onChange={(e) => updateCell(row.id, 'ticketCategory2Name', e.target.value)}
                          className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-blue-500 rounded"
                          placeholder="Optional..."
                        />
                      </div>

                      <div className="w-24 p-1 border-r border-gray-200">
                        <input
                          type="number"
                          value={row.ticketCategory2Price}
                          onChange={(e) => updateCell(row.id, 'ticketCategory2Price', e.target.value)}
                          className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-blue-500 rounded"
                          placeholder="€"
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <div className="w-24 p-1 border-r border-gray-200">
                        <input
                          type="number"
                          value={row.ticketCategory2Capacity}
                          onChange={(e) => updateCell(row.id, 'ticketCategory2Capacity', e.target.value)}
                          className="w-full px-2 py-1 text-xs border-0 focus:ring-1 focus:ring-blue-500 rounded"
                          placeholder="100"
                          min="1"
                        />
                      </div>

                      {/* Status */}
                      <div className="w-24 p-2 border-r border-gray-200 flex items-center justify-center">
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(row.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
                            {row.status === 'validated' ? 'OK' :
                             row.status === 'error' ? 'Fehler' :
                             row.status === 'venue_suggestion' ? 'Venue?' : 'Warten'}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="w-32 p-1 flex items-center justify-center space-x-1">
                        <button
                          onClick={() => duplicateRow(row.id)}
                          className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                          title="Zeile duplizieren"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeRow(row.id)}
                          className="text-red-600 hover:text-red-800 transition-colors p-1"
                          title="Zeile löschen"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Venue Suggestions Dropdown */}
                    {showVenueSuggestions[row.id] && row.venueMatches && row.venueMatches.length > 0 && (
                      <div className="absolute left-0 right-0 top-full bg-white border border-gray-300 rounded-lg shadow-lg z-20 m-2">
                        <div className="p-3 border-b border-gray-200">
                          <h5 className="font-semibold text-gray-900 flex items-center space-x-2">
                            <Database className="w-4 h-4 text-blue-600" />
                            <span>🎯 Venue-Vorschläge aus Datenbank</span>
                          </h5>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {row.venueMatches.map((match) => (
                            <button
                              key={match.venue.id}
                              onClick={() => selectVenue(row.id, match.venue.id)}
                              className="w-full text-left p-4 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-semibold text-gray-900">{match.venue.name}</div>
                                  <div className="text-sm text-gray-600">{match.venue.address}</div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {match.venue.capacity.toLocaleString()} Kapazität • {match.venue.type}
                                    {match.venue.amenities.length > 0 && ` • ${match.venue.amenities.slice(0, 2).join(', ')}`}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-medium text-blue-600">{match.matchScore}% Match</div>
                                  <div className="text-xs text-gray-500">{match.matchType}</div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                        <div className="p-3 border-t border-gray-200 bg-gray-50">
                          <button
                            onClick={() => setShowVenueSuggestions(prev => ({ ...prev, [row.id]: false }))}
                            className="text-sm text-gray-600 hover:text-gray-800"
                          >
                            ❌ Vorschläge schließen
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Error Messages */}
                    {row.errors.length > 0 && (
                      <div className="absolute left-0 right-0 top-full bg-red-50 border border-red-200 rounded-lg shadow-lg z-20 m-2 p-3">
                        <h5 className="font-semibold text-red-900 mb-2">❌ Validierungsfehler:</h5>
                        <ul className="space-y-1">
                          {row.errors.map((error, errorIndex) => (
                            <li key={errorIndex} className="text-sm text-red-700">• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={addNewRow}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>➕ Zeile hinzufügen</span>
              </button>
              <button
                onClick={() => validateAndMatchVenues(importRows)}
                disabled={isProcessing}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>🔄 Validiere...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>✅ Validieren</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {importRows.filter(r => r.status === 'validated' || r.status === 'venue_suggestion').length} von {importRows.length} Events bereit
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleImport}
                disabled={importRows.filter(r => r.status === 'validated' || r.status === 'venue_suggestion').length === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>📥 {importRows.filter(r => r.status === 'validated' || r.status === 'venue_suggestion').length} Events importieren</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventImportSheet;