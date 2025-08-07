import React, { useState, useMemo } from 'react';
import { QrCode, Printer, Mail, Download, Search, Filter, Eye, Edit, Trash2, RefreshCw, CheckCircle, XCircle, Clock, AlertTriangle, X } from 'lucide-react';
import type { Ticket, Event, Participant } from '../types';
import { exportEventParticipants, exportTicketsPDF, ExportParticipant } from '../utils/exportUtils';

const TicketManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterEvent, setFilterEvent] = useState('all');
  const [sortBy, setSortBy] = useState('purchaseDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [exportFilters, setExportFilters] = useState({
    format: 'csv',
    includePersonalData: true,
    includeQRCodes: true,
    includeUPCCodes: true,
    includeSeatInfo: true,
    includeSpecialRequirements: true,
    onlyValidTickets: false,
    dateRange: { start: '', end: '' },
    selectedEvents: [] as string[],
    selectedCategories: [] as string[],
    selectedStatuses: [] as string[],
    emailDelivery: {
      enabled: false,
      recipients: [] as string[],
      subject: '',
      message: '',
      includePassword: false,
      password: ''
    }
  });
  const [newEmailRecipient, setNewEmailRecipient] = useState('');
  const [printOptions, setPrintOptions] = useState({
    layout: '1_per_page',
    paperSize: 'A4',
    quality: 'normal',
    includeQRCodes: true,
    includeUPCCodes: true,
    includeEventInfo: true,
    includeSeatInfo: true,
    includeParticipantInfo: true,
    onlyValidTickets: true,
    copies: 1
  });

  // Mock tickets data
  const mockTickets: Ticket[] = [
    {
      id: '1',
      eventId: '1',
      categoryId: '1',
      participantId: '1',
      ticketNumber: 'TKT-2024-001234',
      qrCode: 'QR-SMF2024-001234-VIP',
      upcCode: '123456789012',
      price: 299,
      purchaseDate: '2024-01-15T10:30:00Z',
      status: 'valid',
      seatNumber: '12',
      section: 'VIP-A',
      row: '5',
      validFrom: '2024-07-15T16:00:00Z',
      validUntil: '2024-07-16T02:00:00Z',
      specialRequirements: ['Rollstuhlgerecht']
    },
    {
      id: '2',
      eventId: '1',
      categoryId: '2',
      participantId: '2',
      ticketNumber: 'TKT-2024-001235',
      qrCode: 'QR-SMF2024-001235-GA',
      upcCode: '123456789013',
      price: 89,
      purchaseDate: '2024-01-16T14:20:00Z',
      status: 'used',
      validFrom: '2024-07-15T16:00:00Z',
      validUntil: '2024-07-16T02:00:00Z'
    },
    {
      id: '3',
      eventId: '2',
      categoryId: '3',
      participantId: '3',
      ticketNumber: 'TKT-2024-001236',
      qrCode: 'QR-JAZZ2024-001236-TABLE',
      upcCode: '123456789014',
      price: 85,
      purchaseDate: '2024-01-18T09:15:00Z',
      status: 'cancelled',
      seatNumber: '4',
      section: 'Table-B',
      row: '2'
    }
  ];

  // Mock events for filter
  const mockEvents = [
    { id: '1', title: 'Summer Music Festival 2024' },
    { id: '2', title: 'Jazz Night at Blue Note' },
    { id: '3', title: 'Tech Conference 2024' }
  ];

  // Mock participants
  const mockParticipants = [
    { id: '1', firstName: 'Anna', lastName: 'Müller', email: 'anna.mueller@email.com' },
    { id: '2', firstName: 'Thomas', lastName: 'Schmidt', email: 'thomas.schmidt@email.com' },
    { id: '3', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@email.com' }
  ];

  const filteredAndSortedTickets = useMemo(() => {
    let filtered = mockTickets;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(ticket => 
        ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.qrCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.upcCode.includes(searchTerm)
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === filterStatus);
    }

    // Apply event filter
    if (filterEvent !== 'all') {
      filtered = filtered.filter(ticket => ticket.eventId === filterEvent);
    }

    // Sort tickets
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'purchaseDate':
          comparison = new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime();
          break;
        case 'ticketNumber':
          comparison = a.ticketNumber.localeCompare(b.ticketNumber);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [mockTickets, searchTerm, filterStatus, filterEvent, sortBy, sortOrder]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'used':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'refunded':
        return <RefreshCw className="w-5 h-5 text-orange-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'bg-emerald-100 text-emerald-800';
      case 'used':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'valid': return 'Gültig';
      case 'used': return 'Verwendet';
      case 'cancelled': return 'Storniert';
      case 'refunded': return 'Erstattet';
      default: return status;
    }
  };

  const getParticipantName = (participantId: string) => {
    const participant = mockParticipants.find(p => p.id === participantId);
    return participant ? `${participant.firstName} ${participant.lastName}` : 'Unbekannt';
  };

  const getEventTitle = (eventId: string) => {
    const event = mockEvents.find(e => e.id === eventId);
    return event ? event.title : 'Unbekanntes Event';
  };

  const handleExportTickets = () => {
    setShowExportModal(true);
  };

  const handlePrintTickets = () => {
    setShowPrintModal(true);
  };

  const executeExport = () => {
    let ticketsToExport = filteredAndSortedTickets;

    // Apply export filters
    if (exportFilters.onlyValidTickets) {
      ticketsToExport = ticketsToExport.filter(ticket => ticket.status === 'valid');
    }

    if (exportFilters.selectedEvents.length > 0) {
      ticketsToExport = ticketsToExport.filter(ticket => exportFilters.selectedEvents.includes(ticket.eventId));
    }

    if (exportFilters.selectedStatuses.length > 0) {
      ticketsToExport = ticketsToExport.filter(ticket => exportFilters.selectedStatuses.includes(ticket.status));
    }

    if (exportFilters.dateRange.start && exportFilters.dateRange.end) {
      const startDate = new Date(exportFilters.dateRange.start);
      const endDate = new Date(exportFilters.dateRange.end);
      ticketsToExport = ticketsToExport.filter(ticket => {
        const purchaseDate = new Date(ticket.purchaseDate);
        return purchaseDate >= startDate && purchaseDate <= endDate;
      });
    }

    const exportData: ExportParticipant[] = ticketsToExport.map(ticket => {
      const participant = mockParticipants.find(p => p.id === ticket.participantId);
      return {
        id: ticket.id,
        firstName: exportFilters.includePersonalData ? (participant?.firstName || 'Unbekannt') : 'DSGVO',
        lastName: exportFilters.includePersonalData ? (participant?.lastName || '') : 'DSGVO',
        email: exportFilters.includePersonalData ? (participant?.email || '') : 'DSGVO',
        phone: exportFilters.includePersonalData ? '' : 'DSGVO',
        ticketNumber: ticket.ticketNumber,
        qrCode: exportFilters.includeQRCodes ? ticket.qrCode : '',
        upcCode: exportFilters.includeUPCCodes ? ticket.upcCode : '',
        ticketCategory: ticket.categoryId === '1' ? 'VIP' : 
                       ticket.categoryId === '2' ? 'General Admission' : 'Table Seating',
        price: ticket.price,
        purchaseDate: ticket.purchaseDate,
        seatNumber: exportFilters.includeSeatInfo ? ticket.seatNumber : undefined,
        section: exportFilters.includeSeatInfo ? ticket.section : undefined,
        row: exportFilters.includeSeatInfo ? ticket.row : undefined,
        status: ticket.status,
        specialRequirements: exportFilters.includeSpecialRequirements ? ticket.specialRequirements : undefined
      };
    });
    
    const filename = `Tickets_${exportFilters.format}_${new Date().toISOString().split('T')[0]}`;
    exportEventParticipants(filename, exportData);
    setShowExportModal(false);
    
    // E-Mail-Versand wenn aktiviert
    if (exportFilters.emailDelivery.enabled && exportFilters.emailDelivery.recipients.length > 0) {
      sendExportByEmail(exportData, filename);
    } else {
      alert(`✅ ${ticketsToExport.length} Tickets erfolgreich exportiert!
    
📊 Export-Details:
• Format: ${exportFilters.format.toUpperCase()}
• Persönliche Daten: ${exportFilters.includePersonalData ? 'Ja' : 'Nein (DSGVO)'}
• QR-Codes: ${exportFilters.includeQRCodes ? 'Ja' : 'Nein'}
• UPC-Codes: ${exportFilters.includeUPCCodes ? 'Ja' : 'Nein'}
• Sitzplatz-Info: ${exportFilters.includeSeatInfo ? 'Ja' : 'Nein'}
• Nur gültige Tickets: ${exportFilters.onlyValidTickets ? 'Ja' : 'Nein'}`);
    }
  };

  const sendExportByEmail = async (exportData: ExportParticipant[], filename: string) => {
    try {
      // Simuliere E-Mail-Versand
      const emailData = {
        recipients: exportFilters.emailDelivery.recipients,
        subject: exportFilters.emailDelivery.subject || `Ticket-Export: ${filename}`,
        message: exportFilters.emailDelivery.message || 'Anbei finden Sie den angeforderten Ticket-Export.',
        attachment: {
          filename: `${filename}.${exportFilters.format}`,
          data: exportData,
          format: exportFilters.format
        },
        password: exportFilters.emailDelivery.includePassword ? exportFilters.emailDelivery.password : null
      };

      console.log('📧 E-Mail-Export wird versendet:', emailData);
      
      // Simuliere Versand-Verzögerung
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert(`📧 Export erfolgreich per E-Mail versendet!
      
📊 Versand-Details:
• Empfänger: ${exportFilters.emailDelivery.recipients.join(', ')}
• Betreff: ${emailData.subject}
• Datei: ${emailData.attachment.filename}
• Tickets: ${exportData.length}
• Format: ${exportFilters.format.toUpperCase()}
${exportFilters.emailDelivery.includePassword ? '• Passwort-geschützt: Ja' : '• Passwort-geschützt: Nein'}

✅ E-Mail erfolgreich zugestellt!`);
      
    } catch (error) {
      console.error('❌ Fehler beim E-Mail-Versand:', error);
      alert('❌ Fehler beim E-Mail-Versand. Bitte versuchen Sie es erneut.');
    }
  };

  const addEmailRecipient = () => {
    const email = newEmailRecipient.trim();
    if (!email) return;
    
    // E-Mail-Validierung
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('❌ Ungültige E-Mail-Adresse');
      return;
    }
    
    if (exportFilters.emailDelivery.recipients.includes(email)) {
      alert('❌ E-Mail-Adresse bereits hinzugefügt');
      return;
    }
    
    setExportFilters(prev => ({
      ...prev,
      emailDelivery: {
        ...prev.emailDelivery,
        recipients: [...prev.emailDelivery.recipients, email]
      }
    }));
    setNewEmailRecipient('');
  };

  const removeEmailRecipient = (email: string) => {
    setExportFilters(prev => ({
      ...prev,
      emailDelivery: {
        ...prev.emailDelivery,
        recipients: prev.emailDelivery.recipients.filter(e => e !== email)
      }
    }));
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setExportFilters(prev => ({
      ...prev,
      emailDelivery: {
        ...prev.emailDelivery,
        password
      }
    }));
  };

  const executePrint = () => {
    let ticketsToPrint = filteredAndSortedTickets;

    // Apply print filters
    if (printOptions.onlyValidTickets) {
      ticketsToPrint = ticketsToPrint.filter(ticket => ticket.status === 'valid');
    }

    const exportData: ExportParticipant[] = ticketsToPrint.map(ticket => {
      const participant = mockParticipants.find(p => p.id === ticket.participantId);
      return {
        id: ticket.id,
        firstName: printOptions.includeParticipantInfo ? (participant?.firstName || 'Unbekannt') : '',
        lastName: printOptions.includeParticipantInfo ? (participant?.lastName || '') : '',
        email: printOptions.includeParticipantInfo ? (participant?.email || '') : '',
        phone: printOptions.includeParticipantInfo ? '' : '',
        ticketNumber: ticket.ticketNumber,
        qrCode: printOptions.includeQRCodes ? ticket.qrCode : '',
        upcCode: printOptions.includeUPCCodes ? ticket.upcCode : '',
        ticketCategory: ticket.categoryId === '1' ? 'VIP' : 
                       ticket.categoryId === '2' ? 'General Admission' : 'Table Seating',
        price: ticket.price,
        purchaseDate: ticket.purchaseDate,
        seatNumber: printOptions.includeSeatInfo ? ticket.seatNumber : undefined,
        section: printOptions.includeSeatInfo ? ticket.section : undefined,
        row: printOptions.includeSeatInfo ? ticket.row : undefined,
        status: ticket.status,
        eventTitle: printOptions.includeEventInfo ? getEventTitle(ticket.eventId) : undefined,
        venue: printOptions.includeEventInfo ? 'Venue Name' : undefined,
        eventDate: printOptions.includeEventInfo ? '2024-07-15' : undefined
      };
    });
    
    exportTicketsPDF('Tickets_Print', exportData);
    setShowPrintModal(false);
    
    alert(`🖨️ ${ticketsToPrint.length} Tickets werden gedruckt!
    
📄 Druck-Einstellungen:
• Layout: ${printOptions.layout.replace('_', ' ').replace('per page', 'pro Seite')}
• Papierformat: ${printOptions.paperSize}
• Qualität: ${printOptions.quality === 'normal' ? 'Normal' : printOptions.quality === 'high' ? 'Hoch' : 'Entwurf'}
• Kopien: ${printOptions.copies}
• QR-Codes: ${printOptions.includeQRCodes ? 'Ja' : 'Nein'}
• UPC-Codes: ${printOptions.includeUPCCodes ? 'Ja' : 'Nein'}
• Event-Info: ${printOptions.includeEventInfo ? 'Ja' : 'Nein'}
• Teilnehmer-Info: ${printOptions.includeParticipantInfo ? 'Ja' : 'Nein'}
• Nur gültige Tickets: ${printOptions.onlyValidTickets ? 'Ja' : 'Nein'}`);
  };

  const handleViewTicket = (ticket: Ticket) => {
    const participant = mockParticipants.find(p => p.id === ticket.participantId);
    const event = mockEvents.find(e => e.id === ticket.eventId);
    
    alert(`🎫 Ticket-Details:

Ticket-Nr: ${ticket.ticketNumber}
Event: ${event?.title || 'Unbekanntes Event'}
Kategorie: ${ticket.categoryId === '1' ? 'VIP' : ticket.categoryId === '2' ? 'General Admission' : 'Table Seating'}
Preis: €${ticket.price}
Status: ${getStatusLabel(ticket.status)}

👤 Teilnehmer: ${participant ? `${participant.firstName} ${participant.lastName}` : 'Unbekannt'}
📧 E-Mail: ${participant?.email || 'Nicht verfügbar'}

📱 QR-Code: ${ticket.qrCode}
📊 UPC-Code: ${ticket.upcCode}

${ticket.seatNumber ? `🪑 Sitzplatz: Sektion ${ticket.section}, Reihe ${ticket.row}, Platz ${ticket.seatNumber}` : ''}
${ticket.specialRequirements && ticket.specialRequirements.length > 0 ? `♿ Besondere Anforderungen: ${ticket.specialRequirements.join(', ')}` : ''}

📅 Gekauft: ${new Date(ticket.purchaseDate).toLocaleDateString('de-DE')}
${ticket.validFrom ? `⏰ Gültig: ${new Date(ticket.validFrom).toLocaleDateString('de-DE')} - ${new Date(ticket.validUntil!).toLocaleDateString('de-DE')}` : ''}`);
  };

  const handlePrintQRCode = (ticket: Ticket) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>QR-Code - ${ticket.ticketNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; text-align: center; }
          .qr-container { border: 2px solid #333; padding: 30px; margin: 20px auto; width: 300px; }
          .qr-code { width: 200px; height: 200px; background: #000; color: white; margin: 20px auto; display: flex; align-items: center; justify-content: center; font-size: 12px; word-break: break-all; }
          .ticket-info { margin: 20px 0; }
          .ticket-number { font-family: monospace; font-weight: bold; font-size: 18px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="qr-container">
          <h2>🎫 QR-Code</h2>
          <div class="qr-code">${ticket.qrCode}</div>
          <div class="ticket-number">${ticket.ticketNumber}</div>
          <div class="ticket-info">
            <p><strong>Event:</strong> ${getEventTitle(ticket.eventId)}</p>
            <p><strong>Kategorie:</strong> ${ticket.categoryId === '1' ? 'VIP' : ticket.categoryId === '2' ? 'General Admission' : 'Table Seating'}</p>
            <p><strong>Preis:</strong> €${ticket.price}</p>
            ${ticket.seatNumber ? `<p><strong>Platz:</strong> ${ticket.section} ${ticket.row}-${ticket.seatNumber}</p>` : ''}
          </div>
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handleSendEmail = (ticket: Ticket) => {
    const participant = mockParticipants.find(p => p.id === ticket.participantId);
    const event = mockEvents.find(e => e.id === ticket.eventId);
    
    if (!participant) {
      alert('❌ Teilnehmer nicht gefunden');
      return;
    }

    const emailContent = `
Betreff: Ihr Ticket für ${event?.title || 'Event'}

Liebe/r ${participant.firstName} ${participant.lastName},

vielen Dank für Ihren Ticket-Kauf! Hier sind Ihre Ticket-Details:

🎫 Ticket-Nummer: ${ticket.ticketNumber}
🎪 Event: ${event?.title || 'Event'}
📅 Datum: ${event ? new Date(event.date).toLocaleDateString('de-DE') : 'TBD'}
🎭 Kategorie: ${ticket.categoryId === '1' ? 'VIP' : ticket.categoryId === '2' ? 'General Admission' : 'Table Seating'}
💰 Preis: €${ticket.price}

📱 QR-Code: ${ticket.qrCode}
📊 UPC-Code: ${ticket.upcCode}

${ticket.seatNumber ? `🪑 Ihr Sitzplatz: Sektion ${ticket.section}, Reihe ${ticket.row}, Platz ${ticket.seatNumber}` : ''}

Bitte bringen Sie dieses Ticket (ausgedruckt oder auf dem Smartphone) zum Event mit.

Mit freundlichen Grüßen,
Ihr TicketForge Team
    `;

    alert(`📧 E-Mail wird versendet an: ${participant.email}

${emailContent}

✅ E-Mail erfolgreich versendet!`);
  };

  const handleEditTicket = (ticket: Ticket) => {
    const newStatus = prompt(`Status ändern für Ticket ${ticket.ticketNumber}:

Aktuelle Status: ${getStatusLabel(ticket.status)}

Neue Optionen:
- valid (Gültig)
- used (Verwendet)  
- cancelled (Storniert)
- refunded (Erstattet)

Neuer Status:`, ticket.status);

    if (newStatus && ['valid', 'used', 'cancelled', 'refunded'].includes(newStatus)) {
      alert(`✅ Ticket-Status aktualisiert:

Ticket: ${ticket.ticketNumber}
Status: ${getStatusLabel(ticket.status)} → ${getStatusLabel(newStatus)}

Änderung wurde gespeichert und Teilnehmer benachrichtigt.`);
    } else if (newStatus) {
      alert('❌ Ungültiger Status. Bitte wählen Sie: valid, used, cancelled oder refunded');
    }
  };

  const handleCancelTicket = (ticket: Ticket) => {
    const participant = mockParticipants.find(p => p.id === ticket.participantId);
    
    const confirmMessage = `⚠️ ACHTUNG: Ticket stornieren

Ticket: ${ticket.ticketNumber}
Teilnehmer: ${participant ? `${participant.firstName} ${participant.lastName}` : 'Unbekannt'}
Event: ${getEventTitle(ticket.eventId)}
Preis: €${ticket.price}

Diese Aktion wird:
• Ticket als "Storniert" markieren
• Inventory um 1 Ticket erhöhen
• Teilnehmer per E-Mail benachrichtigen
• Rückerstattung einleiten (falls konfiguriert)

Möchten Sie fortfahren?`;

    if (confirm(confirmMessage)) {
      alert(`✅ Ticket erfolgreich storniert:

Ticket: ${ticket.ticketNumber}
Status: ${getStatusLabel(ticket.status)} → Storniert
Inventory: +1 Ticket verfügbar
E-Mail: Stornierungsbestätigung versendet
Rückerstattung: Wird bearbeitet`);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ticket-Verwaltung</h1>
          <p className="text-gray-600 mt-1">Verwalten Sie alle Tickets mit QR- und UPC-Codes</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleExportTickets}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button 
            onClick={handlePrintTickets}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Printer className="w-4 h-4" />
            <span>Drucken</span>
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
              placeholder="Tickets suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Alle Status</option>
            <option value="valid">Gültig</option>
            <option value="used">Verwendet</option>
            <option value="cancelled">Storniert</option>
            <option value="refunded">Erstattet</option>
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
            <option value="purchaseDate">Nach Kaufdatum</option>
            <option value="ticketNumber">Nach Ticket-Nr.</option>
            <option value="price">Nach Preis</option>
            <option value="status">Nach Status</option>
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
            {filteredAndSortedTickets.length} von {mockTickets.length} Tickets
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{mockTickets.length}</div>
          <div className="text-gray-600">Gesamt Tickets</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-2xl font-bold text-emerald-600">{mockTickets.filter(t => t.status === 'valid').length}</div>
          <div className="text-gray-600">Gültige Tickets</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{mockTickets.filter(t => t.status === 'used').length}</div>
          <div className="text-gray-600">Verwendet</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">€{mockTickets.reduce((sum, t) => sum + t.price, 0).toLocaleString()}</div>
          <div className="text-gray-600">Ticket-Wert</div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Ticket-Liste</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredAndSortedTickets.map((ticket) => (
            <div key={ticket.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{ticket.ticketNumber}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {getStatusLabel(ticket.status)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="font-medium text-gray-700">Event:</span>
                      <span className="text-gray-600 ml-1">{getEventTitle(ticket.eventId)}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Teilnehmer:</span>
                      <span className="text-gray-600 ml-1">{getParticipantName(ticket.participantId)}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Preis:</span>
                      <span className="text-gray-600 ml-1">€{ticket.price}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Kaufdatum:</span>
                      <span className="text-gray-600 ml-1">{new Date(ticket.purchaseDate).toLocaleDateString('de-DE')}</span>
                    </div>
                  </div>

                  {/* QR and UPC Codes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <QrCode className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-gray-900">QR-Code</span>
                      </div>
                      <div className="font-mono text-sm text-gray-600">{ticket.qrCode}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="w-4 h-4 bg-gray-600 rounded text-white text-xs flex items-center justify-center font-bold">U</span>
                        <span className="font-medium text-gray-900">UPC-Code</span>
                      </div>
                      <div className="font-mono text-sm text-gray-600">{ticket.upcCode}</div>
                    </div>
                  </div>

                  {/* Seat Information */}
                  {ticket.seatNumber && (
                    <div className="mb-4">
                      <span className="font-medium text-gray-700">Sitzplatz:</span>
                      <span className="text-gray-600 ml-1">
                        Sektion {ticket.section}, Reihe {ticket.row}, Platz {ticket.seatNumber}
                      </span>
                    </div>
                  )}

                  {/* Special Requirements */}
                  {ticket.specialRequirements && ticket.specialRequirements.length > 0 && (
                    <div className="mb-4">
                      <span className="font-medium text-gray-700">Besondere Anforderungen:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {ticket.specialRequirements.map((req, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Validity Period */}
                  {ticket.validFrom && ticket.validUntil && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Gültigkeitszeitraum:</span>
                      <span className="ml-1">
                        {new Date(ticket.validFrom).toLocaleString('de-DE')} - {new Date(ticket.validUntil).toLocaleString('de-DE')}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button onClick={() => handleViewTicket(ticket)} className="text-blue-600 hover:text-blue-800 transition-colors p-2" title="Ticket anzeigen">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => handlePrintQRCode(ticket)} className="text-purple-600 hover:text-purple-800 transition-colors p-2" title="QR-Code drucken">
                    <QrCode className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleSendEmail(ticket)} className="text-emerald-600 hover:text-emerald-800 transition-colors p-2" title="E-Mail senden">
                    <Mail className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleEditTicket(ticket)} className="text-gray-600 hover:text-gray-800 transition-colors p-2" title="Ticket bearbeiten">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleCancelTicket(ticket)} className="text-red-600 hover:text-red-800 transition-colors p-2" title="Ticket stornieren">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">📤 Ticket-Export Konfiguration</h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Export Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">📄 Export-Format</label>
                <div className="grid grid-cols-3 gap-4">
                  {['csv', 'xlsx', 'json'].map(format => (
                    <label key={format} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="exportFormat"
                        value={format}
                        checked={exportFilters.format === format}
                        onChange={(e) => setExportFilters(prev => ({ ...prev, format: e.target.value }))}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{format.toUpperCase()}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Data Inclusion Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">📋 Daten-Einschluss</label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={exportFilters.includePersonalData}
                      onChange={(e) => setExportFilters(prev => ({ ...prev, includePersonalData: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">👤 Persönliche Daten (Name, E-Mail) - DSGVO-konform</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={exportFilters.includeQRCodes}
                      onChange={(e) => setExportFilters(prev => ({ ...prev, includeQRCodes: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">📱 QR-Codes</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={exportFilters.includeUPCCodes}
                      onChange={(e) => setExportFilters(prev => ({ ...prev, includeUPCCodes: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">📊 UPC/EAN-Codes</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={exportFilters.includeSeatInfo}
                      onChange={(e) => setExportFilters(prev => ({ ...prev, includeSeatInfo: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">🪑 Sitzplatz-Informationen</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={exportFilters.includeSpecialRequirements}
                      onChange={(e) => setExportFilters(prev => ({ ...prev, includeSpecialRequirements: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">♿ Besondere Anforderungen</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={exportFilters.onlyValidTickets}
                      onChange={(e) => setExportFilters(prev => ({ ...prev, onlyValidTickets: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">✅ Nur gültige Tickets exportieren</span>
                  </label>
                </div>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">📅 Zeitraum-Filter (Optional)</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Von</label>
                    <input
                      type="date"
                      value={exportFilters.dateRange.start}
                      onChange={(e) => setExportFilters(prev => ({ 
                        ...prev, 
                        dateRange: { ...prev.dateRange, start: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Bis</label>
                    <input
                      type="date"
                      value={exportFilters.dateRange.end}
                      onChange={(e) => setExportFilters(prev => ({ 
                        ...prev, 
                        dateRange: { ...prev.dateRange, end: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h5 className="font-semibold text-blue-900 mb-2">📊 Export-Vorschau</h5>
                <div className="text-sm text-blue-800 space-y-1">
                  <div>• {filteredAndSortedTickets.length} Tickets werden exportiert</div>
                  <div>• Format: {exportFilters.format.toUpperCase()}</div>
                  <div>• Persönliche Daten: {exportFilters.includePersonalData ? 'Enthalten' : 'DSGVO-konform ausgeblendet'}</div>
                  <div>• Codes: {exportFilters.includeQRCodes ? 'QR' : ''}{exportFilters.includeQRCodes && exportFilters.includeUPCCodes ? ' + ' : ''}{exportFilters.includeUPCCodes ? 'UPC' : ''}</div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={executeExport}
                disabled={exportFilters.emailDelivery.enabled && exportFilters.emailDelivery.recipients.length === 0}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>{exportFilters.emailDelivery.enabled ? '📧 Per E-Mail senden' : '📤 Export starten'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">🖨️ Ticket-Druck Konfiguration</h3>
              <button
                onClick={() => setShowPrintModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Print Layout */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">📄 Druck-Layout</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: '1_per_page', label: '1 pro Seite', desc: 'Große Tickets' },
                    { value: '2_per_page', label: '2 pro Seite', desc: 'Standard' },
                    { value: '4_per_page', label: '4 pro Seite', desc: 'Kompakt' }
                  ].map(layout => (
                    <label key={layout.value} className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 transition-colors">
                      <input
                        type="radio"
                        name="printLayout"
                        value={layout.value}
                        checked={printOptions.layout === layout.value}
                        onChange={(e) => setPrintOptions(prev => ({ ...prev, layout: e.target.value }))}
                        className="text-blue-600 focus:ring-blue-500 mb-2"
                      />
                      <div className="font-medium text-gray-900">{layout.label}</div>
                      <div className="text-sm text-gray-600">{layout.desc}</div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Paper Size and Quality */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">📏 Papierformat</label>
                  <select
                    value={printOptions.paperSize}
                    onChange={(e) => setPrintOptions(prev => ({ ...prev, paperSize: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="A4">A4 (210 × 297 mm)</option>
                    <option value="Letter">Letter (216 × 279 mm)</option>
                    <option value="A3">A3 (297 × 420 mm)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">🎨 Druck-Qualität</label>
                  <select
                    value={printOptions.quality}
                    onChange={(e) => setPrintOptions(prev => ({ ...prev, quality: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="draft">Entwurf (schnell)</option>
                    <option value="normal">Normal (empfohlen)</option>
                    <option value="high">Hoch (beste Qualität)</option>
                  </select>
                </div>
              </div>

              {/* Print Content Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">📋 Druck-Inhalt</label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={printOptions.includeQRCodes}
                      onChange={(e) => setPrintOptions(prev => ({ ...prev, includeQRCodes: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">📱 QR-Codes auf Tickets</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={printOptions.includeUPCCodes}
                      onChange={(e) => setPrintOptions(prev => ({ ...prev, includeUPCCodes: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">📊 UPC/EAN-Codes</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={printOptions.includeEventInfo}
                      onChange={(e) => setPrintOptions(prev => ({ ...prev, includeEventInfo: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">🎪 Event-Informationen (Datum, Venue)</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={printOptions.includeSeatInfo}
                      onChange={(e) => setPrintOptions(prev => ({ ...prev, includeSeatInfo: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">🪑 Sitzplatz-Informationen</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={printOptions.includeParticipantInfo}
                      onChange={(e) => setPrintOptions(prev => ({ ...prev, includeParticipantInfo: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">👤 Teilnehmer-Namen</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={printOptions.onlyValidTickets}
                      onChange={(e) => setPrintOptions(prev => ({ ...prev, onlyValidTickets: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">✅ Nur gültige Tickets drucken</span>
                  </label>
                </div>
              </div>

              {/* Copies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">📄 Anzahl Kopien</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={printOptions.copies}
                  onChange={(e) => setPrintOptions(prev => ({ ...prev, copies: parseInt(e.target.value) || 1 }))}
                  className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Print Preview */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h5 className="font-semibold text-blue-900 mb-2">🖨️ Druck-Vorschau</h5>
                <div className="text-sm text-blue-800 space-y-1">
                  <div>• {filteredAndSortedTickets.filter(t => printOptions.onlyValidTickets ? t.status === 'valid' : true).length} Tickets werden gedruckt</div>
                  <div>• Layout: {printOptions.layout.replace('_', ' ').replace('per page', 'pro Seite')}</div>
                  <div>• Papier: {printOptions.paperSize}</div>
                  <div>• Qualität: {printOptions.quality === 'normal' ? 'Normal' : printOptions.quality === 'high' ? 'Hoch' : 'Entwurf'}</div>
                  <div>• Kopien: {printOptions.copies}</div>
                  <div>• Geschätzte Seiten: {Math.ceil((filteredAndSortedTickets.length * printOptions.copies) / parseInt(printOptions.layout.charAt(0)))}</div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={executePrint}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>🖨️ Drucken starten</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketManager;