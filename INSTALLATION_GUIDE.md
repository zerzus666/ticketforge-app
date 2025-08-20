# 🛠️ TicketForge Installation Guide

## 📋 Voraussetzungen

### 💻 System-Anforderungen
- **Node.js** 18+ installiert
- **npm** oder **yarn** Package Manager
- **Git** für Version Control
- **Heroku CLI** für Deployment
- **PostgreSQL** für lokale Entwicklung (optional)

### 🛍️ Shopify-Anforderungen
- **Shopify Partner Account** (kostenlos)
- **Development Store** für Tests
- **Basis-Kenntnisse** in Shopify Admin

---

## 🚀 Schritt-für-Schritt Installation

### 1. 📦 Projekt-Setup

```bash
# 1. ZIP-Datei extrahieren
unzip ticketforge-complete.zip
cd ticketforge-shopify-app

# 2. Dependencies installieren
npm install

# 3. Shopify CLI installieren (global)
npm install -g @shopify/cli @shopify/theme

# 4. Prisma Setup
npx prisma generate
```

### 2. 🔐 Environment Configuration

**Erstellen Sie `.env` Datei:**
```env
# Shopify App Configuration
SHOPIFY_API_KEY=f1563c8fd966ad4ca7732c765e3de444
SHOPIFY_API_SECRET=IHR_CLIENT_SECRET_HIER
SCOPES=write_products,read_products,write_orders,read_orders,read_customers,write_customers,read_inventory,write_inventory
HOST=https://ihre-domain.com

# Database (für lokale Entwicklung)
DATABASE_URL="postgresql://username:password@localhost:5432/ticketforge"

# Session Storage
SHOPIFY_APP_URL=https://ihre-domain.com

# Hardticket Configuration
HARDTICKET_ADDON_PRICE=4.99
HARDTICKET_MAX_COUNTRIES=9
HARDTICKET_DEFAULT_DELIVERY_DAYS=3

# Shipping API Keys (optional)
DHL_API_KEY=ihr_dhl_api_key
DEUTSCHE_POST_API_KEY=ihr_post_api_key
USPS_API_KEY=ihr_usps_api_key
```

### 3. 🛍️ Shopify Partner Account

**3.1 Partner Account erstellen:**
1. Gehen Sie zu: https://partners.shopify.com
2. Registrieren Sie sich als Partner
3. Bestätigen Sie Ihre E-Mail-Adresse

**3.2 App erstellen:**
1. Dashboard → Apps → "Create app"
2. App-Details eingeben:
   ```
   App Name: Event Ticketing Pro
   App Type: Public app
   App URL: https://ihre-domain.com
   ```
3. Client ID und Secret notieren

**3.3 Development Store:**
1. Dashboard → Stores → "Create development store"
2. Store-Name: `ticketforge-test`
3. Store für App-Tests verwenden

### 4. 🗄️ Database Setup

**Lokale PostgreSQL (optional):**
```bash
# PostgreSQL installieren (macOS)
brew install postgresql
brew services start postgresql

# Database erstellen
createdb ticketforge

# Prisma Migrationen
npx prisma migrate dev --name init
```

**Oder Heroku PostgreSQL verwenden:**
```bash
# Heroku PostgreSQL Addon
heroku addons:create heroku-postgresql:mini
heroku config:get DATABASE_URL
```

### 5. 🚀 Development Server

```bash
# Lokale Entwicklung starten
npm run dev

# Oder mit Shopify CLI
shopify app dev
```

**App wird verfügbar unter:**
- **Lokal**: http://localhost:3000
- **Shopify Admin**: Über App-Installation

---

## 🌐 Produktions-Deployment

### 🔥 Heroku (Empfohlen)

```bash
# 1. Heroku App erstellen
heroku create ihr-app-name

# 2. PostgreSQL hinzufügen
heroku addons:create heroku-postgresql:mini

# 3. Environment Variables
heroku config:set SHOPIFY_API_KEY=ihre_client_id
heroku config:set SHOPIFY_API_SECRET=ihr_client_secret
heroku config:set HOST=https://ihr-app-name.herokuapp.com
heroku config:set SHOPIFY_APP_URL=https://ihr-app-name.herokuapp.com

# 4. Deployen
git add .
git commit -m "Deploy TicketForge to Heroku"
git push heroku main

# 5. Database migrieren
heroku run npx prisma migrate deploy
heroku run npx prisma generate

# 6. App öffnen
heroku open
```

### ☁️ Alternative Hosting

**Vercel:**
```bash
npm install -g vercel
vercel --prod
```

**DigitalOcean App Platform:**
1. GitHub Repository verbinden
2. Build Command: `npm run build`
3. Run Command: `npm start`

**AWS/Google Cloud:**
- Docker Container mit Node.js 18
- PostgreSQL Database
- Load Balancer mit SSL

---

## 🧪 Testing & Validation

### ✅ Funktions-Tests

**1. Event-Erstellung:**
```bash
# Test-Event erstellen
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Concert",
    "venue": "Test Venue",
    "date": "2024-12-31",
    "time": "20:00"
  }'
```

**2. Inventory-Alerts:**
- Event mit wenigen Tickets erstellen
- Tickets verkaufen bis LOW STOCK
- Alert-Badges prüfen

**3. Hardticket-Versand:**
- Hardticket-Addon aktivieren
- Test-Bestellung mit Versand
- Tracking-Nummer generieren

### 🔍 Shopify-Integration

**1. App-Installation:**
```
https://ihre-domain.com/auth?shop=ihr-test-store.myshopify.com
```

**2. Webhook-Tests:**
- Test-Bestellung in Shopify
- Inventory-Update prüfen
- E-Mail-Benachrichtigungen

**3. Produkt-Sync:**
- Event erstellen
- Shopify-Produkt prüfen
- Varianten und Preise validieren

---

## 🐛 Troubleshooting

### ❌ Häufige Probleme

**Problem: "Command not found: shopify"**
```bash
# Lösung: Shopify CLI global installieren
npm install -g @shopify/cli
```

**Problem: Database Connection Error**
```bash
# Lösung: DATABASE_URL prüfen
echo $DATABASE_URL
npx prisma migrate reset
```

**Problem: Shopify OAuth Error**
```bash
# Lösung: Redirect URLs prüfen
# In shopify.app.toml und Partner Dashboard
```

**Problem: Webhook nicht empfangen**
```bash
# Lösung: ngrok für lokale Tests
npm install -g ngrok
ngrok http 3000
# Webhook URL: https://abc123.ngrok.io/webhooks
```

### 🔧 Debug-Befehle

```bash
# Logs anzeigen
heroku logs --tail

# Database-Status prüfen
npx prisma studio

# Shopify-Verbindung testen
shopify app info

# Environment Variables prüfen
heroku config
```

---

## 📚 Weitere Ressourcen

### 📖 Dokumentation
- **Shopify App Development**: https://shopify.dev/docs/apps
- **Remix Framework**: https://remix.run/docs
- **Prisma ORM**: https://www.prisma.io/docs
- **Heroku Deployment**: https://devcenter.heroku.com

### 🎥 Video-Tutorials
- **Shopify App Basics**: YouTube Shopify Developers
- **Remix Crash Course**: YouTube Remix Tutorials
- **PostgreSQL Setup**: YouTube Database Tutorials

### 💬 Community
- **Shopify Partners Slack**: partners.shopify.com/slack
- **Remix Discord**: remix.run/discord
- **Stack Overflow**: Tags: shopify-app, remix, prisma

---

## 📞 Support

**Bei Problemen:**
1. **📚 Dokumentation** durchsuchen
2. **🔍 GitHub Issues** prüfen
3. **💬 Community** fragen
4. **📧 Support** kontaktieren: support@ticketforge.com

**Für Custom Development:**
- **E-Mail**: dev@ticketforge.com
- **Telefon**: +49 30 12345678
- **Consulting**: €150/Stunde

---

**🎉 Viel Erfolg mit Ihrer TicketForge Installation!**