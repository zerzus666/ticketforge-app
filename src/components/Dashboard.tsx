import React from 'react';
import { TrendingUp, Calendar, Users, DollarSign, ArrowUp, ArrowDown, Ticket, MapPin } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Aktive Events',
      value: '12',
      change: '+3',
      changeType: 'positive' as const,
      icon: Calendar,
      color: 'blue'
    },
    {
      title: 'Verkaufte Tickets',
      value: '2,847',
      change: '+245',
      changeType: 'positive' as const,
      icon: Ticket,
      color: 'emerald'
    },
    {
      title: 'Gesamtumsatz',
      value: '€156,890',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'purple'
    },
    {
      title: 'Durchschn. Ticketpreis',
      value: '€55.12',
      change: '-2.1%',
      changeType: 'negative' as const,
      icon: TrendingUp,
      color: 'orange'
    }
  ];

  const recentEvents = [
    { 
      name: 'Summer Music Festival 2024', 
      venue: 'Central Park',
      ticketsSold: 1250,
      totalCapacity: 1500,
      revenue: 89750,
      status: 'Aktiv',
      date: '2024-07-15'
    },
    { 
      name: 'Jazz Night at Blue Note', 
      venue: 'Blue Note NYC',
      ticketsSold: 180,
      totalCapacity: 200,
      revenue: 8100,
      status: 'Aktiv',
      date: '2024-02-20'
    },
    { 
      name: 'Corporate Conference 2024', 
      venue: 'Convention Center',
      ticketsSold: 450,
      totalCapacity: 500,
      revenue: 67500,
      status: 'Aktiv',
      date: '2024-03-10'
    },
    { 
      name: 'Rock Concert Spectacular', 
      venue: 'Madison Square Garden',
      ticketsSold: 15000,
      totalCapacity: 15000,
      revenue: 1125000,
      status: 'Ausverkauft',
      date: '2024-04-22'
    },
    { 
      name: 'Comedy Night Special', 
      venue: 'Comedy Club Downtown',
      ticketsSold: 95,
      totalCapacity: 120,
      revenue: 2850,
      status: 'Aktiv',
      date: '2024-05-18'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500 text-blue-600 bg-blue-50',
      emerald: 'bg-emerald-500 text-emerald-600 bg-emerald-50',
      orange: 'bg-orange-500 text-orange-600 bg-orange-50',
      purple: 'bg-purple-500 text-purple-600 bg-purple-50'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getTicketAvailability = (sold: number, capacity: number) => {
    const percentage = (sold / capacity) * 100;
    if (percentage >= 100) return { status: 'Ausverkauft', color: 'bg-red-500' };
    if (percentage >= 90) return { status: 'Fast ausverkauft', color: 'bg-orange-500' };
    if (percentage >= 75) return { status: 'Wenige Tickets', color: 'bg-yellow-500' };
    return { status: 'Verfügbar', color: 'bg-emerald-500' };
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Dashboard</h1>
          <p className="text-gray-600 mt-1">Übersicht über Ihre Events und Ticket-Verkäufe</p>
        </div>
        <div className="flex space-x-3">
          <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Letzte 30 Tage</option>
            <option>Letzte 90 Tage</option>
            <option>Letztes Jahr</option>
          </select>
          <button 
            onClick={() => {
              const reportData = {
                period: 'Letzte 30 Tage',
                totalEvents: 12,
                soldTickets: 2847,
                revenue: 156890,
                avgTicketPrice: 55.12,
                generatedAt: new Date().toISOString()
              };
              
              const csvContent = `Zeitraum,Events,Verkaufte Tickets,Umsatz,Durchschnittspreis
${reportData.period},${reportData.totalEvents},${reportData.soldTickets},€${reportData.revenue},€${reportData.avgTicketPrice}`;
              
              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `dashboard_report_${new Date().toISOString().split('T')[0]}.csv`;
              a.click();
              URL.revokeObjectURL(url);
              
              alert(`📊 Dashboard-Bericht erfolgreich exportiert!

📄 Datei: dashboard_report_${new Date().toISOString().split('T')[0]}.csv
📊 Inhalt:
• Zeitraum: ${reportData.period}
• Events: ${reportData.totalEvents}
• Verkaufte Tickets: ${reportData.soldTickets.toLocaleString()}
• Umsatz: €${reportData.revenue.toLocaleString()}
• Ø Ticketpreis: €${reportData.avgTicketPrice}

💾 Datei wurde in Downloads gespeichert.`);
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Bericht exportieren
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = getColorClasses(stat.color).split(' ');
          
          return (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${colorClasses[2]} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${colorClasses[1]}`} />
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {stat.changeType === 'positive' ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Umsatz Trend Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Umsatz-Entwicklung</h3>
            <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
              <option>7 Tage</option>
              <option>30 Tage</option>
              <option>90 Tage</option>
            </select>
          </div>
          <div className="h-64 bg-gradient-to-t from-purple-50 to-transparent rounded-lg flex items-end justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">€156,890</div>
              <div className="text-gray-600">Gesamtumsatz diesen Monat</div>
              <div className="text-emerald-600 text-sm mt-1">↗ +18% gegenüber Vormonat</div>
            </div>
          </div>
        </div>

        {/* Top Events */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Top Events</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Alle anzeigen</button>
          </div>
          <div className="space-y-4">
            {recentEvents.slice(0, 5).map((event, index) => {
              const availability = getTicketAvailability(event.ticketsSold, event.totalCapacity);
              const percentage = (event.ticketsSold / event.totalCapacity) * 100;
              
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">
                      {Math.round(percentage)}%
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{event.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span>{event.venue}</span>
                        <span>•</span>
                        <span>{new Date(event.date).toLocaleDateString('de-DE')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      €{event.revenue.toLocaleString('de-DE')}
                    </div>
                    <div className="text-xs text-gray-600">
                      {event.ticketsSold}/{event.totalCapacity} Tickets
                    </div>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium text-white ${availability.color} mt-1`}>
                      {availability.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event Performance */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Event Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">87%</div>
            <div className="text-gray-600">Durchschnittliche Auslastung</div>
          </div>
          <div className="text-center p-4 bg-emerald-50 rounded-lg">
            <div className="text-2xl font-bold text-emerald-600">€55.12</div>
            <div className="text-gray-600">Durchschnittlicher Ticketpreis</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">4.8</div>
            <div className="text-gray-600">Durchschnittliche Bewertung</div>
          </div>
        </div>
      </div>

      {/* Ticket Availability Alerts */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Ticket-Verfügbarkeit Warnungen</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold">
                !
              </div>
              <div>
                <p className="font-medium text-red-900">Rock Concert Spectacular</p>
                <p className="text-sm text-red-700">AUSVERKAUFT - Alle 15.000 Tickets verkauft</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                AUSVERKAUFT
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                ⚠
              </div>
              <div>
                <p className="font-medium text-orange-900">Summer Music Festival 2024</p>
                <p className="text-sm text-orange-700">Nur noch 250 Tickets verfügbar</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                WENIGE TICKETS
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-bold">
                ⚠
              </div>
              <div>
                <p className="font-medium text-yellow-900">Comedy Night Special</p>
                <p className="text-sm text-yellow-700">Noch 25 Tickets verfügbar</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                FAST AUSVERKAUFT
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;