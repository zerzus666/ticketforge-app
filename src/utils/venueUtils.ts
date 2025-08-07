// Venue Utility Functions
// Handles venue search, suggestions, and database operations

import type { Venue } from '../types';
import { enhanceVenueWithLocation } from './locationParser';

export interface VenueSearchResult {
  venue: Venue;
  matchScore: number;
  matchType: 'name' | 'city' | 'address' | 'type';
}

// Search venues in database with intelligent matching
export const searchVenues = (
  venues: Venue[], 
  searchTerm: string, 
  filters?: {
    type?: string;
    capacity?: { min?: number; max?: number };
    city?: string;
    country?: string;
  }
): VenueSearchResult[] => {
  if (!searchTerm.trim()) return [];
  
  const term = searchTerm.toLowerCase();
  const results: VenueSearchResult[] = [];
  
  venues.forEach(venue => {
    const enhancedVenue = enhanceVenueWithLocation(venue);
    let matchScore = 0;
    let matchType: VenueSearchResult['matchType'] = 'name';
    
    // Name matching (highest priority)
    if (venue.name.toLowerCase().includes(term)) {
      matchScore = venue.name.toLowerCase().startsWith(term) ? 100 : 80;
      matchType = 'name';
    }
    // City matching
    else if (enhancedVenue.seoLocation?.primaryLocation?.toLowerCase().includes(term)) {
      matchScore = 70;
      matchType = 'city';
    }
    // Address matching
    else if (venue.address.toLowerCase().includes(term)) {
      matchScore = 60;
      matchType = 'address';
    }
    // Type matching
    else if (venue.type.toLowerCase().includes(term)) {
      matchScore = 40;
      matchType = 'type';
    }
    
    // Apply filters
    if (matchScore > 0) {
      if (filters?.type && venue.type !== filters.type) matchScore = 0;
      if (filters?.capacity?.min && venue.capacity < filters.capacity.min) matchScore = 0;
      if (filters?.capacity?.max && venue.capacity > filters.capacity.max) matchScore = 0;
      if (filters?.city && !enhancedVenue.seoLocation?.primaryLocation?.toLowerCase().includes(filters.city.toLowerCase())) matchScore = 0;
    }
    
    if (matchScore > 0) {
      results.push({
        venue: enhancedVenue,
        matchScore,
        matchType
      });
    }
  });
  
  // Sort by match score (highest first)
  return results.sort((a, b) => b.matchScore - a.matchScore);
};

// Get venue suggestions based on event context
export const getVenueSuggestions = (
  venues: Venue[],
  eventContext: {
    title?: string;
    category?: string;
    expectedAttendance?: number;
    location?: string;
  }
): Venue[] => {
  const suggestions: { venue: Venue; score: number }[] = [];
  
  venues.forEach(venue => {
    let score = 0;
    const enhancedVenue = enhanceVenueWithLocation(venue);
    
    // Category-based venue type matching
    if (eventContext.category) {
      const categoryVenueMap: { [key: string]: string[] } = {
        'Musik': ['arena', 'stadium', 'outdoor', 'club'],
        'Business': ['conference', 'theater'],
        'Sport': ['stadium', 'arena'],
        'Kultur': ['theater', 'outdoor'],
        'Comedy': ['club', 'theater'],
        'Theater': ['theater']
      };
      
      const preferredTypes = categoryVenueMap[eventContext.category] || [];
      if (preferredTypes.includes(venue.type)) {
        score += 30;
      }
    }
    
    // Capacity matching
    if (eventContext.expectedAttendance) {
      const capacityRatio = eventContext.expectedAttendance / venue.capacity;
      if (capacityRatio >= 0.3 && capacityRatio <= 0.9) {
        score += 40; // Optimal capacity utilization
      } else if (capacityRatio >= 0.1 && capacityRatio <= 1.0) {
        score += 20; // Acceptable capacity
      }
    }
    
    // Location matching
    if (eventContext.location) {
      const locationTerm = eventContext.location.toLowerCase();
      if (enhancedVenue.seoLocation?.primaryLocation?.toLowerCase().includes(locationTerm)) {
        score += 25;
      } else if (venue.address.toLowerCase().includes(locationTerm)) {
        score += 15;
      }
    }
    
    // Title-based matching (keywords)
    if (eventContext.title) {
      const titleLower = eventContext.title.toLowerCase();
      const venueKeywords = [
        venue.name.toLowerCase(),
        venue.type,
        ...venue.amenities.map(a => a.toLowerCase())
      ];
      
      venueKeywords.forEach(keyword => {
        if (titleLower.includes(keyword)) {
          score += 10;
        }
      });
    }
    
    if (score > 0) {
      suggestions.push({ venue: enhancedVenue, score });
    }
  });
  
  // Sort by score and return top suggestions
  return suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(s => s.venue);
};

// Validate venue data for import
export const validateVenueData = (venueData: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!venueData.name || typeof venueData.name !== 'string' || venueData.name.trim().length === 0) {
    errors.push('Name ist erforderlich');
  }
  
  if (!venueData.address || typeof venueData.address !== 'string' || venueData.address.trim().length === 0) {
    errors.push('Adresse ist erforderlich');
  }
  
  if (!venueData.capacity || isNaN(parseInt(venueData.capacity)) || parseInt(venueData.capacity) <= 0) {
    errors.push('Gültige Kapazität ist erforderlich');
  }
  
  const validTypes = ['arena', 'stadium', 'theater', 'club', 'outdoor', 'conference'];
  if (!venueData.type || !validTypes.includes(venueData.type)) {
    errors.push(`Typ muss einer der folgenden sein: ${validTypes.join(', ')}`);
  }
  
  // Validate coordinates if provided
  if (venueData.latitude && (isNaN(parseFloat(venueData.latitude)) || Math.abs(parseFloat(venueData.latitude)) > 90)) {
    errors.push('Ungültiger Breitengrad');
  }
  
  if (venueData.longitude && (isNaN(parseFloat(venueData.longitude)) || Math.abs(parseFloat(venueData.longitude)) > 180)) {
    errors.push('Ungültiger Längengrad');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Parse CSV venue data
export const parseVenueCSV = (csvContent: string): any[] => {
  const lines = csvContent.split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const venues: any[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    const venue: any = {};
    
    headers.forEach((header, index) => {
      const value = values[index] || '';
      
      switch (header.toLowerCase()) {
        case 'name':
          venue.name = value;
          break;
        case 'address':
          venue.address = value;
          break;
        case 'capacity':
          venue.capacity = parseInt(value) || 0;
          break;
        case 'type':
          venue.type = value.toLowerCase();
          break;
        case 'amenities':
          venue.amenities = value ? value.split(';').map(a => a.trim()) : [];
          break;
        case 'latitude':
          venue.latitude = parseFloat(value) || null;
          break;
        case 'longitude':
          venue.longitude = parseFloat(value) || null;
          break;
        case 'seatingchart':
          venue.seatingChart = value;
          break;
      }
    });
    
    venues.push(venue);
  }
  
  return venues;
};

// Convert parsed data to Venue objects
export const createVenueFromImport = (importData: any): Venue => {
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    name: importData.name,
    address: importData.address,
    capacity: importData.capacity,
    type: importData.type,
    coordinates: {
      lat: importData.latitude || 0,
      lng: importData.longitude || 0
    },
    amenities: importData.amenities || [],
    seatingChart: importData.seatingChart || ''
  };
};