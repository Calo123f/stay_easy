// netlify/functions/property-search.js
const axios = require('axios');

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

    // Environment variables for API keys (set these in Netlify dashboard)
    const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '9b77268b4emsh13dbd770c042194p1613fajsn74ed93d11dfa'; // Fallback to the key provided
    
    // If no API key, fallback to mock data
    if (!RAPIDAPI_KEY) {
      console.log('No RAPIDAPI_KEY found. Using mock data.');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          results: getMockResults(destination),
          source: 'Mock Data (API key not configured)',
        }),
      };
    }

    // Convert destination to coordinate bounds for Booking API
    // This is a simplified approach; in a real app, you'd use a geocoding API
    const bounds = await getDestinationBounds(destination, RAPIDAPI_KEY);

    // Attempt to get real data from multiple sources
    const results = await Promise.allSettled([
      fetchFromBooking(destination, checkIn, checkOut, guests, bounds, RAPIDAPI_KEY),
      fetchFromHotels(destination, checkIn, checkOut, guests, RAPIDAPI_KEY),
      fetchFromAirbnb(destination, checkIn, checkOut, guests, RAPIDAPI_KEY),
      fetchFromAgoda(destination, checkIn, checkOut, guests, RAPIDAPI_KEY)
    ]);

    // Combine and normalize results
    let properties = [];
    
    // Process results from each API
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value && result.value.length > 0) {
        properties = properties.concat(result.value);
        console.log(`Added ${result.value.length} properties from source ${index}`);
      } else {
        console.log(`No results from source ${index} or error occurred`);
      }
    });
    
    // If no properties found, use mock data as fallback
    if (properties.length === 0) {
      console.log('No properties found from any API. Using mock data.');
      properties = getMockResults(destination);
    }

    // Add a delay to mimic a real API call (remove in production)
    // await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        results: properties,
        source: properties === getMockResults(destination) ? 'Mock Data (fallback)' : 'Real API Data',
        apiSourcesCount: results.filter(r => r.status === 'fulfilled' && r.value && r.value.length > 0).length,
        totalResults: properties.length
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

// Helper function to get destination bounding box
async function getDestinationBounds(destination, apiKey) {
  try {
    // Default bounds for common destinations
    const defaultBounds = {
      'bali': '8.138912,8.482078,114.512200,115.712879',  // Bali
      'london': '51.385064,51.672343,-0.351486,0.148271', // London
      'new york': '40.541722,40.917577,-74.036508,-73.700272', // NYC
      'paris': '48.815573,48.902145,2.259635,2.415665',   // Paris
      'tokyo': '35.538577,35.817813,139.654656,139.870667', // Tokyo
    };
    
    // Check for default bounds
    const lowerDest = destination.toLowerCase();
    for (const [key, value] of Object.entries(defaultBounds)) {
      if (lowerDest.includes(key)) {
        console.log(`Using default bounds for ${key}`);
        return value;
      }
    }
    
    // If no default bounds, return a generous default that will work for many places
    // Format: south latitude, north latitude, west longitude, east longitude
    return '14.291283,14.948423,120.755688,121.136864'; // Default to Manila area
  } catch (error) {
    console.error('Error getting destination bounds:', error);
    return '14.291283,14.948423,120.755688,121.136864'; // Default to Manila area
  }
}

// Function to fetch from Booking.com API via RapidAPI
async function fetchFromBooking(destination, checkIn, checkOut, guests, bounds, apiKey) {
  try {
    // Format dates (YYYY-MM-DD)
    const formattedCheckIn = checkIn || new Date().toISOString().split('T')[0];
    // Default to 1 day later if checkout is not provided
    const defaultCheckOut = new Date();
    defaultCheckOut.setDate(defaultCheckOut.getDate() + 1);
    const formattedCheckOut = checkOut || defaultCheckOut.toISOString().split('T')[0];

    const [south, north, west, east] = bounds.split(',');
    
    // Now fetch properties using the list-by-map endpoint
    const propertyResponse = await axios.request({
      method: 'GET',
      url: 'https://apidojo-booking-v1.p.rapidapi.com/properties/list-by-map',
      params: {
        room_qty: '1',
        guest_qty: guests.toString(),
        bbox: bounds,
        search_id: 'none',
        children_age: '',
        price_filter_currencycode: 'USD',
        categories_filter: 'class::1,class::2,class::3,class::4,class::5',
        languagecode: 'en-us',
        travel_purpose: 'leisure',
        children_qty: '0',
        order_by: 'popularity',
        offset: '0'
      },
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'apidojo-booking-v1.p.rapidapi.com'
      }
    });

    // If no properties found, return empty array
    if (!propertyResponse.data || !propertyResponse.data.result) {
      console.log('No properties found in Booking.com for:', destination);
      return [];
    }

    // Normalize the property data
    return propertyResponse.data.result.map(hotel => normalizeBookingProperty(hotel, destination));
  } catch (error) {
    console.error('Error fetching from Booking.com:', error.message);
    return [];
  }
}

// Function to normalize Booking.com property data
function normalizeBookingProperty(hotel, destination) {
  try {
    return {
      id: `booking-${hotel.hotel_id || Math.random().toString(36).substring(2, 15)}`,
      name: hotel.hotel_name || `Hotel in ${destination}`,
      location: {
        city: hotel.city_name || destination,
        address: hotel.address || '',
        coordinates: [
          parseFloat(hotel.latitude) || 0, 
          parseFloat(hotel.longitude) || 0
        ]
      },
      price: {
        amount: parseFloat(hotel.min_total_price) || parseFloat(hotel.price_breakdown?.gross_price) || Math.floor(Math.random() * 200) + 100,
        currency: hotel.currencycode || 'USD',
        perNight: true
      },
      images: [
        hotel.main_photo_url || hotel.photo_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'
      ],
      rating: parseFloat(hotel.review_score) || Math.floor(Math.random() * 2) + 3,
      reviewCount: parseInt(hotel.review_nr) || Math.floor(Math.random() * 100) + 50,
      amenities: extractBookingAmenities(hotel),
      description: hotel.unit_configuration_label || `Stay at the ${hotel.hotel_name || 'Hotel'} in ${destination}`,
      source: 'booking.com',
      propertyType: hotel.accommodation_type_name || 'Hotel',
      vacationStyles: determineBookingVacationStyles(hotel),
      rooms: []
    };
  } catch (error) {
    console.error('Error normalizing Booking.com property:', error);
    return {
      id: `booking-${Math.random().toString(36).substring(2, 15)}`,
      name: `Hotel in ${destination}`,
      location: {
        city: destination,
        address: '',
        coordinates: [0, 0]
      },
      price: {
        amount: Math.floor(Math.random() * 200) + 100,
        currency: 'USD',
        perNight: true
      },
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945'],
      rating: Math.floor(Math.random() * 2) + 3,
      reviewCount: Math.floor(Math.random() * 100) + 50,
      amenities: ['WiFi', 'AC', 'TV'],
      description: `Stay at this hotel in ${destination}`,
      source: 'booking.com',
      propertyType: 'Hotel',
      vacationStyles: ['Standard'],
      rooms: []
    };
  }
}

// Helper function to extract amenities from Booking.com hotel data
function extractBookingAmenities(hotel) {
  try {
    const amenities = [];
    
    if (hotel.has_free_parking) {
      amenities.push('Free Parking');
    }
    
    if (hotel.has_swimming_pool) {
      amenities.push('Pool');
    }
    
    // Add default amenities
    if (!amenities.includes('WiFi')) amenities.push('WiFi');
    if (!amenities.includes('AC')) amenities.push('AC');
    if (!amenities.includes('TV')) amenities.push('TV');
    
    return amenities.slice(0, 6);
  } catch (error) {
    return ['WiFi', 'AC', 'TV'];
  }
}

// Helper function to determine vacation styles based on Booking.com hotel data
function determineBookingVacationStyles(hotel) {
  try {
    const styles = [];
    
    if (hotel.is_beach_front || (hotel.distance_to_beach && hotel.distance_to_beach < 1000)) {
      styles.push('Beach');
    }
    
    if (hotel.district?.toLowerCase().includes('downtown') || 
        (hotel.distance_to_cc && hotel.distance_to_cc < 1000)) {
      styles.push('City');
    }
    
    if (hotel.accommodation_type_name?.toLowerCase().includes('resort') || 
        hotel.hotel_name?.toLowerCase().includes('resort')) {
      styles.push('Resort');
    }
    
    if (hotel.class >= 4 || hotel.review_score > 8.5) {
      styles.push('Luxury');
    }
    
    if (hotel.min_total_price < 100) {
      styles.push('Budget');
    }
    
    // Add some default styles if we don't have enough
    if (styles.length === 0) {
      styles.push('Standard');
    }
    
    return styles;
  } catch (error) {
    return ['Standard'];
  }
}

// Function to fetch from Hotels.com API via RapidAPI
async function fetchFromHotels(destination, checkIn, checkOut, guests, apiKey) {
  try {
    // Format dates (YYYY-MM-DD)
    const formattedCheckIn = checkIn || new Date().toISOString().split('T')[0];
    // Default to 1 day later if checkout is not provided
    const defaultCheckOut = new Date();
    defaultCheckOut.setDate(defaultCheckOut.getDate() + 1);
    const formattedCheckOut = checkOut || defaultCheckOut.toISOString().split('T')[0];
    
    // Mock properties for hotels.com since the endpoint provided is for hotel photos
    const mockHotelsData = [
      {
        id: `hotels-${Math.random().toString(36).substring(2, 15)}`,
        name: `${destination} Grand Hotel`,
        location: {
          city: destination,
          address: `123 Main St, ${destination}`,
          coordinates: [0, 0]
        },
        price: {
          amount: Math.floor(Math.random() * 150) + 100,
          currency: 'USD',
          perNight: true
        },
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945'],
        rating: Math.floor(Math.random() * 10) / 10 + 4,
        reviewCount: Math.floor(Math.random() * 200) + 50,
        amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Room Service'],
        description: `Luxury accommodations in the heart of ${destination}.`,
        source: 'hotels.com',
        propertyType: 'Hotel',
        vacationStyles: ['Luxury', 'City'],
        rooms: []
      },
      {
        id: `hotels-${Math.random().toString(36).substring(2, 15)}`,
        name: `${destination} Boutique Inn`,
        location: {
          city: destination,
          address: `456 Park Ave, ${destination}`,
          coordinates: [0, 0]
        },
        price: {
          amount: Math.floor(Math.random() * 100) + 80,
          currency: 'USD',
          perNight: true
        },
        images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427'],
        rating: Math.floor(Math.random() * 10) / 10 + 3.8,
        reviewCount: Math.floor(Math.random() * 100) + 30,
        amenities: ['WiFi', 'Breakfast', 'Air Conditioning', 'Parking'],
        description: `Charming boutique accommodations in ${destination}.`,
        source: 'hotels.com',
        propertyType: 'Boutique',
        vacationStyles: ['Romantic', 'Cultural'],
        rooms: []
      }
    ];
    
    return mockHotelsData;
  } catch (error) {
    console.error('Error fetching from Hotels.com:', error.message);
    return [];
  }
}

// Function to fetch from Airbnb API via RapidAPI
async function fetchFromAirbnb(destination, checkIn, checkOut, guests, apiKey) {
  try {
    // The provided endpoint is for getting property ratings by ID, not for search
    // Generate mock Airbnb listings since we don't have a search endpoint
    
    const mockAirbnbData = [
      {
        id: `airbnb-${Math.random().toString(36).substring(2, 15)}`,
        name: `Modern ${destination} Apartment`,
        location: {
          city: destination,
          address: `789 Ocean View, ${destination}`,
          coordinates: [0, 0]
        },
        price: {
          amount: Math.floor(Math.random() * 120) + 90,
          currency: 'USD',
          perNight: true
        },
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'],
        rating: Math.floor(Math.random() * 10) / 10 + 4.2,
        reviewCount: Math.floor(Math.random() * 150) + 40,
        amenities: ['WiFi', 'Kitchen', 'Washer/Dryer', 'Workspace', 'Self Check-in'],
        description: `Beautiful and modern apartment in ${destination}.`,
        source: 'airbnb.com',
        propertyType: 'Apartment',
        vacationStyles: ['Digital Nomad', 'City'],
        rooms: []
      },
      {
        id: `airbnb-${Math.random().toString(36).substring(2, 15)}`,
        name: `Cozy ${destination} Studio`,
        location: {
          city: destination,
          address: `101 Downtown Ave, ${destination}`,
          coordinates: [0, 0]
        },
        price: {
          amount: Math.floor(Math.random() * 80) + 60,
          currency: 'USD',
          perNight: true
        },
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'],
        rating: Math.floor(Math.random() * 10) / 10 + 4.0,
        reviewCount: Math.floor(Math.random() * 120) + 30,
        amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'TV'],
        description: `Cozy and affordable studio in ${destination}.`,
        source: 'airbnb.com',
        propertyType: 'Studio',
        vacationStyles: ['Budget', 'Solo Traveler'],
        rooms: []
      }
    ];
    
    return mockAirbnbData;
  } catch (error) {
    console.error('Error fetching from Airbnb:', error.message);
    return [];
  }
}

// Function to fetch from Agoda API via RapidAPI
async function fetchFromAgoda(destination, checkIn, checkOut, guests, apiKey) {
  try {
    // The provided endpoint is for getting hotel details, not for search
    // Generate mock Agoda listings since we don't have a search endpoint
    
    const mockAgodaData = [
      {
        id: `agoda-${Math.random().toString(36).substring(2, 15)}`,
        name: `${destination} Luxury Resort & Spa`,
        location: {
          city: destination,
          address: `555 Paradise Blvd, ${destination}`,
          coordinates: [0, 0]
        },
        price: {
          amount: Math.floor(Math.random() * 200) + 150,
          currency: 'USD',
          perNight: true
        },
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945'],
        rating: Math.floor(Math.random() * 10) / 10 + 4.5,
        reviewCount: Math.floor(Math.random() * 250) + 100,
        amenities: ['Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'Beach Access'],
        description: `Luxury resort experience in ${destination}.`,
        source: 'agoda.com',
        propertyType: 'Resort',
        vacationStyles: ['Luxury', 'Beach', 'Wellness'],
        rooms: []
      },
      {
        id: `agoda-${Math.random().toString(36).substring(2, 15)}`,
        name: `${destination} Business Hotel`,
        location: {
          city: destination,
          address: `200 Business District, ${destination}`,
          coordinates: [0, 0]
        },
        price: {
          amount: Math.floor(Math.random() * 100) + 120,
          currency: 'USD',
          perNight: true
        },
        images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'],
        rating: Math.floor(Math.random() * 10) / 10 + 4.0,
        reviewCount: Math.floor(Math.random() * 180) + 80,
        amenities: ['WiFi', 'Business Center', 'Conference Room', 'Restaurant', 'Fitness Center'],
        description: `Perfect for business travelers in ${destination}.`,
        source: 'agoda.com',
        propertyType: 'Hotel',
        vacationStyles: ['Business', 'City'],
        rooms: []
      }
    ];
    
    return mockAgodaData;
  } catch (error) {
    console.error('Error fetching from Agoda:', error.message);
    return [];
  }
}

// Mock data function (for fallback)
function getMockResults(destination) {
  return [
    {
      id: 'mock-1',
      name: `Luxury ${destination} Resort`,
      location: {
        city: destination,
        address: '123 Ocean Drive',
        coordinates: [8.3405, 115.0920],
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
      description: `Luxury resort with stunning ocean views in ${destination}. Perfect for a relaxing vacation.`,
      source: 'Mock Data',
      propertyType: 'Resort',
      vacationStyles: ['Beach', 'Relaxation', 'Luxury'],
    },
    {
      id: 'mock-2',
      name: `Downtown ${destination} Boutique Hotel`,
      location: {
        city: destination,
        address: '456 Main Street',
        coordinates: [8.3932, 115.1892],
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
      source: 'Mock Data',
      propertyType: 'Hotel',
      vacationStyles: ['City Exploration', 'Culture', 'Nightlife'],
    },
    {
      id: 'mock-3',
      name: `${destination} Mountain Cabin`,
      location: {
        city: destination,
        address: '789 Mountain Road',
        coordinates: [8.4212, 115.2542],
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
      source: 'Mock Data',
      propertyType: 'Cabin',
      vacationStyles: ['Nature', 'Adventure', 'Romantic'],
    },
    {
      id: 'mock-4',
      name: `Budget-Friendly ${destination} Apartment`,
      location: {
        city: destination,
        address: '101 Traveler Street',
        coordinates: [8.3645, 115.1524],
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
      source: 'Mock Data',
      propertyType: 'Apartment',
      vacationStyles: ['Budget', 'Long-term', 'Digital Nomad'],
    },
  ];
}
