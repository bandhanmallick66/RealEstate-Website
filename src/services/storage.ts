import { Property, User, Booking } from '../types';
import { SEED_PROPERTIES, INITIAL_USER } from '../data/seedProperties';

const KEYS = {
  PROPERTIES: 'fortvide_properties_v2',
  USERS: 'fortvide_users_v2',
  CURRENT_USER: 'fortvide_current_user_v2',
  BOOKINGS: 'fortvide_bookings_v2',
  FAVORITES: 'fortvide_favorites_v2'
};

// Seed Bookings for initial user demo
const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'book-1',
    propertyId: 'prop-oceanfront-masterpiece',
    propertyTitle: 'Oceanfront Masterpiece',
    propertyLocation: 'Miami, Florida',
    propertyPrice: 24500000,
    propertyImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
    propertyCategory: 'House',
    userId: INITIAL_USER.id,
    userName: INITIAL_USER.name,
    userEmail: INITIAL_USER.email,
    userPhone: INITIAL_USER.phone,
    date: '2026-10-15',
    timeSlot: '14:00 (Afternoon Private Tour)',
    viewingType: 'in-person',
    notes: 'Private yacht arrival at Biscayne Bay slip requested.',
    status: 'Confirmed',
    createdAt: '2025-02-12'
  }
];

export const StorageService = {
  // Properties
  getProperties(): Property[] {
    try {
      const data = localStorage.getItem(KEYS.PROPERTIES);
      if (!data) {
        localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(SEED_PROPERTIES));
        return SEED_PROPERTIES;
      }
      return JSON.parse(data);
    } catch {
      return SEED_PROPERTIES;
    }
  },

  getPropertyById(id: string): Property | undefined {
    const list = this.getProperties();
    return list.find(p => p.id === id);
  },

  addProperty(property: Omit<Property, 'id' | 'createdAt'>): Property {
    const properties = this.getProperties();
    const newProperty: Property = {
      ...property,
      id: 'prop-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newProperty, ...properties];
    localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(updated));
    window.dispatchEvent(new Event('fortvide_properties_changed'));
    return newProperty;
  },

  updateProperty(id: string, updates: Partial<Property>): Property | null {
    const properties = this.getProperties();
    const index = properties.findIndex(p => p.id === id);
    if (index === -1) return null;

    const updatedProperty = { ...properties[index], ...updates };
    properties[index] = updatedProperty;
    localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(properties));
    window.dispatchEvent(new Event('fortvide_properties_changed'));
    return updatedProperty;
  },

  deleteProperty(id: string): boolean {
    const properties = this.getProperties();
    const filtered = properties.filter(p => p.id !== id);
    if (filtered.length === properties.length) return false;

    localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(filtered));
    window.dispatchEvent(new Event('fortvide_properties_changed'));
    return true;
  },

  // Users & Auth
  getUsers(): User[] {
    try {
      const data = localStorage.getItem(KEYS.USERS);
      if (!data) {
        const initial = [
          INITIAL_USER,
          {
            id: 'user_admin',
            name: 'Lord Sterling',
            email: 'sterling@fortvide.com',
            phone: '+44 20 7946 0912',
            role: 'Investor' as const,
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
            createdAt: '2023-11-01'
          }
        ];
        localStorage.setItem(KEYS.USERS, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(data);
    } catch {
      return [INITIAL_USER];
    }
  },

  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(KEYS.CURRENT_USER);
      if (!data) {
        // default to INITIAL_USER logged in for instant demonstration
        localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(INITIAL_USER));
        return INITIAL_USER;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_USER;
    }
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.CURRENT_USER);
    }
    window.dispatchEvent(new Event('fortvide_auth_changed'));
  },

  registerUser(name: string, email: string, phone: string, role: User['role'] = 'VIP Member'): User {
    const users = this.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      this.setCurrentUser(existing);
      return existing;
    }

    const newUser: User = {
      id: 'user_' + Date.now(),
      name,
      email,
      phone: phone || '+1 (555) 000-0000',
      role,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updated = [...users, newUser];
    localStorage.setItem(KEYS.USERS, JSON.stringify(updated));
    this.setCurrentUser(newUser);
    return newUser;
  },

  loginUser(email: string): User | null {
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      this.setCurrentUser(user);
      return user;
    }
    // Auto-create if new email to ensure seamless testing
    const created = this.registerUser(email.split('@')[0], email, '+1 (555) 0198');
    return created;
  },

  logoutUser(): void {
    this.setCurrentUser(null);
  },

  // Bookings (Viewing requests)
  getBookings(): Booking[] {
    try {
      const data = localStorage.getItem(KEYS.BOOKINGS);
      if (!data) {
        localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
        return INITIAL_BOOKINGS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_BOOKINGS;
    }
  },

  getUserBookings(userId: string): Booking[] {
    const all = this.getBookings();
    return all.filter(b => b.userId === userId);
  },

  addBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>): Booking {
    const all = this.getBookings();
    const newBooking: Booking = {
      ...bookingData,
      id: 'book-' + Date.now(),
      status: 'Confirmed',
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newBooking, ...all];
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(updated));
    window.dispatchEvent(new Event('fortvide_bookings_changed'));
    return newBooking;
  },

  cancelBooking(id: string): boolean {
    const all = this.getBookings();
    const index = all.findIndex(b => b.id === id);
    if (index === -1) return false;
    all[index].status = 'Cancelled';
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(all));
    window.dispatchEvent(new Event('fortvide_bookings_changed'));
    return true;
  },

  // Favorites
  getFavorites(): string[] {
    try {
      const data = localStorage.getItem(KEYS.FAVORITES);
      if (!data) {
        const initial = ['prop-oceanfront-masterpiece', 'prop-skyline-penthouse'];
        localStorage.setItem(KEYS.FAVORITES, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  toggleFavorite(propertyId: string): boolean {
    const favs = this.getFavorites();
    const isFav = favs.includes(propertyId);
    let updated: string[];
    if (isFav) {
      updated = favs.filter(id => id !== propertyId);
    } else {
      updated = [...favs, propertyId];
    }
    localStorage.setItem(KEYS.FAVORITES, JSON.stringify(updated));
    window.dispatchEvent(new Event('fortvide_favorites_changed'));
    return !isFav;
  }
};
