import React, { useState } from 'react';
import { Check, Crown, Zap, Building2, CreditCard } from 'lucide-react';
import type { PricingPlan } from '../types';

const PricingPlans: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans: PricingPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: billingCycle === 'monthly' ? 29 : 290,
      interval: billingCycle,
      features: [
        'Bis zu 5 Events pro Monat',
        '1.000 Tickets pro Monat',
        '2 Veranstaltungsorte',
        'Basis Ticket-Design',
        'E-Mail Support',
        'Grundlegende Berichte',
        'QR-Code Generation'
      ],
      limits: {
        events: 5,
        tickets: 1000,
        venues: 2,
        participants: 500
      }
    },
    {
      id: 'professional',
      name: 'Professional',
      price: billingCycle === 'monthly' ? 79 : 790,
      interval: billingCycle,
      popular: true,
      features: [
        'Bis zu 25 Events pro Monat',
        '10.000 Tickets pro Monat',
        '10 Veranstaltungsorte',
        'Erweiterte Ticket-Designs',
        'Ticket-Bundles',
        'Teilnehmer-Datenbank',
        'Erweiterte Analytics',
        'Priority Support',
        'Bulk-Import',
        'Inventory-Management'
      ],
      limits: {
        events: 25,
        tickets: 10000,
        venues: 10,
        participants: 5000
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: billingCycle === 'monthly' ? 199 : 1990,
      interval: billingCycle,
      features: [
        'Unbegrenzte Events',
        'Unbegrenzte Tickets',
        'Unbegrenzte Veranstaltungsorte',
        'AI Event Assistant',
        'Custom Ticket-Designs',
        'White-Label Lösung',
        'API Zugang',
        'Custom Integrationen',
        'Dedicated Account Manager',
        'Tägliche Berichte',
        'Custom Schulungen',
        'Multi-User Management'
      ],
      limits: {
        events: -1,
        tickets: -1,
        venues: -1,
        participants: -1
      }
    }
  ];

  const paymentOptions = [
    {
      name: 'Kreditkarten',
      description: 'Visa, Mastercard, American Express',
      fee: 'Keine zusätzlichen Gebühren',
      icon: CreditCard
    },
    {
      name: 'PayPal',
      description: 'Sicherer PayPal Checkout',
      fee: 'Keine zusätzlichen Gebühren',
      icon: CreditCard
    },
    {
      name: 'Banküberweisung',
      description: 'Direkte Banküberweisung (nur Enterprise)',
      fee: 'Keine Gebühren, 30 Tage Zahlungsziel',
      icon: Building2
    },
    {
      name: 'SEPA Lastschrift',
      description: 'Automatischer Einzug (Deutschland/EU)',
      fee: 'Keine Gebühren',
      icon: Zap
    }
  ];

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'starter':
        return <Zap className="w-8 h-8 text-blue-600" />;
      case 'professional':
        return <Crown className="w-8 h-8 text-emerald-600" />;
      case 'enterprise':
        return <Building2 className="w-8 h-8 text-purple-600" />;
      default:
        return <Zap className="w-8 h-8 text-blue-600" />;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'starter':
        return 'border-blue-200 hover:border-blue-300';
      case 'professional':
        return 'border-emerald-200 hover:border-emerald-300 ring-2 ring-emerald-500';
      case 'enterprise':
        return 'border-purple-200 hover:border-purple-300';
      default:
        return 'border-gray-200 hover:border-gray-300';
    }
  };

  const getButtonColor = (planId: string) => {
    switch (planId) {
      case 'starter':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'professional':
        return 'bg-emerald-600 hover:bg-emerald-700 text-white';
      case 'enterprise':
        return 'bg-purple-600 hover:bg-purple-700 text-white';
      default:
        return 'bg-gray-600 hover:bg-gray-700 text-white';
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Wählen Sie Ihren Plan</h1>
        <p className="text-xl text-gray-600 mb-8">Skalieren Sie Ihr Event-Ticketing mit unserer professionellen Plattform</p>
        
        {/* Billing Toggle */}
        <div className="inline-flex rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'monthly' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monatlich
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'yearly' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Jährlich
            <span className="ml-2 inline-flex px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
              17% sparen
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-2xl border-2 ${getPlanColor(plan.id)} p-8 relative transition-all duration-300 hover:shadow-lg`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  Beliebtester Plan
                </span>
              </div>
            )}
            
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                {getPlanIcon(plan.id)}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold text-gray-900">
                €{plan.price}
                <span className="text-lg font-normal text-gray-600">
                  /{billingCycle === 'monthly' ? 'Monat' : 'Jahr'}
                </span>
              </div>
              {billingCycle === 'yearly' && (
                <p className="text-emerald-600 text-sm mt-1">
                  €{Math.round(plan.price / 12)}/Monat jährlich abgerechnet
                </p>
              )}
            </div>

            <div className="space-y-4 mb-8">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <button className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${getButtonColor(plan.id)}`}>
              onClick={() => {
                const yearlyPrice = plan.price * 10;
                const monthlySavings = plan.price - (yearlyPrice / 12);
                
                alert(`🚀 Plan "${plan.name}" auswählen:

💰 Kosten:
• Monatlich: €${plan.price}
• Jährlich: €${yearlyPrice} (17% Rabatt = €${(monthlySavings * 12).toFixed(0)} Ersparnis)

📋 Features:
${plan.features.slice(0, 5).map(feature => `• ${feature}`).join('\n')}

📊 Limits:
• Events: ${plan.limits.events === -1 ? 'Unbegrenzt' : plan.limits.events}
• Tickets: ${plan.limits.tickets === -1 ? 'Unbegrenzt' : plan.limits.tickets.toLocaleString()}
• Venues: ${plan.limits.venues === -1 ? 'Unbegrenzt' : plan.limits.venues}
• Teilnehmer: ${plan.limits.participants === -1 ? 'Unbegrenzt' : plan.limits.participants.toLocaleString()}

🔄 Nächste Schritte:
1. Zahlungsmethode auswählen
2. Upgrade bestätigen
3. Sofortiger Zugang zu neuen Features

💳 Verfügbare Zahlungsmethoden:
• Kreditkarte (Visa, Mastercard, Amex)
• PayPal
• SEPA-Lastschrift
• Banküberweisung (Enterprise)

Möchten Sie fortfahren?`);
              }}
              Plan wählen
            </button>
          </div>
        ))}
      </div>

      {/* Payment Options */}
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Zahlungsoptionen</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {paymentOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <div key={index} className="text-center p-6 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex justify-center mb-4">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{option.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                <p className="text-xs text-emerald-600 font-medium">{option.fee}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enterprise Features */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-4">Enterprise Lösungen</h3>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Benötigen Sie eine maßgeschneiderte Lösung für Ihre Agentur oder große Organisation? 
            Unser Enterprise Plan bietet dedizierten Support, Custom Integrationen und Volumen-Preise.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-purple-100">Dedicated Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">Custom</div>
              <div className="text-purple-100">API Integrationen</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">Volumen</div>
              <div className="text-purple-100">Preis-Rabatte</div>
            </div>
          </div>
          <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors">
            Vertrieb kontaktieren
          </button>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Häufig gestellte Fragen</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Kann ich jederzeit den Plan wechseln?</h4>
            <p className="text-gray-600 text-sm">Ja, Sie können jederzeit upgraden oder downgraden. Änderungen werden sofort wirksam.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Bieten Sie Rückerstattungen an?</h4>
            <p className="text-gray-600 text-sm">Wir bieten eine 30-Tage Geld-zurück-Garantie auf alle Pläne. Keine Fragen gestellt.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Gibt es Setup-Gebühren?</h4>
            <p className="text-gray-600 text-sm">Keine Setup-Gebühren für alle Pläne. Enterprise-Kunden erhalten kostenloses Onboarding.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Welche Zahlungsmethoden akzeptieren Sie?</h4>
            <p className="text-gray-600 text-sm">Wir akzeptieren alle gängigen Kreditkarten, PayPal, Banküberweisung und SEPA-Lastschrift.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;