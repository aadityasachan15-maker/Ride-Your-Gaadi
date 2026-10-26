import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateFare, estimateRouteMetrics } from './fareCalculator.ts';

test('calculateFare returns correct base calculation with no extras', () => {
  const result = calculateFare({
    baseFare: 5.0,
    perKmRate: 1.5,
    distanceKm: 10,
    donationSelected: false,
    refreshments: [],
  });

  // rawFare = 5 + (1.5 * 10) = 20.0
  // serviceFee = 1.5
  // finalTotal = 20.0 + 1.5 = 21.5
  assert.equal(result.rideFare, 20.0);
  assert.equal(result.discountAmount, 0);
  assert.equal(result.donationAmount, 0);
  assert.equal(result.refreshmentsTotal, 0);
  assert.equal(result.finalTotal, 21.5);
});

test('calculateFare applies SARAH_AIRPORT promo code (25% off)', () => {
  const result = calculateFare({
    baseFare: 10.0,
    perKmRate: 2.0,
    distanceKm: 15,
    promoCode: 'SARAH_AIRPORT',
    donationSelected: false,
    refreshments: [],
  });

  // rawFare = 10 + 30 = 40.0
  // discount = 25% of 40 = 10.0
  // subtotal = 30.0
  // serviceFee = 1.5
  // finalTotal = 31.5
  assert.equal(result.rideFare, 40.0);
  assert.equal(result.discountAmount, 10.0);
  assert.equal(result.subtotalAfterDiscount, 30.0);
  assert.equal(result.finalTotal, 31.5);
});

test('calculateFare includes donations and refreshments', () => {
  const result = calculateFare({
    baseFare: 5.0,
    perKmRate: 1.0,
    distanceKm: 5,
    donationSelected: true,
    donationAmount: 1.0,
    refreshments: [
      {
        item: {
          id: 'ref1',
          name: 'CyberEnergy Nitro',
          category: 'drink',
          price: 3.5,
          description: 'Drink',
          iconName: 'Zap',
        },
        quantity: 2,
      },
      {
        item: {
          id: 'ref2',
          name: 'Spring Water',
          category: 'drink',
          price: 2.0,
          description: 'Water',
          iconName: 'Droplet',
        },
        quantity: 1,
      },
    ],
  });

  // rideFare = 5 + 5 = 10.0
  // refreshments = (3.5 * 2) + (2.0 * 1) = 9.0
  // donation = 1.0
  // service fee = 1.5
  // total = 10.0 + 1.0 + 9.0 + 1.5 = 21.5
  assert.equal(result.rideFare, 10.0);
  assert.equal(result.refreshmentsTotal, 9.0);
  assert.equal(result.donationAmount, 1.0);
  assert.equal(result.finalTotal, 21.5);
});

test('estimateRouteMetrics detects airport routes', () => {
  const route = estimateRouteMetrics('Downtown Center', 'International Airport Terminal 3');
  assert.equal(route.distanceKm, 18.5);
  assert.equal(route.durationMinutes, 24);
});
