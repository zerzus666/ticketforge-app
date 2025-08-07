import React, { useState, useEffect } from 'react';
import { FileText, Globe, DollarSign, Settings, Eye, Edit, Trash2, Plus, Search, Filter, ExternalLink, Copy, CheckCircle, AlertTriangle } from 'lucide-react';
import type { Event } from '../types';

interface BlogPost {
  id: string;
  shopifyBlogId: string;
  shopifyPostId: string;
  eventId: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  status: 'draft' | 'published';
  publishedAt?: string;
  tags: string[];
  seoTitle: string;
  metaDescription: string;
  featuredImage?: string;
  adsenseEnabled: boolean;
  adsenseId: string;
  adsenseSlots: AdSenseSlot[];
  createdAt: string;
  updatedAt: string;
}

interface AdSenseSlot {
  id: string;
  position: 'top' | 'middle' | 'bottom' | 'sidebar';
  slotId: string;
  format: 'auto' | 'rectangle' | 'leaderboard' | 'skyscraper';
  isActive: boolean;
}

interface ShopifyBlogManagerProps {
  userSubscription: 'basic' | 'advanced' | 'premium' | 'enterprise';
  onBlogPostCreated?: (blogPost: BlogPost) => void;
}

const ShopifyBlogManager: React.FC<ShopifyBlogManagerProps> = ({ 
  userSubscription = 'basic',
  onBlogPostCreated 
}) => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [adsenseSettings, setAdsenseSettings] = useState({
    defaultId: 'ca-pub-1234567890123456', // Basic Plan Standard-ID
    customId: '',
    autoCreatePosts: true,
    defaultSlots: [
      { position: 'top', format: 'leaderboard' },
      { position: 'middle', format: 'rectangle' },
      { position: 'bottom', format: 'rectangle' }
    ]
  });
  const [showAdsenseSettings, setShowAdsenseSettings] = useState(false);

  // Mock Blog Posts
  const mockBlogPosts: BlogPost[] = [
    {
      id: '1',
      shopifyBlogId: 'blog_events',
      shopifyPostId: 'post_12345',
      eventId: '8',
      title: 'Spring Electronic Festival Leipzig 2025 - Das erste große Electronic Event des Jahres',
      content: generateBlogContent({
        id: '8',
        title: 'Spring Electronic Festival Leipzig 2025',
        description: 'Das erste große Electronic Festival des Jahres 2025 im Werk2',
        date: '2025-04-15',
        venue: {
          name: 'Werk2 - Kulturfabrik Leipzig',
          address: 'Kochstraße 132, 04277 Leipzig, Deutschland'
        }
      } as Event),
      excerpt: 'Erleben Sie das erste große Electronic Festival 2025 in der legendären Werk2 Kulturfabrik Leipzig. Underground Beats, internationale DJs und unvergessliche Nächte.',
      slug: 'spring-electronic-festival-leipzig-2025',
      status: 'published',
      publishedAt: '2025-01-20T10:00:00Z',
      tags: ['electronic', 'festival', 'leipzig', 'werk2', 'techno', 'house'],
      seoTitle: 'Spring Electronic Festival Leipzig 2025 - Tickets | Werk2 Kulturfabrik',
      metaDescription: 'Das erste große Electronic Festival 2025 in Leipzig! Tickets für das Spring Electronic Festival im Werk2. Underground Electronic Music mit internationalen DJs.',
      featuredImage: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg',
      adsenseEnabled: true,
      adsenseId: userSubscription === 'basic' ? 'ca-pub-1234567890123456' : 'ca-pub-custom-id',
      adsenseSlots: [
        { id: '1', position: 'top', slotId: '1234567890', format: 'leaderboard', isActive: true },
        { id: '2', position: 'middle', slotId: '2345678901', format: 'rectangle', isActive: true },
        { id: '3', position: 'bottom', slotId: '3456789012', format: 'rectangle', isActive: true }
      ],
      createdAt: '2025-01-20T10:00:00Z',
      updatedAt: '2025-01-20T10:00:00Z'
    }
  ];

  useEffect(() => {
    setBlogPosts(mockBlogPosts);
  }, [userSubscription]);

  // Blog-Content Generator
  function generateBlogContent(event: Event): string {
    const adsenseId = userSubscription === 'basic' ? adsenseSettings.defaultId : (adsenseSettings.customId || adsenseSettings.defaultId);
    
    return `
<div class="event-blog-post">
  <!-- AdSense Top Banner (nur bei Advanced+ editierbar) -->
  ${userSubscription !== 'basic' ? `
  <div class="adsense-top">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}" crossorigin="anonymous"></script>
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="${adsenseId}"
         data-ad-slot="1234567890"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
    <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
  </div>
  ` : `
  <!-- Basic Plan: Standard AdSense (nicht editierbar) -->
  <div class="adsense-top">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456" crossorigin="anonymous"></script>
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-1234567890123456"
         data-ad-slot="1234567890"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
    <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
  </div>
  `}

  <h1>${event.title}</h1>
  
  <div class="event-meta">
    <p><strong>📅 Datum:</strong> ${new Date(event.date).toLocaleDateString('de-DE', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}</p>
    <p><strong>⏰ Uhrzeit:</strong> ${event.time} Uhr</p>
    <p><strong>🏟️ Venue:</strong> ${event.venue.name}</p>
    <p><strong>📍 Adresse:</strong> ${event.venue.address}</p>
    ${event.minAge ? `<p><strong>🔞 Mindestalter:</strong> ${event.minAge} Jahre</p>` : ''}
  </div>

  ${event.images && event.images.length > 0 ? `
  <div class="event-gallery">
    <img src="${event.images[0]}" alt="${event.title}" style="width: 100%; max-width: 600px; height: auto; border-radius: 8px; margin: 20px 0;" />
  </div>
  ` : ''}

  <div class="event-description">
    <p>${event.description}</p>
  </div>

  <!-- AdSense Middle Rectangle -->
  <div class="adsense-middle" style="margin: 30px 0; text-align: center;">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}" crossorigin="anonymous"></script>
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="${adsenseId}"
         data-ad-slot="2345678901"
         data-ad-format="rectangle"></ins>
    <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
  </div>

  <h2>🎫 Ticket-Kategorien</h2>
  <div class="ticket-categories">
    ${event.ticketCategories.map(cat => `
      <div class="ticket-category" style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 10px 0;">
        <h3 style="color: ${cat.color};">${cat.name}</h3>
        <p><strong>💰 Preis:</strong> €${cat.price}</p>
        <p><strong>👥 Verfügbar:</strong> ${cat.capacity - cat.sold - cat.reserved} von ${cat.capacity}</p>
        ${cat.benefits.length > 0 ? `<p><strong>✨ Vorteile:</strong> ${cat.benefits.join(', ')}</p>` : ''}
      </div>
    `).join('')}
  </div>

  <h2>🏟️ Venue-Informationen</h2>
  <div class="venue-info">
    <p><strong>📍 Adresse:</strong> ${event.venue.address}</p>
    <p><strong>👥 Kapazität:</strong> ${event.venue.capacity.toLocaleString()} Personen</p>
    <p><strong>🏢 Typ:</strong> ${event.venue.type}</p>
    ${event.venue.amenities.length > 0 ? `<p><strong>🎯 Ausstattung:</strong> ${event.venue.amenities.join(', ')}</p>` : ''}
  </div>

  ${event.organizer ? `
  <h2>👤 Veranstalter</h2>
  <div class="organizer-info">
    <p><strong>🏢 Name:</strong> ${event.organizer.name}</p>
    ${event.organizer.company ? `<p><strong>🏢 Unternehmen:</strong> ${event.organizer.company}</p>` : ''}
    <p><strong>📧 Kontakt:</strong> ${event.organizer.email}</p>
    ${event.organizer.phone ? `<p><strong>📞 Telefon:</strong> ${event.organizer.phone}</p>` : ''}
  </div>
  ` : ''}

  <!-- AdSense Bottom Banner -->
  <div class="adsense-bottom" style="margin: 30px 0; text-align: center;">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}" crossorigin="anonymous"></script>
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="${adsenseId}"
         data-ad-slot="3456789012"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
    <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
  </div>

  <div class="cta-section" style="background: linear-gradient(135deg, #3B82F6, #10B981); color: white; padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0;">
    <h2>🎫 Tickets jetzt sichern!</h2>
    <p>Verpassen Sie nicht dieses einmalige Event. Tickets sind limitiert!</p>
    <a href="/products/${event.title.toLowerCase().replace(/\s+/g, '-')}" 
       style="background: white; color: #3B82F6; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; margin-top: 15px;">
      🛒 Tickets kaufen
    </a>
  </div>

  ${event.tags.length > 0 ? `
  <div class="event-tags">
    <h3>🏷️ Tags</h3>
    <div class="tags">
      ${event.tags.map(tag => `<span style="background: #e5e7eb; padding: 4px 12px; border-radius: 20px; margin: 2px; display: inline-block;">#${tag}</span>`).join('')}
    </div>
  </div>
  ` : ''}
</div>

<style>
.event-blog-post {
  max-width: 800px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #374151;
}

.event-meta {
  background: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
  border-left: 4px solid #3B82F6;
}

.ticket-category {
  transition: transform 0.2s;
}

.ticket-category:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.adsense-top, .adsense-middle, .adsense-bottom {
  margin: 20px 0;
  min-height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .event-blog-post {
    padding: 0 16px;
  }
  
  .ticket-category {
    margin: 8px 0;
  }
}
</style>
`;
  }

  const createShopifyBlogPost = async (event: Event): Promise<BlogPost> => {
    const adsenseId = userSubscription === 'basic' ? adsenseSettings.defaultId : (adsenseSettings.customId || adsenseSettings.defaultId);
    
    // SEO-optimierte Daten
    const seoTitle = `${event.title} - Tickets & Informationen | ${event.venue.name}`;
    const metaDescription = `${event.description.substring(0, 140)}... Tickets jetzt sichern für ${event.title} am ${new Date(event.date).toLocaleDateString('de-DE')} im ${event.venue.name}.`;
    const slug = event.title.toLowerCase()
      .replace(/[äöüß]/g, (match) => ({ 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' }[match] || match))
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // AdSense Slots basierend auf Subscription
    const adsenseSlots: AdSenseSlot[] = [
      { id: '1', position: 'top', slotId: '1234567890', format: 'leaderboard', isActive: true },
      { id: '2', position: 'middle', slotId: '2345678901', format: 'rectangle', isActive: true },
      { id: '3', position: 'bottom', slotId: '3456789012', format: 'rectangle', isActive: true }
    ];

    // Bei Premium/Enterprise: Sidebar AdSense hinzufügen
    if (['premium', 'enterprise'].includes(userSubscription)) {
      adsenseSlots.push(
        { id: '4', position: 'sidebar', slotId: '4567890123', format: 'skyscraper', isActive: true }
      );
    }

    const blogPost: BlogPost = {
      id: Date.now().toString(),
      shopifyBlogId: 'events_blog',
      shopifyPostId: `post_${Date.now()}`,
      eventId: event.id,
      title: seoTitle,
      content: generateBlogContent(event),
      excerpt: metaDescription,
      slug,
      status: 'published',
      publishedAt: new Date().toISOString(),
      tags: [...(event.tags || []), 'tickets', 'events', event.venue.name.toLowerCase()],
      seoTitle,
      metaDescription,
      featuredImage: event.images?.[0],
      adsenseEnabled: true,
      adsenseId,
      adsenseSlots,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Simuliere Shopify Blog API Call
    try {
      console.log('🛍️ Erstelle Shopify Blog Post:', {
        blog_id: blogPost.shopifyBlogId,
        article: {
          title: blogPost.title,
          content: blogPost.content,
          excerpt: blogPost.excerpt,
          slug: blogPost.slug,
          tags: blogPost.tags.join(', '),
          published: true,
          featured_image: blogPost.featuredImage,
          metafields: [
            {
              namespace: 'ticketforge',
              key: 'event_id',
              value: event.id,
              type: 'single_line_text_field'
            },
            {
              namespace: 'seo',
              key: 'meta_description',
              value: blogPost.metaDescription,
              type: 'single_line_text_field'
            },
            {
              namespace: 'adsense',
              key: 'publisher_id',
              value: adsenseId,
              type: 'single_line_text_field'
            }
          ]
        }
      });

      // Mock Shopify API Response
      const shopifyResponse = {
        article: {
          id: parseInt(blogPost.shopifyPostId.replace('post_', '')),
          title: blogPost.title,
          content: blogPost.content,
          slug: blogPost.slug,
          published_at: blogPost.publishedAt,
          url: `https://your-store.myshopify.com/blogs/events/${blogPost.slug}`,
          tags: blogPost.tags.join(', ')
        }
      };

      console.log('✅ Shopify Blog Post erstellt:', shopifyResponse);
      
      setBlogPosts(prev => [...prev, blogPost]);
      onBlogPostCreated?.(blogPost);
      
      return blogPost;
    } catch (error) {
      console.error('❌ Fehler beim Erstellen des Shopify Blog Posts:', error);
      throw error;
    }
  };

  const updateAdsenseSettings = (newSettings: any) => {
    if (userSubscription === 'basic') {
      // Basic Plan: AdSense ID nicht änderbar
      alert('⚠️ AdSense-ID kann im Basic Plan nicht geändert werden. Upgrade auf Advanced+ für benutzerdefinierte AdSense-IDs.');
      return;
    }
    
    setAdsenseSettings(prev => ({ ...prev, ...newSettings }));
    
    // Update alle bestehenden Blog Posts mit neuer AdSense ID
    setBlogPosts(prev => prev.map(post => ({
      ...post,
      adsenseId: newSettings.customId || adsenseSettings.defaultId,
      content: post.content.replace(/ca-pub-[0-9]+/g, newSettings.customId || adsenseSettings.defaultId)
    })));
    
    alert('✅ AdSense-Einstellungen aktualisiert und auf alle Blog Posts angewendet!');
  };

  const regenerateBlogPost = async (blogPost: BlogPost) => {
    const event = {
      id: blogPost.eventId,
      title: blogPost.title.split(' - ')[0], // Extract original title
      description: blogPost.excerpt,
      date: '2025-04-15', // Mock date
      venue: {
        name: 'Werk2 - Kulturfabrik Leipzig',
        address: 'Kochstraße 132, 04277 Leipzig, Deutschland'
      }
    } as Event;

    const updatedContent = generateBlogContent(event);
    
    setBlogPosts(prev => prev.map(post => 
      post.id === blogPost.id 
        ? { ...post, content: updatedContent, updatedAt: new Date().toISOString() }
        : post
    ));
    
    alert('✅ Blog Post mit aktuellen AdSense-Einstellungen regeneriert!');
  };

  const getSubscriptionFeatures = () => {
    switch (userSubscription) {
      case 'basic':
        return {
          canEditAdsense: false,
          maxAdsenseSlots: 3,
          autoGeneration: false,
          customTemplates: false,
          description: 'Standard AdSense-ID (nicht editierbar)'
        };
      case 'advanced':
        return {
          canEditAdsense: true,
          maxAdsenseSlots: 4,
          autoGeneration: true,
          customTemplates: false,
          description: 'Benutzerdefinierte AdSense-ID + Auto-Generation'
        };
      case 'premium':
        return {
          canEditAdsense: true,
          maxAdsenseSlots: 6,
          autoGeneration: true,
          customTemplates: true,
          description: 'Vollständige AdSense-Kontrolle + Custom Templates'
        };
      case 'enterprise':
        return {
          canEditAdsense: true,
          maxAdsenseSlots: -1,
          autoGeneration: true,
          customTemplates: true,
          description: 'Unbegrenzte AdSense-Slots + White-Label'
        };
      default:
        return {
          canEditAdsense: false,
          maxAdsenseSlots: 3,
          autoGeneration: false,
          customTemplates: false,
          description: 'Standard Features'
        };
    }
  };

  const features = getSubscriptionFeatures();

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🛍️ Shopify Blog Manager</h1>
          <p className="text-gray-600 mt-1">Automatische Blog-Posts für Events mit Google AdSense Integration</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
            userSubscription === 'basic' ? 'bg-blue-100 text-blue-800' :
            userSubscription === 'advanced' ? 'bg-emerald-100 text-emerald-800' :
            userSubscription === 'premium' ? 'bg-purple-100 text-purple-800' :
            'bg-orange-100 text-orange-800'
          }`}>
            {userSubscription.charAt(0).toUpperCase() + userSubscription.slice(1)} Plan
          </div>
          <button
            onClick={() => setShowAdsenseSettings(!showAdsenseSettings)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <Settings className="w-4 h-4" />
            <span>💰 AdSense</span>
          </button>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>📝 Manueller Post</span>
          </button>
        </div>
      </div>

      {/* Subscription Features Info */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Plan-Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className={`text-2xl font-bold ${features.canEditAdsense ? 'text-emerald-600' : 'text-red-600'}`}>
              {features.canEditAdsense ? '✅' : '❌'}
            </div>
            <div className="text-sm text-gray-600">AdSense ID editierbar</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {features.maxAdsenseSlots === -1 ? '∞' : features.maxAdsenseSlots}
            </div>
            <div className="text-sm text-gray-600">AdSense Slots</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${features.autoGeneration ? 'text-emerald-600' : 'text-red-600'}`}>
              {features.autoGeneration ? '✅' : '❌'}
            </div>
            <div className="text-sm text-gray-600">Auto-Generation</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${features.customTemplates ? 'text-emerald-600' : 'text-red-600'}`}>
              {features.customTemplates ? '✅' : '❌'}
            </div>
            <div className="text-sm text-gray-600">Custom Templates</div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-blue-800 text-sm">{features.description}</p>
        </div>
      </div>

      {/* AdSense Settings */}
      {showAdsenseSettings && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Google AdSense Einstellungen</h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Standard AdSense Publisher ID
                </label>
                <input
                  type="text"
                  value={adsenseSettings.defaultId}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1">Basic Plan Standard-ID (nicht editierbar)</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Benutzerdefinierte AdSense ID {!features.canEditAdsense && '(Premium Feature)'}
                </label>
                <input
                  type="text"
                  value={adsenseSettings.customId}
                  onChange={(e) => features.canEditAdsense && setAdsenseSettings(prev => ({ ...prev, customId: e.target.value }))}
                  disabled={!features.canEditAdsense}
                  placeholder="ca-pub-1234567890123456"
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !features.canEditAdsense ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''
                  }`}
                />
                {!features.canEditAdsense && (
                  <p className="text-xs text-red-500 mt-1">⚠️ Upgrade auf Advanced+ für benutzerdefinierte AdSense-IDs</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={adsenseSettings.autoCreatePosts}
                  onChange={(e) => setAdsenseSettings(prev => ({ ...prev, autoCreatePosts: e.target.checked }))}
                  disabled={!features.autoGeneration}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium text-gray-900">
                  📝 Automatische Blog-Posts für neue Events erstellen
                  {!features.autoGeneration && ' (Premium Feature)'}
                </span>
              </label>
              
              {!features.autoGeneration && (
                <p className="text-xs text-red-500 ml-6">⚠️ Auto-Generation nur ab Advanced Plan verfügbar</p>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => updateAdsenseSettings(adsenseSettings)}
                disabled={!features.canEditAdsense}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>💾 Einstellungen speichern</span>
              </button>
              
              {userSubscription === 'basic' && (
                <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  onClick={() => {
                    alert(`🚀 Upgrade zu Advanced Plan:

✨ Neue Features:
• Benutzerdefinierte AdSense-ID
• Automatische Blog-Post-Generierung
• Erweiterte Templates
• Priority Support

💰 Kosten:
• Advanced: €99/Monat
• Ersparnis: Bis zu €500/Monat durch AdSense

📞 Upgrade jetzt:
• Online: ticketforge.com/upgrade
• E-Mail: sales@ticketforge.com
• Telefon: +49 30 12345678`);
                  }}
                  🚀 Auf Advanced upgraden
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Blog Posts List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">📝 Shopify Blog Posts</h3>
            <div className="text-sm text-gray-600">
              {blogPosts.length} Posts • AdSense ID: {userSubscription === 'basic' ? 'Standard (locked)' : 'Custom'}
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {blogPosts.map((post) => (
            <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{post.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      post.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.status === 'published' ? '✅ Veröffentlicht' : '📝 Entwurf'}
                    </span>
                    {post.adsenseEnabled && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        💰 AdSense aktiv
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="font-medium text-gray-700">📅 Veröffentlicht:</span>
                      <span className="text-gray-600 ml-1">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('de-DE') : 'Nicht veröffentlicht'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">🔗 Slug:</span>
                      <span className="text-gray-600 ml-1 font-mono text-sm">{post.slug}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">💰 AdSense ID:</span>
                      <span className="text-gray-600 ml-1 font-mono text-sm">{post.adsenseId}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">📊 AdSense Slots:</span>
                      <span className="text-gray-600 ml-1">{post.adsenseSlots.filter(slot => slot.isActive).length} aktiv</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => window.open(`https://your-store.myshopify.com/blogs/events/${post.slug}`, '_blank')}
                    className="text-blue-600 hover:text-blue-800 transition-colors p-2"
                    title="Blog Post anzeigen"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(post.content)}
                    className="text-gray-600 hover:text-gray-800 transition-colors p-2"
                    title="HTML kopieren"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => regenerateBlogPost(post)}
                    className="text-emerald-600 hover:text-emerald-800 transition-colors p-2"
                    title="Mit aktuellen AdSense-Einstellungen regenerieren"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-800 transition-colors p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AdSense Revenue Tracking */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 border border-green-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">💰 AdSense Revenue Tracking</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">€247.83</div>
            <div className="text-green-800">Diesen Monat</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">15,420</div>
            <div className="text-blue-800">Impressions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">2.3%</div>
            <div className="text-purple-800">CTR</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">€0.016</div>
            <div className="text-orange-800">CPC</div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
          <h5 className="font-semibold text-gray-900 mb-2">🎯 AdSense-Optimierung:</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>• 📊 Automatische Slot-Optimierung</div>
            <div>• 🎯 Event-spezifische Anzeigen</div>
            <div>• 📱 Mobile-responsive Ads</div>
            <div>• 🔄 A/B Testing für Platzierung</div>
          </div>
        </div>
      </div>

      {/* Integration Guide */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔧 Shopify Integration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="font-bold">1</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">📝 Auto-Generation</h4>
            <p className="text-gray-600 text-sm">Blog Posts werden automatisch bei Event-Erstellung generiert</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="font-bold">2</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">💰 AdSense Integration</h4>
            <p className="text-gray-600 text-sm">Google AdSense Codes werden automatisch eingefügt</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="font-bold">3</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">🛍️ Shopify Sync</h4>
            <p className="text-gray-600 text-sm">Posts werden direkt in Shopify Blog veröffentlicht</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopifyBlogManager;