export const toggleDriverOnline = async (driverId) => {
  return {
    id: driverId,
    name: 'Ravi Kumar',
    isOnline: true,
    autoAcceptEnabled: true,
    autoAcceptRules: {
      minFare: 200,
      maxDistanceKm: 10,
      pickupDistanceKm: 3,
      preferredAreas: ['Banaswadi', 'HRBR', 'Kalyan Nagar']
    }
  };
};

export const acceptTrip = async (tripId, driverId) => {
  return {
    message: 'Trip accepted successfully',
    trip: {
      id: tripId,
      customerName: 'Demo Customer',
      driverId,
      status: 'accepted'
    }
  };
};

export const rejectTrip = async (tripId) => {
  return {
    message: 'Trip rejected successfully',
    trip: {
      id: tripId,
      customerName: 'Demo Customer',
      status: 'cancelled'
    }
  };
};
