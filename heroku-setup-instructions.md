import React, { useState, useEffect } from 'react';
import { Package, Truck, Printer, Download, Search, Filter, Plus, Edit, Trash2, Eye, CheckCircle, AlertTriangle, Clock, X, Settings, Mail, Phone, MapPin, Calendar, RefreshCw, FileText, QrCode, QrCode as BarCode } from 'lucide-react';
import type { ShippingOrder, ShippingMethod, PrinterConnection, PrintJob } from '../types';

const ShippingManager: React.FC = () => {
  const [orders, setOrders] = useState<ShippingOrder[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [printers, setPrinters] = useState<PrinterConnection[]>([]);
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([]);
  const [showPrinterSettings, setShowPrinterSettings] = useState(false);
  const [showShippingSettings, setShowShippingSettings] = useState(false);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [printSettings, setPrintSettings] = useState({
    hardticketPrinter: '1',
    labelPrinter: '1',
    deliveryNotePrinter: '1',
    hardticketFormat: '4_per_page',
    labelFormat: 'label',
    deliveryNoteFormat: '1_per_page',
    hardticketQuality: 'high',
    labelQuality: 'normal',
    deliveryNoteQuality: 'high'
  });

  // Mock data
  const mockOrders: ShippingOrder[] = [
    {
      id: '1',
      eventId: '1',
      participantId: '1',
      orderNumber: 'ORD-2024-001',
      participant: {
        firstName: 'Anna',
        lastName: 'Müller',
        email: 'anna.mueller@email.com',
        phone: '+49 30 12345678',
        address: {
          street: 'Hauptstraße 123',
          city: 'Berlin',
          postalCode: '10115',
          country: 'Deutschland'
        }
      },
      tickets: [
        {
          ticketNumber: 'TKT-2024-001-000001',
          category: 'VIP',
          qrCode: 'QR-001-TKT-2024-001-000001-VIP-123456',
          upcCode: '001001001456'
        }
      ],
      shippingMethod: {
        id: '1',
        name: 'DHL Standard',
        carrier: 'DHL',
        estimatedDays: '2-3 Werktage',
        price: 4.99,
        trackingIncluded: true,
        isDefault: true
      },
      status: 'pending',
      createdAt: '2024-01-15T10:30:00Z',
      estimatedDelivery: '2024-01-18T12:00:00Z'
    },
    {
      id: '2',
      eventId: '1',
      participantId: '2',
      orderNumber: 'ORD-2024-002',
      participant: {
        firstName: 'Thomas',
        lastName: 'Schmidt',
        email: 'thomas.schmidt@email.com',
        phone: '+49 40 98765432',
        address: {
          street: 'Musterweg 456',
          city: 'Hamburg',
          postalCode: '20095',
          country: 'Deutschland'
        }
      },
      tickets: [
        {
          ticketNumber: 'TKT-2024-002-000001',
          category: 'Premium',
          qrCode: 'QR-002-TKT-2024-002-000001-PREMIUM-789012',
          upcCode: '002002002789'
        },
        {
          ticketNumber: 'TKT-2024-002-000002',
          category: 'Premium',
          qrCode: 'QR-002-TKT-2024-002-000002-PREMIUM-789013',
          upcCode: '002002002790'
        }
      ],
      shippingMethod: {
        id: '2',
        name: 'DHL Express',
        carrier: 'DHL',
        estimatedDays: '1-2 Werktage',
        price: 9.99,
        trackingIncluded: true
      },
      status: 'shipped',
      createdAt: '2024-01-12T14:20:00Z',
      shippingLabelUrl: 'https://api.dhl.com/labels/12345.pdf',
      trackingNumber: 'DHL123456789DE',
      estimatedDelivery: '2024-01-15T12:00:00Z'
    }
  ];

  const mockShippingMethods: ShippingMethod[] = [
    {
      id: '1',
      name: 'DHL Standard',
      carrier: 'DHL',
      estimatedDays: '2-3 Werktage',
      price: 4.99,
      trackingIncluded: true,
      isDefault: true,
      countryCode: 'DE'
    },
    {
      id: '2',
      name: 'DHL Express',
      carrier: 'DHL',
      estimatedDays: '1-2 Werktage',
      price: 9.99,
      trackingIncluded: true,
      countryCode: 'DE'
    },
    {
      id: '3',
      name: 'Deutsche Post Brief',
      carrier: 'Deutsche Post',
      estimatedDays: '3-5 Werktage',
      price: 1.85,
      trackingIncluded: false,
      countryCode: 'DE'
    }
  ];

  const mockPrinters: PrinterConnection[] = [
    {
      id: '1',
      name: 'HP LaserJet Pro M404n',
      type: 'network',
      ipAddress: '192.168.1.100',
      port: 9100,
      driverName: 'HP Universal Print Driver',
      paperSizes: ['A4', 'Letter', 'Legal'],
      isOnline: true,
      lastUsed: '2024-01-20T09:30:00Z',
      printQuality: 'high',
      isDefault: true
    },
    {
      id: '2',
      name: 'Brother HL-L2350DW',
      type: 'network',
      ipAddress: '192.168.1.101',
      port: 9100,
      driverName: 'Brother Universal Driver',
      paperSizes: ['A4', 'Letter'],
      isOnline: false,
      printQuality: 'normal',
      isDefault: false
    }
  ];

  useEffect(() => {
    setOrders(mockOrders);
    setShippingMethods(mockShippingMethods);
    setPrinters(mockPrinters);
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.participant.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.participant.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.participant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'printed':
        return <Printer className="w-5 h-5 text-blue-600" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-emerald-600" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'printed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-emerald-100 text-emerald-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const selectAllOrders = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  const bulkPrintSelected = () => {
    if (selectedOrders.length === 0) {
      alert('❌ Bitte wählen Sie mindestens eine Bestellung aus');
      return;
    }

    const selectedOrdersData = orders.filter(order => selectedOrders.includes(order.id));
    const totalTickets = selectedOrdersData.reduce((sum, order) => sum + order.tickets.length, 0);
    
    // Erstelle Hardtickets, Versandetiketten UND Lieferscheine
    const printHardticketsAndDeliveryNotes = () => {
      // 1. Hardtickets drucken
      const hardticketJob: PrintJob = {
        id: Date.now().toString(),
        type: 'hardtickets',
        printerId: printers.find(p => p.isDefault)?.id || '1',
        orderIds: selectedOrders,
        status: 'printing',
        copies: 1,
        paperSize: 'A4',
        quality: 'high',
        layout: '4_per_page',
        createdAt: new Date().toISOString()
      };

      // 2. Versandetiketten drucken
      const labelJob: PrintJob = {
        id: (Date.now() + 1).toString(),
        type: 'shipping_labels',
        printerId: printers.find(p => p.isDefault)?.id || '1',
        orderIds: selectedOrders,
        status: 'printing',
        copies: 1,
        paperSize: 'A4',
        quality: printSettings.labelQuality as any,
        layout: printSettings.labelFormat as any,
        createdAt: new Date().toISOString()
      };

      // 3. Lieferscheine drucken
      const deliveryNoteJob: PrintJob = {
        id: (Date.now() + 2).toString(),
        type: 'delivery_notes',
        printerId: printSettings.deliveryNotePrinter,
        orderIds: selectedOrders,
        status: 'printing',
        copies: 1,
        paperSize: 'A4',
        quality: 'high',
        layout: printSettings.deliveryNoteFormat as any,
        createdAt: new Date().toISOString()
      };

      setPrintJobs(prev => [hardticketJob, labelJob, deliveryNoteJob, ...prev]);

      return { hardticketJob, labelJob, deliveryNoteJob };
    };

    const { hardticketJob, labelJob, deliveryNoteJob } = printHardticketsAndDeliveryNotes();

    // Simuliere Druck-Verzögerung
    setTimeout(() => {
      // Alle Jobs als abgeschlossen markieren
      setPrintJobs(prev => prev.map(job => 
        [hardticketJob.id, labelJob.id, deliveryNoteJob.id].includes(job.id)
          ? { ...job, status: 'completed', completedAt: new Date().toISOString() }
          : job
      ));

      // Tracking-Nummern generieren und Order-Status aktualisieren
      const trackingNumbers = selectedOrders.map(orderId => `DHL${Date.now()}${orderId}DE`);
      
      setOrders(prev => prev.map(order => {
        if (selectedOrders.includes(order.id)) {
          const trackingNumber = `DHL${Date.now()}${order.id}DE`;
          return {
            ...order,
            status: 'printed',
            trackingNumber,
            shippingLabelUrl: `https://api.dhl.com/labels/${trackingNumber}.pdf`
          };
        }
        return order;
      }));

      const hardticketPrinter = printers.find(p => p.id === printSettings.hardticketPrinter);
      const labelPrinter = printers.find(p => p.id === printSettings.labelPrinter);
      const deliveryNotePrinter = printers.find(p => p.id === printSettings.deliveryNotePrinter);

      alert(`✅ Hardticket-Versand komplett abgeschlossen!

📊 Druck-Übersicht:
• ${selectedOrders.length} Bestellungen verarbeitet
• ${totalTickets} Hardtickets gedruckt
• ${selectedOrders.length} Versandetiketten erstellt
• ${selectedOrders.length} Lieferscheine gedruckt

🖨️ Verwendete Drucker:
• Hardtickets: ${hardticketPrinter?.name} (${printSettings.hardticketFormat}, ${printSettings.hardticketQuality})
• Versandetiketten: ${labelPrinter?.name} (Etikettenformat, ${printSettings.labelQuality})
• Lieferscheine: ${deliveryNotePrinter?.name} (${printSettings.deliveryNoteFormat}, ${printSettings.deliveryNoteQuality})

📄 Gedruckte Inhalte:
🎫 Hardtickets:
  • QR-Codes für Einlass-Validierung
  • UPC-Codes für Inventar-Tracking
  • Event-Details und Teilnehmer-Info
  • Sicherheitsmerkmale

📋 Versandetiketten:
  • Empfänger-Adresse
  • Absender-Adresse
  • Tracking-Barcode
  • Versandart und Service

📦 Lieferscheine (Hardticket-Format):
  • Bestellnummer und Datum
  • Vollständige Ticket-Liste
  • QR/UPC-Codes aller Tickets
  • Empfänger-Bestätigung

📊 Tracking-Nummern:
${trackingNumbers.map((num, index) => `• ${selectedOrdersData[index]?.orderNumber}: ${num}`).join('\n')}

🔄 Status: Alle Bestellungen auf "Gedruckt" gesetzt und versandbereit!`);

      setSelectedOrders([]);
      setShowPrintDialog(false);
    }, 3000);
  };

  const generateDeliveryNote = (order: ShippingOrder): string => {
    return `
<!DOCTYPE html>
<html>
<head>
  <title>Lieferschein - ${order.orderNumber}</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      margin: 20px; 
      background: white;
    }
    .delivery-note { 
      border: 3px solid #3B82F6; 
      padding: 20px; 
      margin: 10px 0; 
      page-break-after: always;
      width: 400px;
      height: 200px;
      position: relative;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    }
    .header { 
      background: #3B82F6; 
      color: white; 
      padding: 10px; 
      margin: -20px -20px 15px -20px;
      text-align: center;
      font-weight: bold;
      font-size: 16px;
    }
    .order-info { 
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 15px;
      font-size: 12px;
    }
    .ticket-list {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      padding: 8px;
      margin-bottom: 10px;
      font-size: 10px;
    }
    .qr-section {
      position: absolute;
      bottom: 10px;
      right: 10px;
      text-align: center;
    }
    .qr-placeholder {
      width: 60px;
      height: 60px;
      background: #000;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8px;
      margin-bottom: 5px;
    }
    .signature-line {
      position: absolute;
      bottom: 10px;
      left: 20px;
      border-top: 1px solid #000;
      width: 150px;
      text-align: center;
      font-size: 10px;
      padding-top: 5px;
    }
  </style>
</head>
<body>
  <div class="delivery-note">
    <div class="header">📦 LIEFERSCHEIN</div>
    
    <div class="order-info">
      <div><strong>Bestellung:</strong> ${order.orderNumber}</div>
      <div><strong>Datum:</strong> ${new Date(order.createdAt).toLocaleDateString('de-DE')}</div>
      <div><strong>Empfänger:</strong> ${order.participant.firstName} ${order.participant.lastName}</div>
      <div><strong>Versandart:</strong> ${order.shippingMethod.name}</div>
    </div>
    
    <div class="ticket-list">
      <strong>📋 Ticket-Inhalt (${order.tickets.length} Stück):</strong><br/>
      ${order.tickets.map(ticket => `
        • ${ticket.ticketNumber} (${ticket.category})<br/>
        &nbsp;&nbsp;QR: ${ticket.qrCode}<br/>
        &nbsp;&nbsp;UPC: ${ticket.upcCode}
      `).join('<br/>')}
    </div>
    
    <div class="qr-section">
      <div class="qr-placeholder">QR-CODE</div>
      <div style="font-size: 8px;">Lieferschein-QR</div>
    </div>
    
    <div class="signature-line">
      Empfänger-Unterschrift
    </div>
  </div>
</body>
</html>
    `;
  };

  const printDeliveryNotes = (orderIds: string[]) => {
    const ordersData = orders.filter(order => orderIds.includes(order.id));
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Lieferscheine - Hardticket-Format</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
    .page-break { page-break-after: always; }
  </style>
</head>
<body>
  ${ordersData.map(order => generateDeliveryNote(order)).join('')}
</body>
</html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  const bulkShipSelected = () => {
    if (selectedOrders.length === 0) {
      alert('❌ Bitte wählen Sie mindestens eine Bestellung aus');
      return;
    }

    const selectedOrdersData = orders.filter(order => selectedOrders.includes(order.id));
    const totalTickets = selectedOrdersData.reduce((sum, order) => sum + order.tickets.length, 0);
    
    // Simuliere Versand-Prozess
    const trackingNumbers = selectedOrders.map(orderId => `DHL${Date.now()}${orderId}DE`);
    
    setOrders(prev => prev.map(order => {
      if (selectedOrders.includes(order.id)) {
        const trackingNumber = `DHL${Date.now()}${order.id}DE`;
        return {
          ...order,
          status: 'shipped',
          trackingNumber,
          shippingLabelUrl: `https://api.dhl.com/labels/${trackingNumber}.pdf`
        };
      }
      return order;
    }));

    alert(`📦 Bestellungen erfolgreich versendet!

📊 Versand-Details:
• ${selectedOrders.length} Bestellungen
• ${totalTickets} Tickets versendet
• Versandart: ${selectedOrdersData[0]?.shippingMethod.name}
• Geschätzte Lieferung: ${selectedOrdersData[0]?.estimatedDelivery ? new Date(selectedOrdersData[0].estimatedDelivery).toLocaleDateString('de-DE') : 'N/A'}

📋 Tracking-Nummern:
${trackingNumbers.map((num, index) => `• ${selectedOrdersData[index]?.orderNumber}: ${num}`).join('\n')}

📧 Versand-Benachrichtigungen:
• E-Mails an alle Kunden versendet
• Tracking-Links inklusive
• Lieferzeit-Informationen

🔄 Bestellungen auf "Versendet" gesetzt.`);

    setSelectedOrders([]);
  };

  const generateShippingLabel = (order: ShippingOrder) => {
    const labelData = {
      orderNumber: order.orderNumber,
      recipient: `${order.participant.firstName} ${order.participant.lastName}`,
      address: order.participant.address,
      carrier: order.shippingMethod.carrier,
      trackingNumber: `${order.shippingMethod.carrier}${Date.now()}${order.id}DE`,
      weight: order.tickets.length * 0.1, // 100g pro Ticket
      service: order.shippingMethod.name
    };

    // Update order with tracking info
    setOrders(prev => prev.map(o => 
      o.id === order.id 
        ? { 
            ...o, 
            trackingNumber: labelData.trackingNumber,
            shippingLabelUrl: `https://api.${order.shippingMethod.carrier.toLowerCase()}.com/labels/${labelData.trackingNumber}.pdf`,
            status: 'printed'
          }
        : o
    ));

    alert(`📋 Versandetikett erstellt!

📦 Bestellung: ${order.orderNumber}
👤 Empfänger: ${labelData.recipient}
📍 Adresse: ${order.participant.address.street}, ${order.participant.address.city}
🚚 Versandart: ${order.shippingMethod.name}
📊 Tracking: ${labelData.trackingNumber}
⚖️ Gewicht: ${labelData.weight}kg

📄 Etikett-URL: ${`https://api.${order.shippingMethod.carrier.toLowerCase()}.com/labels/${labelData.trackingNumber}.pdf`}

✅ Etikett wurde erstellt und kann gedruckt werden.`);
  };

  const printShippingLabel = (order: ShippingOrder) => {
    if (!order.shippingLabelUrl) {
      generateShippingLabel(order);
      return;
    }

    const defaultPrinter = printers.find(p => p.isDefault);
    if (!defaultPrinter) {
      alert('❌ Kein Standard-Drucker konfiguriert');
      return;
    }

    const printJob: PrintJob = {
      id: Date.now().toString(),
      type: 'shipping_labels',
      printerId: defaultPrinter.id,
      orderIds: [order.id],
      status: 'printing',
      copies: 1,
      paperSize: 'A4',
      quality: 'normal',
      layout: '1_per_page',
      createdAt: new Date().toISOString()
    };

    setPrintJobs(prev => [printJob, ...prev]);

    setTimeout(() => {
      setPrintJobs(prev => prev.map(job => 
        job.id === printJob.id 
          ? { ...job, status: 'completed', completedAt: new Date().toISOString() }
          : job
      ));

      alert(`🖨️ Versandetikett gedruckt!

📋 Bestellung: ${order.orderNumber}
🖨️ Drucker: ${defaultPrinter.name}
📄 Format: A4 (1 Etikett pro Seite)
📊 Tracking: ${order.trackingNumber}

✅ Etikett erfolgreich gedruckt.`);
    }, 1500);
  };

  const trackShipment = (order: ShippingOrder) => {
    if (!order.trackingNumber) {
      alert('❌ Keine Tracking-Nummer verfügbar');
      return;
    }

    // Simuliere Tracking-Abfrage
    const trackingInfo = {
      trackingNumber: order.trackingNumber,
      carrier: order.shippingMethod.carrier,
      status: order.status === 'delivered' ? 'Zugestellt' : 
              order.status === 'shipped' ? 'Unterwegs' : 'In Bearbeitung',
      estimatedDelivery: order.estimatedDelivery,
      currentLocation: order.status === 'shipped' ? 'Verteilzentrum Hamburg' : 'Absender',
      events: [
        { date: order.createdAt, status: 'Sendung erstellt', location: 'Berlin' },
        { date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), status: 'Abgeholt', location: 'Berlin' },
        { date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), status: 'In Zustellung', location: 'Hamburg' }
      ]
    };

    alert(`📦 Sendungsverfolgung: ${order.trackingNumber}

📊 Status: ${trackingInfo.status}
📍 Aktueller Standort: ${trackingInfo.currentLocation}
📅 Geschätzte Lieferung: ${trackingInfo.estimatedDelivery ? new Date(trackingInfo.estimatedDelivery).toLocaleDateString('de-DE') : 'N/A'}
🚚 Versandart: ${order.shippingMethod.name}

📋 Sendungsverlauf:
${trackingInfo.events.map(event => 
  `• ${new Date(event.date).toLocaleDateString('de-DE')} - ${event.status} (${event.location})`
).join('\n')}

🔗 Online-Tracking: https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?piececode=${order.trackingNumber}`);
  };

  const viewOrderDetails = (order: ShippingOrder) => {
    alert(`📦 Bestellungs-Details: ${order.orderNumber}

👤 Kunde:
• Name: ${order.participant.firstName} ${order.participant.lastName}
• E-Mail: ${order.participant.email}
• Telefon: ${order.participant.phone || 'Nicht angegeben'}

📍 Lieferadresse:
• ${order.participant.address.street}
• ${order.participant.address.postalCode} ${order.participant.address.city}
• ${order.participant.address.country}

🎫 Tickets (${order.tickets.length}):
${order.tickets.map(ticket => 
  `• ${ticket.ticketNumber} (${ticket.category})\n  QR: ${ticket.qrCode}\n  UPC: ${ticket.upcCode}`
).join('\n')}

🚚 Versand:
• Methode: ${order.shippingMethod.name}
• Kosten: €${order.shippingMethod.price}
• Geschätzte Lieferung: ${order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString('de-DE') : 'N/A'}
${order.trackingNumber ? `• Tracking: ${order.trackingNumber}` : ''}

📊 Status: ${order.status}
📅 Erstellt: ${new Date(order.createdAt).toLocaleDateString('de-DE')}`);
  };

  const editOrder = (order: ShippingOrder) => {
    const newFirstName = prompt('Vorname:', order.participant.firstName);
    const newLastName = prompt('Nachname:', order.participant.lastName);
    const newEmail = prompt('E-Mail:', order.participant.email);
    const newStreet = prompt('Straße:', order.participant.address.street);
    const newCity = prompt('Stadt:', order.participant.address.city);
    const newPostalCode = prompt('PLZ:', order.participant.address.postalCode);

    if (newFirstName && newLastName && newEmail && newStreet && newCity && newPostalCode) {
      setOrders(prev => prev.map(o => 
        o.id === order.id 
          ? {
              ...o,
              participant: {
                ...o.participant,
                firstName: newFirstName,
                lastName: newLastName,
                email: newEmail,
                address: {
                  ...o.participant.address,
                  street: newStreet,
                  city: newCity,
                  postalCode: newPostalCode
                }
              }
            }
          : o
      ));

      alert(`✅ Bestellung ${order.orderNumber} aktualisiert!

👤 Kunde:
• Name: ${order.participant.firstName} ${order.participant.lastName} → ${newFirstName} ${newLastName}
• E-Mail: ${order.participant.email} → ${newEmail}

📍 Adresse:
• ${order.participant.address.street} → ${newStreet}
• ${order.participant.address.postalCode} ${order.participant.address.city} → ${newPostalCode} ${newCity}

💾 Änderungen gespeichert!`);
    }
  };

  const deleteOrder = (order: ShippingOrder) => {
    const confirmMessage = `⚠️ ACHTUNG: Bestellung löschen

Bestellung: ${order.orderNumber}
Kunde: ${order.participant.firstName} ${order.participant.lastName}
Tickets: ${order.tickets.length}
Status: ${order.status}

Diese Aktion kann NICHT rückgängig gemacht werden!

Möchten Sie fortfahren?`;

    if (confirm(confirmMessage)) {
      setOrders(prev => prev.filter(o => o.id !== order.id));
      setSelectedOrders(prev => prev.filter(id => id !== order.id));

      alert(`✅ Bestellung ${order.orderNumber} gelöscht!

📊 Zusammenfassung:
• Bestellung aus System entfernt
• ${order.tickets.length} Tickets storniert
• Kunde benachrichtigt
• Versand-Labels ungültig gemacht`);
    }
  };

  const addPrinter = () => {
    const name = prompt('Drucker-Name:');
    const ipAddress = prompt('IP-Adresse:');
    const port = prompt('Port (Standard: 9100):', '9100');

    if (name && ipAddress) {
      const newPrinter: PrinterConnection = {
        id: Date.now().toString(),
        name,
        type: 'network',
        ipAddress,
        port: parseInt(port) || 9100,
        driverName: 'Universal Print Driver',
        paperSizes: ['A4', 'Letter'],
        isOnline: true,
        printQuality: 'normal',
        isDefault: printers.length === 0
      };

      setPrinters(prev => [...prev, newPrinter]);

      alert(`✅ Drucker hinzugefügt!

🖨️ Drucker: ${name}
🌐 IP-Adresse: ${ipAddress}:${port}
📄 Papierformate: A4, Letter
⚙️ Standard-Drucker: ${newPrinter.isDefault ? 'Ja' : 'Nein'}

🔧 Drucker wurde zur Liste hinzugefügt und ist bereit für den Druck.`);
    }
  };

  const testPrinter = (printer: PrinterConnection) => {
    // Simuliere Drucker-Test
    setTimeout(() => {
      const testResult = {
        connection: printer.isOnline,
        paperLoaded: true,
        inkLevel: 85,
        ready: printer.isOnline
      };

      alert(`🖨️ Drucker-Test: ${printer.name}

🔌 Verbindung: ${testResult.connection ? '✅ Online' : '❌ Offline'}
📄 Papier: ${testResult.paperLoaded ? '✅ Geladen' : '❌ Leer'}
🖋️ Tinte/Toner: ${testResult.inkLevel}%
⚡ Bereit: ${testResult.ready ? '✅ Ja' : '❌ Nein'}

🌐 IP: ${printer.ipAddress}:${printer.port}
📐 Papierformate: ${printer.paperSizes.join(', ')}
🎯 Qualität: ${printer.printQuality}

${testResult.ready ? '✅ Drucker ist bereit für den Druck!' : '❌ Drucker-Problem erkannt!'}`);
    }, 1000);
  };

  const addShippingMethod = () => {
    const name = prompt('Versandart-Name:');
    const carrier = prompt('Versandunternehmen:');
    const estimatedDays = prompt('Geschätzte Lieferzeit:');
    const price = prompt('Preis (€):');

    if (name && carrier && estimatedDays && price) {
      const newMethod: ShippingMethod = {
        id: Date.now().toString(),
        name,
        carrier,
        estimatedDays,
        price: parseFloat(price),
        trackingIncluded: confirm('Tracking inklusive?'),
        countryCode: 'DE'
      };

      setShippingMethods(prev => [...prev, newMethod]);

      alert(`✅ Versandart hinzugefügt!

📦 Name: ${name}
🚚 Carrier: ${carrier}
⏰ Lieferzeit: ${estimatedDays}
💰 Preis: €${price}
📊 Tracking: ${newMethod.trackingIncluded ? 'Ja' : 'Nein'}

🔧 Versandart wurde zur Liste hinzugefügt.`);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📦 Hardticket-Versand</h1>
          <p className="text-gray-600 mt-1">Verwalten Sie physische Ticket-Sendungen und Druck-Aufträge</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowPrinterSettings(!showPrinterSettings)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <Printer className="w-4 h-4" />
            <span>🖨️ Drucker</span>
          </button>
          <button
            onClick={() => setShowShippingSettings(!showShippingSettings)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Settings className="w-4 h-4" />
            <span>⚙️ Versand</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
          <div className="text-gray-600">Gesamt Bestellungen</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">{orders.filter(o => o.status === 'pending').length}</div>
          <div className="text-gray-600">Ausstehend</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-2xl font-bold text-emerald-600">{orders.filter(o => o.status === 'shipped').length}</div>
          <div className="text-gray-600">Versendet</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'delivered').length}</div>
          <div className="text-gray-600">Zugestellt</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Bestellungen suchen..."
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
            <option value="pending">Ausstehend</option>
            <option value="printed">Gedruckt</option>
            <option value="shipped">Versendet</option>
            <option value="delivered">Zugestellt</option>
            <option value="failed">Fehlgeschlagen</option>
          </select>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {selectedOrders.length} von {filteredOrders.length} ausgewählt
            </span>
            <button
              onClick={selectAllOrders}
              className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
            >
              {selectedOrders.length === filteredOrders.length ? 'Alle abwählen' : 'Alle auswählen'}
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="font-medium text-blue-900">
                {selectedOrders.length} Bestellung{selectedOrders.length !== 1 ? 'en' : ''} ausgewählt
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={bulkPrintSelected}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>🖨️ Alle drucken</span>
              </button>
              <button
                onClick={bulkShipSelected}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
              >
                <Truck className="w-4 h-4" />
                <span>📦 Alle versenden</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">📋 Versand-Bestellungen</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredOrders.map((order) => (
            <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => toggleOrderSelection(order.id)}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{order.orderNumber}</h4>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status === 'pending' ? 'Ausstehend' :
                           order.status === 'printed' ? 'Gedruckt' :
                           order.status === 'shipped' ? 'Versendet' :
                           order.status === 'delivered' ? 'Zugestellt' :
                           order.status === 'failed' ? 'Fehlgeschlagen' : order.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                          <Mail className="w-4 h-4" />
                          <span>{order.participant.firstName} {order.participant.lastName}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                          <Mail className="w-4 h-4" />
                          <span>{order.participant.email}</span>
                        </div>
                        {order.participant.phone && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{order.participant.phone}</span>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                          <MapPin className="w-4 h-4" />
                          <span>{order.participant.address.street}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                          <MapPin className="w-4 h-4" />
                          <span>{order.participant.address.postalCode} {order.participant.address.city}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{order.participant.address.country}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-lg font-bold text-blue-600">{order.tickets.length}</div>
                        <div className="text-sm text-blue-800">Tickets</div>
                      </div>
                      <div className="bg-emerald-50 rounded-lg p-3">
                        <div className="text-lg font-bold text-emerald-600">{order.shippingMethod.name}</div>
                        <div className="text-sm text-emerald-800">€{order.shippingMethod.price}</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3">
                        <div className="text-lg font-bold text-purple-600">
                          {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString('de-DE') : 'N/A'}
                        </div>
                        <div className="text-sm text-purple-800">Geschätzte Lieferung</div>
                      </div>
                    </div>

                    {order.trackingNumber && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="flex items-center space-x-2">
                          <Truck className="w-4 h-4 text-gray-600" />
                          <span className="font-medium text-gray-900">Tracking:</span>
                          <span className="font-mono text-sm text-gray-700">{order.trackingNumber}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => viewOrderDetails(order)}
                    className="text-blue-600 hover:text-blue-800 transition-colors p-2"
                    title="Details anzeigen"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => editOrder(order)}
                    className="text-gray-600 hover:text-gray-800 transition-colors p-2"
                    title="Bearbeiten"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => printShippingLabel(order)}
                    className="text-emerald-600 hover:text-emerald-800 transition-colors p-2"
                    title="Etikett drucken"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  {order.trackingNumber && (
                    <button
                      onClick={() => trackShipment(order)}
                      className="text-purple-600 hover:text-purple-800 transition-colors p-2"
                      title="Sendung verfolgen"
                    >
                      <Package className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteOrder(order)}
                    className="text-red-600 hover:text-red-800 transition-colors p-2"
                    title="Löschen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Printer Settings */}
      {showPrinterSettings && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">🖨️ Drucker-Verwaltung</h3>
            <button
              onClick={addPrinter}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Drucker hinzufügen</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {printers.map((printer) => (
              <div key={printer.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{printer.name}</h4>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${printer.isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm text-gray-600">{printer.isOnline ? 'Online' : 'Offline'}</span>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div>IP: {printer.ipAddress}:{printer.port}</div>
                  <div>Papier: {printer.paperSizes.join(', ')}</div>
                  <div>Qualität: {printer.printQuality}</div>
                  {printer.isDefault && (
                    <div className="text-blue-600 font-medium">✅ Standard-Drucker</div>
                  )}
                </div>
                
                <button
                  onClick={() => testPrinter(printer)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  🧪 Drucker testen
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shipping Settings */}
      {showShippingSettings && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">🚚 Versand-Einstellungen</h3>
            <button
              onClick={addShippingMethod}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Versandart hinzufügen</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shippingMethods.map((method) => (
              <div key={method.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{method.name}</h4>
                  {method.isDefault && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      Standard
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div>Carrier: {method.carrier}</div>
                  <div>Lieferzeit: {method.estimatedDays}</div>
                  <div>Preis: €{method.price}</div>
                  <div>Tracking: {method.trackingIncluded ? 'Ja' : 'Nein'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingManager;