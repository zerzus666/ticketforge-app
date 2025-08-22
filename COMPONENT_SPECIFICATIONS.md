# 🧩 TicketForge - Component Specifications

## 📋 Frontend-Komponenten Detailspezifikation

### 🚨 Inventory-Alert-Komponenten (KRITISCH)

#### 🔴 SoldOutBadge Component
```typescript
interface SoldOutBadgeProps {
  eventTitle: string;
  categoryName?: string;
  size?: 'small' | 'medium' | 'large';
  showAnimation?: boolean;
}

const SoldOutBadge: React.FC<SoldOutBadgeProps> = ({ 
  eventTitle, 
  categoryName, 
  size = 'medium',
  showAnimation = true 
}) => {
  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-2 text-sm',
    large: 'px-4 py-3 text-base'
  };

  return (
    <div 
      className={`
        bg-gradient-to-r from-red-600 to-red-700 
        text-white font-bold rounded-full 
        ${sizeClasses[size]}
        ${showAnimation ? 'animate-pulse' : ''}
        shadow-lg shadow-red-500/30
        border-2 border-red-500
        uppercase tracking-wide
      `}
      role="alert"
      aria-label={`${eventTitle} ${categoryName ? categoryName : ''} ist ausverkauft`}
    >
      🔴 AUSVERKAUFT
    </div>
  );
};

// CSS-Animationen
const soldOutKeyframes = `
@keyframes pulse-red {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
  }
  50% { 
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(220, 38, 38, 0.6);
  }
}

.animate-pulse-red {
  animation: pulse-red 2s infinite;
}
`;
```

#### 🟠 CriticalStockBadge Component
```typescript
interface CriticalStockBadgeProps {
  availableTickets: number;
  totalCapacity: number;
  categoryName: string;
}

const CriticalStockBadge: React.FC<CriticalStockBadgeProps> = ({ 
  availableTickets, 
  totalCapacity, 
  categoryName 
}) => {
  const percentage = (availableTickets / totalCapacity) * 100;
  
  return (
    <div 
      className="
        bg-gradient-to-r from-orange-500 to-red-500 
        text-white font-bold rounded-full 
        px-3 py-2 text-sm
        animate-pulse-orange
        shadow-lg shadow-orange-500/30
        border-2 border-orange-400
        uppercase tracking-wide
      "
      role="alert"
      aria-label={`Kritischer Bestand: Nur noch ${availableTickets} ${categoryName} Tickets verfügbar`}
    >
      ⚠️ NUR {availableTickets} ÜBRIG
    </div>
  );
};
```

#### 🟡 LowStockBadge Component
```typescript
const LowStockBadge: React.FC<{
  availableTickets: number;
  categoryName: string;
}> = ({ availableTickets, categoryName }) => (
  <div 
    className="
      bg-gradient-to-r from-yellow-500 to-orange-500 
      text-white font-semibold rounded-full 
      px-3 py-1 text-sm
      shadow-md shadow-yellow-500/20
      border border-yellow-400
      uppercase tracking-wide
    "
    role="alert"
    aria-label={`Wenige Tickets: ${availableTickets} ${categoryName} Tickets verfügbar`}
  >
    🟡 WENIGE TICKETS
  </div>
);
```

### 📊 Dashboard-Komponenten

#### 🏠 Dashboard Component
```typescript
interface DashboardProps {
  shop: string;
  userSubscription: SubscriptionPlan;
}

const Dashboard: React.FC<DashboardProps> = ({ shop, userSubscription }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Real-time updates via WebSocket
  useEffect(() => {
    const socket = io();
    socket.emit('join-shop', shop);
    
    socket.on('inventory-update', (update) => {
      setEvents(prev => prev.map(event => 
        event.id === update.eventId 
          ? updateEventInventory(event, update)
          : event
      ));
    });
    
    socket.on('critical-alert', (alert) => {
      setAlerts(prev => [alert, ...prev]);
      showNotification(alert);
    });
    
    return () => socket.disconnect();
  }, [shop]);

  return (
    <div className="dashboard-container">
      {/* Stats Overview */}
      <div className="stats-grid">
        <StatCard 
          title="Aktive Events" 
          value={stats?.activeEvents || 0}
          icon={Calendar}
          color="blue"
          trend={stats?.eventsTrend}
        />
        <StatCard 
          title="Verkaufte Tickets" 
          value={stats?.soldTickets || 0}
          icon={Ticket}
          color="emerald"
          trend={stats?.ticketsTrend}
        />
        <StatCard 
          title="Gesamtumsatz" 
          value={`€${stats?.revenue || 0}`}
          icon={DollarSign}
          color="purple"
          trend={stats?.revenueTrend}
        />
        <StatCard 
          title="Ø Ticketpreis" 
          value={`€${stats?.avgTicketPrice || 0}`}
          icon={TrendingUp}
          color="orange"
          trend={stats?.priceTrend}
        />
      </div>

      {/* Critical Alerts */}
      {alerts.length > 0 && (
        <AlertSection alerts={alerts} onDismiss={dismissAlert} />
      )}

      {/* Events Overview */}
      <EventsOverview 
        events={events}
        onEventUpdate={handleEventUpdate}
        showInventoryAlerts={true}
      />
    </div>
  );
};
```

#### 📊 StatCard Component
```typescript
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'emerald' | 'purple' | 'orange';
  trend?: {
    value: number;
    direction: 'up' | 'down';
    period: string;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200'
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`flex items-center text-sm font-medium ${
            trend.direction === 'up' ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {trend.direction === 'up' ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
            {trend.value}%
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-gray-600 text-sm">{title}</p>
        {trend && (
          <p className="text-gray-500 text-xs mt-1">{trend.period}</p>
        )}
      </div>
    </div>
  );
};
```

### 🎫 Event-Management-Komponenten

#### 📝 EventCreationForm Component
```typescript
interface EventCreationFormProps {
  onEventCreated: (event: Event) => void;
  existingVenues: Venue[];
  userSubscription: SubscriptionPlan;
}

const EventCreationForm: React.FC<EventCreationFormProps> = ({ 
  onEventCreated, 
  existingVenues,
  userSubscription 
}) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    time: '',
    endTime: '',
    doorsOpen: '',
    venue: null,
    organizer: {
      name: '',
      email: '',
      phone: ''
    },
    category: '',
    images: [],
    tags: [],
    ticketCategories: [
      { name: 'General Admission', price: 0, capacity: 0, description: '', benefits: [] }
    ]
  });

  const [venueSearchResults, setVenueSearchResults] = useState<VenueSearchResult[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Real-time validation
  useEffect(() => {
    const errors = validateEventForm(formData);
    setValidationErrors(errors);
  }, [formData]);

  // Venue search with debouncing
  const debouncedVenueSearch = useMemo(
    () => debounce(async (searchTerm: string) => {
      if (searchTerm.length >= 3) {
        const results = await searchVenues(existingVenues, searchTerm);
        setVenueSearchResults(results);
      }
    }, 300),
    [existingVenues]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateEventForm(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setIsCreating(true);
    
    try {
      const event = await createEvent(formData);
      onEventCreated(event);
      resetForm();
    } catch (error) {
      console.error('Event creation failed:', error);
      // Show error notification
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="event-creation-form">
      {/* Basic Event Info */}
      <div className="form-section">
        <h3 className="section-title">📋 Event-Grunddaten</h3>
        
        <div className="form-grid">
          <FormField
            label="Event-Titel"
            required
            error={validationErrors.title}
          >
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateFormData('title', e.target.value)}
              placeholder="Summer Music Festival 2024"
              className="form-input"
              maxLength={100}
            />
          </FormField>
          
          <FormField
            label="Event-Kategorie"
            required
            error={validationErrors.category}
          >
            <select
              value={formData.category}
              onChange={(e) => updateFormData('category', e.target.value)}
              className="form-select"
            >
              <option value="">Kategorie wählen</option>
              <option value="Musik">🎵 Musik</option>
              <option value="Business">🏢 Business</option>
              <option value="Sport">⚽ Sport</option>
              <option value="Kultur">🎭 Kultur</option>
              <option value="Comedy">😂 Comedy</option>
              <option value="Theater">🎪 Theater</option>
            </select>
          </FormField>
        </div>
        
        <FormField
          label="Event-Beschreibung"
          required
          error={validationErrors.description}
          helpText="Mindestens 150 Wörter für optimale SEO"
        >
          <WysiwygEditor
            value={formData.description}
            onChange={(value) => updateFormData('description', value)}
            placeholder="Beschreiben Sie Ihr Event ausführlich..."
            eventTitle={formData.title}
            eventCategory={formData.category}
            venue={formData.venue?.name}
            onSEOUpdate={handleSEOUpdate}
          />
        </FormField>
      </div>

      {/* Date & Time */}
      <div className="form-section">
        <h3 className="section-title">📅 Datum & Uhrzeit</h3>
        
        <div className="form-grid">
          <FormField label="Event-Datum" required error={validationErrors.date}>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => updateFormData('date', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="form-input"
            />
          </FormField>
          
          <FormField label="Beginn-Uhrzeit" required error={validationErrors.time}>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => updateFormData('time', e.target.value)}
              className="form-input"
            />
          </FormField>
          
          <FormField label="Einlass-Uhrzeit" error={validationErrors.doorsOpen}>
            <input
              type="time"
              value={formData.doorsOpen}
              onChange={(e) => updateFormData('doorsOpen', e.target.value)}
              className="form-input"
            />
          </FormField>
          
          <FormField label="End-Uhrzeit" error={validationErrors.endTime}>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => updateFormData('endTime', e.target.value)}
              className="form-input"
            />
          </FormField>
        </div>
      </div>

      {/* Venue Selection */}
      <div className="form-section">
        <h3 className="section-title">🏟️ Veranstaltungsort</h3>
        
        <VenueSelector
          selectedVenue={formData.venue}
          onVenueSelect={(venue) => updateFormData('venue', venue)}
          existingVenues={existingVenues}
          onCreateNewVenue={handleCreateNewVenue}
          error={validationErrors.venue}
        />
      </div>

      {/* Ticket Categories */}
      <div className="form-section">
        <h3 className="section-title">🎫 Ticket-Kategorien</h3>
        
        <TicketCategoriesManager
          categories={formData.ticketCategories}
          onCategoriesChange={(categories) => updateFormData('ticketCategories', categories)}
          errors={validationErrors.ticketCategories}
          maxCategories={userSubscription.limits.maxTicketCategories}
        />
      </div>

      {/* Event Images */}
      <div className="form-section">
        <h3 className="section-title">🖼️ Event-Bilder</h3>
        
        <ImageUploader
          images={formData.images}
          onImagesChange={(images) => updateFormData('images', images)}
          maxImages={5}
          maxFileSize={5 * 1024 * 1024} // 5MB
          acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
        />
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        <button
          type="button"
          onClick={resetForm}
          className="btn-secondary"
          disabled={isCreating}
        >
          Zurücksetzen
        </button>
        
        <button
          type="submit"
          className="btn-primary"
          disabled={!validation.isValid || isCreating}
        >
          {isCreating ? (
            <>
              <Loader className="w-5 h-5 animate-spin mr-2" />
              Event wird erstellt...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 mr-2" />
              Event erstellen
            </>
          )}
        </button>
      </div>
    </form>
  );
};
```

#### 🏟️ VenueSelector Component
```typescript
interface VenueSelectorProps {
  selectedVenue: Venue | null;
  onVenueSelect: (venue: Venue) => void;
  existingVenues: Venue[];
  onCreateNewVenue: (venueData: VenueFormData) => void;
  error?: string;
}

const VenueSelector: React.FC<VenueSelectorProps> = ({
  selectedVenue,
  onVenueSelect,
  existingVenues,
  onCreateNewVenue,
  error
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<VenueSearchResult[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced venue search
  const debouncedSearch = useMemo(
    () => debounce(async (term: string) => {
      if (term.length >= 3) {
        setIsSearching(true);
        const results = await searchVenues(existingVenues, term);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 300),
    [existingVenues]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  return (
    <div className="venue-selector">
      {selectedVenue ? (
        <SelectedVenueDisplay
          venue={selectedVenue}
          onClear={() => onVenueSelect(null)}
          onEdit={() => setShowCreateForm(true)}
        />
      ) : (
        <>
          <div className="venue-search">
            <div className="search-input-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Venue suchen (z.B. Madison Square Garden)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`venue-search-input ${error ? 'error' : ''}`}
              />
              {isSearching && <Loader className="search-loader" />}
            </div>
            
            {error && (
              <div className="error-message">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="search-results">
              <h4 className="results-title">
                🎯 Gefundene Venues ({searchResults.length})
              </h4>
              <div className="results-list">
                {searchResults.map((result) => (
                  <VenueSearchResult
                    key={result.venue.id}
                    result={result}
                    onSelect={() => onVenueSelect(result.venue)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Create New Venue */}
          <div className="create-venue-section">
            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              className="btn-outline"
            >
              <Plus className="w-4 h-4 mr-2" />
              Neue Venue erstellen
            </button>
          </div>

          {showCreateForm && (
            <VenueCreationModal
              onVenueCreated={(venue) => {
                onVenueSelect(venue);
                setShowCreateForm(false);
              }}
              onClose={() => setShowCreateForm(false)}
              initialData={{
                name: searchTerm,
                address: '',
                capacity: 0,
                type: 'outdoor'
              }}
            />
          )}
        </>
      )}
    </div>
  );
};
```

### 🎫 Ticket-Management-Komponenten

#### 🎟️ TicketCategoriesManager Component
```typescript
interface TicketCategoriesManagerProps {
  categories: TicketCategory[];
  onCategoriesChange: (categories: TicketCategory[]) => void;
  errors?: { [key: string]: string };
  maxCategories: number;
}

const TicketCategoriesManager: React.FC<TicketCategoriesManagerProps> = ({
  categories,
  onCategoriesChange,
  errors = {},
  maxCategories
}) => {
  const addCategory = () => {
    if (categories.length >= maxCategories) {
      alert(`Maximal ${maxCategories} Kategorien erlaubt in Ihrem Plan`);
      return;
    }

    const newCategory: TicketCategory = {
      id: generateId(),
      name: '',
      description: '',
      price: 0,
      capacity: 0,
      sold: 0,
      reserved: 0,
      color: getNextCategoryColor(categories.length),
      benefits: []
    };

    onCategoriesChange([...categories, newCategory]);
  };

  const updateCategory = (index: number, updates: Partial<TicketCategory>) => {
    const updated = categories.map((cat, i) => 
      i === index ? { ...cat, ...updates } : cat
    );
    onCategoriesChange(updated);
  };

  const removeCategory = (index: number) => {
    if (categories.length <= 1) {
      alert('Mindestens eine Ticket-Kategorie erforderlich');
      return;
    }
    
    const updated = categories.filter((_, i) => i !== index);
    onCategoriesChange(updated);
  };

  return (
    <div className="ticket-categories-manager">
      <div className="categories-header">
        <h4 className="categories-title">
          🎫 Ticket-Kategorien ({categories.length}/{maxCategories})
        </h4>
        <button
          type="button"
          onClick={addCategory}
          disabled={categories.length >= maxCategories}
          className="btn-outline-small"
        >
          <Plus className="w-4 h-4 mr-1" />
          Kategorie hinzufügen
        </button>
      </div>

      <div className="categories-list">
        {categories.map((category, index) => (
          <TicketCategoryForm
            key={category.id}
            category={category}
            index={index}
            onUpdate={(updates) => updateCategory(index, updates)}
            onRemove={() => removeCategory(index)}
            error={errors[`category_${index}`]}
            canRemove={categories.length > 1}
          />
        ))}
      </div>

      {/* Category Summary */}
      <div className="categories-summary">
        <div className="summary-stats">
          <div className="stat">
            <span className="stat-label">Gesamt-Kapazität:</span>
            <span className="stat-value">
              {categories.reduce((sum, cat) => sum + cat.capacity, 0).toLocaleString()}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Preisspanne:</span>
            <span className="stat-value">
              €{Math.min(...categories.map(c => c.price))} - €{Math.max(...categories.map(c => c.price))}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Kategorien:</span>
            <span className="stat-value">{categories.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
```

#### 🎟️ TicketCategoryForm Component
```typescript
interface TicketCategoryFormProps {
  category: TicketCategory;
  index: number;
  onUpdate: (updates: Partial<TicketCategory>) => void;
  onRemove: () => void;
  error?: string;
  canRemove: boolean;
}

const TicketCategoryForm: React.FC<TicketCategoryFormProps> = ({
  category,
  index,
  onUpdate,
  onRemove,
  error,
  canRemove
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="ticket-category-form">
      <div className="category-header">
        <div className="category-indicator" style={{ backgroundColor: category.color }}>
          {index + 1}
        </div>
        <h5 className="category-title">
          Kategorie {index + 1}
          {category.name && `: ${category.name}`}
        </h5>
        <div className="category-actions">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="btn-ghost-small"
          >
            <Settings className="w-4 h-4" />
          </button>
          {canRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="btn-ghost-small text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="category-content">
        <div className="basic-fields">
          <div className="field-row">
            <FormField label="Name" required>
              <input
                type="text"
                value={category.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                placeholder="VIP, General Admission, Student..."
                className="form-input"
              />
            </FormField>
            
            <FormField label="Preis (€)" required>
              <input
                type="number"
                value={category.price}
                onChange={(e) => onUpdate({ price: parseFloat(e.target.value) || 0 })}
                min="0.01"
                step="0.01"
                placeholder="89.00"
                className="form-input"
              />
            </FormField>
            
            <FormField label="Kapazität" required>
              <input
                type="number"
                value={category.capacity}
                onChange={(e) => onUpdate({ capacity: parseInt(e.target.value) || 0 })}
                min="1"
                placeholder="1000"
                className="form-input"
              />
            </FormField>
          </div>
        </div>

        {showAdvanced && (
          <div className="advanced-fields">
            <FormField label="Beschreibung">
              <textarea
                value={category.description}
                onChange={(e) => onUpdate({ description: e.target.value })}
                placeholder="Detaillierte Beschreibung dieser Ticket-Kategorie..."
                rows={3}
                className="form-textarea"
              />
            </FormField>
            
            <FormField label="Farbe">
              <div className="color-picker">
                <input
                  type="color"
                  value={category.color}
                  onChange={(e) => onUpdate({ color: e.target.value })}
                  className="color-input"
                />
                <span className="color-preview" style={{ backgroundColor: category.color }}></span>
              </div>
            </FormField>
            
            <FormField label="Vorteile">
              <BenefitsManager
                benefits={category.benefits}
                onBenefitsChange={(benefits) => onUpdate({ benefits })}
              />
            </FormField>
          </div>
        )}
      </div>

      {error && (
        <div className="category-error">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
};
```

### 📦 Hardticket-Versand-Komponenten

#### 🚚 ShippingManager Component
```typescript
interface ShippingManagerProps {
  userSubscription: SubscriptionPlan;
  availableCountries: string[];
}

const ShippingManager: React.FC<ShippingManagerProps> = ({ 
  userSubscription, 
  availableCountries 
}) => {
  const [orders, setOrders] = useState<HardticketOrder[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [printers, setPrinters] = useState<PrinterConnection[]>([]);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadHardticketOrders();
    loadPrinterConnections();
    loadShippingMethods();
  }, []);

  const bulkProcessOrders = async () => {
    if (selectedOrders.length === 0) {
      alert('Bitte wählen Sie mindestens eine Bestellung aus');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Generate hardtickets for all selected orders
      const hardticketJobs = await Promise.all(
        selectedOrders.map(orderId => generateHardtickets(orderId))
      );

      // 2. Generate shipping labels
      const shippingLabels = await Promise.all(
        selectedOrders.map(orderId => generateShippingLabel(orderId))
      );

      // 3. Generate delivery notes
      const deliveryNotes = await Promise.all(
        selectedOrders.map(orderId => generateDeliveryNote(orderId))
      );

      // 4. Queue for bulk printing
      await queueBulkPrint({
        hardtickets: hardticketJobs,
        shippingLabels,
        deliveryNotes,
        printerId: getDefaultPrinter()?.id
      });

      // 5. Update order statuses
      await updateOrderStatuses(selectedOrders, 'printed');

      // 6. Send tracking notifications
      await sendTrackingNotifications(selectedOrders);

      alert(`✅ ${selectedOrders.length} Bestellungen erfolgreich verarbeitet!`);
      setSelectedOrders([]);
      
    } catch (error) {
      console.error('Bulk processing failed:', error);
      alert('❌ Fehler bei der Verarbeitung. Bitte versuchen Sie es erneut.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="shipping-manager">
      {/* Header */}
      <div className="manager-header">
        <div className="header-info">
          <h2 className="manager-title">📦 Hardticket-Versand</h2>
          <p className="manager-subtitle">
            Verwalten Sie physische Ticket-Sendungen und Druck-Aufträge
          </p>
        </div>
        <div className="header-actions">
          <PrinterSettingsButton onOpenSettings={() => setShowPrinterSettings(true)} />
          <ShippingSettingsButton onOpenSettings={() => setShowShippingSettings(true)} />
        </div>
      </div>

      {/* Statistics */}
      <ShippingStatistics orders={orders} />

      {/* Filters and Search */}
      <OrderFilters
        onSearchChange={setSearchTerm}
        onStatusFilter={setStatusFilter}
        onCountryFilter={setCountryFilter}
      />

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <BulkActionsBar
          selectedCount={selectedOrders.length}
          onBulkPrint={bulkProcessOrders}
          onBulkShip={bulkShipOrders}
          isProcessing={isProcessing}
        />
      )}

      {/* Orders List */}
      <OrdersList
        orders={filteredOrders}
        selectedOrders={selectedOrders}
        onOrderSelect={toggleOrderSelection}
        onSelectAll={selectAllOrders}
        onOrderAction={handleOrderAction}
      />

      {/* Settings Modals */}
      {showPrinterSettings && (
        <PrinterSettingsModal
          printers={printers}
          onClose={() => setShowPrinterSettings(false)}
          onPrinterUpdate={updatePrinter}
        />
      )}
    </div>
  );
};
```

#### 📋 OrderCard Component
```typescript
interface OrderCardProps {
  order: HardticketOrder;
  isSelected: boolean;
  onSelect: (orderId: string) => void;
  onAction: (action: string, orderId: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, isSelected, onSelect, onAction }) => {
  const statusConfig = {
    pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    printed: { icon: Printer, color: 'text-blue-600', bg: 'bg-blue-100' },
    shipped: { icon: Truck, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    delivered: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    failed: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' }
  };

  const StatusIcon = statusConfig[order.status].icon;

  return (
    <div className={`order-card ${isSelected ? 'selected' : ''}`}>
      <div className="order-header">
        <div className="order-selection">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(order.id)}
            className="order-checkbox"
          />
        </div>
        
        <div className="order-info">
          <h4 className="order-number">{order.orderNumber}</h4>
          <div className="order-status">
            <StatusIcon className={`w-5 h-5 ${statusConfig[order.status].color}`} />
            <span className={`status-badge ${statusConfig[order.status].bg} ${statusConfig[order.status].color}`}>
              {getStatusLabel(order.status)}
            </span>
          </div>
        </div>
      </div>

      <div className="order-content">
        {/* Customer Info */}
        <div className="customer-section">
          <h5 className="section-title">👤 Kunde</h5>
          <div className="customer-info">
            <div className="info-row">
              <Mail className="w-4 h-4 text-gray-500" />
              <span>{order.participant.firstName} {order.participant.lastName}</span>
            </div>
            <div className="info-row">
              <Mail className="w-4 h-4 text-gray-500" />
              <span>{order.participant.email}</span>
            </div>
            {order.participant.phone && (
              <div className="info-row">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>{order.participant.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="address-section">
          <h5 className="section-title">📍 Lieferadresse</h5>
          <div className="address-info">
            <div>{order.participant.address.street}</div>
            <div>{order.participant.address.postalCode} {order.participant.address.city}</div>
            <div>{order.participant.address.country}</div>
          </div>
        </div>

        {/* Tickets */}
        <div className="tickets-section">
          <h5 className="section-title">🎫 Tickets ({order.tickets.length})</h5>
          <div className="tickets-list">
            {order.tickets.map((ticket, index) => (
              <div key={index} className="ticket-item">
                <span className="ticket-category">{ticket.category}</span>
                <span className="ticket-number">{ticket.ticketNumber}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Info */}
        <div className="shipping-section">
          <h5 className="section-title">🚚 Versand</h5>
          <div className="shipping-info">
            <div className="info-row">
              <span className="info-label">Methode:</span>
              <span>{order.shippingMethod.name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Kosten:</span>
              <span>€{order.shippingMethod.price}</span>
            </div>
            {order.trackingNumber && (
              <div className="info-row">
                <span className="info-label">Tracking:</span>
                <span className="tracking-number">{order.trackingNumber}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="order-actions">
        <button
          onClick={() => onAction('view', order.id)}
          className="action-btn"
          title="Details anzeigen"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => onAction('edit', order.id)}
          className="action-btn"
          title="Bearbeiten"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onAction('print', order.id)}
          className="action-btn"
          title="Etikett drucken"
        >
          <Printer className="w-4 h-4" />
        </button>
        {order.trackingNumber && (
          <button
            onClick={() => onAction('track', order.id)}
            className="action-btn"
            title="Sendung verfolgen"
          >
            <Package className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
```

---

## 🎨 CSS-Spezifikationen

### 🚨 **Alert-Animationen**
```css
/* Sold Out Animation */
@keyframes pulse-sold-out {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(220, 38, 38, 0.6);
  }
}

.sold-out-badge {
  background: linear-gradient(45deg, #DC2626, #EF4444);
  color: white;
  padding: 8px 16px;
  border-radius: 9999px;
  font-weight: 800;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  animation: pulse-sold-out 2s infinite;
  border: 2px solid #B91C1C;
  position: relative;
  overflow: hidden;
}

.sold-out-badge::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

/* Critical Stock Animation */
@keyframes pulse-critical {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 2px 8px rgba(234, 88, 12, 0.3);
  }
  50% {
    transform: scale(1.03);
    box-shadow: 0 4px 12px rgba(234, 88, 12, 0.5);
  }
}

.critical-badge {
  background: linear-gradient(45deg, #EA580C, #F97316);
  color: white;
  padding: 6px 12px;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 11px;
  animation: pulse-critical 1.5s infinite;
  border: 2px solid #C2410C;
}

/* Low Stock Warning */
.low-stock-badge {
  background: linear-gradient(45deg, #D97706, #F59E0B);
  color: white;
  padding: 4px 10px;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 10px;
  border: 1px solid #B45309;
  box-shadow: 0 2px 6px rgba(217, 119, 6, 0.2);
}
```

### 📱 **Responsive Design**
```css
/* Mobile-First Responsive Design */
.event-card {
  @apply bg-white rounded-xl border border-gray-200 overflow-hidden;
  transition: all 0.3s ease;
}

.event-card:hover {
  @apply shadow-lg border-blue-300;
  transform: translateY(-2px);
}

/* Mobile (< 768px) */
@media (max-width: 767px) {
  .event-card {
    @apply mx-4 mb-4;
  }
  
  .event-card .event-content {
    @apply p-4;
  }
  
  .event-card .ticket-categories {
    @apply flex-col space-y-2;
  }
  
  .inventory-badge {
    @apply text-xs px-2 py-1;
  }
}

/* Tablet (768px - 1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  .events-grid {
    @apply grid-cols-2 gap-6;
  }
  
  .event-card {
    @apply max-w-none;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .events-grid {
    @apply grid-cols-3 gap-8;
  }
  
  .event-card {
    @apply max-w-sm;
  }
  
  .dashboard-layout {
    @apply grid-cols-4 gap-8;
  }
}

/* Large Desktop (1280px+) */
@media (min-width: 1280px) {
  .events-grid {
    @apply grid-cols-4;
  }
  
  .dashboard-layout {
    @apply grid-cols-5;
  }
}
```

### 🎨 **Component-Library**
```css
/* Button System */
.btn-primary {
  @apply bg-blue-600 text-white px-6 py-3 rounded-lg font-medium;
  @apply hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
  @apply transition-all duration-200;
}

.btn-secondary {
  @apply bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-medium;
  @apply hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2;
  @apply transition-all duration-200;
}

.btn-outline {
  @apply border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium;
  @apply hover:bg-blue-600 hover:text-white focus:ring-2 focus:ring-blue-500;
  @apply transition-all duration-200;
}

.btn-danger {
  @apply bg-red-600 text-white px-6 py-3 rounded-lg font-medium;
  @apply hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2;
  @apply transition-all duration-200;
}

/* Form Elements */
.form-input {
  @apply w-full px-4 py-2 border border-gray-300 rounded-lg;
  @apply focus:ring-2 focus:ring-blue-500 focus:border-transparent;
  @apply disabled:bg-gray-50 disabled:text-gray-500;
  @apply transition-all duration-200;
}

.form-input.error {
  @apply border-red-500 focus:ring-red-500;
}

.form-textarea {
  @apply w-full px-4 py-2 border border-gray-300 rounded-lg resize-none;
  @apply focus:ring-2 focus:ring-blue-500 focus:border-transparent;
  @apply transition-all duration-200;
}

.form-select {
  @apply w-full px-4 py-2 border border-gray-300 rounded-lg;
  @apply focus:ring-2 focus:ring-blue-500 focus:border-transparent;
  @apply bg-white cursor-pointer;
  @apply transition-all duration-200;
}

/* Card System */
.card {
  @apply bg-white rounded-xl border border-gray-200 overflow-hidden;
  @apply shadow-sm hover:shadow-md transition-shadow duration-200;
}

.card-header {
  @apply px-6 py-4 border-b border-gray-200 bg-gray-50;
}

.card-content {
  @apply px-6 py-4;
}

.card-footer {
  @apply px-6 py-4 border-t border-gray-200 bg-gray-50;
}
```

---

## 📱 Mobile-Komponenten

### 📲 **Mobile-Navigation**
```typescript
const MobileNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/shipping', label: 'Versand', icon: Package },
    { path: '/analytics', label: 'Berichte', icon: BarChart3 },
    { path: '/settings', label: 'Einstellungen', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mobile-menu-button"
        aria-label="Navigation öffnen"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsOpen(false)}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="menu-header">
              <h3 className="menu-title">TicketForge</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="menu-close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <nav className="menu-nav">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
```

### 📊 **Mobile-Dashboard**
```typescript
const MobileDashboard: React.FC<DashboardProps> = ({ stats, alerts, events }) => {
  return (
    <div className="mobile-dashboard">
      {/* Quick Stats */}
      <div className="mobile-stats">
        <div className="stats-scroll">
          <MobileStatCard title="Events" value={stats.activeEvents} color="blue" />
          <MobileStatCard title="Tickets" value={stats.soldTickets} color="emerald" />
          <MobileStatCard title="Umsatz" value={`€${stats.revenue}`} color="purple" />
        </div>
      </div>

      {/* Critical Alerts */}
      {alerts.length > 0 && (
        <div className="mobile-alerts">
          <h3 className="alerts-title">🚨 Wichtige Warnungen</h3>
          {alerts.slice(0, 3).map(alert => (
            <MobileAlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}

      {/* Recent Events */}
      <div className="mobile-events">
        <div className="events-header">
          <h3 className="events-title">📅 Aktuelle Events</h3>
          <Link to="/events" className="view-all-link">
            Alle anzeigen
          </Link>
        </div>
        
        <div className="events-list">
          {events.slice(0, 5).map(event => (
            <MobileEventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};
```

---

## 🔧 Utility-Funktionen

### 📍 **Location-Parser**
```typescript
// utils/locationParser.ts
export function parseAddress(address: string): ParsedLocation {
  // Regex-Patterns für verschiedene Adress-Formate
  const patterns = {
    // US Format: "123 Main St, New York, NY 10001"
    us: /^(.+),\s*([^,]+),\s*([A-Z]{2})\s*(\d{5}(-\d{4})?)$/,
    
    // German Format: "Hauptstraße 123, 10115 Berlin, Deutschland"
    de: /^(.+),\s*(\d{5})\s+([^,]+),?\s*(.*)$/,
    
    // UK Format: "123 High Street, London, SW1A 1AA, UK"
    uk: /^(.+),\s*([^,]+),\s*([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}),?\s*(.*)$/
  };

  // Try each pattern
  for (const [country, pattern] of Object.entries(patterns)) {
    const match = address.match(pattern);
    if (match) {
      return parseAddressMatch(match, country);
    }
  }

  // Fallback: Split by commas and guess
  return parseAddressFallback(address);
}

function parseAddressMatch(match: RegExpMatchArray, country: string): ParsedLocation {
  switch (country) {
    case 'us':
      return {
        street: match[1].trim(),
        city: match[2].trim(),
        state: match[3].trim(),
        zipCode: match[4].trim(),
        country: 'United States',
        region: getUSRegion(match[3]),
        timezone: getUSTimezone(match[3])
      };
      
    case 'de':
      return {
        street: match[1].trim(),
        zipCode: match[2].trim(),
        city: match[3].trim(),
        country: match[4].trim() || 'Deutschland',
        state: getGermanState(match[2]),
        region: getGermanRegion(match[2]),
        timezone: 'Europe/Berlin'
      };
      
    case 'uk':
      return {
        street: match[1].trim(),
        city: match[2].trim(),
        zipCode: match[3].trim(),
        country: match[4].trim() || 'United Kingdom',
        region: 'United Kingdom',
        timezone: 'Europe/London'
      };
      
    default:
      return parseAddressFallback(match[0]);
  }
}

// SEO-Location-Generator
export function generateSEOLocation(
  parsedLocation: ParsedLocation, 
  venueName: string
): SEOLocation {
  const { city, state, county, region } = parsedLocation;
  
  // Primary location for main SEO
  const primaryLocation = `${city}, ${state}`;
  
  // Secondary location for additional context
  const secondaryLocation = county ? `${county}, ${state}` : region || 'United States';
  
  // Generate location keywords
  const locationKeywords = [
    city.toLowerCase(),
    state.toLowerCase(),
    `${city.toLowerCase()} ${state.toLowerCase()}`,
    `events in ${city.toLowerCase()}`,
    `${city.toLowerCase()} events`,
    `tickets ${city.toLowerCase()}`,
    `${city.toLowerCase()} tickets`,
    `concerts ${city.toLowerCase()}`,
    `${city.toLowerCase()} concerts`
  ];
  
  // Add venue-specific keywords
  locationKeywords.push(
    `${venueName.toLowerCase()} events`,
    `events at ${venueName.toLowerCase()}`,
    `${venueName.toLowerCase()} tickets`
  );
  
  // Add metro area keywords
  const metroArea = detectMetroArea(city);
  if (metroArea) {
    locationKeywords.push(
      metroArea.toLowerCase(),
      `${metroArea.toLowerCase()} events`,
      `events in ${metroArea.toLowerCase()}`
    );
  }
  
  return {
    primaryLocation,
    secondaryLocation,
    locationKeywords: [...new Set(locationKeywords)], // Remove duplicates
    nearbyLandmarks: getNearbyLandmarks(city),
    metroArea
  };
}
```

### 🎫 **Ticket-Code-Generatoren**
```typescript
// utils/ticketCodes.ts

// EAN-13 Code Generator
export function generateEANCode(
  eventId: string, 
  participantId: string, 
  categoryId: string
): string {
  // Format: EEEPPPCCCXXX (12 digits + checksum)
  const eventCode = eventId.slice(-3).padStart(3, '0');
  const participantCode = participantId.slice(-3).padStart(3, '0');
  const categoryCode = categoryId.slice(-3).padStart(3, '0');
  
  // Generate random 3-digit sequence
  const randomCode = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  // Combine to 12 digits
  const baseCode = eventCode + participantCode + categoryCode + randomCode;
  
  // Calculate EAN-13 checksum
  const checksum = calculateEANChecksum(baseCode);
  
  return baseCode + checksum;
}

function calculateEANChecksum(code: string): string {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(code[i]);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  
  const checksum = (10 - (sum % 10)) % 10;
  return checksum.toString();
}

// QR-Code Generator
export function generateQRCode(
  eventId: string,
  participantId: string,
  categoryName: string,
  ticketNumber: string
): string {
  const eventCode = eventId.toUpperCase().slice(-3);
  const categoryCode = categoryName.replace(/\s+/g, '').toUpperCase().slice(0, 6);
  const timestamp = Date.now().toString().slice(-6);
  
  return `QR-${eventCode}-${ticketNumber}-${categoryCode}-${timestamp}`;
}

// Ticket-Number Generator
export function generateTicketNumber(
  eventId: string,
  participantId: string
): string {
  const year = new Date().getFullYear();
  const eventCode = eventId.slice(-3).padStart(3, '0');
  const participantCode = participantId.slice(-6).padStart(6, '0');
  
  return `TKT-${year}-${eventCode}-${participantCode}`;
}

// Validation Functions
export function validateEANCode(eanCode: string): boolean {
  if (!/^\d{13}$/.test(eanCode)) return false;
  
  const baseCode = eanCode.slice(0, 12);
  const providedChecksum = eanCode.slice(12);
  const calculatedChecksum = calculateEANChecksum(baseCode);
  
  return providedChecksum === calculatedChecksum;
}

export function validateQRCode(qrCode: string): boolean {
  return /^QR-[A-Z0-9]{3}-TKT-\d{4}-\d{3}-\d{6}-[A-Z0-9]{6}-\d{6}$/.test(qrCode);
}
```

### 📧 **E-Mail-Templates**
```typescript
// utils/emailTemplates.ts

// Inventory-Alert E-Mail
export function generateInventoryAlertEmail(
  alert: InventoryAlert,
  event: Event,
  category: TicketCategory
): EmailTemplate {
  const available = category.capacity - category.sold - category.reserved;
  const percentage = (available / category.capacity) * 100;
  
  let subject: string;
  let urgency: 'high' | 'medium' | 'low';
  
  switch (alert.type) {
    case 'sold_out':
      subject = `🔴 AUSVERKAUFT: ${event.title} - ${category.name}`;
      urgency = 'high';
      break;
    case 'critical':
      subject = `🟠 KRITISCH: Nur ${available} Tickets übrig - ${event.title}`;
      urgency = 'high';
      break;
    case 'low_stock':
      subject = `🟡 Wenige Tickets: ${category.name} - ${event.title}`;
      urgency = 'medium';
      break;
    default:
      subject = `📊 Inventory-Update: ${event.title}`;
      urgency = 'low';
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${subject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f9fafb; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: ${urgency === 'high' ? '#DC2626' : urgency === 'medium' ? '#F59E0B' : '#3B82F6'}; color: white; padding: 24px; text-align: center; }
        .content { padding: 24px; }
        .alert-badge { display: inline-block; padding: 8px 16px; border-radius: 9999px; font-weight: bold; font-size: 14px; margin: 16px 0; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin: 20px 0; }
        .stat-card { background: #f8fafc; padding: 16px; border-radius: 8px; text-align: center; }
        .footer { background: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">🚨 Inventory-Alert</h1>
          <p style="margin: 8px 0 0 0; opacity: 0.9;">${event.title}</p>
        </div>
        
        <div class="content">
          <div class="alert-badge" style="background: ${urgency === 'high' ? '#DC2626' : urgency === 'medium' ? '#F59E0B' : '#3B82F6'}; color: white;">
            ${alert.type === 'sold_out' ? '🔴 AUSVERKAUFT' : 
              alert.type === 'critical' ? `🟠 NUR ${available} ÜBRIG` : 
              '🟡 WENIGE TICKETS'}
          </div>
          
          <h2>Event-Details</h2>
          <p><strong>📅 Datum:</strong> ${new Date(event.date).toLocaleDateString('de-DE')}</p>
          <p><strong>⏰ Uhrzeit:</strong> ${event.time} Uhr</p>
          <p><strong>🏟️ Venue:</strong> ${event.venue.name}</p>
          <p><strong>📍 Adresse:</strong> ${event.venue.address}</p>
          
          <h3>Ticket-Status: ${category.name}</h3>
          <div class="stats-grid">
            <div class="stat-card">
              <div style="font-size: 24px; font-weight: bold; color: #3B82F6;">${category.capacity}</div>
              <div>Gesamt-Kapazität</div>
            </div>
            <div class="stat-card">
              <div style="font-size: 24px; font-weight: bold; color: #10B981;">${category.sold}</div>
              <div>Verkauft</div>
            </div>
            <div class="stat-card">
              <div style="font-size: 24px; font-weight: bold; color: ${available === 0 ? '#EF4444' : available <= 10 ? '#F59E0B' : '#10B981'};">${available}</div>
              <div>Verfügbar</div>
            </div>
            <div class="stat-card">
              <div style="font-size: 24px; font-weight: bold; color: #8B5CF6;">${percentage.toFixed(1)}%</div>
              <div>Verfügbar</div>
            </div>
          </div>
          
          ${alert.type === 'sold_out' ? `
            <div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <h4 style="color: #DC2626; margin: 0 0 8px 0;">🔴 Event ist ausverkauft!</h4>
              <p style="margin: 0; color: #7F1D1D;">Alle ${category.capacity} Tickets für "${category.name}" wurden verkauft. Das Event wird automatisch als "Ausverkauft" markiert.</p>
            </div>
          ` : alert.type === 'critical' ? `
            <div style="background: #FFFBEB; border: 1px solid #FED7AA; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <h4 style="color: #EA580C; margin: 0 0 8px 0;">🟠 Kritischer Bestand!</h4>
              <p style="margin: 0; color: #9A3412;">Nur noch ${available} Tickets verfügbar. Erwägen Sie zusätzliche Marketing-Maßnahmen oder Kapazitäts-Erhöhung.</p>
            </div>
          ` : `
            <div style="background: #FFFBEB; border: 1px solid #FED7AA; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <h4 style="color: #D97706; margin: 0 0 8px 0;">🟡 Wenige Tickets verfügbar</h4>
              <p style="margin: 0; color: #92400E;">Der Bestand wird knapp. Überwachen Sie die Verkäufe und bereiten Sie sich auf einen möglichen Ausverkauf vor.</p>
            </div>
          `}
          
          <div style="text-align: center; margin: 24px 0;">
            <a href="https://ihre-domain.com/events/${event.id}" 
               style="background: #3B82F6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
              📊 Event im Dashboard anzeigen
            </a>
          </div>
        </div>
        
        <div class="footer">
          <p>Diese Benachrichtigung wurde automatisch von TicketForge generiert.</p>
          <p>Benachrichtigungen verwalten: <a href="https://ihre-domain.com/settings/notifications">Einstellungen</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return {
    to: alert.recipientEmail,
    subject,
    html: htmlContent,
    priority: urgency,
    tags: ['inventory-alert', alert.type, event.id]
  };
}

// Ticket-Bestätigung E-Mail
export function generateTicketConfirmationEmail(
  customer: ShopifyCustomer,
  order: ShopifyOrder,
  event: Event,
  tickets: Ticket[]
): EmailTemplate {
  const totalTickets = tickets.length;
  const totalAmount = tickets.reduce((sum, ticket) => sum + ticket.price, 0);
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Ticket-Bestätigung - ${event.title}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f9fafb; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #3B82F6, #10B981); color: white; padding: 32px 24px; text-align: center; }
        .content { padding: 24px; }
        .ticket-card { background: #f8fafc; border: 2px solid #e5e7eb; border-radius: 12px; padding: 20px; margin: 16px 0; position: relative; }
        .qr-placeholder { width: 80px; height: 80px; background: #000; color: white; display: flex; align-items: center; justify-content: center; font-size: 10px; margin: 0 auto 16px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">🎫 Ticket-Bestätigung</h1>
          <p style="margin: 8px 0 0 0; font-size: 18px; opacity: 0.9;">${event.title}</p>
        </div>
        
        <div class="content">
          <h2>Hallo ${customer.first_name}!</h2>
          <p>Vielen Dank für Ihren Ticket-Kauf. Hier sind Ihre Ticket-Details:</p>
          
          <div style="background: #EFF6FF; border: 1px solid #DBEAFE; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <h3 style="color: #1E40AF; margin: 0 0 12px 0;">📋 Event-Informationen</h3>
            <p style="margin: 4px 0;"><strong>📅 Datum:</strong> ${new Date(event.date).toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p style="margin: 4px 0;"><strong>⏰ Uhrzeit:</strong> ${event.time} Uhr</p>
            ${event.doorsOpen ? `<p style="margin: 4px 0;"><strong>🚪 Einlass:</strong> ${event.doorsOpen} Uhr</p>` : ''}
            <p style="margin: 4px 0;"><strong>🏟️ Venue:</strong> ${event.venue.name}</p>
            <p style="margin: 4px 0;"><strong>📍 Adresse:</strong> ${event.venue.address}</p>
          </div>
          
          <h3>🎫 Ihre Tickets (${totalTickets})</h3>
          ${tickets.map(ticket => `
            <div class="ticket-card">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 8px 0; color: #1F2937;">${ticket.category}</h4>
                  <p style="margin: 4px 0; font-size: 14px; color: #6B7280;"><strong>Ticket-Nr.:</strong> ${ticket.ticketNumber}</p>
                  <p style="margin: 4px 0; font-size: 14px; color: #6B7280;"><strong>Preis:</strong> €${ticket.price}</p>
                  ${ticket.seatInfo ? `<p style="margin: 4px 0; font-size: 14px; color: #6B7280;"><strong>Platz:</strong> ${ticket.seatInfo}</p>` : ''}
                </div>
                <div class="qr-placeholder">
                  QR-CODE<br/>${ticket.qrCode.slice(0, 12)}
                </div>
              </div>
              <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #E5E7EB; font-family: monospace; font-size: 12px; color: #6B7280;">
                QR: ${ticket.qrCode}<br/>
                EAN: ${ticket.eanCode}
              </div>
            </div>
          `).join('')}
          
          <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <h4 style="color: #166534; margin: 0 0 8px 0;">💰 Bestellübersicht</h4>
            <p style="margin: 4px 0;"><strong>Bestellnummer:</strong> ${order.order_number}</p>
            <p style="margin: 4px 0;"><strong>Tickets:</strong> ${totalTickets}</p>
            <p style="margin: 4px 0;"><strong>Gesamtbetrag:</strong> €${totalAmount.toFixed(2)}</p>
            <p style="margin: 4px 0;"><strong>Zahlungsstatus:</strong> ✅ Bezahlt</p>
          </div>
          
          <div style="background: #FEF3C7; border: 1px solid #FDE68A; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <h4 style="color: #92400E; margin: 0 0 8px 0;">📱 Wichtige Hinweise</h4>
            <ul style="margin: 8px 0; padding-left: 20px; color: #78350F;">
              <li>Bringen Sie Ihre Tickets ausgedruckt oder auf dem Smartphone mit</li>
              <li>QR-Codes werden am Eingang gescannt</li>
              <li>Tickets sind nicht übertragbar und nur einmal verwendbar</li>
              <li>Bei Fragen kontaktieren Sie uns: support@ticketforge.com</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="https://ihre-domain.com/tickets/${order.id}" 
               style="background: #3B82F6; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 16px;">
              🎫 Tickets herunterladen (PDF)
            </a>
          </div>
        </div>
        
        <div style="background: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht auf diese E-Mail.</p>
          <p>TicketForge - Professionelles Event-Ticketing für Shopify</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return {
    to: customer.email,
    subject,
    html: htmlContent,
    attachments: [
      {
        filename: `tickets-${event.title.replace(/[^a-z0-9]/gi, '_')}.pdf`,
        content: await generateTicketPDF(tickets, event),
        contentType: 'application/pdf'
      }
    ],
    tags: ['ticket-confirmation', event.id, order.id]
  };
}
```

---

## 📊 **Performance-Benchmarks**

### ⚡ **Response-Zeit-Ziele**
```typescript
// Performance-Monitoring
interface PerformanceBenchmarks {
  // Frontend Performance
  firstContentfulPaint: number;    // < 1.5s
  largestContentfulPaint: number;  // < 2.5s
  cumulativeLayoutShift: number;   // < 0.1
  timeToInteractive: number;       // < 3.5s
  
  // API Performance
  dashboardLoad: number;           // < 500ms
  eventCreation: number;           // < 1s
  inventoryUpdate: number;         // < 200ms
  webhookProcessing: number;       // < 2s
  
  // Database Performance
  eventQuery: number;              // < 50ms
  inventoryQuery: number;          // < 30ms
  analyticsQuery: number;          // < 100ms
  bulkOperations: number;          // < 5s
}

// Performance-Monitoring Implementation
class PerformanceMonitor {
  static startTimer(operation: string): string {
    const timerId = `${operation}-${Date.now()}`;
    console.time(timerId);
    return timerId;
  }
  
  static endTimer(timerId: string, threshold: number): void {
    console.timeEnd(timerId);
    
    const duration = performance.now() - parseInt(timerId.split('-')[1]);
    
    if (duration > threshold) {
      console.warn(`Performance warning: ${timerId} took ${duration}ms (threshold: ${threshold}ms)`);
      
      // Send to monitoring service
      newrelic.recordMetric(`Custom/Performance/Slow/${timerId.split('-')[0]}`, duration);
    }
  }
  
  static async measureAsync<T>(
    operation: string, 
    fn: () => Promise<T>, 
    threshold: number
  ): Promise<T> {
    const timerId = this.startTimer(operation);
    try {
      const result = await fn();
      this.endTimer(timerId, threshold);
      return result;
    } catch (error) {
      this.endTimer(timerId, threshold);
      throw error;
    }
  }
}

// Usage in Components
const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      const timerId = PerformanceMonitor.startTimer('dashboard-load');
      
      try {
        const [eventsData, statsData, alertsData] = await Promise.all([
          fetchEvents(),
          fetchDashboardStats(),
          fetchInventoryAlerts()
        ]);
        
        setEvents(eventsData);
        setStats(statsData);
        setAlerts(alertsData);
        
        PerformanceMonitor.endTimer(timerId, 500); // 500ms threshold
      } catch (error) {
        console.error('Dashboard load failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Component render...
};
```

---

**📋 Ende der Component-Spezifikationen**

**🎯 Nächster Schritt:** Implementierung der kritischen Inventory-Alert-Komponenten starten

**📞 Bei Fragen:** dev-support@ticketforge.com