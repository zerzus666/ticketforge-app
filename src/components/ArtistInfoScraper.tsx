import React, { useState } from 'react';
import { Search, Globe, Music, Users, Star, ExternalLink, Download, Copy } from 'lucide-react';
import type { ArtistInfo } from '../types';

interface ArtistInfoScraperProps {
  onArtistInfoGenerated?: (artistInfo: ArtistInfo, seoContent: any) => void;
}

const ArtistInfoScraper: React.FC<ArtistInfoScraperProps> = ({ onArtistInfoGenerated }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [artistInfo, setArtistInfo] = useState<ArtistInfo | null>(null);
  const [seoContent, setSeoContent] = useState<any>(null);

  // Mock web scraping function - in production, this would call actual APIs
  const scrapeArtistInfo = async (artistName: string): Promise<{ artistInfo: ArtistInfo; seoContent: any }> => {
    // Simulate API calls to various sources:
    // - Spotify API for music data
    // - Wikipedia for biography
    // - Social media APIs for follower counts
    // - Music databases for discography
    // - SEO tools for keyword suggestions
    
    const mockArtistInfo: ArtistInfo = {
      id: Date.now().toString(),
      name: artistName,
      genre: ['Pop', 'Rock', 'Alternative'],
      biography: `${artistName} is a renowned artist known for their innovative sound and captivating performances. With a career spanning multiple decades, they have consistently pushed the boundaries of music and entertainment, earning critical acclaim and a devoted global fanbase.`,
      imageUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
      socialMedia: {
        spotify: `https://open.spotify.com/artist/${artistName.toLowerCase().replace(' ', '')}`,
        instagram: `@${artistName.toLowerCase().replace(' ', '')}`,
        twitter: `@${artistName.toLowerCase().replace(' ', '')}`,
        facebook: artistName,
        youtube: `${artistName}VEVO`
      },
      popularSongs: [
        'Greatest Hit #1',
        'Chart Topper',
        'Fan Favorite',
        'Radio Single',
        'Concert Anthem'
      ],
      albums: [
        'Latest Album (2024)',
        'Previous Release (2022)',
        'Breakthrough Album (2020)',
        'Debut Album (2018)'
      ],
      awards: [
        'Grammy Award Winner',
        'Billboard Music Award',
        'MTV Video Music Award',
        'People\'s Choice Award'
      ],
      collaborations: [
        'Featured Artist A',
        'Collaboration with B',
        'Duet with C'
      ],
      tourHistory: [
        'World Tour 2024',
        'Stadium Tour 2023',
        'Intimate Venues Tour 2022'
      ],
      fanBase: {
        monthlyListeners: Math.floor(Math.random() * 50000000) + 10000000,
        followers: Math.floor(Math.random() * 100000000) + 20000000,
        demographics: {
          ageGroups: [
            { range: '18-24', percentage: 35 },
            { range: '25-34', percentage: 28 },
            { range: '13-17', percentage: 22 },
            { range: '35-44', percentage: 15 }
          ],
          topCountries: ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany']
        }
      },
      seoKeywords: [
        `${artistName.toLowerCase()} concert`,
        `${artistName.toLowerCase()} tour`,
        `${artistName.toLowerCase()} tickets`,
        `${artistName.toLowerCase()} live`,
        `${artistName.toLowerCase()} performance`,
        'live music',
        'concert tickets',
        'music event'
      ],
      relatedArtists: [
        'Similar Artist 1',
        'Genre Peer 2',
        'Frequent Collaborator 3',
        'Contemporary 4'
      ]
    };

    const mockSeoContent = {
      productTitle: `${artistName} Live in Concert - Official Tickets`,
      metaDescription: `Experience ${artistName} live in concert! Get official tickets for the most anticipated music event. Premium seating, VIP packages, and exclusive merchandise available.`,
      productDescription: `
        Don't miss your chance to see ${artistName} perform live! Known for their electrifying stage presence and hit songs including ${mockArtistInfo.popularSongs.slice(0, 3).join(', ')}, this concert promises to be an unforgettable experience.

        ${artistName} has captivated audiences worldwide with their unique blend of ${mockArtistInfo.genre.join(', ')} music. With over ${(mockArtistInfo.fanBase.monthlyListeners! / 1000000).toFixed(1)} million monthly listeners on Spotify and numerous awards including ${mockArtistInfo.awards.slice(0, 2).join(' and ')}, this is a performance you won't want to miss.

        The show will feature songs from their latest album "${mockArtistInfo.albums[0]}" as well as classic hits that have defined their career. Expect stunning visuals, incredible sound quality, and the energy that only a live ${artistName} performance can deliver.

        Ticket categories include general admission, reserved seating, and exclusive VIP packages with meet & greet opportunities. All tickets include official merchandise and access to pre-show activities.
      )
      `,
      keywords: mockArtistInfo.seoKeywords,
      hashtags: [
        \`#${artistName.replace(' ', '')}Concert`,
        \`#${artistName.replace(' ', '')}Live`,
        '#LiveMusic',
        '#ConcertTickets',
        '#MusicEvent',
        \`#${artistName.replace(' ', '')}Tour`
      ],
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'MusicEvent',
        'name': \`${artistName} Live in Concert`,
        'performer': {
          '@type': 'MusicGroup',
          'name': artistName,
          'genre': mockArtistInfo.genre
        },
        'description': \`Live concert performance by ${artistName}`,
        'offers': {
          '@type': 'Offer',
          'availability': 'https://schema.org/InStock',
          'price': '89.00',
          'priceCurrency': 'USD'
        }
      }
    };

    return { artistInfo: mockArtistInfo, seoContent: mockSeoContent };
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const result = await scrapeArtistInfo(searchQuery);
      setArtistInfo(result.artistInfo);
      setSeoContent(result.seoContent);
      
      if (onArtistInfoGenerated) {
        onArtistInfoGenerated(result.artistInfo, result.seoContent);
      }
    } catch (error) {
      console.error('Error scraping artist info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Search Interface */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Globe className="w-6 h-6 text-blue-600" />
          <span>Artist Information & SEO Content Generator</span>
        </h3>
        
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Enter artist name (e.g., Taylor Swift, Ed Sheeran, Coldplay)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!searchQuery.trim() || isLoading}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Scraping...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Generate Content</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p>Our AI scrapes information from multiple sources including:</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {['Spotify', 'Wikipedia', 'AllMusic', 'Discogs', 'Social Media APIs', 'Music Charts'].map((source) => (
              <span key={source} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {source}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Artist Information Display */}
      {artistInfo && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Artist Information</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Basic Info */}
            <div className="lg:col-span-1">
              <img 
                src={artistInfo.imageUrl} 
                alt={artistInfo.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h4 className="text-2xl font-bold text-gray-900 mb-2">{artistInfo.name}</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {artistInfo.genre.map((genre, index) => (
                  <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {genre}
                  </span>
                ))}
              </div>
              
              {/* Social Media Links */}
              <div className="space-y-2">
                <h5 className="font-semibold text-gray-900">Social Media</h5>
                {Object.entries(artistInfo.socialMedia).map(([platform, handle]) => (
                  handle && (
                    <div key={platform} className="flex items-center space-x-2 text-sm">
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                      <span className="capitalize">{platform}:</span>
                      <span className="text-blue-600">{handle}</span>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Detailed Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Biography */}
              <div>
                <h5 className="font-semibold text-gray-900 mb-2">Biography</h5>
                <p className="text-gray-700">{artistInfo.biography}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold">Audience Reach</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {(artistInfo.fanBase.monthlyListeners! / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-gray-600">Monthly Listeners</div>
                </div>
                
                <div className="bg-emerald-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-5 h-5 text-emerald-600" />
                    <span className="font-semibold">Recognition</span>
                  </div>
                  <div className="text-sm text-gray-700">
                    {artistInfo.awards.slice(0, 2).join(', ')}
                  </div>
                </div>
              </div>

              {/* Popular Songs */}
              <div>
                <h5 className="font-semibold text-gray-900 mb-2">Popular Songs</h5>
                <div className="flex flex-wrap gap-2">
                  {artistInfo.popularSongs.map((song, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      {song}
                    </span>
                  ))}
                </div>
              </div>

              {/* Albums */}
              <div>
                <h5 className="font-semibold text-gray-900 mb-2">Recent Albums</h5>
                <div className="flex flex-wrap gap-2">
                  {artistInfo.albums.map((album, index) => (
                    <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                      {album}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO Content */}
      {seoContent && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
            <Search className="w-6 h-6 text-emerald-600" />
            <span>Generated SEO Content</span>
          </h3>
          
          <div className="space-y-6">
            {/* Product Title */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-semibold text-gray-900">Product Title</h5>
                <button
                  onClick={() => copyToClipboard(seoContent.productTitle)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800">{seoContent.productTitle}</p>
              </div>
            </div>

            {/* Meta Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-semibold text-gray-900">Meta Description</h5>
                <button
                  onClick={() => copyToClipboard(seoContent.metaDescription)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800">{seoContent.metaDescription}</p>
              </div>
            </div>

            {/* Product Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-semibold text-gray-900">Product Description</h5>
                <button
                  onClick={() => copyToClipboard(seoContent.productDescription)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                <p className="text-gray-800 whitespace-pre-line">{seoContent.productDescription}</p>
              </div>
            </div>

            {/* Keywords */}
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">SEO Keywords</h5>
              <div className="flex flex-wrap gap-2">
                {seoContent.keywords.map((keyword: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Hashtags */}
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">Social Media Hashtags</h5>
              <div className="flex flex-wrap gap-2">
                {seoContent.hashtags.map((hashtag: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {hashtag}
                  </span>
                ))}
              </div>
            </div>

            {/* Structured Data */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-semibold text-gray-900">Structured Data (JSON-LD)</h5>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(seoContent.structuredData, null, 2))}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-gray-900 text-green-400 rounded-lg p-4 max-h-64 overflow-y-auto">
                <pre className="text-sm">{JSON.stringify(seoContent.structuredData, null, 2)}</pre>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-6">
            <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export All Content</span>
            </button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Apply to Event
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistInfoScraper;
    }
  }
}