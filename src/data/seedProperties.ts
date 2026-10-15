import { Property, User } from '../types';

export const INITIAL_USER: User = {
  id: 'user_vance',
  name: 'Alexandra Vance',
  email: 'alexandra@vance-holdings.com',
  phone: '+1 (305) 555-8921',
  role: 'VIP Member',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  createdAt: '2024-01-15'
};

export const SEED_PROPERTIES: Property[] = [
  {
    id: 'prop-oceanfront-masterpiece',
    title: 'Oceanfront Masterpiece',
    price: 24500000,
    location: 'Miami, Florida',
    city: 'Miami',
    country: 'United States',
    category: 'House',
    beds: 6,
    baths: 7,
    sqft: 8500,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80'
    ],
    description: 'A striking contemporary architectural marvel commanding prime frontage on Biscayne Bay. Designed with cantilevered glass terraces, an infinity-edge salt pool extending over the private coastline, and motorized floor-to-ceiling glass systems that dissolve the line between curated interior grandeur and sunset sea vistas.',
    features: [
      'Private Deepwater Yacht Slip',
      'Cantilevered Infinity Edge Pool',
      'Sub-Zero & Gaggenau Chef Kitchen',
      'Climate-Controlled 1,000 Bottle Wine Vault',
      'Rooftop Stargazing Sky Lounge',
      'Automated Crestron Smart Residence',
      'Private 4-Car Climate Showroom'
    ],
    featured: true,
    isExclusive: true,
    ownerId: 'user_vance',
    ownerName: 'Alexandra Vance',
    ownerEmail: 'alexandra@vance-holdings.com',
    createdAt: '2025-02-10'
  },
  {
    id: 'prop-skyline-penthouse',
    title: 'Skyline Penthouse',
    price: 18750000,
    location: 'Dubai, UAE',
    city: 'Dubai',
    country: 'United Arab Emirates',
    category: 'Apartment',
    beds: 4,
    baths: 5,
    sqft: 6200,
    image: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80'
    ],
    description: 'Perched in the upper aerie of Downtown Dubai, this dual-level trophy penthouse delivers uninhibited 360-degree panoramas of the iconic city skyline and Arabian Gulf waters. Features custom Italian marble finishes, internal biometric elevator access, and a private sky pool terrace.',
    features: [
      'Private Glass-Bottom Sky Pool',
      'Direct Biometric Private Elevator',
      'Double-Height 24ft Ceilings',
      'Full Burj Khalifa Panoramic View',
      '24/7 Dedicated White-Glove Concierge',
      'Private Wellness Spa & Sauna Suite',
      'Bespoke Minotti Interior Package'
    ],
    featured: true,
    isExclusive: true,
    ownerId: 'user_admin',
    ownerName: 'Lord Sterling',
    ownerEmail: 'sterling@fortvide.com',
    createdAt: '2025-02-14'
  },
  {
    id: 'prop-tropical-paradise-villa',
    title: 'Tropical Paradise Villa',
    price: 7850000,
    location: 'Bali, Indonesia',
    city: 'Uluwatu',
    country: 'Indonesia',
    category: 'House',
    beds: 5,
    baths: 6,
    sqft: 7100,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80'
    ],
    description: 'Carved seamlessly into the dramatic cliffs of Uluwatu, this biophilic sanctuary harmonizes sustainably sourced teak, natural volcanic stone, and cascading waterfalls. Surrounded by private tropical jungle canopies with unimpeded horizon vistas of the Indian Ocean.',
    features: [
      'Cliffside 30-Meter Lap Pool',
      'Open-Air Pavilion Living Rooms',
      'Traditional Ayurvedic Private Spa',
      'Direct Private Beach Funicular Access',
      'Organic Tropical Permaculture Gardens',
      'Solar-Powered Net-Zero Architecture'
    ],
    featured: true,
    isExclusive: true,
    ownerId: 'user_vance',
    ownerName: 'Alexandra Vance',
    ownerEmail: 'alexandra@vance-holdings.com',
    createdAt: '2025-02-18'
  },
  {
    id: 'prop-mayfair-duplex',
    title: 'Mayfair Heritage Duplex',
    price: 21000000,
    location: 'London, United Kingdom',
    city: 'London',
    country: 'United Kingdom',
    category: 'Apartment',
    beds: 4,
    baths: 5,
    sqft: 5400,
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80'
    ],
    description: 'An impeccably restored Grade II listed Georgian mansion residence situated on Mayfair’s most prestigious garden square. Blending ornate 18th-century plasterwork and chevron parquet floors with discrete contemporary luxury amenities.',
    features: [
      'Private Mews House Car Parking',
      'Exclusive Resident Garden Square Access',
      'Library with Antique Wood Burning Hearth',
      'Temperature Controlled Sommelier Cellar',
      '24/7 Security & Uniformed Doorman'
    ],
    featured: false,
    isExclusive: true,
    ownerId: 'user_admin',
    ownerName: 'Lord Sterling',
    ownerEmail: 'sterling@fortvide.com',
    createdAt: '2025-01-28'
  },
  {
    id: 'prop-monaco-penthouse',
    title: 'Monaco Harbor Grand Suite',
    price: 31500000,
    location: 'Monte Carlo, Monaco',
    city: 'Monaco',
    country: 'Monaco',
    category: 'Apartment',
    beds: 3,
    baths: 4,
    sqft: 4900,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1600&q=80'
    ],
    description: 'Commanding front-row box seats over Port Hercules and the Mediterranean Sea. Floor-to-ceiling glass terraces offer unobstructed race viewing for the Monaco Grand Prix alongside ultra-high-spec sound insulation and security.',
    features: [
      'Full Formula 1 Port Hercules Track View',
      'Private Helipad Landing Privileges',
      'Calacatta Viola Stone Kitchen Island',
      'Dual Sub-Penthouse Private Parking Bays',
      'Private Steam Room & Plunge Bath'
    ],
    featured: false,
    isExclusive: true,
    ownerId: 'user_vance',
    ownerName: 'Alexandra Vance',
    ownerEmail: 'alexandra@vance-holdings.com',
    createdAt: '2025-02-05'
  },
  {
    id: 'prop-lake-como-plot',
    title: 'The Peak Architectural Plot',
    price: 14200000,
    location: 'Lake Como, Italy',
    city: 'Bellagio',
    country: 'Italy',
    category: 'Plot',
    beds: 0,
    baths: 0,
    sqft: 45000,
    plotSqft: 45000,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80'
    ],
    description: 'An exceptional 1.03-acre promontory estate plot with pre-approved architectural blueprints for a 12,000 sq ft modernist villa by Pritzker-prize winning architects. Enjoys 280-degree unobstructed vistas across Lake Como with direct lake frontage rights and private boat dock permit.',
    features: [
      'Approved UNESCO Boundary Building Permits',
      'Direct Shoreline Private Boat Dock Rights',
      'Existing Olive & Cypress Grove Sanctuary',
      'Engineered Helicopter Pad Pad Clearance',
      'Geothermal Well Connection Ready'
    ],
    featured: false,
    isExclusive: true,
    ownerId: 'user_admin',
    ownerName: 'Lord Sterling',
    ownerEmail: 'sterling@fortvide.com',
    createdAt: '2025-01-20'
  },
  {
    id: 'prop-cap-dantibes-plot',
    title: "Cap d'Antibes Coastal Estate Plot",
    price: 19800000,
    location: 'French Riviera, France',
    city: 'Antibes',
    country: 'France',
    category: 'Plot',
    beds: 0,
    baths: 0,
    sqft: 68000,
    plotSqft: 68000,
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80'
    ],
    description: 'One of the final untouched prime coastal headlands on the prestigious Cap d’Antibes. 1.56 acres of gently sloping Mediterranean pine grounds touching the azure coastline with permits for a luxury residential compound and private security gatehouse.',
    features: [
      'Rare 1.56 Acre Waterfront Acreage',
      'South-West Facing Sunset Orientation',
      'Approved Multi-Structure Estate Envelope',
      'Century-Old Umbrella Pine Canopy',
      'Private Direct Sea Trail'
    ],
    featured: false,
    isExclusive: true,
    ownerId: 'user_vance',
    ownerName: 'Alexandra Vance',
    ownerEmail: 'alexandra@vance-holdings.com',
    createdAt: '2025-02-01'
  },
  {
    id: 'prop-beverly-hills-chateau',
    title: 'Bel Air Modern Chateau',
    price: 32000000,
    location: 'Los Angeles, California',
    city: 'Bel Air',
    country: 'United States',
    category: 'House',
    beds: 7,
    baths: 9,
    sqft: 12400,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80'
    ],
    description: 'Set behind guarded double gates in prestigious Bel Air, this estate boasts panoramic canyon and city-to-ocean vistas. Features a 16-seat Dolby Atmos screening room, 5,000 sq ft subterranean entertainment gallery, tennis court, and zero-edge ozone pool.',
    features: [
      'Regulation Championship Tennis Court',
      '16-Seat Dolby Atmos Cinema Pavilion',
      'Zero-Edge Dual Level Ozone Pool',
      'Subterranean 10-Car Gallery Showroom',
      'Commercial Grade Secondary Catering Kitchen'
    ],
    featured: false,
    isExclusive: true,
    ownerId: 'user_vance',
    ownerName: 'Alexandra Vance',
    ownerEmail: 'alexandra@vance-holdings.com',
    createdAt: '2025-01-10'
  },
  {
    id: 'prop-aspen-crest',
    title: 'Aspen Crest Alpine Lodge',
    price: 16900000,
    location: 'Aspen, Colorado',
    city: 'Aspen',
    country: 'United States',
    category: 'House',
    beds: 6,
    baths: 7,
    sqft: 9200,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80'
    ],
    description: 'Ski-in / ski-out mountain architectural tour-de-force on Red Mountain. Soaring Douglas fir timber frames, floor-to-ceiling glass overlooking Ajax Mountain, heated outdoor stone terraces with hot tubs and fire pits, and a dedicated equipment locker with boot warmers.',
    features: [
      'Direct Ski-In / Ski-Out Trail Access',
      'Custom Copper Fireplace Centrepiece',
      'Heated Slate Driveway & Courtyard',
      'Commercial Heated Ski Lounge & Boot Dryers',
      'Cedar Barrel Outdoor Sauna'
    ],
    featured: false,
    isExclusive: true,
    ownerId: 'user_admin',
    ownerName: 'Lord Sterling',
    ownerEmail: 'sterling@fortvide.com',
    createdAt: '2025-01-18'
  }
];

export const PRESET_IMAGE_OPTIONS = [
  { label: 'Modern Oceanfront Villa', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80' },
  { label: 'High-Rise Glass Penthouse', url: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Tropical Modern Sanctuary', url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Heritage Grand Mansion', url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Bel Air Modern Chateau', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Scenic Estate Land / Plot', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Alpine Luxury Lodge', url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Cap d’Antibes Coast Plot', url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=80' }
];
