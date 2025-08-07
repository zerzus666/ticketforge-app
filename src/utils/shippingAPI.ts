// Shopify Shipping API Integration
// Handles real shipping label generation for multiple markets

export interface ShopifyShippingConfig {
  shopDomain: string;
  accessToken: string;
  apiVersion: string;
}

export interface ShippingCarrier {
  id: string;
  name: string;
  code: string;
  services: ShippingService[];
  countries: string[];
  trackingUrlTemplate: string;
}

export interface ShippingService {
  id: string;
  name: string;
  code: string;
  estimatedDays: string;
  price: number;
  trackingIncluded: boolean;
  requiresSignature?: boolean;
  maxWeight?: number;
  maxDimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface ShippingLabel {
  id: string;
  trackingNumber: string;
  labelUrl: string;
  carrier: string;
  service: string;
  cost: number;
  currency: string;
  estimatedDelivery: string;
  createdAt: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone?: string;
}

// Market-specific carriers configuration
export const MARKET_CARRIERS: { [market: string]: ShippingCarrier[] } = {
  'DE': [ // Deutschland
    {
      id: 'dhl_de',
      name: 'DHL Deutschland',
      code: 'dhl',
      countries: ['DE', 'AT', 'CH'],
      trackingUrlTemplate: 'https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?lang=de&idc={trackingNumber}',
      services: [
        {
          id: 'dhl_paket',
          name: 'DHL Paket',
          code: 'dhl_paket',
          estimatedDays: '1-2',
          price: 4.99,
          trackingIncluded: true,
          maxWeight: 31.5
        },
        {
          id: 'dhl_premium',
          name: 'DHL Premium',
          code: 'dhl_premium',
          estimatedDays: '1',
          price: 7.99,
          trackingIncluded: true,
          requiresSignature: true,
          maxWeight: 31.5
        }
      ]
    },
    {
      id: 'deutsche_post',
      name: 'Deutsche Post',
      code: 'deutsche_post',
      countries: ['DE'],
      trackingUrlTemplate: 'https://www.deutschepost.de/de/s/sendungsverfolgung.html?piececode={trackingNumber}',
      services: [
        {
          id: 'brief_standard',
          name: 'Brief Standard',
          code: 'brief',
          estimatedDays: '1-2',
          price: 0.85,
          trackingIncluded: false,
          maxWeight: 0.02
        },
        {
          id: 'einschreiben',
          name: 'Einschreiben',
          code: 'einschreiben',
          estimatedDays: '1-2',
          price: 2.65,
          trackingIncluded: true,
          requiresSignature: true,
          maxWeight: 0.02
        }
      ]
    }
  ],
  'US': [ // USA
    {
      id: 'usps',
      name: 'USPS',
      code: 'usps',
      countries: ['US'],
      trackingUrlTemplate: 'https://tools.usps.com/go/TrackConfirmAction?tLabels={trackingNumber}',
      services: [
        {
          id: 'usps_first_class',
          name: 'USPS First-Class Mail',
          code: 'first_class',
          estimatedDays: '1-3',
          price: 0.68,
          trackingIncluded: false,
          maxWeight: 0.5
        },
        {
          id: 'usps_priority',
          name: 'USPS Priority Mail',
          code: 'priority',
          estimatedDays: '1-3',
          price: 9.65,
          trackingIncluded: true,
          maxWeight: 70
        }
      ]
    },
    {
      id: 'ups_us',
      name: 'UPS',
      code: 'ups',
      countries: ['US', 'CA'],
      trackingUrlTemplate: 'https://www.ups.com/track?tracknum={trackingNumber}',
      services: [
        {
          id: 'ups_ground',
          name: 'UPS Ground',
          code: 'ground',
          estimatedDays: '1-5',
          price: 12.50,
          trackingIncluded: true,
          maxWeight: 70
        },
        {
          id: 'ups_next_day',
          name: 'UPS Next Day Air',
          code: 'next_day',
          estimatedDays: '1',
          price: 45.00,
          trackingIncluded: true,
          maxWeight: 70
        }
      ]
    }
  ],
  'GB': [ // United Kingdom
    {
      id: 'royal_mail',
      name: 'Royal Mail',
      code: 'royal_mail',
      countries: ['GB'],
      trackingUrlTemplate: 'https://www.royalmail.com/track-your-item#/tracking-results/{trackingNumber}',
      services: [
        {
          id: 'rm_first_class',
          name: 'First Class',
          code: 'first_class',
          estimatedDays: '1-2',
          price: 1.10,
          trackingIncluded: false,
          maxWeight: 2
        },
        {
          id: 'rm_tracked',
          name: 'Tracked 24',
          code: 'tracked_24',
          estimatedDays: '1',
          price: 4.20,
          trackingIncluded: true,
          maxWeight: 2
        }
      ]
    },
    {
      id: 'dpd_uk',
      name: 'DPD UK',
      code: 'dpd',
      countries: ['GB'],
      trackingUrlTemplate: 'https://www.dpd.co.uk/apps/tracking/?reference={trackingNumber}',
      services: [
        {
          id: 'dpd_next_day',
          name: 'DPD Next Day',
          code: 'next_day',
          estimatedDays: '1',
          price: 8.50,
          trackingIncluded: true,
          maxWeight: 30
        }
      ]
    }
  ],
  'FR': [ // France
    {
      id: 'la_poste',
      name: 'La Poste',
      code: 'la_poste',
      countries: ['FR'],
      trackingUrlTemplate: 'https://www.laposte.fr/outils/suivre-vos-envois?code={trackingNumber}',
      services: [
        {
          id: 'colissimo',
          name: 'Colissimo',
          code: 'colissimo',
          estimatedDays: '2-3',
          price: 6.90,
          trackingIncluded: true,
          maxWeight: 30
        },
        {
          id: 'chronopost',
          name: 'Chronopost',
          code: 'chronopost',
          estimatedDays: '1',
          price: 15.50,
          trackingIncluded: true,
          requiresSignature: true,
          maxWeight: 30
        }
      ]
    }
  ]
};

// Shopify Shipping API Client
export class ShopifyShippingAPI {
  private config: ShopifyShippingConfig;

  constructor(config: ShopifyShippingConfig) {
    this.config = config;
  }

  // Get available shipping rates for destination
  async getShippingRates(
    destinationAddress: ShippingAddress,
    items: Array<{ weight: number; value: number }>
  ): Promise<ShippingService[]> {
    const country = destinationAddress.country;
    const carriers = MARKET_CARRIERS[country] || [];
    
    const availableServices: ShippingService[] = [];
    
    for (const carrier of carriers) {
      for (const service of carrier.services) {
        // Check weight limits
        const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
        if (service.maxWeight && totalWeight > service.maxWeight) {
          continue;
        }
        
        // Calculate price based on destination and weight
        const calculatedPrice = this.calculateShippingPrice(service, destinationAddress, totalWeight);
        
        availableServices.push({
          ...service,
          price: calculatedPrice
        });
      }
    }
    
    return availableServices;
  }

  // Create shipping label via Shopify API
  async createShippingLabel(
    orderId: string,
    fulfillmentId: string,
    shippingService: ShippingService,
    fromAddress: ShippingAddress,
    toAddress: ShippingAddress,
    items: Array<{ sku: string; quantity: number; weight: number }>
  ): Promise<ShippingLabel> {
    const url = `https://${this.config.shopDomain}/admin/api/${this.config.apiVersion}/orders/${orderId}/fulfillments/${fulfillmentId}/shipping_labels.json`;
    
    const labelRequest = {
      shipping_label: {
        carrier_service_id: shippingService.id,
        origin_address: fromAddress,
        destination_address: toAddress,
        line_items: items.map(item => ({
          sku: item.sku,
          quantity: item.quantity,
          weight: item.weight,
          weight_unit: 'kg'
        })),
        service_code: shippingService.code,
        package_type: 'package',
        insurance: true,
        signature_required: shippingService.requiresSignature || false
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': this.config.accessToken
        },
        body: JSON.stringify(labelRequest)
      });

      if (!response.ok) {
        throw new Error(`Shopify API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const shippingLabel = data.shipping_label;

      return {
        id: shippingLabel.id,
        trackingNumber: shippingLabel.tracking_number,
        labelUrl: shippingLabel.label_url,
        carrier: shippingService.code,
        service: shippingService.name,
        cost: shippingLabel.cost,
        currency: shippingLabel.currency,
        estimatedDelivery: shippingLabel.estimated_delivery_date,
        createdAt: shippingLabel.created_at
      };
    } catch (error) {
      console.error('❌ Shopify Shipping Label Error:', error);
      throw new Error(`Failed to create shipping label: ${error.message}`);
    }
  }

  // Update fulfillment with tracking info
  async updateFulfillmentTracking(
    orderId: string,
    fulfillmentId: string,
    trackingNumber: string,
    trackingCompany: string,
    trackingUrl?: string
  ): Promise<void> {
    const url = `https://${this.config.shopDomain}/admin/api/${this.config.apiVersion}/orders/${orderId}/fulfillments/${fulfillmentId}.json`;
    
    const updateData = {
      fulfillment: {
        tracking_number: trackingNumber,
        tracking_company: trackingCompany,
        tracking_url: trackingUrl,
        notify_customer: true
      }
    };

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': this.config.accessToken
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update fulfillment: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Fulfillment Update Error:', error);
      throw error;
    }
  }

  // Calculate shipping price based on destination and weight
  private calculateShippingPrice(
    service: ShippingService,
    destination: ShippingAddress,
    weight: number
  ): number {
    let basePrice = service.price;
    
    // Weight-based pricing
    if (weight > 1) {
      basePrice += (weight - 1) * 2.50; // €2.50 per additional kg
    }
    
    // International shipping surcharge
    if (destination.country !== 'DE') {
      basePrice += 5.00;
    }
    
    // Remote area surcharge (simplified)
    const remoteCodes = ['01', '02', '03', '07', '08', '09']; // Example remote postal codes
    if (remoteCodes.some(code => destination.zip.startsWith(code))) {
      basePrice += 3.00;
    }
    
    return Math.round(basePrice * 100) / 100; // Round to 2 decimal places
  }

  // Get carrier by country
  static getCarriersByCountry(countryCode: string): ShippingCarrier[] {
    return MARKET_CARRIERS[countryCode] || [];
  }

  // Get tracking URL for carrier
  static getTrackingUrl(carrier: string, trackingNumber: string): string {
    for (const marketCarriers of Object.values(MARKET_CARRIERS)) {
      const carrierConfig = marketCarriers.find(c => c.code === carrier);
      if (carrierConfig) {
        return carrierConfig.trackingUrlTemplate.replace('{trackingNumber}', trackingNumber);
      }
    }
    return `https://track.example.com/${trackingNumber}`;
  }
}

// Shopify Fulfillment Service Integration
export class ShopifyFulfillmentService {
  private api: ShopifyShippingAPI;

  constructor(config: ShopifyShippingConfig) {
    this.api = new ShopifyShippingAPI(config);
  }

  // Create fulfillment for hardticket orders
  async createHardticketFulfillment(
    orderId: string,
    lineItems: Array<{ id: string; quantity: number }>,
    shippingAddress: ShippingAddress,
    selectedService: ShippingService
  ): Promise<{ fulfillmentId: string; shippingLabel: ShippingLabel }> {
    const url = `https://${this.api.config.shopDomain}/admin/api/${this.api.config.apiVersion}/orders/${orderId}/fulfillments.json`;
    
    // 1. Create fulfillment
    const fulfillmentData = {
      fulfillment: {
        location_id: null, // Use default location
        tracking_number: null, // Will be updated after label creation
        tracking_company: selectedService.code,
        notify_customer: false, // We'll notify after label is created
        line_items: lineItems,
        shipment_status: 'label_printed'
      }
    };

    try {
      const fulfillmentResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': this.api.config.accessToken
        },
        body: JSON.stringify(fulfillmentData)
      });

      if (!fulfillmentResponse.ok) {
        throw new Error(`Failed to create fulfillment: ${fulfillmentResponse.status}`);
      }

      const fulfillmentResult = await fulfillmentResponse.json();
      const fulfillmentId = fulfillmentResult.fulfillment.id;

      // 2. Create shipping label
      const companyAddress: ShippingAddress = {
        firstName: 'TicketForge',
        lastName: 'Shipping',
        company: 'TicketForge GmbH',
        address1: 'Musterstraße 123',
        city: 'Berlin',
        province: 'Berlin',
        country: 'DE',
        zip: '10115',
        phone: '+49 30 12345678'
      };

      const items = lineItems.map(item => ({
        sku: `hardticket-${item.id}`,
        quantity: item.quantity,
        weight: 0.05 // 50g per hardticket
      }));

      const shippingLabel = await this.api.createShippingLabel(
        orderId,
        fulfillmentId,
        selectedService,
        companyAddress,
        shippingAddress,
        items
      );

      // 3. Update fulfillment with tracking info
      await this.api.updateFulfillmentTracking(
        orderId,
        fulfillmentId,
        shippingLabel.trackingNumber,
        selectedService.code,
        ShopifyShippingAPI.getTrackingUrl(selectedService.code, shippingLabel.trackingNumber)
      );

      return { fulfillmentId, shippingLabel };
    } catch (error) {
      console.error('❌ Hardticket Fulfillment Error:', error);
      throw error;
    }
  }

  // Bulk create fulfillments for multiple orders
  async bulkCreateFulfillments(
    orders: Array<{
      orderId: string;
      lineItems: Array<{ id: string; quantity: number }>;
      shippingAddress: ShippingAddress;
      selectedService: ShippingService;
    }>
  ): Promise<Array<{ orderId: string; fulfillmentId: string; shippingLabel: ShippingLabel; error?: string }>> {
    const results = [];

    for (const order of orders) {
      try {
        const result = await this.createHardticketFulfillment(
          order.orderId,
          order.lineItems,
          order.shippingAddress,
          order.selectedService
        );
        
        results.push({
          orderId: order.orderId,
          fulfillmentId: result.fulfillmentId,
          shippingLabel: result.shippingLabel
        });
      } catch (error) {
        results.push({
          orderId: order.orderId,
          fulfillmentId: '',
          shippingLabel: {} as ShippingLabel,
          error: error.message
        });
      }
    }

    return results;
  }
}

// Market detection utility
export const detectMarketFromAddress = (address: ShippingAddress): string => {
  const countryMarketMap: { [country: string]: string } = {
    'DE': 'DE',
    'AT': 'DE', // Austria uses German carriers
    'CH': 'DE', // Switzerland uses German carriers
    'US': 'US',
    'CA': 'US', // Canada uses US carriers
    'GB': 'GB',
    'UK': 'GB',
    'FR': 'FR',
    'BE': 'FR', // Belgium uses French carriers
    'LU': 'FR', // Luxembourg uses French carriers
    'IT': 'IT',
    'ES': 'ES',
    'NL': 'NL',
    'SE': 'SE',
    'NO': 'SE', // Norway uses Swedish carriers
    'DK': 'DK'
  };

  return countryMarketMap[address.country] || 'DE'; // Default to German market
};

// Shipping cost calculator
export const calculateShippingCosts = (
  items: Array<{ weight: number; value: number }>,
  destination: ShippingAddress,
  service: ShippingService
): { shippingCost: number; insurance: number; total: number } => {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  const totalValue = items.reduce((sum, item) => sum + item.value, 0);
  
  let shippingCost = service.price;
  
  // Weight-based pricing
  if (totalWeight > 1) {
    shippingCost += (totalWeight - 1) * 2.50;
  }
  
  // International surcharge
  if (destination.country !== 'DE') {
    shippingCost += 5.00;
  }
  
  // Insurance (1% of value, minimum €2)
  const insurance = Math.max(totalValue * 0.01, 2.00);
  
  const total = shippingCost + insurance;
  
  return {
    shippingCost: Math.round(shippingCost * 100) / 100,
    insurance: Math.round(insurance * 100) / 100,
    total: Math.round(total * 100) / 100
  };
};

// Label format configurations for different printers
export const LABEL_FORMATS = {
  'zebra_zd420': {
    name: 'Zebra ZD420',
    formats: [
      { id: '4x6', name: '4" x 6" Standard', width: 101.6, height: 152.4, dpi: 203 },
      { id: '4x3', name: '4" x 3" Compact', width: 101.6, height: 76.2, dpi: 203 },
      { id: '2x1', name: '2" x 1" Mini', width: 50.8, height: 25.4, dpi: 203 }
    ]
  },
  'dymo_450': {
    name: 'Dymo LabelWriter 450',
    formats: [
      { id: 'dymo_large', name: 'Large Address (4" x 1.125")', width: 101.6, height: 28.6, dpi: 300 },
      { id: 'dymo_standard', name: 'Standard Address (3.5" x 1.125")', width: 89, height: 28.6, dpi: 300 },
      { id: 'dymo_return', name: 'Return Address (3/4" x 2")', width: 19, height: 50.8, dpi: 300 }
    ]
  }
};

// Generate ZPL code for Zebra printers
export const generateZPLLabel = (
  shippingLabel: ShippingLabel,
  fromAddress: ShippingAddress,
  toAddress: ShippingAddress,
  format: { width: number; height: number; dpi: number }
): string => {
  return `^XA
^FO50,50^A0N,30,30^FD${shippingLabel.carrier.toUpperCase()}^FS
^FO50,100^A0N,25,25^FDTracking: ${shippingLabel.trackingNumber}^FS
^FO50,150^A0N,20,20^FDFrom: ${fromAddress.firstName} ${fromAddress.lastName}^FS
^FO50,180^A0N,20,20^FD${fromAddress.address1}^FS
^FO50,210^A0N,20,20^FD${fromAddress.city}, ${fromAddress.province} ${fromAddress.zip}^FS
^FO50,250^A0N,20,20^FD${fromAddress.country}^FS
^FO50,320^A0N,25,25^FDTo: ${toAddress.firstName} ${toAddress.lastName}^FS
^FO50,350^A0N,20,20^FD${toAddress.address1}^FS
${toAddress.address2 ? `^FO50,380^A0N,20,20^FD${toAddress.address2}^FS` : ''}
^FO50,410^A0N,20,20^FD${toAddress.city}, ${toAddress.province} ${toAddress.zip}^FS
^FO50,440^A0N,20,20^FD${toAddress.country}^FS
^FO300,350^BQN,2,8^FDMM,A${shippingLabel.trackingNumber}^FS
^FO50,500^A0N,15,15^FDService: ${shippingLabel.service}^FS
^FO50,530^A0N,15,15^FDCost: ${shippingLabel.cost} ${shippingLabel.currency}^FS
^FO50,560^A0N,15,15^FDEst. Delivery: ${shippingLabel.estimatedDelivery}^FS
^XZ`;
};

// Generate delivery note in hardticket format
export const generateDeliveryNoteHTML = (
  order: any,
  shippingLabel: ShippingLabel
): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Lieferschein - ${order.orderNumber}</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      margin: 0; 
      padding: 20px;
      background: white;
    }
    .delivery-note {
      width: 400px;
      height: 200px;
      border: 2px solid #333;
      padding: 15px;
      margin: 10px;
      position: relative;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      page-break-after: always;
    }
    .header {
      background: #3B82F6;
      color: white;
      padding: 8px;
      margin: -15px -15px 15px -15px;
      text-align: center;
      font-weight: bold;
      font-size: 14px;
    }
    .qr-code {
      position: absolute;
      top: 15px;
      right: 15px;
      width: 60px;
      height: 60px;
      background: #000;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8px;
      text-align: center;
    }
    .order-info {
      font-size: 11px;
      line-height: 1.4;
    }
    .ticket-list {
      margin-top: 10px;
      font-size: 10px;
    }
    .signature-field {
      position: absolute;
      bottom: 15px;
      left: 15px;
      right: 80px;
      border-top: 1px solid #333;
      padding-top: 5px;
      font-size: 9px;
    }
    .tracking-info {
      position: absolute;
      bottom: 15px;
      right: 15px;
      font-size: 9px;
      text-align: right;
    }
  </style>
</head>
<body>
  <div class="delivery-note">
    <div class="header">📦 LIEFERSCHEIN</div>
    <div class="qr-code">QR<br/>${order.orderNumber}</div>
    
    <div class="order-info">
      <strong>Bestellung:</strong> ${order.orderNumber}<br/>
      <strong>Datum:</strong> ${new Date().toLocaleDateString('de-DE')}<br/>
      <strong>Event:</strong> ${order.eventTitle}<br/>
      <strong>Empfänger:</strong> ${order.participant.firstName} ${order.participant.lastName}<br/>
      <strong>Adresse:</strong> ${order.participant.address.street}<br/>
      ${order.participant.address.city}, ${order.participant.address.postalCode}<br/>
      <strong>Telefon:</strong> ${order.participant.phone || 'Nicht angegeben'}
    </div>
    
    <div class="ticket-list">
      <strong>📋 Ticket-Inhalt:</strong><br/>
      ${order.tickets.map((ticket: any) => 
        `• ${ticket.category} - ${ticket.ticketNumber}<br/>`
      ).join('')}
      <strong>Gesamt:</strong> ${order.tickets.length} Hardticket(s)
    </div>
    
    <div class="signature-field">
      <strong>Empfänger-Unterschrift:</strong> ________________________
    </div>
    
    <div class="tracking-info">
      <strong>Tracking:</strong><br/>
      ${shippingLabel.trackingNumber}<br/>
      <strong>Versand:</strong> ${shippingLabel.carrier.toUpperCase()}
    </div>
  </div>
</body>
</html>`;
};