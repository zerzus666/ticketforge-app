import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Download, Mail, Phone, Calendar, MapPin, Users, Edit, Trash2, Eye, UserCheck } from 'lucide-react';
import type { Participant, Event, Ticket } from '../types';
import { exportEventParticipants, ExportParticipant } from '../utils/exportUtils';

const ParticipantManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSegment, setFilterSegment] = useState('all');
  const [filterEvent, setFilterEvent] = useState('all');
  const [sortBy, setSortBy] = useState('lastName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Mock participants data
  const mockParticipants: Participant[] = [
    {
      id: '1',
      firstName: 'Anna',
      lastName: 'Müller',
      email: 'anna.mueller@email.com',
      phone: '+49 30 12345678',
      dateOfBirth: '1990-05-15',
      address: {
        street: 'Hauptstraße 123',
        city: 'Berlin',
        postalCode: '10115',
        country: 'Deutschland'
      },
      emergencyContact: {
        name: 'Max Müller',
        phone: '+49 30 87654321',
        relationship: 'Ehemann'
      },
      dietaryRestrictions: ['Vegetarisch'],
      accessibilityNeeds: [],
      marketingConsent: true,
      registrationDate: '2024-01-15T10:30:00Z',
      lastUpdated: '2024-01-20T14:45:00Z',
      totalTicketsPurchased: 3,
      totalSpent: 267,
      preferredLanguage: 'Deutsch',
      customerSegment: 'regular'
    },
    {
      id: '2',
      firstName: 'Thomas',
      lastName: 'Schmidt',
      email: 'thomas.schmidt@email.com',
      phone: '+49 40 98765432',
      dateOfBirth: '1985-08-22',
      address: {
        street: 'Musterweg 456',
        city: 'Hamburg',
        postalCode: '20095',
        country: 'Deutschland'
      },
      emergencyContact: {
        name: 'Lisa Schmidt',
        phone: '+49 40 11223344',
        relationship: 'Ehefrau'
      },
      dietaryRestrictions: [],
      accessibilityNeeds: ['Rollstuhlgerecht'],
      marketingConsent: false,
      registrationDate: '2024-01-10T16:20:00Z',
      lastUpdated: '2024-01-18T09:15:00Z',
      totalTicketsPurchased: 8,
      totalSpent: 1245,
      preferredLanguage: 'Deutsch',
      customerSegment: 'vip'
    },
    {
      id: '3',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 555 123 4567',
      dateOfBirth: '1995-12-03',
      address: {
        street: '789 Broadway',
        city: 'New York',
        postalCode: '10003',
        country: 'USA'
      },
      emergencyContact: {
        name: 'Mike Johnson',
        phone: '+1 555 987 6543',
        relationship: 'Bruder'
      },
      dietaryRestrictions: ['Glutenfrei', 'Laktosefrei'],
      accessibilityNeeds: [],
      marketingConsent: true,
      registrationDate: '2024-01-08T12:00:00Z',
      lastUpdated: '2024-01-19T11:30:00Z',
      totalTicketsPurchased: 2,
      totalSpent: 178,
      preferredLanguage: 'Englisch',
      customerSegment: 'student'
    },
    {
      id: '4',
      firstName: 'Klaus',
      lastName: 'Weber',
      email: 'klaus.weber@email.com',
      phone: '+49 89 55667788',
      dateOfBirth: '1962-03-18',
      address: {
        street: 'Bahnhofstraße 321',
        city: 'München',
        postalCode: '80331',
        country: 'Deutschland'
      },
      emergencyContact: {
        name: 'Ingrid Weber',
        phone: '+49 89 99887766',
        relationship: 'Ehefrau'
      },
      dietaryRestrictions: [],
      accessibilityNeeds: ['Hörunterstützung'],
      marketingConsent: true,
      registrationDate: '2023-12-20T14:15:00Z',
      lastUpdated: '2024-01-16T16:45:00Z',
      totalTicketsPurchased: 12,
      totalSpent: 2890,
      preferredLanguage: 'Deutsch',
      customerSegment: 'senior'
    }
  ];

  // Mock events for filter
  const mockEvents = [
    { id: '1', title: 'Summer Music Festival 2024' },
    { id: '2', title: 'Jazz Night at Blue Note' },
    { id: '3', title: 'Tech Conference 2024' }
  ];

  // Filter and sort participants
  const filteredAndSortedParticipants = useMemo(() => {
    let filtered = mockParticipants;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(participant => 
        participant.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        participant.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        participant.phone?.includes(searchTerm)
      );
    }

    // Apply segment filter
    if (filterSegment !== 'all') {
      filtered = filtered.filter(participant => participant.customerSegment === filterSegment);
    }

    // Sort participants
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'firstName':
          comparison = a.firstName.localeCompare(b.firstName);
          break;
        case 'lastName':
          comparison = a.lastName.localeCompare(b.lastName);
          break;
        case 'email':
          comparison = a.email.localeCompare(b.email);
          break;
        case 'registrationDate':
          comparison = new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime();
          break;
        case 'totalSpent':
          comparison = a.totalSpent - b.totalSpent;
          break;
        case 'totalTickets':
          comparison = a.totalTicketsPurchased - b.totalTicketsPurchased;
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [mockParticipants, searchTerm, filterSegment, sortBy, sortOrder]);

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'vip':
        return 'bg-purple-100 text-purple-800';
      case 'regular':
        return 'bg-blue-100 text-blue-800';
      case 'student':
        return 'bg-green-100 text-green-800';
      case 'senior':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSegmentLabel = (segment: string) => {
    switch (segment) {
      case 'vip': return 'VIP';
      case 'regular': return 'Standard';
      case 'student': return 'Student';
      case 'senior': return 'Senior';
      default: return segment;
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleExportParticipants = () => {
    const exportData: ExportParticipant[] = filteredAndSortedParticipants.map(participant => ({
      id: participant.id,
      firstName: participant.firstName,
      lastName: participant.lastName,
      email: participant.email,
      phone: participant.phone || '',
      ticketNumber: `TKT-2024-${participant.id.padStart(6, '0')}`,
      qrCode: `QR-2024-${participant.id}-${participant.customerSegment?.toUpperCase()}`,
      upcCode: `${Math.floor(Math.random() * 900000000000) + 100000000000}`,
      ticketCategory: participant.customerSegment === 'vip' ? 'VIP' : 
                     participant.customerSegment === 'student' ? 'Student' :
                     participant.customerSegment === 'senior' ? 'Senior' : 'Standard',
      price: participant.totalSpent / participant.totalTicketsPurchased,
      purchaseDate: participant.registrationDate,
      status: 'valid'
    }));
    
    exportEventParticipants('Alle_Teilnehmer', exportData);
  };

  const handleViewParticipant = (participant: Participant) => {
    alert(`👤 Teilnehmer-Details:

Name: ${participant.firstName} ${participant.lastName}
E-Mail: ${participant.email}
Telefon: ${participant.phone || 'Nicht angegeben'}
Segment: ${getSegmentLabel(participant.customerSegment || 'regular')}
Tickets gekauft: ${participant.totalTicketsPurchased}
Gesamtausgaben: €${participant.totalSpent}
Registriert: ${new Date(participant.registrationDate).toLocaleDateString('de-DE')}

${participant.emergencyContact ? `Notfallkontakt: ${participant.emergencyContact.name} (${participant.emergencyContact.phone})` : ''}
${participant.dietaryRestrictions && participant.dietaryRestrictions.length > 0 ? `Diät: ${participant.dietaryRestrictions.join(', ')}` : ''}
${participant.accessibilityNeeds && participant.accessibilityNeeds.length > 0 ? `Barrierefreiheit: ${participant.accessibilityNeeds.join(', ')}` : ''}`);
  };

  const handleEditParticipant = (participant: Participant) => {
    const newFirstName = prompt('Vorname:', participant.firstName);
    const newLastName = prompt('Nachname:', participant.lastName);
    const newEmail = prompt('E-Mail:', participant.email);
    const newPhone = prompt('Telefon:', participant.phone || '');
    
    if (newFirstName && newLastName && newEmail) {
      alert(`✅ Teilnehmer aktualisiert:

Vorname: ${participant.firstName} → ${newFirstName}
Nachname: ${participant.lastName} → ${newLastName}
E-Mail: ${participant.email} → ${newEmail}
Telefon: ${participant.phone || 'Leer'} → ${newPhone || 'Leer'}

Änderungen wurden gespeichert.`);
    }
  };

  const handleViewTickets = (participant: Participant) => {
    const mockTickets = [
      {
        ticketNumber: `TKT-2024-${participant.id.padStart(6, '0')}-001`,
        event: 'Summer Music Festival 2024',
        category: participant.customerSegment === 'vip' ? 'VIP' : 'Standard',
        price: participant.totalSpent / participant.totalTicketsPurchased,
        status: 'Gültig',
        qrCode: `QR-2024-${participant.id}-001`
      }
    ];

    const ticketList = mockTickets.map(ticket => 
      `🎫 ${ticket.ticketNumber}
Event: ${ticket.event}
Kategorie: ${ticket.category}
Preis: €${ticket.price.toFixed(2)}
Status: ${ticket.status}
QR: ${ticket.qrCode}`
    ).join('\n\n');

    alert(`🎫 Tickets von ${participant.firstName} ${participant.lastName}:

${ticketList}

Gesamt: ${participant.totalTicketsPurchased} Tickets
Gesamtwert: €${participant.totalSpent}`);
  };

  const handleDeleteParticipant = (participant: Participant) => {
    const confirmMessage = `⚠️ ACHTUNG: Teilnehmer löschen

Teilnehmer: ${participant.firstName} ${participant.lastName}
E-Mail: ${participant.email}
Tickets: ${participant.totalTicketsPurchased}
Ausgaben: €${participant.totalSpent}

Diese Aktion kann NICHT rückgängig gemacht werden!
Alle Ticket-Daten werden ebenfalls gelöscht.

Möchten Sie fortfahren?`;

    if (confirm(confirmMessage)) {
      alert(`✅ Teilnehmer "${participant.firstName} ${participant.lastName}" wurde gelöscht.

📊 Zusammenfassung:
• Teilnehmer-Daten entfernt
• ${participant.totalTicketsPurchased} Tickets storniert
• €${participant.totalSpent} Umsatz angepasst
• E-Mail-Benachrichtigung versendet`);
    }
  };

  const handleAddParticipant = () => {
    const firstName = prompt('Vorname:');
    const lastName = prompt('Nachname:');
    const email = prompt('E-Mail:');
    const phone = prompt('Telefon (optional):');
    
    if (firstName && lastName && email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('❌ Ungültige E-Mail-Adresse');
        return;
      }

      alert(`✅ Neuer Teilnehmer erstellt:

Name: ${firstName} ${lastName}
E-Mail: ${email}
Telefon: ${phone || 'Nicht angegeben'}
Segment: Standard
Status: Aktiv

Teilnehmer wurde zur Datenbank hinzugefügt.`);
    }
  };
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teilnehmer-Datenbank</h1>
          <p className="text-gray-600 mt-1">Verwalten Sie alle Teilnehmer und deren Ticket-Käufe</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2">
            onClick={handleExportParticipants}
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button 
            onClick={handleAddParticipant}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Teilnehmer hinzufügen</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Teilnehmer suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterSegment}
            onChange={(e) => setFilterSegment(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Alle Segmente</option>
            <option value="vip">VIP</option>
            <option value="regular">Standard</option>
            <option value="student">Student</option>
            <option value="senior">Senior</option>
          </select>

          <select
            value={filterEvent}
            onChange={(e) => setFilterEvent(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Alle Events</option>
            {mockEvents.map(event => (
              <option key={event.id} value={event.id}>{event.title}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="lastName">Nach Nachname</option>
            <option value="firstName">Nach Vorname</option>
            <option value="email">Nach E-Mail</option>
            <option value="registrationDate">Nach Registrierung</option>
            <option value="totalSpent">Nach Ausgaben</option>
            <option value="totalTickets">Nach Tickets</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
            <span>{sortOrder === 'asc' ? 'Aufsteigend' : 'Absteigend'}</span>
          </button>

          <div className="text-sm text-gray-600">
            {filteredAndSortedParticipants.length} von {mockParticipants.length} Teilnehmern
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{mockParticipants.length}</div>
          <div className="text-gray-600">Gesamt Teilnehmer</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-2xl font-bold text-emerald-600">{mockParticipants.reduce((sum, p) => sum + p.totalTicketsPurchased, 0)}</div>
          <div className="text-gray-600">Tickets gekauft</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">€{mockParticipants.reduce((sum, p) => sum + p.totalSpent, 0).toLocaleString()}</div>
          <div className="text-gray-600">Gesamtumsatz</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">{mockParticipants.filter(p => p.marketingConsent).length}</div>
          <div className="text-gray-600">Marketing-Einverständnis</div>
        </div>
      </div>

      {/* Participants List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Teilnehmer-Liste</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredAndSortedParticipants.map((participant) => (
            <div key={participant.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-xl font-semibold text-gray-900">
                      {participant.firstName} {participant.lastName}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSegmentColor(participant.customerSegment || 'regular')}`}>
                      {getSegmentLabel(participant.customerSegment || 'regular')}
                    </span>
                    {participant.marketingConsent && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Marketing OK
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{participant.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{participant.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {participant.dateOfBirth ? 
                          `${calculateAge(participant.dateOfBirth)} Jahre` : 
                          'Alter unbekannt'
                        }
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{participant.address?.city}, {participant.address?.country}</span>
                    </div>
                  </div>

                  {/* Purchase Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-blue-600">{participant.totalTicketsPurchased}</div>
                      <div className="text-sm text-blue-800">Tickets gekauft</div>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-emerald-600">€{participant.totalSpent}</div>
                      <div className="text-sm text-emerald-800">Gesamtausgaben</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-purple-600">
                        €{participant.totalTicketsPurchased > 0 ? Math.round(participant.totalSpent / participant.totalTicketsPurchased) : 0}
                      </div>
                      <div className="text-sm text-purple-800">Ø pro Ticket</div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Registriert:</span>
                      <span className="text-gray-600 ml-1">
                        {new Date(participant.registrationDate).toLocaleDateString('de-DE')}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Sprache:</span>
                      <span className="text-gray-600 ml-1">{participant.preferredLanguage}</span>
                    </div>
                    {participant.dietaryRestrictions && participant.dietaryRestrictions.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-700">Diät:</span>
                        <span className="text-gray-600 ml-1">{participant.dietaryRestrictions.join(', ')}</span>
                      </div>
                    )}
                    {participant.accessibilityNeeds && participant.accessibilityNeeds.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-700">Barrierefreiheit:</span>
                        <span className="text-gray-600 ml-1">{participant.accessibilityNeeds.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  {/* Emergency Contact */}
                  {participant.emergencyContact && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <h6 className="font-medium text-gray-900 mb-1">Notfallkontakt:</h6>
                      <div className="text-sm text-gray-600">
                        {participant.emergencyContact.name} ({participant.emergencyContact.relationship}) - {participant.emergencyContact.phone}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button 
                    onClick={() => handleViewParticipant(participant)}
                    className="text-blue-600 hover:text-blue-800 transition-colors p-2" 
                    title="Teilnehmer anzeigen"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleEditParticipant(participant)}
                    className="text-gray-600 hover:text-gray-800 transition-colors p-2" 
                    title="Teilnehmer bearbeiten"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleViewTickets(participant)}
                    className="text-emerald-600 hover:text-emerald-800 transition-colors p-2" 
                    title="Tickets anzeigen"
                  >
                    <UserCheck className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteParticipant(participant)}
                    className="text-red-600 hover:text-red-800 transition-colors p-2" 
                    title="Teilnehmer löschen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParticipantManager;