// Event Utility Functions
// Handles event deduplication, validation, and data processing

import type { Event } from '../types';

export interface DuplicateMatch {
  event: Event;
  matchScore: number;
  matchReasons: string[];
}

// Intelligente Duplikat-Erkennung für Events
export const detectDuplicateEvents = (events: Event[]): Event[] => {
  const uniqueEvents: Event[] = [];
  const duplicates: { original: Event; duplicate: Event; score: number }[] = [];

  events.forEach(event => {
    const duplicateMatch = findDuplicateMatch(event, uniqueEvents);
    
    if (duplicateMatch) {
      duplicates.push({
        original: duplicateMatch.event,
        duplicate: event,
        score: duplicateMatch.matchScore
      });
      
      // Behalte das Event mit mehr Daten oder das neuere
      if (shouldReplaceEvent(duplicateMatch.event, event)) {
        const index = uniqueEvents.findIndex(e => e.id === duplicateMatch.event.id);
        uniqueEvents[index] = event;
      }
    } else {
      uniqueEvents.push(event);
    }
  });

  if (duplicates.length > 0) {
    console.log('🔍 Duplikate erkannt und entfernt:', duplicates);
  }

  return uniqueEvents;
};

// Finde Duplikat-Match für ein Event
export const findDuplicateMatch = (event: Event, existingEvents: Event[]): DuplicateMatch | null => {
  for (const existing of existingEvents) {
    const matchScore = calculateEventSimilarity(event, existing);
    
    if (matchScore >= 80) { // 80% Ähnlichkeit = Duplikat
      const matchReasons = getMatchReasons(event, existing);
      return {
        event: existing,
        matchScore,
        matchReasons
      };
    }
  }
  
  return null;
};

// Berechne Ähnlichkeit zwischen zwei Events (0-100)
export const calculateEventSimilarity = (event1: Event, event2: Event): number => {
  let score = 0;
  let maxScore = 0;

  // Titel-Ähnlichkeit (40% Gewichtung)
  const titleSimilarity = calculateStringSimilarity(event1.title, event2.title);
  score += titleSimilarity * 0.4;
  maxScore += 40;

  // Datum-Ähnlichkeit (25% Gewichtung)
  if (event1.date === event2.date) {
    score += 25;
  } else {
    const dateDiff = Math.abs(new Date(event1.date).getTime() - new Date(event2.date).getTime());
    const daysDiff = dateDiff / (1000 * 60 * 60 * 24);
    if (daysDiff <= 1) score += 20; // Gleicher oder nächster Tag
    else if (daysDiff <= 7) score += 10; // Gleiche Woche
  }
  maxScore += 25;

  // Venue-Ähnlichkeit (25% Gewichtung)
  const venueSimilarity = calculateVenueSimilarity(event1.venue, event2.venue);
  score += venueSimilarity * 0.25;
  maxScore += 25;

  // Zeit-Ähnlichkeit (10% Gewichtung)
  if (event1.time === event2.time) {
    score += 10;
  } else if (event1.time && event2.time) {
    const timeDiff = Math.abs(
      parseTime(event1.time) - parseTime(event2.time)
    );
    if (timeDiff <= 60) score += 8; // Innerhalb 1 Stunde
    else if (timeDiff <= 180) score += 5; // Innerhalb 3 Stunden
  }
  maxScore += 10;

  return (score / maxScore) * 100;
};

// String-Ähnlichkeit berechnen (Levenshtein-basiert)
export const calculateStringSimilarity = (str1: string, str2: string): number => {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  if (s1 === s2) return 100;
  
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  if (longer.length === 0) return 100;
  
  const distance = levenshteinDistance(longer, shorter);
  return ((longer.length - distance) / longer.length) * 100;
};

// Venue-Ähnlichkeit berechnen
export const calculateVenueSimilarity = (venue1: any, venue2: any): number => {
  let score = 0;
  
  // Name-Ähnlichkeit (60%)
  const nameSimilarity = calculateStringSimilarity(venue1.name, venue2.name);
  score += nameSimilarity * 0.6;
  
  // Adress-Ähnlichkeit (40%)
  const addressSimilarity = calculateStringSimilarity(venue1.address, venue2.address);
  score += addressSimilarity * 0.4;
  
  return score;
};

// Levenshtein-Distanz berechnen
const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
};

// Zeit in Minuten seit Mitternacht parsen
const parseTime = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

// Match-Gründe ermitteln
export const getMatchReasons = (event1: Event, event2: Event): string[] => {
  const reasons: string[] = [];
  
  if (calculateStringSimilarity(event1.title, event2.title) >= 90) {
    reasons.push('Identischer oder sehr ähnlicher Titel');
  }
  
  if (event1.date === event2.date) {
    reasons.push('Gleiches Datum');
  }
  
  if (calculateVenueSimilarity(event1.venue, event2.venue) >= 90) {
    reasons.push('Gleiche oder sehr ähnliche Venue');
  }
  
  if (event1.time === event2.time) {
    reasons.push('Gleiche Uhrzeit');
  }
  
  if (event1.organizer?.name && event2.organizer?.name && 
      calculateStringSimilarity(event1.organizer.name, event2.organizer.name) >= 90) {
    reasons.push('Gleicher Veranstalter');
  }
  
  return reasons;
};

// Entscheide, welches Event behalten werden soll
export const shouldReplaceEvent = (existing: Event, newEvent: Event): boolean => {
  // Behalte das Event mit mehr Daten
  const existingDataScore = getEventDataCompleteness(existing);
  const newDataScore = getEventDataCompleteness(newEvent);
  
  if (newDataScore > existingDataScore) return true;
  
  // Bei gleicher Datenvollständigkeit, behalte das neuere
  if (newDataScore === existingDataScore) {
    return new Date(newEvent.updatedAt) > new Date(existing.updatedAt);
  }
  
  return false;
};

// Bewerte Datenvollständigkeit eines Events (0-100)
export const getEventDataCompleteness = (event: Event): number => {
  let score = 0;
  
  // Basis-Daten (40 Punkte)
  if (event.title) score += 10;
  if (event.description) score += 10;
  if (event.date) score += 10;
  if (event.time) score += 10;
  
  // Venue-Daten (20 Punkte)
  if (event.venue.name) score += 5;
  if (event.venue.address) score += 5;
  if (event.venue.capacity > 0) score += 5;
  if (event.venue.amenities.length > 0) score += 5;
  
  // Ticket-Kategorien (20 Punkte)
  if (event.ticketCategories.length > 0) score += 10;
  if (event.ticketCategories.some(cat => cat.description)) score += 5;
  if (event.ticketCategories.some(cat => cat.benefits.length > 0)) score += 5;
  
  // Zusätzliche Daten (20 Punkte)
  if (event.images.length > 0) score += 5;
  if (event.tags.length > 0) score += 5;
  if (event.organizer?.name) score += 5;
  if (event.category) score += 5;
  
  return score;
};

// Validiere Event-Daten
export const validateEventData = (event: Partial<Event>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!event.title?.trim()) errors.push('Event-Titel ist erforderlich');
  if (!event.date) errors.push('Event-Datum ist erforderlich');
  if (!event.time) errors.push('Event-Uhrzeit ist erforderlich');
  if (!event.venue?.name?.trim()) errors.push('Venue-Name ist erforderlich');
  if (!event.venue?.address?.trim()) errors.push('Venue-Adresse ist erforderlich');
  if (!event.ticketCategories || event.ticketCategories.length === 0) {
    errors.push('Mindestens eine Ticket-Kategorie ist erforderlich');
  }
  
  // Validiere Ticket-Kategorien
  event.ticketCategories?.forEach((category, index) => {
    if (!category.name?.trim()) errors.push(`Ticket-Kategorie ${index + 1}: Name ist erforderlich`);
    if (!category.price || category.price <= 0) errors.push(`Ticket-Kategorie ${index + 1}: Gültiger Preis erforderlich`);
    if (!category.capacity || category.capacity <= 0) errors.push(`Ticket-Kategorie ${index + 1}: Gültige Kapazität erforderlich`);
  });
  
  // Validiere Datum (nicht in der Vergangenheit für neue Events)
  if (event.date && new Date(event.date) < new Date()) {
    errors.push('Event-Datum darf nicht in der Vergangenheit liegen');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Event-Status basierend auf Datum automatisch setzen
export const getEventStatusByDate = (eventDate: string): Event['status'] => {
  const now = new Date();
  const eventDateTime = new Date(eventDate);
  
  if (eventDateTime < now) {
    return 'completed';
  } else {
    return 'published';
  }
};

// Events nach geografischen Kriterien sortieren
export const sortEventsByLocation = (events: Event[], sortBy: 'city' | 'state' | 'region' | 'county' | 'zipCode'): Event[] => {
  return [...events].sort((a, b) => {
    let valueA = '';
    let valueB = '';
    
    switch (sortBy) {
      case 'city':
        valueA = a.venue.geographic?.city || a.venue.address.split(',')[1]?.trim() || '';
        valueB = b.venue.geographic?.city || b.venue.address.split(',')[1]?.trim() || '';
        break;
      case 'state':
        valueA = a.venue.geographic?.state || '';
        valueB = b.venue.geographic?.state || '';
        break;
      case 'region':
        valueA = a.venue.geographic?.region || '';
        valueB = b.venue.geographic?.region || '';
        break;
      case 'county':
        valueA = a.venue.geographic?.county || '';
        valueB = b.venue.geographic?.county || '';
        break;
      case 'zipCode':
        valueA = a.venue.geographic?.zipCode || '';
        valueB = b.venue.geographic?.zipCode || '';
        break;
    }
    
    return valueA.localeCompare(valueB);
  });
};

// Event-Duplikate in Array entfernen
export const removeDuplicateEvents = (events: Event[]): Event[] => {
  return detectDuplicateEvents(events);
};