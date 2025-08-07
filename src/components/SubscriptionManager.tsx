import React, { useState, useEffect } from 'react';
import { Crown, Zap, Building2, Rocket, Check, X, CreditCard, AlertTriangle, TrendingUp, Users, Calendar, Ticket } from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  ticketFee: number;
  features: string[];
  limits: {
    events: number; // -1 = unlimited
    venues: number;
    participants: number;
    storage: string;
    apiCalls: number;
    customBranding: boolean;
    prioritySupport: boolean;
    analytics: boolean;
    bulkImport: boolean;
    aiAssistant: boolean;
    whiteLabel: boolean;
  };
  popular?: boolean;
  color: string;
}

interface UsageStats {
  currentPlan: string;
  eventsThisMonth: number;
  ticketsSold: number;
  storageUsed: number;
  apiCallsUsed: number;
  billingCycle: 'monthly' | 'yearly';
}

const SubscriptionManager: React.FC = () => {
  const [currentUsage, setCurrentUsage] = useState<UsageStats>({
    currentPlan: 'basic',
    eventsThisMonth: 8,
    ticketsSold: 1247,
    storageUsed: 2.3,
    apiCallsUsed: 15420,
    billingCycle: 'monthly'
  });

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      monthlyPrice: 29,
      ticketFee: 1.00,
      color: 'blue',
      features: [
        'Bis zu 10 Events pro Monat',
        'Bis zu 5 Venues',
        'Bis zu 1.000 Teilnehmer',
        '5GB Speicher',
        'Basis Ticket-Design',
        'E-Mail Support',
        'Grundlegende Berichte',
        'CSV Import/Export'
      ],
      limits: {
        events: 10,
        venues: 5,
        participants: 1000,
        storage: '5GB',
        apiCalls: 10000,
        customBranding: false,
        prioritySupport: false,
        analytics: false,
        bulkImport: false,
        aiAssistant: false,
        whiteLabel: false
      }
    },
    {
      id: 'advanced',
      name: 'Advanced',
      monthlyPrice: 99,
      ticketFee: 0.50,
      color: 'emerald',
      popular: true,
      features: [
        'Bis zu 50 Events pro Monat',
        'Bis zu 25 Venues',
        'Bis zu 10.000 Teilnehmer',
        '50GB Speicher',
        'Erweiterte Ticket-Designs',
        'Ticket-Bundles',
        'Saalplan-Management',
        'Priority E-Mail Support',
        'Erweiterte Analytics',
        'Bulk Import/Export',
        'API Zugang (50k Calls)',
        'Custom Branding'
      ],
      limits: {
        events: 50,
        venues: 25,
        participants: 10000,
        storage: '50GB',
        apiCalls: 50000,
        customBranding: true,
        prioritySupport: true,
        analytics: true,
        bulkImport: true,
        aiAssistant: false,
        whiteLabel: false
      }
    },
    {
      id: 'premium',
      name: 'Premium',
      monthlyPrice: 299,
      ticketFee: 0.20,
      color: 'purple',
      features: [
        'Bis zu 200 Events pro Monat',
        'Bis zu 100 Venues',
        'Bis zu 100.000 Teilnehmer',
        '500GB Speicher',
        'AI Event Assistant',
        'Erweiterte Saalplan-Features',
        'White-Label Option',
        'Telefon & Chat Support',
        'Erweiterte Analytics & Berichte',
        'Multi-User Management',
        'API Zugang (200k Calls)',
        'Custom Integrationen',
        'Hardticket-Versand'
      ],
      limits: {
        events: 200,
        venues: 100,
        participants: 100000,
        storage: '500GB',
        apiCalls: 200000,
        customBranding: true,
        prioritySupport: true,
        analytics: true,
        bulkImport: true,
        aiAssistant: true,
        whiteLabel: true
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthlyPrice: 599,
      ticketFee: 0.10,
      color: 'orange',
      features: [
        'Unbegrenzte Events',
        'Unbegrenzte Venues',
        'Unbegrenzte Teilnehmer',
        'Unbegrenzter Speicher',
        'Vollständige AI-Suite',
        'Dedicated Account Manager',
        '24/7 Priority Support',
        'Custom Entwicklung',
        'On-Premise Deployment',
        'SLA Garantien',
        'Unbegrenzte API Calls',
        'Enterprise SSO',
        'Compliance Features (DSGVO, SOX)',
        'Multi-Tenant Management'
      ],
      limits: {
        events: -1,
        venues: -1,
        participants: -1,
        storage: 'Unlimited',
        apiCalls: -1,
        customBranding: true,
        prioritySupport: true,
        analytics: true,
        bulkImport: true,
        aiAssistant: true,
        whiteLabel: true
      }
    }
  ];

  const getCurrentPlan = () => {
    return subscriptionPlans.find(plan => plan.id === currentUsage.currentPlan) || subscriptionPlans[0];
  };

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600 bg-red-100';
    if (percentage >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-emerald-600 bg-emerald-100';
  };

  const calculateMonthlyTotal = (plan: SubscriptionPlan) => {
    const baseCost = plan.monthlyPrice;
    const ticketCosts = currentUsage.ticketsSold * plan.ticketFee;
    return baseCost + ticketCosts;
  };

  const isFeatureAvailable = (featureKey: keyof SubscriptionPlan['limits']) => {
    const currentPlan = getCurrentPlan();
    return currentPlan.limits[featureKey];
  };

  const isLimitReached = (usedValue: number, limitKey: keyof SubscriptionPlan['limits']) => {
    const currentPlan = getCurrentPlan();
    const limit = currentPlan.limits[limitKey] as number;
    return limit !== -1 && usedValue >= limit;
  };

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId);
    setShowUpgradeModal(true);
  };

  const confirmUpgrade = () => {
    // Hier würde die Stripe/PayPal Integration erfolgen
    console.log('Upgrading to plan:', selectedPlan);
    setCurrentUsage(prev => ({ ...prev, currentPlan: selectedPlan }));
    setShowUpgradeModal(false);
    alert(`✅ Erfolgreich zu ${subscriptionPlans.find(p => p.id === selectedPlan)?.name} Plan gewechselt!`);
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'basic': return <Zap className="w-8 h-8 text-blue-600" />;
      case 'advanced': return <TrendingUp className="w-8 h-8 text-emerald-600" />;
      case 'premium': return <Crown className="w-8 h-8 text-purple-600" />;
      case 'enterprise': return <Rocket className="w-8 h-8 text-orange-600" />;
      default: return <Zap className="w-8 h-8 text-blue-600" />;
    }
  };

  const getPlanColorClasses = (color: string) => {
    const colors = {
      blue: 'border-blue-200 hover:border-blue-300 bg-blue-50',
      emerald: 'border-emerald-200 hover:border-emerald-300 bg-emerald-50 ring-2 ring-emerald-500',
      purple: 'border-purple-200 hover:border-purple-300 bg-purple-50',
      orange: 'border-orange-200 hover:border-orange-300 bg-orange-50'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getButtonColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-600 hover:bg-blue-700',
      emerald: 'bg-emerald-600 hover:bg-emerald-700',
      purple: 'bg-purple-600 hover:bg-purple-700',
      orange: 'bg-orange-600 hover:bg-orange-700'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">💳 Subscription Management</h1>
          <p className="text-gray-600 mt-1">Verwalten Sie Ihr Abonnement und schalten Sie erweiterte Features frei</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-white rounded-lg border border-gray-200 px-4 py-2">
            <div className="text-sm text-gray-600">Aktueller Plan:</div>
            <div className="font-bold text-gray-900">{getCurrentPlan().name}</div>
          </div>
        </div>
      </div>

      {/* Current Usage Overview */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">📊 Aktuelle Nutzung & Limits</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Events */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Events</span>
              </div>
              {isLimitReached(currentUsage.eventsThisMonth, 'events') && (
                <AlertTriangle className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {currentUsage.eventsThisMonth}
              {getCurrentPlan().limits.events !== -1 && `/${getCurrentPlan().limits.events}`}
            </div>
            <div className="text-sm text-gray-600">Diesen Monat</div>
            {getCurrentPlan().limits.events !== -1 && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      getUsagePercentage(currentUsage.eventsThisMonth, getCurrentPlan().limits.events) >= 90 ? 'bg-red-500' :
                      getUsagePercentage(currentUsage.eventsThisMonth, getCurrentPlan().limits.events) >= 75 ? 'bg-yellow-500' :
                      'bg-emerald-500'
                    }`}
                    style={{ width: `${getUsagePercentage(currentUsage.eventsThisMonth, getCurrentPlan().limits.events)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Tickets */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Ticket className="w-5 h-5 text-emerald-600" />
              <span className="font-medium text-gray-900">Tickets</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{currentUsage.ticketsSold.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Verkauft diesen Monat</div>
            <div className="text-xs text-blue-600 mt-1">
              Gebühren: €{(currentUsage.ticketsSold * getCurrentPlan().ticketFee).toFixed(2)}
            </div>
          </div>

          {/* Storage */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Building2 className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-900">Speicher</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {currentUsage.storageUsed}GB
              {getCurrentPlan().limits.storage !== 'Unlimited' && `/${getCurrentPlan().limits.storage}`}
            </div>
            <div className="text-sm text-gray-600">Verwendet</div>
          </div>

          {/* API Calls */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-gray-900">API Calls</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {currentUsage.apiCallsUsed.toLocaleString()}
              {getCurrentPlan().limits.apiCalls !== -1 && `/${getCurrentPlan().limits.apiCalls.toLocaleString()}`}
            </div>
            <div className="text-sm text-gray-600">Diesen Monat</div>
          </div>
        </div>

        {/* Usage Warnings */}
        {(getUsagePercentage(currentUsage.eventsThisMonth, getCurrentPlan().limits.events) >= 80 ||
          getUsagePercentage(currentUsage.apiCallsUsed, getCurrentPlan().limits.apiCalls) >= 80) && (
          <div className="mt-6 bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold text-yellow-800">⚠️ Limit-Warnung</span>
            </div>
            <div className="text-yellow-700 text-sm space-y-1">
              {getUsagePercentage(currentUsage.eventsThisMonth, getCurrentPlan().limits.events) >= 80 && (
                <div>• Sie haben {getUsagePercentage(currentUsage.eventsThisMonth, getCurrentPlan().limits.events).toFixed(0)}% Ihres Event-Limits erreicht</div>
              )}
              {getUsagePercentage(currentUsage.apiCallsUsed, getCurrentPlan().limits.apiCalls) >= 80 && (
                <div>• Sie haben {getUsagePercentage(currentUsage.apiCallsUsed, getCurrentPlan().limits.apiCalls).toFixed(0)}% Ihrer API-Calls verwendet</div>
              )}
            </div>
            <button
              onClick={() => handleUpgrade('advanced')}
              className="mt-3 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
            >
              🚀 Jetzt upgraden
            </button>
          </div>
        )}
      </div>

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {subscriptionPlans.map((plan) => {
          const isCurrentPlan = currentUsage.currentPlan === plan.id;
          const monthlyTotal = calculateMonthlyTotal(plan);
          
          return (
            <div
              key={plan.id}
              className={`bg-white rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg ${
                getPlanColorClasses(plan.color)
              } ${isCurrentPlan ? 'ring-2 ring-blue-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    🔥 Beliebtester Plan
                  </span>
                </div>
              )}

              {isCurrentPlan && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    ✅ Aktueller Plan
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  {getPlanIcon(plan.id)}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-gray-900">
                  ${plan.monthlyPrice}
                  <span className="text-lg font-normal text-gray-600">/Monat</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  + ${plan.ticketFee} pro verkauftem Ticket
                </div>
                <div className="text-lg font-semibold text-blue-600 mt-2">
                  ≈ ${monthlyTotal.toFixed(2)}/Monat
                </div>
                <div className="text-xs text-gray-500">
                  (basierend auf aktueller Nutzung)
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Plan Limits */}
              <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
                <h5 className="font-semibold text-gray-900 mb-3">📊 Plan-Limits</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Events:</span>
                    <span className="font-medium">{plan.limits.events === -1 ? 'Unbegrenzt' : plan.limits.events}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Venues:</span>
                    <span className="font-medium">{plan.limits.venues === -1 ? 'Unbegrenzt' : plan.limits.venues}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Teilnehmer:</span>
                    <span className="font-medium">{plan.limits.participants === -1 ? 'Unbegrenzt' : plan.limits.participants.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Speicher:</span>
                    <span className="font-medium">{plan.limits.storage}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => isCurrentPlan ? null : handleUpgrade(plan.id)}
                disabled={isCurrentPlan}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors text-white ${
                  isCurrentPlan 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : `${getButtonColorClasses(plan.color)}`
                }`}
              >
                {isCurrentPlan ? '✅ Aktueller Plan' : `🚀 Zu ${plan.name} wechseln`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">🔍 Feature-Vergleich</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Feature</th>
                {subscriptionPlans.map(plan => (
                  <th key={plan.id} className="text-center py-3 px-4 font-medium text-gray-900">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 px-4 font-medium text-gray-900">🎫 Ticket-Design</td>
                {subscriptionPlans.map(plan => (
                  <td key={plan.id} className="text-center py-3 px-4">
                    {plan.id === 'basic' ? (
                      <span className="text-blue-600">Basis</span>
                    ) : plan.id === 'advanced' ? (
                      <span className="text-emerald-600">Erweitert</span>
                    ) : (
                      <span className="text-purple-600">Premium + AI</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-900">🗺️ Saalplan-Management</td>
                {subscriptionPlans.map(plan => (
                  <td key={plan.id} className="text-center py-3 px-4">
                    {plan.id === 'basic' ? (
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    ) : (
                      <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-900">🤖 AI Event Assistant</td>
                {subscriptionPlans.map(plan => (
                  <td key={plan.id} className="text-center py-3 px-4">
                    {['premium', 'enterprise'].includes(plan.id) ? (
                      <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-900">🏷️ White-Label</td>
                {subscriptionPlans.map(plan => (
                  <td key={plan.id} className="text-center py-3 px-4">
                    {['premium', 'enterprise'].includes(plan.id) ? (
                      <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-900">📞 Support</td>
                {subscriptionPlans.map(plan => (
                  <td key={plan.id} className="text-center py-3 px-4 text-sm">
                    {plan.id === 'basic' ? 'E-Mail' :
                     plan.id === 'advanced' ? 'Priority E-Mail' :
                     plan.id === 'premium' ? 'Telefon & Chat' :
                     '24/7 Dedicated'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Billing Information */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">💰 Aktuelle Abrechnung</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-lg font-bold text-blue-600">${getCurrentPlan().monthlyPrice}</div>
            <div className="text-sm text-blue-800">Basis-Gebühr/Monat</div>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="text-lg font-bold text-emerald-600">
              ${(currentUsage.ticketsSold * getCurrentPlan().ticketFee).toFixed(2)}
            </div>
            <div className="text-sm text-emerald-800">
              Ticket-Gebühren ({currentUsage.ticketsSold} × ${getCurrentPlan().ticketFee})
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-lg font-bold text-purple-600">
              ${calculateMonthlyTotal(getCurrentPlan()).toFixed(2)}
            </div>
            <div className="text-sm text-purple-800">Gesamt diesen Monat</div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h5 className="font-semibold text-gray-900 mb-2">💳 Nächste Abrechnung</h5>
          <div className="text-sm text-gray-600">
            <div>Datum: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('de-DE')}</div>
            <div>Geschätzter Betrag: ${calculateMonthlyTotal(getCurrentPlan()).toFixed(2)}</div>
            <div>Zahlungsmethode: •••• 4242 (Visa)</div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                🚀 Upgrade zu {subscriptionPlans.find(p => p.id === selectedPlan)?.name}
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">💰 Neue Kosten:</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <div>Basis: ${subscriptionPlans.find(p => p.id === selectedPlan)?.monthlyPrice}/Monat</div>
                  <div>Ticket-Gebühr: ${subscriptionPlans.find(p => p.id === selectedPlan)?.ticketFee} pro Ticket</div>
                  <div className="font-bold">
                    Geschätzt: ${calculateMonthlyTotal(subscriptionPlans.find(p => p.id === selectedPlan)!).toFixed(2)}/Monat
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-lg p-4">
                <h4 className="font-semibold text-emerald-900 mb-2">✨ Neue Features:</h4>
                <div className="text-sm text-emerald-800 space-y-1">
                  {subscriptionPlans.find(p => p.id === selectedPlan)?.features.slice(0, 4).map((feature, index) => (
                    <div key={index}>• {feature}</div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={confirmUpgrade}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>💳 Upgrade bestätigen</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManager;