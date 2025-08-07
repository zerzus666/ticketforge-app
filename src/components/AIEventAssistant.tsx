import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Sparkles, 
  Search, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign,
  Lightbulb,
  CheckCircle,
  Clock,
  Globe,
  Music,
  Star,
  Target
} from 'lucide-react';
import type { ArtistInfo, EventPattern, AIEventSuggestion, Event, Venue } from '../types';

const AIEventAssistant: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [artistQuery, setArtistQuery] = useState('');
  const [artistInfo, setArtistInfo] = useState<ArtistInfo | null>(null);
  const [eventPatterns, setEventPatterns] = useState<EventPattern[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<AIEventSuggestion[]>([]);
  const [selectedPattern, setSelectedPattern] = useState<EventPattern | null>(null);

  // Mock data for demonstration
  const mockPatterns: EventPattern[] = [
    {
      id: '1',
      patternType: 'recurring',
      name: 'Monthly Jazz Nights',
      frequency: 'monthly',
      venues: ['Blue Note NYC', 'Jazz Cafe London'],
      artists: ['Jazz Quartet', 'Solo Piano'],
      ticketCategories: [
        { id: '1', name: 'General Admission', price: 45, capacity: 150, benefits: ['Standing room'] },
        { id: '2', name: 'VIP Table', price: 85, capacity: 40, benefits: ['Reserved table', 'Complimentary drink'] }
      ],
      pricing: { basePrice: 45, priceIncrease: 5, earlyBirdDiscount: 15 },
      marketing: {
        keywords: ['jazz night', 'live music', 'intimate venue'],
        description: 'An intimate evening of world-class jazz performances',
        hashtags: ['#JazzNight', '#LiveMusic', '#IntimateVenue']
      },
      confidence: 92,
      lastUsed: '2024-01-15',
      usage: 12
    },
    {
      id: '2',
      patternType: 'tour',
      name: 'Rock Band World Tour',
      frequency: 'tour_dates',
      venues: ['Madison Square Garden', 'O2 Arena', 'Tokyo Dome'],
      artists: ['Rock Bands', 'Alternative Artists'],
      ticketCategories: [
        { id: '1', name: 'General Admission', price: 75, capacity: 5000, benefits: ['Standing'] },
        { id: '2', name: 'Reserved Seating', price: 125, capacity: 8000, benefits: ['Assigned seat'] },
        { id: '3', name: 'VIP Package', price: 299, capacity: 200, benefits: ['Meet & greet', 'Merchandise', 'Premium seating'] }
      ],
      pricing: { basePrice: 75, priceIncrease: 25, earlyBirdDiscount: 20 },
      marketing: {
        keywords: ['world tour', 'rock concert', 'live performance'],
        description: 'Experience the energy of live rock music on the world tour',
        hashtags: ['#WorldTour', '#RockConcert', '#LiveMusic']
      },
      confidence: 88,
      lastUsed: '2024-01-10',
      usage: 8
    }
  ];

  const mockArtistInfo: ArtistInfo = {
    id: '1',
    name: 'Taylor Swift',
    genre: ['Pop', 'Country', 'Folk'],
    biography: 'Taylor Swift is an American singer-songwriter known for her narrative songwriting, which often centers around her personal life and has received widespread media coverage and critical praise.',
    imageUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
    socialMedia: {
      spotify: 'https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02',
      instagram: '@taylorswift',
      twitter: '@taylorswift13',
      youtube: 'TaylorSwiftVEVO'
    },
    popularSongs: ['Anti-Hero', 'Shake It Off', 'Blank Space', 'Love Story', 'You Belong With Me'],
    albums: ['Midnights', '1989', 'Folklore', 'Evermore', 'Lover'],
    awards: ['11 Grammy Awards', 'Artist of the Decade', 'Billboard Woman of the Decade'],
    collaborations: ['Ed Sheeran', 'Bon Iver', 'The National', 'Phoebe Bridgers'],
    tourHistory: ['Eras Tour 2023-2024', 'Reputation Stadium Tour', '1989 World Tour'],
    fanBase: {
      monthlyListeners: 83000000,
      followers: 274000000,
      demographics: {
        ageGroups: [
          { range: '18-24', percentage: 35 },
          { range: '25-34', percentage: 28 },
          { range: '13-17', percentage: 22 }
        ],
        topCountries: ['United States', 'United Kingdom', 'Canada', 'Australia']
      }
    },
    seoKeywords: ['taylor swift concert', 'eras tour', 'pop music', 'live performance', 'stadium tour'],
    relatedArtists: ['Olivia Rodrigo', 'Phoebe Bridgers', 'Lorde', 'Billie Eilish']
  };

  const mockSuggestions: AIEventSuggestion[] = [
    {
      id: '1',
      title: 'Taylor Swift: The Eras Tour - Stadium Experience',
      description: 'A career-spanning musical journey through Taylor Swift\'s discography',
      suggestedVenue: {
        id: '1',
        name: 'MetLife Stadium',
        address: 'East Rutherford, NJ',
        capacity: 82500,
        type: 'stadium',
        coordinates: { lat: 40.8135, lng: -74.0745 },
        amenities: ['Parking', 'Concessions', 'VIP Lounges'],
        seatingChart: 'stadium-layout.svg'
      },
      suggestedDate: '2024-07-15',
      suggestedTime: '19:00',
      ticketCategories: [
        { id: '1', name: 'General Admission', price: 89, capacity: 30000, benefits: ['Standing room floor'] },
        { id: '2', name: 'Lower Bowl', price: 149, capacity: 25000, benefits: ['Reserved seating'] },
        { id: '3', name: 'Club Level', price: 249, capacity: 15000, benefits: ['Premium seating', 'Club access'] },
        { id: '4', name: 'VIP Package', price: 599, capacity: 2000, benefits: ['Meet & greet', 'Exclusive merchandise', 'Premium location'] }
      ],
      estimatedAttendance: 72000,
      pricingRecommendation: {
        basePrice: 89,
        premiumPrice: 599,
        earlyBirdDiscount: 25
      },
      marketingContent: {
        seoTitle: 'Taylor Swift Eras Tour 2024 - MetLife Stadium Tickets | Official Event',
        metaDescription: 'Experience Taylor Swift\'s career-spanning Eras Tour at MetLife Stadium. Get official tickets for the most anticipated pop concert of 2024. Premium seating and VIP packages available.',
        productDescription: 'Join millions of Swifties for an unforgettable night as Taylor Swift brings her record-breaking Eras Tour to MetLife Stadium. This spectacular show features songs from across her entire discography, stunning visuals, and surprise acoustic performances. From her country roots to her latest pop anthems, experience the evolution of one of music\'s biggest superstars in this once-in-a-lifetime concert experience.',
        keywords: ['taylor swift tickets', 'eras tour 2024', 'metlife stadium concert', 'pop concert tickets', 'taylor swift new jersey'],
        hashtags: ['#ErasTour', '#TaylorSwift', '#MetLifeStadium', '#SwiftiesNJ', '#PopConcert2024']
      },
      confidence: 95,
      reasoning: [
        'High fan engagement based on social media metrics',
        'Stadium capacity matches artist\'s typical venue size',
        'Pricing aligned with similar pop stadium tours',
        'Date optimized for summer tour season',
        'Location has strong historical ticket sales for pop artists'
      ]
    }
  ];

  useEffect(() => {
    setEventPatterns(mockPatterns);
    setAiSuggestions(mockSuggestions);
  }, []);

  const handleArtistSearch = async () => {
    if (!artistQuery.trim()) return;
    
    setIsAnalyzing(true);
    // Simulate API call to scrape artist information
    setTimeout(() => {
      setArtistInfo(mockArtistInfo);
      setIsAnalyzing(false);
    }, 2000);
  };

  const generateEventFromPattern = (pattern: EventPattern) => {
    setSelectedPattern(pattern);
    // Generate new event suggestion based on pattern
    console.log('Generating event from pattern:', pattern.name);
  };

  const applyAISuggestion = (suggestion: AIEventSuggestion) => {
    console.log('Applying AI suggestion:', suggestion.title);
    // This would create a new event with the suggested parameters
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Brain className="w-8 h-8 text-purple-600" />
            <span>AI Event Assistant</span>
          </h1>
          <p className="text-gray-600 mt-1">Intelligent event creation with pattern recognition and artist insights</p>
        </div>
        <div className="flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-lg">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <span className="text-purple-800 font-medium">AI Powered</span>
        </div>
      </div>

      {/* Artist Information Scraper */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Globe className="w-6 h-6 text-blue-600" />
          <span>Artist Information Scraper</span>
        </h3>
        
        <div className="flex space-x-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Enter artist name (e.g., Taylor Swift, Ed Sheeran, Coldplay)"
              value={artistQuery}
              onChange={(e) => setArtistQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleArtistSearch()}
            />
          </div>
          <button
            onClick={handleArtistSearch}
            disabled={!artistQuery.trim() || isAnalyzing}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Get Artist Info</span>
              </>
            )}
          </button>
        </div>

        {artistInfo && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
            <div className="flex items-start space-x-6">
              <img 
                src={artistInfo.imageUrl} 
                alt={artistInfo.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="text-2xl font-bold text-gray-900 mb-2">{artistInfo.name}</h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  {artistInfo.genre.map((genre, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                      {genre}
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 line-clamp-3">{artistInfo.biography}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold">Audience</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{(artistInfo.fanBase.monthlyListeners! / 1000000).toFixed(1)}M</div>
                    <div className="text-sm text-gray-600">Monthly Listeners</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Music className="w-5 h-5 text-emerald-600" />
                      <span className="font-semibold">Top Songs</span>
                    </div>
                    <div className="text-sm text-gray-700">
                      {artistInfo.popularSongs.slice(0, 3).join(', ')}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="w-5 h-5 text-yellow-600" />
                      <span className="font-semibold">Recognition</span>
                    </div>
                    <div className="text-sm text-gray-700">
                      {artistInfo.awards.slice(0, 2).join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pattern Recognition */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
          <TrendingUp className="w-6 h-6 text-emerald-600" />
          <span>Detected Event Patterns</span>
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {eventPatterns.map((pattern) => (
            <div key={pattern.id} className="border border-gray-200 rounded-lg p-6 hover:border-emerald-300 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">{pattern.name}</h4>
                <div className="flex items-center space-x-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    pattern.confidence >= 90 ? 'bg-emerald-100 text-emerald-800' :
                    pattern.confidence >= 70 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {pattern.confidence}% confidence
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Frequency: {pattern.frequency}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>Venues: {pattern.venues.slice(0, 2).join(', ')}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span>Base Price: ${pattern.pricing.basePrice}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Used {pattern.usage} times</span>
                </div>
              </div>
              
              <button
                onClick={() => generateEventFromPattern(pattern)}
                className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Lightbulb className="w-4 h-4" />
                <span>Generate Event</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* AI Event Suggestions */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
          <Sparkles className="w-6 h-6 text-blue-600" />
          <span>AI-Generated Event Suggestions</span>
        </h3>
        
        <div className="space-y-6">
          {aiSuggestions.map((suggestion) => (
            <div key={suggestion.id} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{suggestion.title}</h4>
                  <p className="text-gray-600 mb-3">{suggestion.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{suggestion.suggestedVenue.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(suggestion.suggestedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{suggestion.estimatedAttendance.toLocaleString()} expected</span>
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  suggestion.confidence >= 90 ? 'bg-emerald-100 text-emerald-800' :
                  suggestion.confidence >= 70 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {suggestion.confidence}% match
                </div>
              </div>
              
              {/* SEO Content Preview */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h5 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span>SEO-Optimized Content</span>
                </h5>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Title: </span>
                    <span className="text-gray-600">{suggestion.marketingContent.seoTitle}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Description: </span>
                    <span className="text-gray-600">{suggestion.marketingContent.metaDescription}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Keywords: </span>
                    <span className="text-gray-600">{suggestion.marketingContent.keywords.join(', ')}</span>
                  </div>
                </div>
              </div>
              
              {/* Pricing Recommendation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-blue-600">${suggestion.pricingRecommendation.basePrice}</div>
                  <div className="text-sm text-blue-800">Base Price</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-purple-600">${suggestion.pricingRecommendation.premiumPrice}</div>
                  <div className="text-sm text-purple-800">Premium Price</div>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-emerald-600">{suggestion.pricingRecommendation.earlyBirdDiscount}%</div>
                  <div className="text-sm text-emerald-800">Early Bird Discount</div>
                </div>
              </div>
              
              {/* AI Reasoning */}
              <div className="mb-4">
                <h5 className="font-semibold text-gray-900 mb-2">AI Reasoning:</h5>
                <ul className="space-y-1">
                  {suggestion.reasoning.map((reason, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <button
                onClick={() => applyAISuggestion(suggestion)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Create Event from AI Suggestion</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights Dashboard */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-6">AI Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold">94%</div>
            <div className="text-purple-100">Prediction Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">2.3x</div>
            <div className="text-purple-100">Faster Event Setup</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">156</div>
            <div className="text-purple-100">Patterns Detected</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">$47K</div>
            <div className="text-purple-100">Revenue Optimized</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIEventAssistant;