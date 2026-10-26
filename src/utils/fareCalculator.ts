import { PromoCode, RefreshmentItem } from '../types/index.ts';

export const PROMO_CODES: Record<string, PromoCode> = {
  SARAH_AIRPORT: {
    code: 'SARAH_AIRPORT',
    discountPercent: 25,
    description: 'Sarah\'s Urgent Airport Rush perk - 25% OFF',
    minFare: 10,
  },
  NEXTGEN50: {
    code: 'NEXTGEN50',
    discountPercent: 50,
    description: 'Welcome Next-Gen 50% OFF (up to $15)',
    minFare: 12,
  },
  FUTURE10: {
    code: 'FUTURE10',
    flatDiscount: 5,
    description: 'Special $5 Off Future Rides',
    minFare: 15,
  },
  ECOGREEN: {
    code: 'ECOGREEN',
    discountPercent: 15,
    description: '15% Off Green Eco Rides',
    minFare: 8,
  },
};

export interface FareCalculationInput {
  baseFare: number;
  perKmRate: number;
  distanceKm: number;
  promoCode?: string;
  donationSelected: boolean;
  donationAmount?: number;
  refreshments: {
    item: RefreshmentItem;
    quantity: number;
  }[];
}

export interface FareBreakdown {
  rideFare: number;
  discountAmount: number;
  subtotalAfterDiscount: number;
  donationAmount: number;
  refreshmentsTotal: number;
  serviceFee: number;
  finalTotal: number;
  appliedPromo?: PromoCode;
}

/**
 * Calculates complete fare breakdown with transparent pricing, promo codes, donations, and refreshments
 */
export function calculateFare(input: FareCalculationInput): FareBreakdown {
  const rawFare = input.baseFare + (input.perKmRate * Math.max(1, input.distanceKm));
  const rideFare = Math.round(rawFare * 100) / 100;

  let discountAmount = 0;
  let appliedPromo: PromoCode | undefined;

  if (input.promoCode) {
    const promo = PROMO_CODES[input.promoCode.trim().toUpperCase()];
    if (promo && (!promo.minFare || rideFare >= promo.minFare)) {
      appliedPromo = promo;
      if (promo.discountPercent) {
        let calc = (rideFare * promo.discountPercent) / 100;
        if (promo.code === 'NEXTGEN50') {
          calc = Math.min(calc, 15); // cap at 15
        }
        discountAmount = Math.round(calc * 100) / 100;
      } else if (promo.flatDiscount) {
        discountAmount = Math.min(rideFare, promo.flatDiscount);
      }
    }
  }

  const subtotalAfterDiscount = Math.max(0, Math.round((rideFare - discountAmount) * 100) / 100);
  const donationAmount = input.donationSelected ? (input.donationAmount ?? 1.0) : 0;

  const refreshmentsTotal = input.refreshments.reduce((acc, curr) => {
    return acc + (curr.item.price * Math.max(0, curr.quantity));
  }, 0);
  const roundedRefreshments = Math.round(refreshmentsTotal * 100) / 100;

  // Modest fixed platform fee
  const serviceFee = 1.5;

  const finalTotal = Math.round((subtotalAfterDiscount + donationAmount + roundedRefreshments + serviceFee) * 100) / 100;

  return {
    rideFare,
    discountAmount,
    subtotalAfterDiscount,
    donationAmount,
    refreshmentsTotal: roundedRefreshments,
    serviceFee,
    finalTotal,
    appliedPromo,
  };
}

/**
 * Computes simulated distance and duration based on popular locations or generic input
 */
export function estimateRouteMetrics(pickup: string, destination: string): { distanceKm: number; durationMinutes: number } {
  const text = `${pickup.toLowerCase()} -> ${destination.toLowerCase()}`;

  if (text.includes('airport')) {
    // Airport is typically 18.5 km, ~24 mins
    return { distanceKm: 18.5, durationMinutes: 24 };
  }
  if (text.includes('station') || text.includes('railway')) {
    return { distanceKm: 7.2, durationMinutes: 14 };
  }
  if (text.includes('mall') || text.includes('center') || text.includes('downtown')) {
    return { distanceKm: 5.4, durationMinutes: 11 };
  }
  if (text.includes('tech') || text.includes('cyber')) {
    return { distanceKm: 11.0, durationMinutes: 18 };
  }

  // Hash-based deterministic distance for custom addresses
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  const dist = 4 + (Math.abs(hash) % 150) / 10; // 4.0km - 19.0km
  const duration = Math.round(dist * 1.5 + 3);

  return {
    distanceKm: Math.round(dist * 10) / 10,
    durationMinutes: duration,
  };
}
