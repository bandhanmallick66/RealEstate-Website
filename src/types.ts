export type PropertyCategory = 'House' | 'Apartment' | 'Plot';

export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  city: string;
  country: string;
  category: PropertyCategory;
  beds: number;
  baths: number;
  sqft: number;
  plotSqft?: number;
  image: string;
  gallery: string[];
  description: string;
  features: string[];
  featured?: boolean;
  isExclusive?: boolean;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Client' | 'Investor' | 'Property Owner' | 'VIP Member';
  avatar?: string;
  createdAt: string;
}

export type ViewingType = 'in-person' | 'virtual';

export interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyPrice: number;
  propertyImage: string;
  propertyCategory: PropertyCategory;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  date: string;
  timeSlot: string;
  viewingType: ViewingType;
  notes?: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export type ActiveSection = 'home' | 'properties' | 'add-property' | 'dashboard';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  isDocDownload?: boolean;
  docTitle?: string;
}
