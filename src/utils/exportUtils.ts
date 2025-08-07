// Export Utility Functions for TicketForge
// Handles CSV, PDF, and Excel exports for events, participants, and tickets

// Unique code generation utilities
export const generateUniqueUPCCode = (eventId: string, participantId: string, categoryId: string): string => {
  // Generate 12-digit UPC code: EEEPPPCCCXXX
  // EEE = Event ID (3 digits)
  // PPP = Participant ID (3 digits) 
  // CCC = Category ID (3 digits)
  // XXX = Random checksum (3 digits)
  
  const eventCode = eventId.padStart(3, '0').slice(-3);
  const participantCode = participantId.padStart(3, '0').slice(-3);
  const categoryCode = categoryId.padStart(3, '0').slice(-3);
  
  // Generate checksum based on other digits
  const baseNumber = eventCode + participantCode + categoryCode;
  const checksum = (parseInt(baseNumber) % 1000).toString().padStart(3, '0');
  
  return eventCode + participantCode + categoryCode + checksum;
};

export const generateUniqueQRCode = (eventId: string, participantId: string, categoryName: string, ticketNumber: string): string => {
  // Generate unique QR code string: QR-EVENTID-TICKETNUMBER-CATEGORY
  const eventCode = eventId.toUpperCase().padStart(3, '0');
  const categoryCode = categoryName.replace(/\s+/g, '').toUpperCase().slice(0, 6);
  const timestamp = Date.now().toString().slice(-6);
  
  return `QR-${eventCode}-${ticketNumber}-${categoryCode}-${timestamp}`;
};

export const generateTicketNumber = (eventId: string, participantId: string): string => {
  // Generate ticket number: TKT-YYYY-EVENTID-PARTICIPANTID
  const year = new Date().getFullYear();
  const eventCode = eventId.padStart(3, '0');
  const participantCode = participantId.padStart(6, '0');
  
  return `TKT-${year}-${eventCode}-${participantCode}`;
};

export interface ExportParticipant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  ticketNumber: string;
  qrCode: string;
  upcCode: string;
  ticketCategory: string;
  price: number;
  purchaseDate: string;
  seatNumber?: string;
  section?: string;
  row?: string;
  status: string;
  specialRequirements?: string[];
  eventTitle?: string;
  venue?: string;
  eventDate?: string;
}

export interface ExportEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  totalCapacity: number;
  soldTickets: number;
  revenue: number;
  status: string;
  organizer?: string;
  category?: string;
}

// Generate CSV content from data
export const generateCSV = (data: any[], headers: string[]): string => {
  const csvHeaders = headers.join(',');
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header] || '';
      // Escape commas and quotes in CSV
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );
  
  return [csvHeaders, ...csvRows].join('\n');
};

// Download CSV file
export const downloadCSV = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

// Export participants for a specific event
export const exportEventParticipants = (
  eventTitle: string, 
  participants: ExportParticipant[]
): void => {
  const headers = [
    'eventTitle',
    'venue',
    'eventDate',
    'firstName',
    'lastName', 
    'email',
    'phone',
    'ticketNumber',
    'qrCode',
    'upcCode',
    'ticketCategory',
    'price',
    'purchaseDate',
    'seatNumber',
    'section',
    'row',
    'status',
    'specialRequirements'
  ];
  
  const csvContent = generateCSV(participants, headers);
  const filename = `${eventTitle.replace(/[^a-z0-9]/gi, '_')}_teilnehmer_${new Date().toISOString().split('T')[0]}.csv`;
  
  downloadCSV(csvContent, filename);
};

// Export all events
export const exportAllEvents = (events: ExportEvent[]): void => {
  const headers = [
    'title',
    'date',
    'time', 
    'venue',
    'address',
    'totalCapacity',
    'soldTickets',
    'revenue',
    'status',
    'organizer',
    'category'
  ];
  
  const csvContent = generateCSV(events, headers);
  const filename = `alle_events_${new Date().toISOString().split('T')[0]}.csv`;
  
  downloadCSV(csvContent, filename);
};

// Generate QR Code data URL (simplified - in production use a QR library)
export const generateQRCodeDataURL = (text: string): string => {
  // This is a placeholder - in production, use a library like 'qrcode'
  // For now, return a simple data URL
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 100;
  canvas.height = 100;
  
  if (ctx) {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 100, 100);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '8px Arial';
    ctx.fillText(text.substring(0, 12), 5, 50);
  }
  
  return canvas.toDataURL();
};

// Export tickets with QR codes as PDF (simplified)
export const exportTicketsPDF = (
  eventTitle: string,
  participants: ExportParticipant[]
): void => {
  // This would use a PDF library like jsPDF in production
  // For now, create a printable HTML page
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Tickets - ${eventTitle}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .ticket { 
          border: 2px solid #333; 
          margin: 20px 0; 
          padding: 20px; 
          page-break-after: always;
          width: 400px;
          position: relative;
        }
        .ticket-header { 
          background: #3B82F6; 
          color: white; 
          padding: 10px; 
          margin: -20px -20px 20px -20px;
          text-align: center;
          font-weight: bold;
          font-size: 18px;
        }
        .qr-code { 
          width: 100px; 
          height: 100px; 
          background: #000; 
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          float: right;
          margin-left: 20px;
          word-break: break-all;
          text-align: center;
        }
        .ticket-info { margin: 10px 0; }
        .ticket-number { 
          font-family: monospace; 
          font-weight: bold; 
          font-size: 12px;
          margin: 5px 0;
        }
        .upc-code {
          font-family: monospace;
          font-size: 14px;
          font-weight: bold;
          text-align: center;
          margin: 10px 0;
          padding: 5px;
          background: #f0f0f0;
          border: 1px solid #ccc;
        }
        .participant-info {
          font-size: 14px;
          line-height: 1.5;
        }
      </style>
    </head>
    <body>
      <h1>Tickets für: ${eventTitle}</h1>
      ${participants.map(p => `
        <div class="ticket">
          <div class="ticket-header">${eventTitle}</div>
          <div class="qr-code">${p.qrCode.slice(0, 20)}</div>
          <div class="ticket-info participant-info">
            <strong>Name:</strong> ${p.firstName} ${p.lastName}<br>
            <strong>E-Mail:</strong> ${p.email}<br>
            ${p.phone ? `<strong>Telefon:</strong> ${p.phone}<br>` : ''}
            <strong>Kategorie:</strong> ${p.ticketCategory}<br>
            <strong>Preis:</strong> €${p.price}<br>
            <strong>Venue:</strong> ${p.venue}<br>
            <strong>Datum:</strong> ${new Date(p.eventDate || '').toLocaleDateString('de-DE')}<br>
            ${p.seatNumber ? `<strong>Platz:</strong> ${p.section} ${p.row}-${p.seatNumber}<br>` : ''}
            ${p.specialRequirements && p.specialRequirements.length > 0 ? `<strong>Besondere Anforderungen:</strong> ${p.specialRequirements.join(', ')}<br>` : ''}
            <div class="ticket-number">Ticket: ${p.ticketNumber}</div>
            <div class="ticket-number">QR: ${p.qrCode}</div>
            <div class="upc-code">UPC/EAN: ${p.upcCode}</div>
          </div>
        </div>
      `).join('')}
    </body>
    </html>
  `;
  
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.print();
};

// Export analytics data
export const exportAnalyticsData = (data: any, type: 'revenue' | 'tickets' | 'events'): void => {
  const headers = type === 'revenue' 
    ? ['period', 'revenue', 'growth']
    : type === 'tickets'
    ? ['period', 'ticketsSold', 'growth'] 
    : ['period', 'eventsCount', 'growth'];
    
  const csvContent = generateCSV(data.chartData || [], headers);
  const filename = `analytics_${type}_${new Date().toISOString().split('T')[0]}.csv`;
  
  downloadCSV(csvContent, filename);
};