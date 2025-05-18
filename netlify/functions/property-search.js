exports.handler = async (event) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // Parse query parameters
    const params = JSON.parse(event.body);
    const { destination, checkIn, checkOut, guests = 2 } = params;

    if (!destination) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Destination is required' }),
      };
    }

    // For now, return mock data
    const results = getMockResults(destination);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        results,
        source: 'Mock Data (In production, this would be from real APIs)',
      }),
    };
  } catch (error) {
    console.error('Property search error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Failed to search properties' }),
    };
  }
};

// Mock data function
function getMockResults(destination) {
  // Create property variations based on destination
  return [
    {
      id: 'prop-1',
      name: `Luxury ${destination} Resort`,
      location: {
        city: destination,
        address: '123 Ocean Drive',
        coordinates: [8.3405, 115.0920], // Random coordinates
      },
      price: {
        amount: 215,
        currency: 'USD',
        perNight: true,
      },
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd',
      ],
      rating: 4.8,
      reviewCount: 356,
      amenities: ['Pool', 'WiFi', 'AC', 'Beach Access', 'Restaurant'],
      description: `Luxury resort with stunning views in ${destination}. Perfect for a relaxing vacation.`,
      source: 'booking.com',
      propertyType: 'Resort',
      vacationStyles: ['Beach', 'Relaxation', 'Luxury'],
    },
    {
      id: 'prop-2',
      name: `Downtown ${destination} Boutique Hotel`,
      location: {
        city: destination,
        address: '456 Main Street',
        coordinates: [8.3932, 115.1892], // Random coordinates
      },
      price: {
        amount: 175,
        currency: 'USD',
        perNight: true,
      },
      images: [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427',
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a',
      ],
      rating: 4.6,
      reviewCount: 285,
      amenities: ['WiFi', 'AC', 'City View', 'Restaurant', 'Bar'],
      description: `Stylish boutique hotel in the heart of ${destination}. Walking distance to main attractions.`,
      source: 'expedia.com',
      propertyType: 'Hotel',
      vacationStyles: ['City Exploration', 'Culture', 'Nightlife'],
    },
    {
      id: 'prop-3',
      name: `${destination} Mountain Cabin`,
      location: {
        city: destination,
        address: '789 Mountain Road',
        coordinates: [8.4212, 115.2542], // Random coordinates
      },
      price: {
        amount: 120,
        currency: 'USD',
        perNight: true,
      },
      images: [
        'https://images.unsplash.com/photo-1510798831971-661eb04b3739',
        'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e',
      ],
      rating: 4.7,
      reviewCount: 192,
      amenities: ['Fireplace', 'WiFi', 'Mountain View', 'Kitchen', 'Parking'],
      description: `Charming cabin with beautiful mountain views in ${destination}. Perfect for a nature retreat.`,
      source: 'airbnb.com',
      propertyType: 'Cabin',
      vacationStyles: ['Nature', 'Adventure', 'Romantic'],
    },
    {
      id: 'prop-4',
      name: `Budget-Friendly ${destination} Apartment`,
      location: {
        city: destination,
        address: '101 Traveler Street',
        coordinates: [8.3645, 115.1524], // Random coordinates
      },
      price: {
        amount: 85,
        currency: 'USD',
        perNight: true,
      },
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
      ],
      rating: 4.3,
      reviewCount: 167,
      amenities: ['WiFi', 'Kitchen', 'Washing Machine', 'City Access', 'Public Transport'],
      description: `Comfortable and affordable apartment in ${destination}. Great for budget travelers.`,
      source: 'vrbo.com',
      propertyType: 'Apartment',
      vacationStyles: ['Budget', 'Long-term', 'Digital Nomad'],
    },
    {
      id: 'prop-5',
      name: `Historic ${destination} Guesthouse`,
      location: {
        city: destination,
        address: '222 Heritage Lane',
        coordinates: [8.3789, 115.1678], // Random coordinates
      },
      price: {
        amount: 140,
        currency: 'USD',
        perNight: true,
      },
      images: [
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7',
      ],
      rating: 4.9,
      reviewCount: 213,
      amenities: ['Breakfast', 'Garden', 'WiFi', 'Historic Building', 'Tours'],
      description: `Charming historic guesthouse in ${destination}. Experience authentic local culture.`,
      source: 'booking.com',
      propertyType: 'Guesthouse',
      vacationStyles: ['Cultural', 'Historic', 'Authentic'],
    },
    {
      id: 'prop-6',
      name: `${destination} Family Villa`,
      location: {
        city: destination,
        address: '333 Family Circle',
        coordinates: [8.4011, 115.2104], // Random coordinates
      },
      price: {
        amount: 250,
        currency: 'USD',
        perNight: true,
      },
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
      ],
      rating: 4.7,
      reviewCount: 178,
      amenities: ['Pool', 'Garden', 'WiFi', 'Kitchen', 'Parking', 'Games Room'],
      description: `Spacious villa in ${destination} perfect for families. Plenty of space and entertainment for all ages.`,
      source: 'airbnb.com',
      propertyType: 'Villa',
      vacationStyles: ['Family', 'Group', 'Relaxation'],
    }
  ];
}
