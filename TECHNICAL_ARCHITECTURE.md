# 🏗️ TicketForge - Technical Architecture

## 📋 System-Übersicht

```
┌─────────────────────────────────────────────────────────────────┐
│                    TicketForge Shopify App                      │
├─────────────────────────────────────────────────────────────────┤
│  Frontend (React + TypeScript + Tailwind)                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│  │ Dashboard   │ │Event Manager│ │Shipping Mgr │ │ AI Assist │ │
│  │             │ │             │ │             │ │           │ │
│  │• Inventory  │ │• CRUD Ops   │ │• Hardtickets│ │• Pattern  │ │
│  │  Alerts     │ │• Geographic │ │• Multi-     │ │  Recogn.  │ │
│  │• Real-time  │ │  Sorting    │ │  Carrier    │ │• Content  │ │
│  │  Stats      │ │• Bulk Import│ │• Tracking   │ │  Gen.     │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  Backend (Remix + Node.js)                                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│  │ API Routes  │ │ Webhooks    │ │ Services    │ │ Utils     │ │
│  │             │ │             │ │             │ │           │ │
│  │• Events     │ │• orders/paid│ │• Email      │ │• Location │ │
│  │• Tickets    │ │• cancelled  │ │• Shipping   │ │  Parser   │ │
│  │• Analytics  │ │• app/       │ │• AI         │ │• Export   │ │
│  │• Shipping   │ │  uninstall  │ │• Inventory  │ │• Validation│ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  Database (PostgreSQL + Prisma ORM)                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│  │ Events      │ │ Ticket      │ │ Venues      │ │ Orders    │ │
│  │             │ │ Categories  │ │             │ │           │ │
│  │• Event Data │ │• Pricing    │ │• Global DB  │ │• Shopify  │ │
│  │• Geographic │ │• Inventory  │ │• Geographic │ │  Orders   │ │
│  │• SEO Data   │ │• Shopify    │ │• Amenities  │ │• Hardticket│ │
│  │• Status     │ │  Variants   │ │• Coordinates│ │  Shipping │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External Integrations                        │
├─────────────────────────────────────────────────────────────────┤
│  Shopify APIs                                                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│  │ Admin API   │ │ Storefront  │ │ Webhooks    │ │ GraphQL   │ │
│  │• Products   │ │• Checkout   │ │• Orders     │ │• Bulk Ops │ │
│  │• Orders     │ │• Cart       │ │• App Events │ │• Metadata │ │
│  │• Customers  │ │• Themes     │ │• Inventory  │ │• Analytics│ │
│  │• Inventory  │ │• Payments   │ │• Customers  │ │• Reports  │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  Shipping APIs                                                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│  │ DHL API     │ │ USPS API    │ │ Royal Mail  │ │ Others    │ │
│  │• Labels     │ │• Labels     │ │• Labels     │ │• La Poste │ │
│  │• Tracking   │ │• Tracking   │ │• Tracking   │ │• Canada   │ │
│  │• Rates      │ │• Rates      │ │• Rates      │ │  Post     │ │
│  │• Pickup     │ │• Pickup     │ │• Pickup     │ │• Australia│ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  AI & Data APIs                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│  │ OpenAI API  │ │ Spotify API │ │ Wikipedia   │ │ Maps APIs │ │
│  │• Content    │ │• Artist     │ │• Biography  │ │• Geocoding│ │
│  │  Generation │ │  Data       │ │• Discography│ │• Places   │ │
│  │• SEO        │ │• Popularity │ │• Awards     │ │• Timezone │ │
│  │  Optimization│ │• Demographics│ │• Images     │ │• Regions  │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database-Architecture

### 📊 **Entity-Relationship-Diagram**
```sql
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│     Events      │────▶│   Ticket Categories  │     │   Event Orders  │
├─────────────────┤ 1:N ├──────────────────────┤     ├─────────────────┤
│ id (PK)         │     │ id (PK)              │ ┌──▶│ id (PK)         │
│ shop            │     │ event_id (FK)        │ │   │ event_id (FK)   │
│ title           │     │ name                 │ │   │ shopify_order_id│
│ description     │     │ price                │ │   │ customer_email  │
│ venue           │     │ capacity             │ │   │ total_amount    │
│ address         │     │ sold                 │ │   │ status          │
│ date            │     │ reserved             │ │   │ created_at      │
│ time            │     │ color                │ │   └─────────────────┘
│ status          │     │ benefits             │ │            │
│ total_capacity  │     │ shopify_variant_id   │ │            │ 1:N
│ sold_tickets    │     │ created_at           │ │            ▼
│ revenue         │     │ updated_at           │ │   ┌─────────────────┐
│ shopify_product │     └──────────────────────┘ │   │ Hardticket Orders│
│ geographic_data │              │               │   ├─────────────────┤
│ seo_location    │              │ N:1           │   │ id (PK)         │
│ images          │              ▼               │   │ order_id (FK)   │
│ tags            │     ┌──────────────────────┐ │   │ participant     │
│ organizer       │     │       Venues         │ │   │ shipping_address│
│ created_at      │     ├──────────────────────┤ │   │ shipping_method │
│ updated_at      │     │ id (PK)              │ │   │ tracking_number │
└─────────────────┘     │ name                 │ │   │ cost            │
         │               │ address              │ │   │ status          │
         │ N:1           │ capacity             │ │   │ created_at      │
         └──────────────▶│ type                 │ │   │ shipped_at      │
                         │ coordinates          │ │   │ delivered_at    │
                         │ amenities            │ │   └─────────────────┘
                         │ seating_chart        │ │            │
                         │ geographic_data      │ │            │ 1:N
                         │ seo_location         │ │            ▼
                         │ created_at           │ │   ┌─────────────────┐
                         │ updated_at           │ │   │  Participants   │
                         └──────────────────────┘ │   ├─────────────────┤
                                                  │   │ id (PK)         │
                                                  └──▶│ order_id (FK)   │
                                                      │ first_name      │
                                                      │ last_name       │
                                                      │ email           │
                                                      │ phone           │
                                                      │ address         │
                                                      │ segment         │
                                                      │ created_at      │
                                                      └─────────────────┘
```

### 🔍 **Indexing-Strategie**
```sql
-- Performance-kritische Indexes
CREATE INDEX CONCURRENTLY idx_events_shop_status ON events(shop, status);
CREATE INDEX CONCURRENTLY idx_events_date_desc ON events(date DESC);
CREATE INDEX CONCURRENTLY idx_events_geographic ON events USING GIN (geographic_data);
CREATE INDEX CONCURRENTLY idx_events_search ON events USING GIN (
  to_tsvector('german', title || ' ' || COALESCE(description, ''))
);

-- Ticket Categories
CREATE INDEX CONCURRENTLY idx_categories_event_id ON ticket_categories(event_id);
CREATE INDEX CONCURRENTLY idx_categories_shopify_variant ON ticket_categories(shopify_variant_id);

-- Orders
CREATE INDEX CONCURRENTLY idx_orders_shopify_id ON event_orders(shopify_order_id);
CREATE INDEX CONCURRENTLY idx_orders_customer_email ON event_orders(customer_email);
CREATE INDEX CONCURRENTLY idx_orders_created_at ON event_orders(created_at DESC);

-- Venues
CREATE INDEX CONCURRENTLY idx_venues_name_trgm ON venues USING GIN (name gin_trgm_ops);
CREATE INDEX CONCURRENTLY idx_venues_address_trgm ON venues USING GIN (address gin_trgm_ops);
CREATE INDEX CONCURRENTLY idx_venues_type ON venues(type);
CREATE INDEX CONCURRENTLY idx_venues_capacity ON venues(capacity);

-- Hardticket Orders
CREATE INDEX CONCURRENTLY idx_hardticket_status ON hardticket_orders(status);
CREATE INDEX CONCURRENTLY idx_hardticket_tracking ON hardticket_orders(tracking_number);
```

---

## 🔄 Data-Flow-Architecture

### 🎫 **Event-Creation-Flow**
```typescript
// 1. User Input → Validation
interface EventCreationFlow {
  userInput: EventFormData;
  validation: ValidationResult;
  geoProcessing: GeographicData;
  venueMatching: VenueMatchResult;
  seoGeneration: SEOLocationData;
  shopifyProduct: ShopifyProductCreation;
  databaseSave: DatabaseTransaction;
  cacheUpdate: CacheInvalidation;
}

// Implementation
async function createEventFlow(formData: EventFormData): Promise<Event> {
  // 1. Validate input
  const validation = await validateEventData(formData);
  if (!validation.isValid) throw new ValidationError(validation.errors);
  
  // 2. Process geographic data
  const geographic = parseAddress(formData.venue.address);
  const seoLocation = generateSEOLocation(geographic, formData.venue.name);
  
  // 3. Match or create venue
  const venue = await findOrCreateVenue({
    ...formData.venue,
    geographic,
    seoLocation
  });
  
  // 4. Create database transaction
  const event = await db.$transaction(async (tx) => {
    const newEvent = await tx.event.create({
      data: {
        ...formData,
        venueId: venue.id,
        geographic,
        seoLocation,
        status: 'DRAFT'
      }
    });
    
    // Create ticket categories
    await tx.ticketCategory.createMany({
      data: formData.ticketCategories.map(cat => ({
        ...cat,
        eventId: newEvent.id
      }))
    });
    
    return newEvent;
  });
  
  // 5. Create Shopify product (async)
  const shopifyProductId = await createShopifyProduct(event);
  await db.event.update({
    where: { id: event.id },
    data: { shopifyProductId }
  });
  
  // 6. Update caches
  await invalidateEventCache(event.shop);
  
  return event;
}
```

### 🛒 **Order-Processing-Flow**
```typescript
// Shopify Webhook → Inventory Update → Alerts
async function processOrderWebhook(webhook: ShopifyOrderWebhook): Promise<void> {
  const ticketLineItems = webhook.line_items.filter(
    item => item.vendor === 'TicketForge' && !item.sku.includes('HARDTICKET')
  );
  
  const hardticketAddon = webhook.line_items.find(
    item => item.sku === 'HARDTICKET-ADDON'
  );
  
  for (const lineItem of ticketLineItems) {
    // 1. Parse SKU to get event and category
    const [eventId, categoryId] = lineItem.sku.split('-');
    
    // 2. Update inventory in transaction
    await db.$transaction(async (tx) => {
      // Update category sold count
      await tx.ticketCategory.update({
        where: { id: categoryId },
        data: { sold: { increment: lineItem.quantity } }
      });
      
      // Update event total
      await tx.event.update({
        where: { id: eventId },
        data: { 
          soldTickets: { increment: lineItem.quantity },
          revenue: { increment: lineItem.quantity * parseFloat(lineItem.price) }
        }
      });
      
      // Create order record
      await tx.eventOrder.create({
        data: {
          eventId,
          shopifyOrderId: webhook.id.toString(),
          customerEmail: webhook.email,
          customerName: `${webhook.customer.first_name} ${webhook.customer.last_name}`,
          totalAmount: parseFloat(webhook.total_price),
          status: 'CONFIRMED'
        }
      });
    });
    
    // 3. Check for inventory alerts
    const updatedCategory = await db.ticketCategory.findUnique({
      where: { id: categoryId },
      include: { event: true }
    });
    
    await checkAndSendInventoryAlerts(updatedCategory);
    
    // 4. Create hardticket order if addon purchased
    if (hardticketAddon) {
      await createHardticketOrder({
        eventOrderId: orderRecord.id,
        participant: webhook.customer,
        shippingAddress: webhook.shipping_address,
        tickets: [{ categoryId, quantity: lineItem.quantity }]
      });
    }
    
    // 5. Send confirmation email
    await sendTicketConfirmation(webhook.customer, lineItem, updatedCategory.event);
  }
  
  // 6. Update real-time dashboard
  await broadcastInventoryUpdate(eventId);
}
```

### 📦 **Hardticket-Shipping-Flow**
```typescript
// Hardticket Order → Label Generation → Tracking
async function processHardticketShipping(orderId: string): Promise<void> {
  const order = await db.hardticketOrder.findUnique({
    where: { id: orderId },
    include: { 
      eventOrder: { 
        include: { 
          event: { include: { ticketCategories: true } }
        }
      }
    }
  });
  
  // 1. Determine shipping method based on country
  const shippingMethod = await selectOptimalShippingMethod(
    order.participant.address.country,
    order.tickets.length
  );
  
  // 2. Generate shipping label via carrier API
  const shippingLabel = await generateShippingLabel({
    carrier: shippingMethod.carrier,
    fromAddress: COMPANY_ADDRESS,
    toAddress: order.participant.address,
    packageInfo: {
      weight: order.tickets.length * 0.05, // 50g per ticket
      dimensions: { length: 25, width: 18, height: 2 }, // cm
      value: order.tickets.reduce((sum, t) => sum + t.price, 0)
    },
    serviceType: shippingMethod.serviceType
  });
  
  // 3. Generate hardtickets with QR/EAN codes
  const hardtickets = await generateHardtickets({
    event: order.eventOrder.event,
    participant: order.participant,
    tickets: order.tickets.map(ticket => ({
      ticketNumber: generateTicketNumber(order.eventOrder.eventId, order.participant.id),
      category: ticket.category,
      qrCode: generateQRCode(order.eventOrder.eventId, ticket.categoryId, order.participant.id),
      eanCode: generateEANCode(order.eventOrder.eventId, order.participant.id, ticket.categoryId),
      seatInfo: ticket.seatInfo
    }))
  });
  
  // 4. Generate delivery note
  const deliveryNote = await generateDeliveryNote({
    orderNumber: order.orderNumber,
    participant: order.participant,
    tickets: hardtickets,
    shippingMethod: shippingMethod
  });
  
  // 5. Update order with tracking info
  await db.hardticketOrder.update({
    where: { id: orderId },
    data: {
      trackingNumber: shippingLabel.trackingNumber,
      shippingLabelUrl: shippingLabel.labelUrl,
      status: 'PRINTED',
      shippedAt: new Date()
    }
  });
  
  // 6. Send shipping notification to customer
  await sendShippingNotification({
    customerEmail: order.participant.email,
    trackingNumber: shippingLabel.trackingNumber,
    estimatedDelivery: shippingLabel.estimatedDelivery,
    trackingUrl: generateTrackingUrl(shippingMethod.carrier, shippingLabel.trackingNumber)
  });
  
  // 7. Queue for bulk printing
  await addToPrintQueue({
    hardtickets,
    deliveryNote,
    shippingLabel,
    printerId: await getDefaultPrinter()
  });
}
```

---

## ⚡ Performance-Architecture

### 🚀 **Caching-Strategy**
```typescript
// Multi-Layer Caching
interface CacheStrategy {
  // Level 1: In-Memory (Node.js)
  memory: {
    events: Map<string, Event[]>;        // 5 minutes TTL
    venues: Map<string, Venue[]>;        // 1 hour TTL
    analytics: Map<string, any>;         // 15 minutes TTL
  };
  
  // Level 2: Redis (Distributed)
  redis: {
    sessions: string;                     // Shopify sessions
    inventory: string;                    // Real-time inventory
    geographic: string;                   // Parsed location data
    apiResponses: string;                 // API response cache
  };
  
  // Level 3: Database (Materialized Views)
  database: {
    eventAnalytics: MaterializedView;     // Refreshed daily
    venueStats: MaterializedView;         // Refreshed weekly
    revenueReports: MaterializedView;     // Refreshed hourly
  };
}

// Cache-Implementation
class CacheManager {
  private memory = new Map();
  private redis = new Redis(process.env.REDIS_URL);
  
  async get<T>(key: string): Promise<T | null> {
    // 1. Check memory cache
    if (this.memory.has(key)) {
      return this.memory.get(key);
    }
    
    // 2. Check Redis cache
    const redisValue = await this.redis.get(key);
    if (redisValue) {
      const parsed = JSON.parse(redisValue);
      this.memory.set(key, parsed);
      return parsed;
    }
    
    return null;
  }
  
  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    // Set in both caches
    this.memory.set(key, value);
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }
  
  async invalidate(pattern: string): Promise<void> {
    // Clear memory cache
    for (const key of this.memory.keys()) {
      if (key.includes(pattern)) {
        this.memory.delete(key);
      }
    }
    
    // Clear Redis cache
    const keys = await this.redis.keys(`*${pattern}*`);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}
```

### 📊 **Database-Optimization**
```sql
-- Partitioning für große Tabellen
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
  (e.sold_tickets::float / NULLIF(e.total_capacity, 0)) * 100 as sold_percentage,
  (e.geographic_data->>'city') as city,
  (e.geographic_data->>'state') as state,
  (e.geographic_data->>'country') as country,
  COUNT(tc.id) as category_count,
  AVG(tc.price) as avg_ticket_price
FROM events e
LEFT JOIN ticket_categories tc ON tc.event_id = e.id
WHERE e.status IN ('PUBLISHED', 'SOLD_OUT')
GROUP BY e.id, e.shop, e.title, e.date, e.total_capacity, e.sold_tickets, e.revenue, e.geographic_data;

-- Refresh-Function
CREATE OR REPLACE FUNCTION refresh_event_analytics()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY event_analytics;
  
  -- Update cache invalidation
  PERFORM pg_notify('cache_invalidate', 'analytics');
END;
$$ LANGUAGE plpgsql;

-- Scheduled refresh (täglich um 2 Uhr)
SELECT cron.schedule('refresh-analytics', '0 2 * * *', 'SELECT refresh_event_analytics();');
```

### 🔄 **Real-time Updates**
```typescript
// WebSocket-Integration für Live-Updates
import { Server as SocketIOServer } from 'socket.io';

class RealTimeManager {
  private io: SocketIOServer;
  
  constructor(server: any) {
    this.io = new SocketIOServer(server, {
      cors: { origin: "*" }
    });
    
    this.setupEventHandlers();
  }
  
  private setupEventHandlers(): void {
    this.io.on('connection', (socket) => {
      // Join shop-specific room
      socket.on('join-shop', (shopDomain) => {
        socket.join(`shop:${shopDomain}`);
      });
      
      // Join event-specific room
      socket.on('join-event', (eventId) => {
        socket.join(`event:${eventId}`);
      });
    });
  }
  
  // Broadcast inventory update to all connected clients
  async broadcastInventoryUpdate(eventId: string, categoryId: string): Promise<void> {
    const updatedCategory = await db.ticketCategory.findUnique({
      where: { id: categoryId },
      include: { event: true }
    });
    
    if (updatedCategory) {
      const available = updatedCategory.capacity - updatedCategory.sold - updatedCategory.reserved;
      const alertStatus = calculateInventoryStatus(updatedCategory);
      
      // Broadcast to event-specific room
      this.io.to(`event:${eventId}`).emit('inventory-update', {
        categoryId,
        available,
        alertStatus,
        timestamp: new Date().toISOString()
      });
      
      // Broadcast to shop-wide room if critical
      if (alertStatus === 'sold_out' || alertStatus === 'critical') {
        this.io.to(`shop:${updatedCategory.event.shop}`).emit('critical-alert', {
          eventId,
          eventTitle: updatedCategory.event.title,
          categoryName: updatedCategory.name,
          alertStatus,
          available
        });
      }
    }
  }
}
```

---

## 🔒 Security-Architecture

### 🛡️ **Authentication & Authorization**
```typescript
// Shopify OAuth-Flow
class ShopifyAuthManager {
  async initiateOAuth(shop: string): Promise<string> {
    const state = generateSecureState();
    const scopes = process.env.SCOPES?.split(',') || [];
    
    const authUrl = `https://${shop}/admin/oauth/authorize?` + 
      `client_id=${process.env.SHOPIFY_API_KEY}&` +
      `scope=${scopes.join(',')}&` +
      `redirect_uri=${process.env.HOST}/auth/callback&` +
      `state=${state}`;
    
    // Store state for verification
    await redis.setex(`oauth:state:${state}`, 600, shop);
    
    return authUrl;
  }
  
  async handleCallback(code: string, shop: string, state: string): Promise<Session> {
    // 1. Verify state
    const storedShop = await redis.get(`oauth:state:${state}`);
    if (storedShop !== shop) {
      throw new Error('Invalid OAuth state');
    }
    
    // 2. Exchange code for access token
    const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.SHOPIFY_API_KEY,
        client_secret: process.env.SHOPIFY_API_SECRET,
        code
      })
    });
    
    const { access_token, scope } = await tokenResponse.json();
    
    // 3. Store session
    const session = await db.session.upsert({
      where: { shop },
      update: { accessToken: access_token, scope },
      create: {
        id: generateSessionId(),
        shop,
        accessToken: access_token,
        scope,
        isOnline: false
      }
    });
    
    // 4. Register webhooks
    await this.registerWebhooks(session);
    
    return session;
  }
}
```

### 🔐 **Webhook-Security**
```typescript
// Webhook-Verifizierung
import crypto from 'crypto';

function verifyShopifyWebhook(
  payload: string, 
  signature: string, 
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('base64');
    
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'base64'),
    Buffer.from(expectedSignature, 'base64')
  );
}

// Webhook-Handler mit Security
app.post('/webhooks/:topic', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.get('X-Shopify-Hmac-Sha256');
  const topic = req.params.topic;
  const payload = req.body.toString();
  
  // 1. Verify webhook signature
  if (!verifyShopifyWebhook(payload, signature, process.env.SHOPIFY_WEBHOOK_SECRET)) {
    return res.status(401).send('Unauthorized');
  }
  
  // 2. Parse and validate payload
  let webhookData;
  try {
    webhookData = JSON.parse(payload);
  } catch (error) {
    return res.status(400).send('Invalid JSON');
  }
  
  // 3. Process webhook based on topic
  try {
    switch (topic) {
      case 'orders/paid':
        await processOrderPaid(webhookData);
        break;
      case 'orders/cancelled':
        await processOrderCancelled(webhookData);
        break;
      case 'app/uninstalled':
        await processAppUninstalled(webhookData);
        break;
      default:
        console.warn(`Unhandled webhook topic: ${topic}`);
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error(`Webhook processing error:`, error);
    res.status(500).send('Internal Server Error');
  }
});
```

### 🔒 **Data-Protection**
```typescript
// DSGVO-konforme Datenverarbeitung
interface DataProtectionManager {
  // Daten-Anonymisierung
  anonymizeParticipant(participantId: string): Promise<void>;
  
  // Daten-Export (DSGVO Art. 20)
  exportPersonalData(email: string): Promise<PersonalDataExport>;
  
  // Daten-Löschung (DSGVO Art. 17)
  deletePersonalData(email: string): Promise<DeletionReport>;
  
  // Einverständnis-Management
  updateMarketingConsent(email: string, consent: boolean): Promise<void>;
}

// Implementation
class GDPRCompliance implements DataProtectionManager {
  async anonymizeParticipant(participantId: string): Promise<void> {
    await db.$transaction(async (tx) => {
      // Anonymize personal data
      await tx.participant.update({
        where: { id: participantId },
        data: {
          firstName: 'ANONYMIZED',
          lastName: 'ANONYMIZED',
          email: `anonymized-${participantId}@deleted.local`,
          phone: null,
          address: null,
          dateOfBirth: null,
          emergencyContact: null
        }
      });
      
      // Keep statistical data for analytics
      await tx.anonymizedParticipant.create({
        data: {
          originalId: participantId,
          customerSegment: participant.customerSegment,
          totalSpent: participant.totalSpent,
          totalTickets: participant.totalTicketsPurchased,
          registrationDate: participant.registrationDate,
          anonymizedAt: new Date()
        }
      });
    });
  }
  
  async exportPersonalData(email: string): Promise<PersonalDataExport> {
    const participant = await db.participant.findUnique({
      where: { email },
      include: {
        orders: {
          include: {
            event: true,
            tickets: true
          }
        },
        hardticketOrders: true
      }
    });
    
    if (!participant) {
      throw new Error('No data found for this email address');
    }
    
    return {
      personalInfo: {
        name: `${participant.firstName} ${participant.lastName}`,
        email: participant.email,
        phone: participant.phone,
        address: participant.address,
        registrationDate: participant.registrationDate
      },
      ticketPurchases: participant.orders.map(order => ({
        eventTitle: order.event.title,
        ticketCategory: order.tickets[0]?.category,
        purchaseDate: order.createdAt,
        amount: order.totalAmount
      })),
      marketingConsent: participant.marketingConsent,
      dataProcessingPurposes: [
        'Event ticket sales and delivery',
        'Customer support and communication',
        'Legal compliance and record keeping'
      ],
      retentionPeriod: '7 years after last purchase (legal requirement)',
      exportDate: new Date().toISOString()
    };
  }
}
```

---

## 📱 Mobile-Architecture

### 📲 **Progressive Web App (PWA)**
```typescript
// Service Worker für Offline-Funktionalität
// sw.js
const CACHE_NAME = 'ticketforge-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/events',
  '/static/css/main.css',
  '/static/js/main.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Push Notifications für Inventory-Alerts
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  if (data.type === 'inventory-alert') {
    const options = {
      body: `${data.eventTitle}: ${data.message}`,
      icon: '/icons/alert-icon.png',
      badge: '/icons/badge-icon.png',
      tag: `inventory-${data.eventId}`,
      requireInteraction: true,
      actions: [
        {
          action: 'view',
          title: 'Event anzeigen'
        },
        {
          action: 'dismiss',
          title: 'Schließen'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});
```

### 📱 **Responsive Components**
```typescript
// Mobile-optimierte Event-Card
const EventCard: React.FC<{ event: Event; isMobile: boolean }> = ({ event, isMobile }) => {
  const inventoryStatus = calculateInventoryStatus(event);
  
  if (isMobile) {
    return (
      <div className="mobile-event-card">
        <div className="card-header">
          <h3 className="event-title">{event.title}</h3>
          {inventoryStatus.alert && (
            <div className={`alert-badge ${inventoryStatus.alertClass}`}>
              {inventoryStatus.alertText}
            </div>
          )}
        </div>
        
        <div className="card-content">
          <div className="event-meta">
            <span className="date">{formatMobileDate(event.date)}</span>
            <span className="venue">{event.venue.name}</span>
          </div>
          
          <div className="ticket-summary">
            <span className="price-range">
              €{Math.min(...event.ticketCategories.map(c => c.price))} - 
              €{Math.max(...event.ticketCategories.map(c => c.price))}
            </span>
            <span className="availability">
              {event.totalCapacity - event.soldTickets} verfügbar
            </span>
          </div>
        </div>
        
        <div className="card-actions">
          <button className="btn-primary-mobile">
            Event verwalten
          </button>
        </div>
      </div>
    );
  }
  
  // Desktop-Version...
};
```

---

## 🧪 Testing-Architecture

### 🔬 **Test-Pyramid**
```typescript
// Unit Tests (90% Coverage)
describe('Inventory Alert System', () => {
  describe('calculateInventoryStatus', () => {
    test('returns sold_out when no tickets available', () => {
      const category = { capacity: 100, sold: 100, reserved: 0 };
      expect(calculateInventoryStatus(category)).toBe('sold_out');
    });
    
    test('returns critical when ≤5% available', () => {
      const category = { capacity: 100, sold: 95, reserved: 0 };
      expect(calculateInventoryStatus(category)).toBe('critical');
    });
    
    test('returns low_stock when ≤15% available', () => {
      const category = { capacity: 100, sold: 85, reserved: 0 };
      expect(calculateInventoryStatus(category)).toBe('low_stock');
    });
  });
  
  describe('generateEANCode', () => {
    test('generates valid 13-digit EAN code', () => {
      const eanCode = generateEANCode('evt_123', 'prt_456', 'cat_789');
      expect(eanCode).toMatch(/^\d{13}$/);
      expect(validateEANChecksum(eanCode)).toBe(true);
    });
  });
});

// Integration Tests (80% Coverage)
describe('Shopify Integration', () => {
  test('creates Shopify product when event published', async () => {
    const event = await createTestEvent();
    const productId = await createShopifyProduct(event);
    
    expect(productId).toBeDefined();
    
    const shopifyProduct = await shopifyAPI.rest.Product.find({
      session: testSession,
      id: productId
    });
    
    expect(shopifyProduct.title).toBe(event.title);
    expect(shopifyProduct.variants).toHaveLength(event.ticketCategories.length);
  });
  
  test('updates inventory on order webhook', async () => {
    const event = await createTestEvent();
    const webhook = createMockOrderWebhook(event);
    
    await handleOrderPaidWebhook(webhook);
    
    const updatedEvent = await db.event.findUnique({ where: { id: event.id } });
    expect(updatedEvent.soldTickets).toBe(webhook.line_items[0].quantity);
  });
});

// E2E Tests (Kritische User-Flows)
describe('Complete Event Flow', () => {
  test('user can create event and receive inventory alerts', async ({ page }) => {
    // 1. Login to Shopify Admin
    await page.goto('/auth?shop=test-store.myshopify.com');
    await page.waitForSelector('[data-testid="dashboard"]');
    
    // 2. Create new event
    await page.click('[data-testid="create-event"]');
    await page.fill('[name="title"]', 'Test Concert');
    await page.fill('[name="venue"]', 'Test Venue');
    await page.fill('[name="date"]', '2024-12-31');
    await page.fill('[name="time"]', '20:00');
    
    // 3. Add ticket category with low capacity
    await page.fill('[name="category_0_name"]', 'General');
    await page.fill('[name="category_0_price"]', '50');
    await page.fill('[name="category_0_capacity"]', '10'); // Low capacity for testing
    
    // 4. Publish event
    await page.click('[data-testid="publish-event"]');
    await page.waitForSelector('.event-card');
    
    // 5. Simulate ticket sales to trigger alerts
    await simulateTicketSales(8); // 80% sold
    
    // 6. Verify LOW STOCK alert appears
    await page.waitForSelector('.low-stock-badge');
    await expect(page.locator('.low-stock-badge')).toContainText('LOW STOCK');
    
    // 7. Sell remaining tickets
    await simulateTicketSales(2); // 100% sold
    
    // 8. Verify SOLD OUT alert appears
    await page.waitForSelector('.sold-out-badge');
    await expect(page.locator('.sold-out-badge')).toContainText('SOLD OUT');
    await expect(page.locator('.sold-out-badge')).toHaveClass(/animate-pulse/);
  });
});
```

### 🔍 **Performance Testing**
```typescript
// Load Testing mit Artillery
// artillery-config.yml
config:
  target: 'https://ticket-forge-5e4b7e5068d7.herokuapp.com'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120  
      arrivalRate: 50
    - duration: 60
      arrivalRate: 100

scenarios:
  - name: "Dashboard Load Test"
    flow:
      - get:
          url: "/dashboard"
          headers:
            Authorization: "Bearer test-token"
      - think: 5
      - get:
          url: "/api/events"
          
  - name: "Event Creation Load Test"
    flow:
      - post:
          url: "/api/events"
          json:
            title: "Load Test Event {{ $randomString() }}"
            venue: "Test Venue"
            date: "2024-12-31"
            time: "20:00"
            ticketCategories: [
              { name: "General", price: 50, capacity: 100 }
            ]

# Performance-Ziele
# - 95% der Requests < 200ms
# - 99% der Requests < 500ms  
# - 0% Error-Rate bei normaler Last
# - Graceful degradation bei Überlast
```

---

## 📈 Monitoring & Observability

### 📊 **Application Monitoring**
```typescript
// New Relic Integration
import newrelic from 'newrelic';

// Custom Metrics
class MetricsCollector {
  static recordEventCreation(shop: string, eventType: string): void {
    newrelic.recordMetric('Custom/Events/Created', 1);
    newrelic.recordMetric(`Custom/Events/Created/${eventType}`, 1);
    newrelic.addCustomAttribute('shop', shop);
  }
  
  static recordInventoryAlert(alertType: string, eventId: string): void {
    newrelic.recordMetric('Custom/Inventory/Alerts', 1);
    newrelic.recordMetric(`Custom/Inventory/Alerts/${alertType}`, 1);
    newrelic.addCustomAttribute('eventId', eventId);
  }
  
  static recordHardticketShipment(country: string, carrier: string): void {
    newrelic.recordMetric('Custom/Hardtickets/Shipped', 1);
    newrelic.recordMetric(`Custom/Hardtickets/Shipped/${country}`, 1);
    newrelic.addCustomAttribute('carrier', carrier);
  }
}

// Error Tracking
class ErrorTracker {
  static captureException(error: Error, context?: any): void {
    newrelic.noticeError(error, context);
    
    // Additional logging for critical errors
    if (error.message.includes('Shopify') || error.message.includes('Database')) {
      console.error('CRITICAL ERROR:', error, context);
      
      // Send to Slack/PagerDuty for immediate attention
      this.sendCriticalAlert(error, context);
    }
  }
  
  private static async sendCriticalAlert(error: Error, context: any): Promise<void> {
    // Slack webhook for critical errors
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🚨 CRITICAL ERROR in TicketForge`,
        attachments: [{
          color: 'danger',
          fields: [
            { title: 'Error', value: error.message, short: false },
            { title: 'Stack', value: error.stack?.substring(0, 500), short: false },
            { title: 'Context', value: JSON.stringify(context), short: false }
          ]
        }]
      })
    });
  }
}
```

### 📈 **Business Metrics**
```typescript
// Revenue Tracking
interface RevenueMetrics {
  // Subscription Revenue
  monthlyRecurringRevenue: number;
  annualRecurringRevenue: number;
  
  // Transaction Fees
  transactionFeeRevenue: number;
  averageRevenuePerUser: number;
  
  // Hardticket Revenue
  hardticketAddonRevenue: number;
  shippingMargin: number;
  
  // Growth Metrics
  newCustomers: number;
  churnRate: number;
  lifetimeValue: number;
}

class BusinessMetricsCollector {
  async calculateMRR(shop: string): Promise<number> {
    const subscription = await db.subscription.findUnique({
      where: { shop }
    });
    
    const transactionFees = await db.transactionFee.aggregate({
      where: {
        shop,
        createdAt: {
          gte: startOfMonth(),
          lte: endOfMonth()
        }
      },
      _sum: { amount: true }
    });
    
    return (subscription?.monthlyPrice || 0) + (transactionFees._sum.amount || 0);
  }
  
  async trackConversion(shop: string, eventId: string): Promise<void> {
    // Track funnel: Event Created → Published → First Sale
    await db.conversionFunnel.upsert({
      where: { eventId },
      update: { lastUpdated: new Date() },
      create: {
        eventId,
        shop,
        eventCreated: new Date(),
        eventPublished: null,
        firstSale: null
      }
    });
  }
}
```

---

## 🔄 CI/CD Pipeline

### 🚀 **Deployment-Pipeline**
```yaml
# .github/workflows/deploy.yml
name: TicketForge CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'
  HEROKU_APP_NAME: 'ticket-forge-5e4b7e5068d7'

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: ticketforge_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Setup test database
        run: |
          npx prisma migrate deploy
          npx prisma generate
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/ticketforge_test
      
      - name: Run linting
        run: npm run lint
      
      - name: Run type checking
        run: npm run typecheck
      
      - name: Run unit tests
        run: npm run test:unit
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/ticketforge_test
      
      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/ticketforge_test
          SHOPIFY_API_KEY: ${{ secrets.SHOPIFY_API_KEY_TEST }}
          SHOPIFY_API_SECRET: ${{ secrets.SHOPIFY_API_SECRET_TEST }}
      
      - name: Build application
        run: npm run build
      
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          BASE_URL: http://localhost:3000
      
      - name: Generate test coverage
        run: npm run test:coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3

  security:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Run security audit
        run: npm audit --audit-level high
      
      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  deploy-staging:
    needs: [test, security]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Deploy to Heroku Staging
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "ticket-forge-staging"
          heroku_email: ${{ secrets.HEROKU_EMAIL }}
      
      - name: Run smoke tests
        run: npm run test:smoke
        env:
          BASE_URL: https://ticket-forge-staging.herokuapp.com

  deploy-production:
    needs: [test, security]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Deploy to Heroku Production
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: ${{ env.HEROKU_APP_NAME }}
          heroku_email: ${{ secrets.HEROKU_EMAIL }}
      
      - name: Run production health checks
        run: npm run test:health
        env:
          BASE_URL: https://ticket-forge-5e4b7e5068d7.herokuapp.com
      
      - name: Notify team of deployment
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: '#deployments'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 📋 **Entwickler-Checkliste**

### ✅ **Setup-Phase**
- [ ] **Repository** geklont und Dependencies installiert
- [ ] **Shopify Partner Account** erstellt
- [ ] **Development Store** eingerichtet
- [ ] **Heroku Account** erstellt
- [ ] **PostgreSQL** lokal installiert (optional)
- [ ] **Environment Variables** konfiguriert
- [ ] **Prisma** Database-Schema generiert

### ✅ **Development-Phase**
- [ ] **Remix-App** läuft lokal
- [ ] **Shopify OAuth** funktioniert
- [ ] **Database-Verbindung** hergestellt
- [ ] **Erste API-Endpoints** implementiert
- [ ] **Shopify Product-API** Integration
- [ ] **Webhook-Handler** für orders/paid
- [ ] **Inventory-Alert-Logik** implementiert

### ✅ **Testing-Phase**
- [ ] **Unit Tests** für alle Core-Functions
- [ ] **Integration Tests** für Shopify-APIs
- [ ] **E2E Tests** für kritische User-Flows
- [ ] **Performance Tests** mit Artillery
- [ ] **Security Tests** mit OWASP ZAP
- [ ] **Accessibility Tests** mit axe-core

### ✅ **Deployment-Phase**
- [ ] **Heroku-App** erstellt und konfiguriert
- [ ] **PostgreSQL-Addon** hinzugefügt
- [ ] **Environment Variables** in Heroku gesetzt
- [ ] **Database-Migrationen** auf Heroku ausgeführt
- [ ] **App** erfolgreich deployed
- [ ] **Health-Checks** bestehen
- [ ] **Monitoring** eingerichtet

### ✅ **App Store-Phase**
- [ ] **Screenshots** in professioneller Qualität
- [ ] **Demo-Video** produziert (30-60 Sekunden)
- [ ] **App-Beschreibungen** geschrieben (DE/EN)
- [ ] **Datenschutzerklärung** DSGVO-konform
- [ ] **Support-Dokumentation** vollständig
- [ ] **Beta-Testing** mit echten Stores
- [ ] **App Store Submission** eingereicht

---

**🎯 Ziel: Shopify App Store Launch in 16 Wochen!**

**📞 Bei Fragen: dev-support@ticketforge.com**