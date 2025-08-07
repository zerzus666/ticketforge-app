# Shopify Event Ticketing App

A comprehensive event ticketing solution for Shopify merchants. Create, manage, and sell event tickets directly through your Shopify store with automated inventory management and prominent availability alerts.

## 🎫 Features

### Core Functionality
- **Event Management** - Create and manage events with multiple ticket categories
- **Shopify Integration** - Events sync as products for seamless checkout
- **Inventory Tracking** - Real-time ticket availability with automated alerts
- **Order Processing** - All sales processed through Shopify's secure checkout
- **Customer Management** - Integrated with Shopify customer database

### Automated Alert System
- **SOLD OUT** - Prominent red alerts when events are completely sold out
- **CRITICAL** - Orange alerts with pulsing animation when ≤5% tickets remain
- **LOW STOCK** - Yellow warnings when ≤15% tickets available
- **Visual Progress** - Progress bars showing sales status for each category

### Professional UI
- **Shopify Polaris** - Native Shopify admin design system
- **Responsive Design** - Works perfectly on all devices
- **Embedded App** - Seamlessly integrated into Shopify admin
- **Real-time Updates** - Live inventory and sales tracking

## 🚀 Installation

### Prerequisites
- Node.js 18+ installed
- Shopify Partner account
- PostgreSQL database
- Shopify CLI installed globally

### Setup Steps

1. **Install Shopify CLI**
   ```bash
   npm install -g @shopify/cli @shopify/theme
   ```

2. **Create Shopify App**
   ```bash
   shopify app init
   ```

3. **Copy Project Files**
   Copy all files from this package to your app directory

4. **Install Dependencies**
   ```bash
   npm install
   ```

5. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database and Shopify credentials
   ```

6. **Setup Database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

7. **Start Development**
   ```bash
   npm run dev
   ```

8. **Deploy to Production**
   ```bash
   npm run deploy
   ```

## 📊 Database Schema

### Events Table
- Event details (title, description, venue, date/time)
- Capacity and sales tracking
- Revenue calculations
- Shopify product integration

### Ticket Categories
- Multiple ticket types per event (VIP, General, Student, etc.)
- Individual pricing and capacity
- Real-time inventory tracking
- Shopify variant integration

### Orders Integration
- Links to Shopify orders
- Customer information
- Payment status tracking
- Automated inventory updates

## 🔧 Configuration

### Environment Variables
```env
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
DATABASE_URL=postgresql://...
HOST=https://your-app-url.com
SCOPES=write_products,read_products,write_orders,read_orders
```

### Shopify App Settings
- **Scopes**: Product and order management permissions
- **Webhooks**: Order and app lifecycle events
- **Embedded**: Runs inside Shopify admin
- **Distribution**: Available on Shopify App Store

## 📱 Usage

### Creating Events
1. Navigate to the app in Shopify admin
2. Click "Create Event"
3. Fill in event details (title, venue, date, time)
4. Add ticket categories with pricing and capacity
5. Publish event - automatically creates Shopify products

### Managing Inventory
- Dashboard shows real-time availability
- Automatic alerts for low stock and sold out events
- Visual progress bars for each ticket category
- Inventory updates automatically with each sale

### Processing Orders
- Customers purchase through normal Shopify checkout
- Orders automatically update event inventory
- Customer data integrated with Shopify
- Email confirmations sent via Shopify

## 🎨 Customization

### Styling
- Uses Shopify Polaris design system
- Consistent with Shopify admin interface
- Responsive design for all screen sizes
- Custom alert styling for urgency

### Functionality
- Extend database schema for additional features
- Add custom webhooks for external integrations
- Implement additional ticket types or bundles
- Add reporting and analytics features

## 🔒 Security

- OAuth authentication with Shopify
- Secure session management
- Database encryption
- HTTPS required for production
- Webhook verification

## 📈 Performance

- Optimized database queries
- Real-time inventory updates
- Efficient webhook processing
- Scalable architecture with Remix
- CDN-ready static assets

## 🛠️ Development

### File Structure
```
app/
├── routes/           # Remix routes
├── components/       # Reusable UI components
├── shopify.server.ts # Shopify configuration
├── db.server.ts      # Database connection
└── root.tsx          # App shell

prisma/
└── schema.prisma     # Database schema

public/
└── build/           # Built assets
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run deploy` - Deploy to Shopify
- `npm run prisma` - Database operations

## 📞 Support

For questions or issues:
1. Check the Shopify App documentation
2. Review Remix framework docs
3. Check Prisma database documentation
4. Contact support for custom development

## 📄 License

MIT License - Free for commercial and personal use.

---

**Event Ticketing Pro** - Professional event management for Shopify stores.