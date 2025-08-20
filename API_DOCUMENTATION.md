# 🔌 TicketForge API Documentation

## 📋 API-Übersicht

Die TicketForge API ermöglicht es Ihnen, Event-Daten, Teilnehmer-Informationen und Vorverkaufszahlen programmatisch zu exportieren und zu verwalten.

**Base URL:** `https://api.ticketforge.de/v1`
**Authentifizierung:** Bearer Token (API-Key)
**Rate Limits:** 1000 Requests/Stunde, 100 Requests/Minute

---

## 🔐 Authentifizierung

### API-Key erhalten
```bash
# Im TicketForge Dashboard → API-Verwaltung
# Neuen API-Key generieren
```

### Request-Header
```http
Authorization: Bearer tf_live_sk_1234567890abcdef
Content-Type: application/json
```

### Beispiel-Request
```javascript
const response = await fetch('https://api.ticketforge.de/v1/events', {
  headers: {
    'Authorization': 'Bearer tf_live_sk_1234567890abcdef',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
```

---

## 📊 Events API

### GET /events
Alle Events exportieren

**Parameter:**
- `format` (optional): `json`, `csv`, `xlsx`
- `status` (optional): `published`, `draft`, `sold_out`, `completed`
- `date_from` (optional): `YYYY-MM-DD`
- `date_to` (optional): `YYYY-MM-DD`
- `include_sales_data` (optional): `true`, `false`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "evt_123456",
      "title": "Summer Music Festival 2024",
      "date": "2024-07-15",
      "time": "18:00",
      "venue": {
        "name": "Central Park",
        "address": "New York, NY",
        "capacity": 50000
      },
      "totalCapacity": 50000,
      "soldTickets": 35678,
      "revenue": 2845670.50,
      "status": "published",
      "categories": [
        {
          "id": "cat_vip",
          "name": "VIP",
          "price": 299,
          "capacity": 500,
          "sold": 456,
          "available": 44
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 100,
    "total": 1,
    "totalPages": 1
  }
}
```

### GET /events/{event_id}/presales
Vorverkaufszahlen für spezifisches Event

**Parameter:**
- `event_id` (required): Event-ID
- `format` (optional): `json`, `csv`, `xlsx`
- `include_categories` (optional): `true`, `false`
- `include_revenue` (optional): `true`, `false`

**Response:**
```json
{
  "success": true,
  "event": {
    "id": "evt_123456",
    "title": "Summer Music Festival 2024",
    "salesPeriod": {
      "start": "2024-01-01T00:00:00Z",
      "end": "2024-07-15T18:00:00Z",
      "isActive": true
    }
  },
  "presales": {
    "totalTicketsSold": 35678,
    "totalRevenue": 2845670.50,
    "grossRevenue": 2845670.50,
    "vatAmount": 540777.40,
    "netRevenue": 2304893.10,
    "vatRate": 19,
    "categories": [
      {
        "id": "cat_vip",
        "name": "VIP",
        "ticketsSold": 456,
        "capacity": 500,
        "revenue": 136344,
        "averagePrice": 299,
        "soldPercentage": 91.2
      }
    ],
    "dailySales": [
      {
        "date": "2024-01-15",
        "tickets": 234,
        "revenue": 20826
      }
    ]
  }
}
```

---

## 👥 Participants API

### GET /events/{event_id}/participants
Event-Teilnehmer exportieren

**Parameter:**
- `event_id` (required): Event-ID
- `format` (optional): `json`, `csv`, `xlsx`
- `include_tickets` (optional): `true`, `false`
- `include_ean_codes` (optional): `true`, `false`
- `include_personal_data` (optional): `true`, `false` (DSGVO-konform)

**Response:**
```json
{
  "success": true,
  "event": {
    "id": "evt_123456",
    "title": "Summer Music Festival 2024"
  },
  "participants": [
    {
      "id": "prt_123456",
      "firstName": "Anna",
      "lastName": "Müller",
      "email": "anna.mueller@email.com",
      "phone": "+49 30 12345678",
      "address": {
        "street": "Hauptstraße 123",
        "city": "Berlin",
        "postalCode": "10115",
        "country": "Deutschland"
      },
      "tickets": [
        {
          "ticketNumber": "TKT-2024-001-000001",
          "category": "VIP",
          "eanCode": "4012345678901",
          "qrCode": "QR-001-TKT-2024-001-000001-VIP-123456",
          "price": 299,
          "purchaseDate": "2024-01-15T10:30:00Z",
          "status": "valid"
        }
      ],
      "totalSpent": 299,
      "customerSegment": "vip"
    }
  ]
}
```

### POST /participants/export
Bulk-Export aller Teilnehmer

**Request Body:**
```json
{
  "events": ["evt_123456", "evt_789012"],
  "format": "xlsx",
  "include_ean_codes": true,
  "email_delivery": ["admin@example.com", "manager@example.com"],
  "filters": {
    "date_from": "2024-01-01",
    "date_to": "2024-12-31",
    "customer_segment": "vip"
  }
}
```

---

## 🎫 Tickets API

### GET /tickets
Alle Tickets exportieren

**Parameter:**
- `format` (optional): `json`, `csv`, `xlsx`, `pdf`
- `event_id` (optional): Event-ID Filter
- `status` (optional): `valid`, `used`, `cancelled`, `refunded`
- `category` (optional): Ticket-Kategorie
- `include_participant_data` (optional): `true`, `false`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "tkt_123456",
      "ticketNumber": "TKT-2024-001-000001",
      "eanCode": "4012345678901",
      "qrCode": "QR-001-TKT-2024-001-000001-VIP-123456",
      "eventId": "evt_123456",
      "categoryId": "cat_vip",
      "participantId": "prt_123456",
      "price": 299,
      "purchaseDate": "2024-01-15T10:30:00Z",
      "status": "valid",
      "seatNumber": "A12",
      "section": "VIP",
      "row": "5"
    }
  ]
}
```

---

## 📈 Analytics API

### GET /analytics
Analytics-Daten exportieren

**Parameter:**
- `metric` (required): `revenue`, `tickets`, `events`, `customers`
- `period` (optional): `7d`, `30d`, `90d`, `1y`
- `group_by` (optional): `day`, `week`, `month`
- `event_id` (optional): Spezifisches Event

**Response:**
```json
{
  "success": true,
  "metric": "revenue",
  "period": "30d",
  "summary": {
    "total": 2845670.50,
    "growth": 18.5,
    "average": 94855.68
  },
  "data": [
    {
      "date": "2024-01-01",
      "value": 45678,
      "growth": 12.3
    }
  ]
}
```

---

## 📦 Shipping API

### GET /shipping/orders
Hardticket-Bestellungen exportieren

**Parameter:**
- `status` (optional): `pending`, `printed`, `shipped`, `delivered`
- `date_from` (optional): `YYYY-MM-DD`
- `date_to` (optional): `YYYY-MM-DD`
- `country` (optional): Ländercode (DE, US, UK, etc.)

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "id": "ship_123456",
      "orderNumber": "ORD-2024-001",
      "participant": {
        "name": "Anna Müller",
        "email": "anna.mueller@email.com",
        "address": {
          "street": "Hauptstraße 123",
          "city": "Berlin",
          "postalCode": "10115",
          "country": "Deutschland"
        }
      },
      "tickets": [
        {
          "ticketNumber": "TKT-2024-001-000001",
          "category": "VIP",
          "eanCode": "4012345678901"
        }
      ],
      "shipping": {
        "method": "DHL Standard",
        "trackingNumber": "DHL123456789DE",
        "estimatedDelivery": "2024-01-18T12:00:00Z",
        "cost": 4.99
      },
      "status": "shipped"
    }
  ]
}
```

---

## 🔄 Webhooks

### Event-Webhooks
TicketForge kann Webhooks an Ihre URLs senden:

**POST /your-webhook-url**
```json
{
  "event": "ticket.sold",
  "data": {
    "eventId": "evt_123456",
    "ticketId": "tkt_789012",
    "participantId": "prt_345678",
    "category": "VIP",
    "price": 299,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

**Verfügbare Events:**
- `ticket.sold` - Ticket verkauft
- `ticket.refunded` - Ticket storniert
- `event.sold_out` - Event ausverkauft
- `event.low_stock` - Wenige Tickets verfügbar
- `hardticket.shipped` - Hardticket versendet

---

## 📋 Error Handling

### HTTP Status Codes
- `200` - Erfolgreich
- `400` - Ungültige Anfrage
- `401` - Nicht authentifiziert
- `403` - Nicht autorisiert
- `404` - Nicht gefunden
- `429` - Rate Limit erreicht
- `500` - Server-Fehler

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "INVALID_API_KEY",
    "message": "Der bereitgestellte API-Schlüssel ist ungültig",
    "details": "Überprüfen Sie Ihren API-Schlüssel und versuchen Sie es erneut"
  }
}
```

---

## 💻 Code-Beispiele

### JavaScript/Node.js
```javascript
const TicketForgeAPI = {
  baseURL: 'https://api.ticketforge.de/v1',
  apiKey: 'tf_live_sk_1234567890abcdef',

  async request(endpoint, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    return response.json();
  },

  // Events exportieren
  async getEvents(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/events?${params}`);
  },

  // Vorverkaufszahlen abrufen
  async getPresales(eventId, options = {}) {
    const params = new URLSearchParams(options);
    return this.request(`/events/${eventId}/presales?${params}`);
  },

  // Teilnehmer exportieren
  async getParticipants(eventId, options = {}) {
    const params = new URLSearchParams(options);
    return this.request(`/events/${eventId}/participants?${params}`);
  }
};

// Verwendung
const events = await TicketForgeAPI.getEvents({ status: 'published' });
const presales = await TicketForgeAPI.getPresales('evt_123456', { 
  include_categories: true 
});
```

### Python
```python
import requests
import json

class TicketForgeAPI:
    def __init__(self, api_key):
        self.base_url = 'https://api.ticketforge.de/v1'
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
    
    def get_events(self, **filters):
        response = requests.get(
            f'{self.base_url}/events',
            headers=self.headers,
            params=filters
        )
        return response.json()
    
    def get_presales(self, event_id, **options):
        response = requests.get(
            f'{self.base_url}/events/{event_id}/presales',
            headers=self.headers,
            params=options
        )
        return response.json()
    
    def export_participants(self, event_id, **options):
        response = requests.get(
            f'{self.base_url}/events/{event_id}/participants',
            headers=self.headers,
            params=options
        )
        return response.json()

# Verwendung
api = TicketForgeAPI('tf_live_sk_1234567890abcdef')
events = api.get_events(status='published')
presales = api.get_presales('evt_123456', include_categories=True)
```

### PHP
```php
<?php
class TicketForgeAPI {
    private $baseUrl = 'https://api.ticketforge.de/v1';
    private $apiKey;
    
    public function __construct($apiKey) {
        $this->apiKey = $apiKey;
    }
    
    private function request($endpoint, $options = []) {
        $headers = [
            'Authorization: Bearer ' . $this->apiKey,
            'Content-Type: application/json'
        ];
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->baseUrl . $endpoint);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        return json_decode($response, true);
    }
    
    public function getEvents($filters = []) {
        $query = http_build_query($filters);
        return $this->request('/events?' . $query);
    }
    
    public function getPresales($eventId, $options = []) {
        $query = http_build_query($options);
        return $this->request("/events/{$eventId}/presales?" . $query);
    }
}

// Verwendung
$api = new TicketForgeAPI('tf_live_sk_1234567890abcdef');
$events = $api->getEvents(['status' => 'published']);
$presales = $api->getPresales('evt_123456', ['include_categories' => true]);
?>
```

---

## 📤 Export-Formate

### JSON (Standard)
```json
{
  "success": true,
  "data": [...],
  "metadata": {
    "generatedAt": "2024-01-20T10:30:00Z",
    "format": "json",
    "recordCount": 1247
  }
}
```

### CSV
```csv
Name,Email,EAN-Code,Ticket-Kategorie,Kaufdatum,Preis
Anna Müller,anna.mueller@email.com,4012345678901,VIP,2024-01-15,€299
Thomas Schmidt,thomas.schmidt@email.com,4012345678902,General,2024-01-16,€89
```

### Excel (XLSX)
- **Formatierte Tabellen** mit Spalten-Styling
- **Mehrere Worksheets** (Events, Participants, Sales)
- **Formeln** für automatische Berechnungen
- **Charts** für visuelle Darstellung

---

## 🔔 Webhook-Integration

### Webhook-URLs konfigurieren
```bash
# Im TicketForge Dashboard → API-Verwaltung → Webhooks
POST /api/v1/webhooks
{
  "url": "https://ihre-domain.com/ticketforge-webhook",
  "events": ["ticket.sold", "event.sold_out"],
  "secret": "ihr_webhook_secret"
}
```

### Webhook-Verifizierung
```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
    
  return signature === `sha256=${expectedSignature}`;
}

// Express.js Handler
app.post('/ticketforge-webhook', (req, res) => {
  const signature = req.headers['x-ticketforge-signature'];
  const payload = JSON.stringify(req.body);
  
  if (!verifyWebhook(payload, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).send('Unauthorized');
  }
  
  // Webhook verarbeiten
  const { event, data } = req.body;
  console.log(`Webhook empfangen: ${event}`, data);
  
  res.status(200).send('OK');
});
```

---

## 📊 Rate Limiting

### Limits
- **1000 Requests/Stunde** pro API-Key
- **100 Requests/Minute** pro API-Key
- **10MB** maximale Response-Größe
- **30 Sekunden** Request-Timeout

### Rate Limit Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642694400
```

### Rate Limit überschritten
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded",
    "retryAfter": 3600
  }
}
```

---

## 🧪 Testing

### API-Testing mit Postman
```json
{
  "info": {
    "name": "TicketForge API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "tf_live_sk_1234567890abcdef"
      }
    ]
  }
}
```

### cURL-Beispiele
```bash
# Events abrufen
curl -H "Authorization: Bearer tf_live_sk_1234567890abcdef" \
     https://api.ticketforge.de/v1/events

# Vorverkaufszahlen als CSV
curl -H "Authorization: Bearer tf_live_sk_1234567890abcdef" \
     "https://api.ticketforge.de/v1/events/evt_123456/presales?format=csv" \
     -o presales.csv

# Teilnehmer mit EAN-Codes
curl -H "Authorization: Bearer tf_live_sk_1234567890abcdef" \
     "https://api.ticketforge.de/v1/events/evt_123456/participants?include_ean_codes=true&format=xlsx" \
     -o participants.xlsx
```

---

## 🔧 SDK Development

### JavaScript SDK
```javascript
// ticketforge-sdk.js
class TicketForgeSDK {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey;
    this.baseURL = options.baseURL || 'https://api.ticketforge.de/v1';
    this.timeout = options.timeout || 30000;
  }
  
  async events() {
    return new EventsAPI(this);
  }
  
  async participants() {
    return new ParticipantsAPI(this);
  }
  
  async analytics() {
    return new AnalyticsAPI(this);
  }
}

// Verwendung
const ticketforge = new TicketForgeSDK('tf_live_sk_1234567890abcdef');
const events = await ticketforge.events().list({ status: 'published' });
```

---

## 📞 Support

### 🛠️ Technischer Support
- **E-Mail**: api-support@ticketforge.com
- **Dokumentation**: https://docs.ticketforge.de
- **Status-Page**: https://status.ticketforge.de
- **GitHub**: https://github.com/ticketforge/api-examples

### 📈 Rate Limit Erhöhung
- **Enterprise Kunden**: Unbegrenzte API-Calls
- **Custom Limits**: Auf Anfrage verfügbar
- **Bulk-Export**: Spezielle Endpoints für große Datenmengen

---

**🔌 TicketForge API - Powerful, Simple, Reliable**