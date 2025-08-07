interface ParsedLocation {
  street?: string;
  city: string;
  state: string;
  zipCode?: string;
  county?: string;
  country: string;
  region?: string;
  timezone?: string;
}

interface SEOLocation {
  primaryLocation: string;
  secondaryLocation: string;
  locationKeywords: string[];
  nearbyLandmarks?: string[];
}

// Geographic regions mapping
const US_REGIONS = {
  'Northeast': ['ME', 'NH', 'VT', 'MA', 'RI', 'CT', 'NY', 'NJ', 'PA'],
  'Southeast': ['DE', 'MD', 'DC', 'VA', 'WV', 'KY', 'TN', 'NC', 'SC', 'GA', 'FL', 'AL', 'MS', 'AR', 'LA'],
  'Midwest': ['OH', 'MI', 'IN', 'WI', 'IL', 'MN', 'IA', 'MO', 'ND', 'SD', 'NE', 'KS'],
  'Southwest': ['TX', 'OK', 'NM', 'AZ'],
  'West': ['MT', 'WY', 'CO', 'UT', 'ID', 'WA', 'OR', 'NV', 'CA', 'AK', 'HI']
};

// Major metropolitan areas
const METRO_AREAS = {
  'New York': ['New York', 'NYC', 'Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'],
  'Los Angeles': ['Los Angeles', 'LA', 'Hollywood', 'Beverly Hills', 'Santa Monica'],
  'Chicago': ['Chicago', 'Windy City'],
  'Houston': ['Houston', 'Space City'],
  'Phoenix': ['Phoenix', 'Scottsdale', 'Tempe'],
  'Philadelphia': ['Philadelphia', 'Philly'],
  'San Antonio': ['San Antonio'],
  'San Diego': ['San Diego'],
  'Dallas': ['Dallas', 'Plano', 'Irving'],
  'San Jose': ['San Jose', 'Silicon Valley'],
  'Austin': ['Austin'],
  'Jacksonville': ['Jacksonville'],
  'Fort Worth': ['Fort Worth'],
  'Columbus': ['Columbus'],
  'Charlotte': ['Charlotte'],
  'San Francisco': ['San Francisco', 'SF', 'Bay Area'],
  'Indianapolis': ['Indianapolis', 'Indy'],
  'Seattle': ['Seattle', 'Emerald City'],
  'Denver': ['Denver', 'Mile High City'],
  'Washington': ['Washington', 'DC', 'Washington DC'],
  'Boston': ['Boston', 'Beantown'],
  'El Paso': ['El Paso'],
  'Nashville': ['Nashville', 'Music City'],
  'Detroit': ['Detroit', 'Motor City'],
  'Oklahoma City': ['Oklahoma City', 'OKC'],
  'Portland': ['Portland'],
  'Las Vegas': ['Las Vegas', 'Vegas', 'Sin City'],
  'Memphis': ['Memphis'],
  'Louisville': ['Louisville'],
  'Baltimore': ['Baltimore'],
  'Milwaukee': ['Milwaukee'],
  'Albuquerque': ['Albuquerque'],
  'Tucson': ['Tucson'],
  'Fresno': ['Fresno'],
  'Sacramento': ['Sacramento'],
  'Mesa': ['Mesa'],
  'Kansas City': ['Kansas City', 'KC'],
  'Atlanta': ['Atlanta', 'ATL'],
  'Long Beach': ['Long Beach'],
  'Colorado Springs': ['Colorado Springs'],
  'Raleigh': ['Raleigh'],
  'Miami': ['Miami', 'Magic City'],
  'Virginia Beach': ['Virginia Beach'],
  'Omaha': ['Omaha'],
  'Oakland': ['Oakland'],
  'Minneapolis': ['Minneapolis', 'Twin Cities'],
  'Tulsa': ['Tulsa'],
  'Arlington': ['Arlington'],
  'Tampa': ['Tampa'],
  'New Orleans': ['New Orleans', 'NOLA', 'Big Easy']
};

// County data for major cities (simplified)
const CITY_COUNTIES = {
  'New York': 'New York County',
  'Los Angeles': 'Los Angeles County',
  'Chicago': 'Cook County',
  'Houston': 'Harris County',
  'Phoenix': 'Maricopa County',
  'Philadelphia': 'Philadelphia County',
  'San Antonio': 'Bexar County',
  'San Diego': 'San Diego County',
  'Dallas': 'Dallas County',
  'San Jose': 'Santa Clara County',
  'Austin': 'Travis County',
  'Jacksonville': 'Duval County',
  'Fort Worth': 'Tarrant County',
  'Columbus': 'Franklin County',
  'Charlotte': 'Mecklenburg County',
  'San Francisco': 'San Francisco County',
  'Indianapolis': 'Marion County',
  'Seattle': 'King County',
  'Denver': 'Denver County',
  'Washington': 'District of Columbia',
  'Boston': 'Suffolk County',
  'El Paso': 'El Paso County',
  'Nashville': 'Davidson County',
  'Detroit': 'Wayne County',
  'Oklahoma City': 'Oklahoma County',
  'Portland': 'Multnomah County',
  'Las Vegas': 'Clark County',
  'Memphis': 'Shelby County',
  'Louisville': 'Jefferson County',
  'Baltimore': 'Baltimore City',
  'Milwaukee': 'Milwaukee County',
  'Albuquerque': 'Bernalillo County',
  'Tucson': 'Pima County',
  'Fresno': 'Fresno County',
  'Sacramento': 'Sacramento County',
  'Mesa': 'Maricopa County',
  'Kansas City': 'Jackson County',
  'Atlanta': 'Fulton County',
  'Long Beach': 'Los Angeles County',
  'Colorado Springs': 'El Paso County',
  'Raleigh': 'Wake County',
  'Miami': 'Miami-Dade County',
  'Virginia Beach': 'Virginia Beach City',
  'Omaha': 'Douglas County',
  'Oakland': 'Alameda County',
  'Minneapolis': 'Hennepin County',
  'Tulsa': 'Tulsa County',
  'Arlington': 'Tarrant County',
  'Tampa': 'Hillsborough County',
  'New Orleans': 'Orleans Parish'
};

// Timezone mapping
const STATE_TIMEZONES = {
  'CA': 'America/Los_Angeles',
  'NY': 'America/New_York',
  'TX': 'America/Chicago',
  'FL': 'America/New_York',
  'IL': 'America/Chicago',
  'PA': 'America/New_York',
  'OH': 'America/New_York',
  'GA': 'America/New_York',
  'NC': 'America/New_York',
  'MI': 'America/New_York',
  'NJ': 'America/New_York',
  'VA': 'America/New_York',
  'WA': 'America/Los_Angeles',
  'AZ': 'America/Phoenix',
  'MA': 'America/New_York',
  'TN': 'America/Chicago',
  'IN': 'America/New_York',
  'MO': 'America/Chicago',
  'MD': 'America/New_York',
  'WI': 'America/Chicago',
  'CO': 'America/Denver',
  'MN': 'America/Chicago',
  'SC': 'America/New_York',
  'AL': 'America/Chicago',
  'LA': 'America/Chicago',
  'KY': 'America/New_York',
  'OR': 'America/Los_Angeles',
  'OK': 'America/Chicago',
  'CT': 'America/New_York',
  'UT': 'America/Denver',
  'IA': 'America/Chicago',
  'NV': 'America/Los_Angeles',
  'AR': 'America/Chicago',
  'MS': 'America/Chicago',
  'KS': 'America/Chicago',
  'NM': 'America/Denver',
  'NE': 'America/Chicago',
  'WV': 'America/New_York',
  'ID': 'America/Boise',
  'HI': 'Pacific/Honolulu',
  'NH': 'America/New_York',
  'ME': 'America/New_York',
  'RI': 'America/New_York',
  'MT': 'America/Denver',
  'DE': 'America/New_York',
  'SD': 'America/Chicago',
  'ND': 'America/Chicago',
  'AK': 'America/Anchorage',
  'DC': 'America/New_York',
  'VT': 'America/New_York',
  'WY': 'America/Denver'
};

export function parseAddress(address: string): ParsedLocation {
  // Clean and split address
  const parts = address.split(',').map(part => part.trim());
  
  let street = '';
  let city = '';
  let state = '';
  let zipCode = '';
  let country = 'United States';
  
  if (parts.length >= 2) {
    // Last part might contain state and zip
    const lastPart = parts[parts.length - 1];
    const stateZipMatch = lastPart.match(/([A-Z]{2})\s*(\d{5}(-\d{4})?)?/);
    
    if (stateZipMatch) {
      state = stateZipMatch[1];
      zipCode = stateZipMatch[2] || '';
      
      // City is the second to last part
      if (parts.length >= 2) {
        city = parts[parts.length - 2];
      }
      
      // Street is everything before city
      if (parts.length >= 3) {
        street = parts.slice(0, -2).join(', ');
      }
    } else {
      // Fallback parsing
      city = parts[parts.length - 1];
      if (parts.length >= 2) {
        state = parts[parts.length - 2];
      }
      if (parts.length >= 3) {
        street = parts.slice(0, -2).join(', ');
      }
    }
  }
  
  // Determine region
  const region = Object.keys(US_REGIONS).find(regionName => 
    US_REGIONS[regionName as keyof typeof US_REGIONS].includes(state)
  );
  
  // Get county
  const county = CITY_COUNTIES[city as keyof typeof CITY_COUNTIES];
  
  // Get timezone
  const timezone = STATE_TIMEZONES[state as keyof typeof STATE_TIMEZONES] || 'America/New_York';
  
  return {
    street: street || undefined,
    city,
    state,
    zipCode: zipCode || undefined,
    county: county || undefined,
    country,
    region: region || undefined,
    timezone
  };
}

export function generateSEOLocation(parsedLocation: ParsedLocation, venueName: string): SEOLocation {
  const { city, state, county, region } = parsedLocation;
  
  // Primary location for main SEO
  const primaryLocation = `${city}, ${state}`;
  
  // Secondary location for additional context
  const secondaryLocation = county ? `${county}, ${state}` : `${region || 'United States'}`;
  
  // Generate location keywords
  const locationKeywords = [
    city.toLowerCase(),
    state.toLowerCase(),
    `${city.toLowerCase()} ${state.toLowerCase()}`,
    `events in ${city.toLowerCase()}`,
    `${city.toLowerCase()} events`,
    `tickets ${city.toLowerCase()}`,
    `${city.toLowerCase()} tickets`,
    `concerts ${city.toLowerCase()}`,
    `${city.toLowerCase()} concerts`
  ];
  
  // Add county keywords if available
  if (county) {
    locationKeywords.push(
      county.toLowerCase(),
      `${county.toLowerCase()} events`,
      `events in ${county.toLowerCase()}`
    );
  }
  
  // Add region keywords if available
  if (region) {
    locationKeywords.push(
      region.toLowerCase(),
      `${region.toLowerCase()} events`,
      `events in ${region.toLowerCase()}`
    );
  }
  
  // Add metro area keywords
  const metroArea = Object.keys(METRO_AREAS).find(metro => 
    METRO_AREAS[metro as keyof typeof METRO_AREAS].some(alias => 
      city.toLowerCase().includes(alias.toLowerCase())
    )
  );
  
  if (metroArea) {
    locationKeywords.push(
      metroArea.toLowerCase(),
      `${metroArea.toLowerCase()} events`,
      `events in ${metroArea.toLowerCase()}`
    );
  }
  
  // Generate nearby landmarks (simplified)
  const nearbyLandmarks = [];
  if (city.toLowerCase().includes('new york')) {
    nearbyLandmarks.push('Times Square', 'Central Park', 'Broadway', 'Manhattan');
  } else if (city.toLowerCase().includes('los angeles')) {
    nearbyLandmarks.push('Hollywood', 'Beverly Hills', 'Santa Monica', 'Downtown LA');
  } else if (city.toLowerCase().includes('chicago')) {
    nearbyLandmarks.push('Millennium Park', 'Navy Pier', 'The Loop', 'Magnificent Mile');
  } else if (city.toLowerCase().includes('san francisco')) {
    nearbyLandmarks.push('Golden Gate Bridge', 'Fisherman\'s Wharf', 'Union Square', 'Chinatown');
  }
  
  return {
    primaryLocation,
    secondaryLocation,
    locationKeywords: [...new Set(locationKeywords)], // Remove duplicates
    nearbyLandmarks: nearbyLandmarks.length > 0 ? nearbyLandmarks : undefined
  };
}

export function enhanceVenueWithLocation(venue: any) {
  const parsedLocation = parseAddress(venue.address);
  const seoLocation = generateSEOLocation(parsedLocation, venue.name);
  
  return {
    ...venue,
    geographic: parsedLocation,
    seoLocation
  };
}