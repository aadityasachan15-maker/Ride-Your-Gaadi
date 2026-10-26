export type VehicleCategory = 'ecovolt' | 'cybersedan' | 'stealthsuv' | 'hyperglide';

export interface Cab {
  id: string;
  name: string;
  category: VehicleCategory;
  tagline: string;
  baseFare: number;
  perKmRate: number;
  capacity: number;
  etaMinutes: number;
  distanceKm: number;
  rating: number;
  driverName: string;
  driverPhone: string;
  driverPhoto: string;
  driverRating: number;
  driverTotalTrips: number;
  plateNumber: string;
  acceleration: string;
  securityLevel: string;
  image: string;
  available: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface RefreshmentItem {
  id: string;
  name: string;
  category: 'drink' | 'snack' | 'gadget';
  price: number;
  description: string;
  iconName: string;
}

export interface PromoCode {
  code: string;
  discountPercent?: number;
  flatDiscount?: number;
  description: string;
  minFare?: number;
}

export type RideStatus = 'requested' | 'assigned' | 'driver_arriving' | 'in_transit' | 'completed' | 'cancelled';

export interface RideBooking {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  pickup: string;
  pickupCoords: { lat: number; lng: number };
  destination: string;
  destCoords: { lat: number; lng: number };
  cabId: string;
  cab: Cab;
  distanceKm: number;
  durationMinutes: number;
  basePrice: number;
  discountApplied: number;
  promoCode?: string;
  donationAmount: number;
  refreshments: {
    item: RefreshmentItem;
    quantity: number;
  }[];
  totalPrice: number;
  paymentMethod: 'wallet' | 'card' | 'upi' | 'cash';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  status: RideStatus;
  createdAt: string;
  currentProgressPercent: number;
  speedKmh: number;
  rating?: number;
  feedback?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'passenger' | 'driver' | 'admin';
  walletBalance: number;
  avatar: string;
  savedAddresses: {
    label: string;
    address: string;
  }[];
  paymentMethods: {
    id: string;
    type: 'card' | 'upi' | 'wallet';
    label: string;
    last4?: string;
    isDefault: boolean;
  }[];
}

export interface KanbanColumn {
  id: string;
  title: string;
  status: RideStatus;
  accentColor: string;
}
