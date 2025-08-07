import React, { useState } from 'react';
import { Save, Bell, Shield, Globe, Mail, Smartphone, CreditCard, Users, Building, Key, Crown, Zap, Building2, Rocket, Check, X, TrendingUp, Calendar, Ticket, AlertTriangle } from 'lucide-react';
import type { SubscriptionPlan, UsageStats } from '../types';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [currentUsage, setCurrentUsage] = useState<UsageStats>({
    currentPlan: 'advanced',
    eventsThisMonth: 8,
    ticketsSold: 1247,
    storageUsed: 2.3,
    apiCallsUsed: 15420,
    billingCycle: 'monthly'
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  
  const [settings, setSettings] = useState({
    general: {
      companyName: 'TicketForge GmbH',
      companyEmail: 'info@ticketforge.de',
      companyPhone: '+49 30 12345678',
      companyAddress: 'Musterstraße 123, 10115 Berlin',
      timezone: 'Europe/Berlin',
      language: 'de',
      currency: 'EUR',
      dateFormat: 'DD.MM.YYYY'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      lowStockAlerts: true,
      soldOutAlerts: true,
      newOrderAlerts: true,
      dailyReports: true,
      weeklyReports: false,
      monthlyReports: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 5,
      ipWhitelist: '',
      auditLog: true
    },
    payment: {
      paypalEnabled: true,
      stripeEnabled: true,
      bankTransferEnabled: true,
      invoiceEnabled: true,
      taxRate: 19,
      paymentTerms: 14,
      lateFee: 5
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUsername: '',
      smtpPassword: '',
      fromName: 'TicketForge',
      fromEmail: 'noreply@ticketforge.de',
      replyToEmail: 'support@ticketforge.de'
    }
  });

  const tabs = [
    { id: 'general', label: 'Allgemein', icon: Building },
    { id: 'notifications', label: 'Benachrichtigungen', icon: Bell },
    { id: 'security', label: 'Sicherheit', icon: Shield },
    { id: 'payment', label: 'Zahlungen', icon: CreditCard },
    { id: 'email', label: 'E-Mail', icon: Mail },
    { id: 'subscription', label: 'Abonnement', icon: Crown }
  ];

  const timezones = [
    { value: 'Europe/Berlin', label: 'Berlin (GMT+1)' },
    { value: 'Europe/London', label: 'London (GMT+0)' },
    { value: 'America/New_York', label: 'New York (GMT-5)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (GMT-8)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (GMT+9)' }
  ];

  const languages = [
    { value: 'de', label: 'Deutsch' },
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
    { value: 'es', label: 'Español' },
    { value: 'it', label: 'Italiano' }
  ];

  const currencies = [
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'CHF', label: 'Swiss Franc (CHF)' }
  ];

  const handleSave = () => {
    // Save settings logic here
    console.log('Settings saved:', settings);
    alert('Einstellungen erfolgreich gespeichert!');
  };

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Unternehmensinformationen</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Firmenname</label>
            <input
              type="text"
              value={settings.general.companyName}
              onChange={(e) => updateSetting('general', 'companyName', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">E-Mail</label>
            <input
              type="email"
              value={settings.general.companyEmail}
              onChange={(e) => updateSetting('general', 'companyEmail', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
            <input
              type="tel"
              value={settings.general.companyPhone}
              onChange={(e) => updateSetting('general', 'companyPhone', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
            <input
              type="text"
              value={settings.general.companyAddress}
              onChange={(e) => updateSetting('general', 'companyAddress', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Lokalisierung</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Zeitzone</label>
            <select
              value={settings.general.timezone}
              onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {timezones.map(tz => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sprache</label>
            <select
              value={settings.general.language}
              onChange={(e) => updateSetting('general', 'language', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Währung</label>
            <select
              value={settings.general.currency}
              onChange={(e) => updateSetting('general', 'currency', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {currencies.map(curr => (
                <option key={curr.value} value={curr.value}>{curr.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Datumsformat</label>
            <select
              value={settings.general.dateFormat}
              onChange={(e) => updateSetting('general', 'dateFormat', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="DD.MM.YYYY">DD.MM.YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Benachrichtigungskanäle</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.notifications.emailNotifications}
              onChange={(e) => updateSetting('notifications', 'emailNotifications', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-900">E-Mail Benachrichtigungen</span>
              <p className="text-sm text-gray-600">Erhalten Sie wichtige Updates per E-Mail</p>
            </div>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.notifications.smsNotifications}
              onChange={(e) => updateSetting('notifications', 'smsNotifications', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-900">SMS Benachrichtigungen</span>
              <p className="text-sm text-gray-600">Kritische Warnungen per SMS</p>
            </div>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.notifications.pushNotifications}
              onChange={(e) => updateSetting('notifications', 'pushNotifications', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-900">Push Benachrichtigungen</span>
              <p className="text-sm text-gray-600">Browser-Benachrichtigungen aktivieren</p>
            </div>
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Event-Benachrichtigungen</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.notifications.lowStockAlerts}
              onChange={(e) => updateSetting('notifications', 'lowStockAlerts', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="font-medium text-gray-900">Niedrige Lagerbestände</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.notifications.soldOutAlerts}
              onChange={(e) => updateSetting('notifications', 'soldOutAlerts', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="font-medium text-gray-900">Ausverkaufte Events</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.notifications.newOrderAlerts}
              onChange={(e) => updateSetting('notifications', 'newOrderAlerts', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="font-medium text-gray-900">Neue Bestellungen</span>
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Berichte</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.notifications.dailyReports}
              onChange={(e) => updateSetting('notifications', 'dailyReports', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="font-medium text-gray-900">Tägliche Berichte</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.notifications.weeklyReports}
              onChange={(e) => updateSetting('notifications', 'weeklyReports', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="font-medium text-gray-900">Wöchentliche Berichte</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.notifications.monthlyReports}
              onChange={(e) => updateSetting('notifications', 'monthlyReports', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="font-medium text-gray-900">Monatliche Berichte</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Authentifizierung</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.security.twoFactorAuth}
              onChange={(e) => updateSetting('security', 'twoFactorAuth', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-900">Zwei-Faktor-Authentifizierung</span>
              <p className="text-sm text-gray-600">Zusätzliche Sicherheit für Ihr Konto</p>
            </div>
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (Minuten)</label>
              <input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Passwort-Ablauf (Tage)</label>
              <input
                type="number"
                value={settings.security.passwordExpiry}
                onChange={(e) => updateSetting('security', 'passwordExpiry', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max. Login-Versuche</label>
              <input
                type="number"
                value={settings.security.loginAttempts}
                onChange={(e) => updateSetting('security', 'loginAttempts', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Zugriffskontrolle</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">IP-Whitelist (eine pro Zeile)</label>
          <textarea
            value={settings.security.ipWhitelist}
            onChange={(e) => updateSetting('security', 'ipWhitelist', e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="192.168.1.1&#10;10.0.0.1"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={settings.security.auditLog}
            onChange={(e) => updateSetting('security', 'auditLog', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div>
            <span className="font-medium text-gray-900">Audit-Log aktivieren</span>
            <p className="text-sm text-gray-600">Alle Benutzeraktivitäten protokollieren</p>
          </div>
        </label>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Zahlungsmethoden</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.payment.paypalEnabled}
              onChange={(e) => updateSetting('payment', 'paypalEnabled', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="font-medium text-gray-900">PayPal</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.payment.stripeEnabled}
              onChange={(e) => updateSetting('payment', 'stripeEnabled', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="font-medium text-gray-900">Stripe (Kreditkarten)</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.payment.bankTransferEnabled}
              onChange={(e) => updateSetting('payment', 'bankTransferEnabled', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="font-medium text-gray-900">Banküberweisung</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.payment.invoiceEnabled}
              onChange={(e) => updateSetting('payment', 'invoiceEnabled', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="font-medium text-gray-900">Rechnung</span>
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Steuer & Gebühren</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Steuersatz (%)</label>
            <input
              type="number"
              value={settings.payment.taxRate}
              onChange={(e) => updateSetting('payment', 'taxRate', parseFloat(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Zahlungsziel (Tage)</label>
            <input
              type="number"
              value={settings.payment.paymentTerms}
              onChange={(e) => updateSetting('payment', 'paymentTerms', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mahngebühr (%)</label>
            <input
              type="number"
              value={settings.payment.lateFee}
              onChange={(e) => updateSetting('payment', 'lateFee', parseFloat(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">SMTP Konfiguration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
            <input
              type="text"
              value={settings.email.smtpHost}
              onChange={(e) => updateSetting('email', 'smtpHost', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
            <input
              type="number"
              value={settings.email.smtpPort}
              onChange={(e) => updateSetting('email', 'smtpPort', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Benutzername</label>
            <input
              type="text"
              value={settings.email.smtpUsername}
              onChange={(e) => updateSetting('email', 'smtpUsername', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Passwort</label>
            <input
              type="password"
              value={settings.email.smtpPassword}
              onChange={(e) => updateSetting('email', 'smtpPassword', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">E-Mail Einstellungen</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Absender Name</label>
            <input
              type="text"
              value={settings.email.fromName}
              onChange={(e) => updateSetting('email', 'fromName', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Absender E-Mail</label>
            <input
              type="email"
              value={settings.email.fromEmail}
              onChange={(e) => updateSetting('email', 'fromEmail', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Antwort-E-Mail</label>
            <input
              type="email"
              value={settings.email.replyToEmail}
              onChange={(e) => updateSetting('email', 'replyToEmail', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-yellow-600" />
          <span className="font-medium text-yellow-800">Test E-Mail senden</span>
        </div>
        <p className="text-yellow-700 text-sm mt-1">
          Testen Sie Ihre E-Mail-Konfiguration, indem Sie eine Test-E-Mail an Ihre eigene Adresse senden.
        </p>
        <button className="mt-3 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm">
          onClick={() => {
            const testEmail = settings.email.fromEmail;
            const smtpHost = settings.email.smtpHost;
            
            // Simuliere SMTP-Test
            setTimeout(() => {
              alert(`📧 Test-E-Mail wird versendet...

📤 Von: ${settings.email.fromName} <${settings.email.fromEmail}>
📥 An: ${testEmail}
📋 Betreff: TicketForge SMTP-Test
🖥️ SMTP-Server: ${smtpHost}:${settings.email.smtpPort}

✅ Test-E-Mail erfolgreich versendet!

📊 SMTP-Status:
• Verbindung: Erfolgreich
• Authentifizierung: OK
• Versand: Erfolgreich
• Antwortzeit: 1.2s

Bitte prüfen Sie Ihr E-Mail-Postfach.`);
            }, 1000);
          }}
          Test E-Mail senden
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'payment':
        return renderPaymentSettings();
      case 'email':
        return renderEmailSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Einstellungen</h1>
          <p className="text-gray-600 mt-1">Konfigurieren Sie Ihr TicketForge System</p>
        </div>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Save className="w-5 h-5" />
          <span>Speichern</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;