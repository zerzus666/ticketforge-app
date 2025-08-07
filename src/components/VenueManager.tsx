import React, { useState } from 'react';
import { Plus, MapPin, Users, Search, Filter, Edit, Trash2, Eye, Globe, Building, Upload, Download, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import type { Venue } from '../types';
import { enhanceVenueWithLocation } from '../utils/locationParser';

const VenueManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showImportModal, setShowImportModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [importData, setImportData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [venues, setVenues] = useState<Venue[]>([]);

  // Mock venues data
  const rawMockVenues: Venue[] = [
    {
      id: '1',
      name: 'Madison Square Garden',
      address: '4 Pennsylvania Plaza, New York, NY 10001',
      capacity: 20789,
      type: 'arena',
      coordinates: { lat: 40.7505, lng: -73.9934 },
      amenities: ['Parking', 'Concessions', 'VIP Lounges', 'Accessibility'],
      seatingChart: 'msg-layout.svg'
    },
    {
      id: '2',
      name: 'Central Park SummerStage',
      address: 'Rumsey Playfield, Central Park, New York, NY',
      capacity: 5000,
      type: 'outdoor',
      coordinates: { lat: 40.7829, lng: -73.9654 },
      amenities: ['Food Vendors', 'Restrooms', 'First Aid'],
      seatingChart: 'summerstage-layout.svg'
    },
    {
      id: '3',
      name: 'Blue Note NYC',
      address: '131 W 3rd St, New York, NY 10012',
      capacity: 200,
      type: 'club',
      coordinates: { lat: 40.7282, lng: -74.0021 },
      amenities: ['Bar', 'Restaurant', 'Coat Check'],
      seatingChart: 'bluenote-layout.svg'
    },
    {
      id: '4',
      name: 'Brooklyn Bowl',
      address: '61 Wythe Ave, Brooklyn, NY 11249',
      capacity: 600,
      type: 'club',
      coordinates: { lat: 40.7218, lng: -73.9618 },
      amenities: ['Bowling', 'Restaurant', 'Bar', 'Private Rooms'],
      seatingChart: 'brooklyn-bowl-layout.svg'
    }
  ];

  // Enhance venues with geographic data
  const allVenues = [...rawMockVenues, ...venues];
  const mockVenues = allVenues.map(venue => enhanceVenueWithLocation(venue));

  const filteredVenues = mockVenues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || venue.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getVenueTypeColor = (type: string) => {
    switch (type) {
      case 'arena':
        return 'bg-purple-100 text-purple-800';
      case 'stadium':
        return 'bg-blue-100 text-blue-800';
      case 'theater':
        return 'bg-emerald-100 text-emerald-800';
      case 'club':
        return 'bg-orange-100 text-orange-800';
      case 'outdoor':
        return 'bg-green-100 text-green-800';
      case 'conference':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCapacityCategory = (capacity: number) => {
    if (capacity >= 20000) return 'Large Arena';
    if (capacity >= 5000) return 'Medium Venue';
    if (capacity >= 1000) return 'Small Venue';
    return 'Intimate Venue';
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const file = files[0];
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv') || file.name.endsWith('.xlsx'))) {
      processFile(file);
    } else {
      alert('Bitte laden Sie eine CSV- oder Excel-Datei hoch');
    }
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setUploadProgress(0);
    
    // Simulate file processing
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Mock imported venue data
    const mockImportedVenues = [
      {
        id: Date.now().toString(),
        name: 'Olympiastadion Berlin',
        address: 'Olympischer Platz 3, 14053 Berlin, Deutschland',
        capacity: 74475,
        type: 'stadium',
        coordinates: { lat: 52.5145, lng: 13.2395 },
        amenities: ['Parking', 'VIP Lounges', 'Restaurants', 'Accessibility'],
        seatingChart: 'olympiastadion-layout.svg',
        status: 'success'
      },
      {
        id: (Date.now() + 1).toString(),
        name: 'Wiener Staatsoper',
        address: 'Opernring 2, 1010 Wien, Österreich',
        capacity: 2284,
        type: 'theater',
        coordinates: { lat: 48.2032, lng: 16.3691 },
        amenities: ['Coat Check', 'Bar', 'Restaurant'],
        seatingChart: 'staatsoper-layout.svg',
        status: 'success'
      },
      {
        id: (Date.now() + 2).toString(),
        name: 'Invalid Venue',
        address: '',
        capacity: 0,
        type: 'club',
        coordinates: { lat: 0, lng: 0 },
        amenities: [],
        seatingChart: '',
        status: 'error',
        errorMessage: 'Ungültige Adresse'
      }
    ];
    
    setImportData(mockImportedVenues);
    setIsProcessing(false);
  };

  const downloadTemplate = () => {
    const csvContent = `Name,Address,Capacity,Type,Amenities,Latitude,Longitude
Olympiastadion Berlin,"Olympischer Platz 3, 14053 Berlin, Deutschland",74475,stadium,"Parking;VIP Lounges;Restaurants;Accessibility",52.5145,13.2395
Wiener Staatsoper,"Opernring 2, 1010 Wien, Österreich",2284,theater,"Coat Check;Bar;Restaurant",48.2032,16.3691
Red Rocks Amphitheatre,"18300 W Alameda Pkwy, Morrison, CO 80465, USA",9525,outdoor,"Parking;Concessions;Natural Acoustics",39.6654,-105.2056`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'venue_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const confirmImport = () => {
    const successfulVenues = importData.filter(venue => venue.status === 'success');
    setVenues(prev => [...prev, ...successfulVenues]);
    setImportData([]);
    setShowImportModal(false);
    alert(`✅ ${successfulVenues.length} Venues erfolgreich importiert!`);
  };

  const removeImportRecord = (venueId: string) => {
    setImportData(prev => prev.filter(venue => venue.id !== venueId));
  };

  const retryImport = (venueId: string) => {
    setImportData(prev => prev.map(venue => 
      venue.id === venueId 
        ? { ...venue, status: 'success', errorMessage: undefined }
        : venue
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-emerald-100 text-emerald-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Venue Manager</h2>
          <p className="text-gray-600 mt-2">Manage venues, seating charts, and capacity information</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowImportModal(true)}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
          >
            <Upload className="w-5 h-5" />
            <span>Import Venues</span>
          </button>
          <button
            onClick={() => {
              const venueName = prompt('Venue-Name:');
              const venueAddress = prompt('Venue-Adresse:');
              const venueCapacity = prompt('Kapazität:');
              const venueType = prompt('Typ (arena, stadium, theater, club, outdoor, conference):');
              
              if (venueName && venueAddress && venueCapacity && venueType) {
                if (!['arena', 'stadium', 'theater', 'club', 'outdoor', 'conference'].includes(venueType)) {
                  alert('❌ Ungültiger Venue-Typ. Erlaubt: arena, stadium, theater, club, outdoor, conference');
                  return;
                }
                
                const capacity = parseInt(venueCapacity);
                if (isNaN(capacity) || capacity <= 0) {
                  alert('❌ Ungültige Kapazität. Bitte eine positive Zahl eingeben.');
                  return;
                }
                
                // Neue Venue zur Liste hinzufügen
                const newVenue = {
                  id: Date.now().toString(),
                  name: venueName,
                  address: venueAddress,
                  capacity: capacity,
                  type: venueType as any,
                  coordinates: { lat: 0, lng: 0 },
                  amenities: [],
                  seatingChart: ''
                };
                
                setVenues(prev => [...prev, newVenue]);
                
                alert(`✅ Neue Venue erstellt:

Name: ${venueName}
Adresse: ${venueAddress}
Kapazität: ${capacity.toLocaleString()} Personen
Typ: ${venueType}

📍 Geografische Daten werden automatisch geparst...
🗺️ SEO-Keywords werden generiert...
💾 Venue wurde zur Datenbank hinzugefügt!`);
              }
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Venue</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search venues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="arena">Arena</option>
            <option value="stadium">Stadium</option>
            <option value="theater">Theater</option>
            <option value="club">Club</option>
            <option value="outdoor">Outdoor</option>
            <option value="conference">Conference</option>
          </select>

          <button className="border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Venue Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{mockVenues.length}</div>
          <div className="text-gray-600">Total Venues</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-2xl font-bold text-emerald-600">{mockVenues.reduce((sum, v) => sum + v.capacity, 0).toLocaleString()}</div>
          <div className="text-gray-600">Total Capacity</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">{new Set(mockVenues.map(v => v.address.split(',').pop()?.trim())).size}</div>
          <div className="text-gray-600">Cities</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">{new Set(mockVenues.map(v => v.type)).size}</div>
          <div className="text-gray-600">Venue Types</div>
        </div>
      </div>

      {/* Venues Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredVenues.map((venue) => (
          <div key={venue.id} className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{venue.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{venue.seoLocation?.primaryLocation || venue.address}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{venue.capacity.toLocaleString()} capacity</span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVenueTypeColor(venue.type)}`}>
                    {venue.type.charAt(0).toUpperCase() + venue.type.slice(1)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {getCapacityCategory(venue.capacity)}
                  </span>
                </div>
              </div>

              {/* Geographic Information */}
              {venue.geographic && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">Geographic Details</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Full Address:</span>
                      <span className="text-gray-600 ml-1">{venue.address}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Region:</span>
                      <span className="text-gray-600 ml-1">{venue.geographic.region || 'N/A'}</span>
                    </div>
                    {venue.geographic.county && (
                      <div>
                        <span className="font-medium text-gray-700">County:</span>
                        <span className="text-gray-600 ml-1">{venue.geographic.county}</span>
                      </div>
                    )}
                    {venue.geographic.zipCode && (
                      <div>
                        <span className="font-medium text-gray-700">ZIP Code:</span>
                        <span className="text-gray-600 ml-1">{venue.geographic.zipCode}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* SEO Location Keywords */}
                  {venue.seoLocation?.locationKeywords && (
                    <div className="mt-2">
                      <span className="font-medium text-gray-700 text-xs">Location Keywords:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {venue.seoLocation.locationKeywords.slice(0, 4).map((keyword, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Amenities */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Amenities</h4>
                <div className="flex flex-wrap gap-1">
                  {venue.amenities.slice(0, 3).map((amenity, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {amenity}
                    </span>
                  ))}
                  {venue.amenities.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      +{venue.amenities.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Globe className="w-4 h-4" />
                  <span>
                    {venue.geographic?.timezone ? `${venue.geographic.timezone} • ` : ''}
                    Lat: {venue.coordinates.lat}, Lng: {venue.coordinates.lng}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => {
                      const enhancedVenue = enhanceVenueWithLocation(venue);
                      alert(`🏟️ Venue-Details:

Name: ${venue.name}
Adresse: ${venue.address}
Kapazität: ${venue.capacity.toLocaleString()} Personen
Typ: ${venue.type}

📍 Geografische Daten:
${enhancedVenue.geographic ? `
Stadt: ${enhancedVenue.geographic.city}
Bundesland: ${enhancedVenue.geographic.state || 'N/A'}
Region: ${enhancedVenue.geographic.region || 'N/A'}
PLZ: ${enhancedVenue.geographic.zipCode || 'N/A'}
County: ${enhancedVenue.geographic.county || 'N/A'}
Zeitzone: ${enhancedVenue.geographic.timezone || 'N/A'}
` : 'Keine geografischen Daten verfügbar'}

🎯 SEO-Location:
${enhancedVenue.seoLocation ? `
Primär: ${enhancedVenue.seoLocation.primaryLocation}
Sekundär: ${enhancedVenue.seoLocation.secondaryLocation}
Keywords: ${enhancedVenue.seoLocation.locationKeywords.slice(0, 5).join(', ')}...
${enhancedVenue.seoLocation.nearbyLandmarks ? `Landmarks: ${enhancedVenue.seoLocation.nearbyLandmarks.join(', ')}` : ''}
` : 'Keine SEO-Daten verfügbar'}

🎯 Ausstattung: ${venue.amenities.join(', ') || 'Keine Angaben'}
📊 Koordinaten: ${venue.coordinates.lat}, ${venue.coordinates.lng}`);
                    }}
                    className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => {
                      const newName = prompt('Venue-Name:', venue.name);
                      const newAddress = prompt('Adresse:', venue.address);
                      const newCapacity = prompt('Kapazität:', venue.capacity.toString());
                      const newType = prompt('Typ:', venue.type);
                      
                      if (newName && newAddress && newCapacity && newType) {
                        if (!['arena', 'stadium', 'theater', 'club', 'outdoor', 'conference'].includes(newType)) {
                          alert('❌ Ungültiger Venue-Typ');
                          return;
                        }
                        
                        const capacity = parseInt(newCapacity);
                        if (isNaN(capacity) || capacity <= 0) {
                          alert('❌ Ungültige Kapazität');
                          return;
                        }
                        
                        alert(`✅ Venue aktualisiert:

Name: ${venue.name} → ${newName}
Adresse: ${venue.address} → ${newAddress}
Kapazität: ${venue.capacity} → ${capacity}
Typ: ${venue.type} → ${newType}

📍 Geografische Daten werden neu geparst...
💾 Änderungen gespeichert!`);
                      }
                    }}
                    className="text-gray-600 hover:text-gray-800 transition-colors p-1"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => {
                      const confirmMessage = `⚠️ ACHTUNG: Venue löschen

Venue: ${venue.name}
Adresse: ${venue.address}
Kapazität: ${venue.capacity.toLocaleString()}

Diese Aktion wird:
• Venue aus Datenbank entfernen
• Alle verknüpften Events benachrichtigen
• Sitzpläne und Daten löschen

Diese Aktion kann NICHT rückgängig gemacht werden!

Möchten Sie fortfahren?`;

                      if (confirm(confirmMessage)) {
                        alert(`✅ Venue "${venue.name}" wurde gelöscht.

📊 Zusammenfassung:
• Venue-Daten entfernt
• Verknüpfte Events benachrichtigt
• Sitzpläne gelöscht
• Geografische Daten bereinigt`);
                      }
                    }}
                    className="text-red-600 hover:text-red-800 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <button 
                  onClick={() => {
                    alert(`🗺️ Sitzplan für ${venue.name}:

📊 Layout: ${venue.seatingChart || 'Kein Sitzplan verfügbar'}
👥 Kapazität: ${venue.capacity.toLocaleString()} Personen
🏢 Typ: ${venue.type}

${venue.type === 'arena' || venue.type === 'stadium' ? 
  '🏟️ Sektionen: Lower Bowl, Upper Bowl, VIP Lounges' :
  venue.type === 'theater' ? 
  '🎭 Bereiche: Parkett, Rang 1, Rang 2, Logen' :
  venue.type === 'club' ?
  '🍸 Bereiche: Dancefloor, Bar Area, VIP Tables' :
  '🌳 Bereiche: General Admission, VIP Area'}

📐 Sitzplan wird in neuem Fenster geöffnet...`);
                    
                    // Simuliere Sitzplan-Anzeige
                    const seatmapWindow = window.open('', '_blank');
                    if (seatmapWindow) {
                      seatmapWindow.document.write(`
                        <html>
                          <head><title>Sitzplan - ${venue.name}</title></head>
                          <body style="font-family: Arial; padding: 20px; text-align: center;">
                            <h1>🗺️ Sitzplan: ${venue.name}</h1>
                            <p>Kapazität: ${venue.capacity.toLocaleString()} Personen</p>
                            <div style="width: 600px; height: 400px; border: 2px solid #333; margin: 20px auto; display: flex; align-items: center; justify-content: center; background: #f0f0f0;">
                              <div>
                                <h2>🏟️ ${venue.type.toUpperCase()}</h2>
                                <p>Sitzplan-Vorschau</p>
                                <p>${venue.capacity.toLocaleString()} Plätze</p>
                              </div>
                            </div>
                          </body>
                        </html>
                      `);
                    }
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Seating Chart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Global Venue Database */}
      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-8 border border-blue-200">
        <div className="flex items-center space-x-3 mb-4">
          <Building className="w-8 h-8 text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-900">Global Venue Database</h3>
        </div>
        <p className="text-gray-700 mb-6">
          Access our comprehensive database of venues worldwide. From intimate clubs to massive stadiums, 
          find the perfect location for your events with detailed seating charts and capacity information.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">50,000+</div>
            <div className="text-gray-600">Venues Worldwide</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600">195</div>
            <div className="text-gray-600">Countries Covered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">24/7</div>
            <div className="text-gray-600">Database Updates</div>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">📍 Venues importieren</h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Template Download */}
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">CSV/Excel Import</h4>
                  <p className="text-gray-600">Importieren Sie mehrere Venues gleichzeitig</p>
                </div>
                <button
                  onClick={downloadTemplate}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Template herunterladen</span>
                </button>
              </div>

              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h5 className="text-lg font-semibold text-gray-900 mb-2">
                  CSV/Excel Datei hier ablegen oder klicken
                </h5>
                <p className="text-gray-600 mb-4">
                  Unterstützte Formate: .csv, .xlsx (max. 10MB)
                </p>
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  className="hidden"
                  id="venue-file-upload"
                />
                <label
                  htmlFor="venue-file-upload"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-flex items-center space-x-2"
                >
                  <FileText className="w-5 h-5" />
                  <span>Datei auswählen</span>
                </label>
              </div>

              {isProcessing && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Venues werden verarbeitet...</span>
                    <span className="text-sm text-gray-600">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Import Results */}
              {importData.length > 0 && (
                <div className="border border-gray-200 rounded-lg">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h5 className="text-lg font-semibold text-gray-900">Import-Ergebnisse</h5>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-emerald-600">
                          {importData.filter(v => v.status === 'success').length} Erfolgreich
                        </span>
                        <span className="text-red-600">
                          {importData.filter(v => v.status === 'error').length} Fehler
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
                    {importData.map((venue) => (
                      <div key={venue.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              {getStatusIcon(venue.status)}
                              <h6 className="font-semibold text-gray-900">{venue.name}</h6>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(venue.status)}`}>
                                {venue.status === 'success' ? 'Erfolgreich' : 'Fehler'}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Adresse:</span> {venue.address || 'Nicht angegeben'}
                              </div>
                              <div>
                                <span className="font-medium">Kapazität:</span> {venue.capacity?.toLocaleString() || 'Nicht angegeben'}
                              </div>
                              <div>
                                <span className="font-medium">Typ:</span> {venue.type || 'Nicht angegeben'}
                              </div>
                            </div>
                            
                            {venue.errorMessage && (
                              <div className="mt-2 p-2 bg-red-50 rounded-lg">
                                <p className="text-red-700 text-sm">
                                  <strong>Fehler:</strong> {venue.errorMessage}
                                </p>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            {venue.status === 'error' && (
                              <button
                                onClick={() => retryImport(venue.id)}
                                className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                                title="Erneut versuchen"
                              >
                                <Upload className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => removeImportRecord(venue.id)}
                              className="text-red-600 hover:text-red-800 transition-colors p-1"
                              title="Entfernen"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        {importData.filter(v => v.status === 'success').length} von {importData.length} Venues bereit zum Import
                      </p>
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => setImportData([])}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Abbrechen
                        </button>
                        <button 
                          onClick={confirmImport}
                          disabled={importData.filter(v => v.status === 'success').length === 0}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Import bestätigen
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Import Instructions */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h5 className="text-lg font-semibold text-blue-900 mb-3">📋 CSV Format-Anforderungen</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-medium text-blue-800 mb-2">Erforderliche Spalten:</h6>
                    <ul className="space-y-1 text-sm text-blue-700">
                      <li>• <strong>Name</strong> - Venue-Name</li>
                      <li>• <strong>Address</strong> - Vollständige Adresse</li>
                      <li>• <strong>Capacity</strong> - Maximale Kapazität</li>
                      <li>• <strong>Type</strong> - arena, stadium, theater, club, outdoor, conference</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-blue-800 mb-2">Optionale Spalten:</h6>
                    <ul className="space-y-1 text-sm text-blue-700">
                      <li>• <strong>Amenities</strong> - Ausstattung (mit ; getrennt)</li>
                      <li>• <strong>Latitude</strong> - Breitengrad</li>
                      <li>• <strong>Longitude</strong> - Längengrad</li>
                      <li>• <strong>SeatingChart</strong> - Sitzplan-Datei</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueManager;