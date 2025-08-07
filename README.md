# TicketForge - Event Ticketing Management System

A comprehensive React + TypeScript application for managing events, venues, tickets, and inventory with advanced geographic sorting and automated alerts.

## 🚀 Features

### Core Functionality
- **Event Management** - Create, edit, and manage events with geographic sorting
- **Venue Management** - Global venue database with location intelligence
- **Ticket Design** - Professional ticket templates with AI-powered design
- **Bulk Import** - CSV file upload with validation and error handling
- **Inventory Management** - Real-time tracking with automated alerts
- **Bundle Management** - Create discounted ticket packages
- **AI Assistant** - Intelligent event creation with pattern recognition

### Geographic Intelligence
- **Multi-Level Sorting** - Sort by city, state, region, county, ZIP code
- **Location Parsing** - Automatic extraction of geographic data
- **SEO Optimization** - Location-based keywords and metadata
- **Regional Classification** - US geographic regions and metro areas
- **Timezone Detection** - Automatic timezone assignment

### Automated Alerts
- **Sold Out Warnings** - Prominent red badges with pulsing animation
- **Low Stock Alerts** - Critical inventory warnings (≤5% remaining)
- **Medium Stock** - Yellow warnings for limited availability (≤15%)
- **Real-time Updates** - Dynamic inventory status tracking

## 📁 Project Structure

```
src/
├── components/
│   ├── AIEventAssistant.tsx      # AI-powered event creation
│   ├── BulkImport.tsx            # CSV bulk import functionality
│   ├── Dashboard.tsx             # Main dashboard with analytics
│   ├── EventManager.tsx          # Event management with geographic sorting
│   ├── InventoryManager.tsx      # Inventory tracking with alerts
│   ├── PricingPlans.tsx          # Subscription pricing display
│   ├── Sidebar.tsx               # Navigation sidebar
│   ├── TicketBundleManager.tsx   # Bundle creation and management
│   ├── TicketDesigner.tsx        # Ticket design interface
│   └── VenueManager.tsx          # Venue management system
├── types/
│   └── index.ts                  # TypeScript type definitions
├── utils/
│   └── locationParser.ts         # Geographic data processing
├── App.tsx                       # Main application component
├── main.tsx                      # Application entry point
└── index.css                     # Global styles with Tailwind
```

## 🛠️ Installation

1. **Clone or download** all project files
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start development server:**
   ```bash
   npm run dev
   ```
4. **Build for production:**
   ```bash
   npm run build
   ```

## 📦 Dependencies

### Core Dependencies
- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Vite** - Fast build tool and dev server

### Development Dependencies
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 🎨 Design System

### Color Palette
- **Primary Blue** - #3B82F6 (buttons, links, primary actions)
- **Success Green** - #10B981 (success states, available tickets)
- **Warning Yellow** - #F59E0B (low stock warnings)
- **Danger Red** - #EF4444 (sold out, critical alerts)
- **Purple** - #8B5CF6 (bundles, premium features)

### Typography
- **Font Family** - Inter (system fallback)
- **Headings** - Bold weights (600-800)
- **Body Text** - Regular weight (400)
- **Small Text** - Medium weight (500)

### Spacing System
- **Base Unit** - 4px (0.25rem)
- **Common Spacing** - 4px, 8px, 12px, 16px, 24px, 32px
- **Layout Spacing** - 48px, 64px, 96px

## 🌍 Geographic Features

### Location Intelligence
- **Address Parsing** - Extracts street, city, state, ZIP, county
- **Regional Classification** - Northeast, Southeast, Midwest, Southwest, West
- **Metro Area Recognition** - Major metropolitan areas
- **Timezone Assignment** - Automatic timezone detection

### SEO Optimization
- **Location Keywords** - Auto-generated location-based keywords
- **Primary Location** - "City, State" format
- **Secondary Location** - County or region context
- **Nearby Landmarks** - Famous locations for major cities

## 🚨 Alert System

### Ticket Availability Levels
- **SOLD OUT** (0% available) - Red, pulsing animation
- **CRITICAL** (≤5% available) - Orange, pulsing animation
- **LOW STOCK** (≤15% available) - Yellow warning
- **MEDIUM** (≤30% available) - Blue indicator
- **GOOD** (>30% available) - Green status

### Alert Locations
- Event list badges
- Dashboard alert cards
- Inventory manager warnings
- Product detail pages

## 🔧 Configuration

### Environment Variables
No environment variables required for basic functionality.

### Customization
- **Colors** - Modify `tailwind.config.js`
- **Typography** - Update font imports in `index.css`
- **Geographic Data** - Extend `locationParser.ts`

## 📱 Responsive Design

- **Mobile First** - Optimized for mobile devices
- **Tablet Support** - Medium screen layouts
- **Desktop** - Full feature set on large screens
- **Breakpoints** - sm (640px), md (768px), lg (1024px), xl (1280px)

## 🚀 Performance

### Optimization Features
- **Code Splitting** - Lazy loading of components
- **Tree Shaking** - Unused code elimination
- **Asset Optimization** - Compressed images and fonts
- **Caching** - Browser caching strategies

## 📄 License

MIT License - Feel free to use in personal and commercial projects.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or issues:
- Check the documentation
- Review component code comments
- Test in development environment
- Verify all dependencies are installed

---

**TicketForge** - Professional event ticketing management made simple.