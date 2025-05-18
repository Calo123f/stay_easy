'use client';

import { useState, useEffect } from 'react';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
  });

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get URL parameters if any
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const destination = urlParams.get('destination');
      
      if (destination) {
        setSearchParams(prev => ({
          ...prev,
          destination
        }));
        
        // Automatically search if destination is provided
        handleSearch({ destination });
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (params = searchParams) => {
    setLoading(true);
    setError(null);
    
    try {
      // Call the Netlify function using fetch
      const response = await fetch('/.netlify/functions/property-search', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      
      const data = await response.json();
      setProperties(data.results || []);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">Find Your Perfect Stay</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Where to?</label>
                <input
                  type="text"
                  name="destination"
                  value={searchParams.destination}
                  onChange={handleInputChange}
                  placeholder="Destinations, cities, or properties"
                  className="w-full rounded-md border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                <input
                  type="date"
                  name="checkIn"
                  value={searchParams.checkIn}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                <input
                  type="date"
                  name="checkOut"
                  value={searchParams.checkOut}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="mt-4 flex items-end justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                <select
                  name="guests"
                  value={searchParams.guests}
                  onChange={handleInputChange}
                  className="rounded-md border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>{num} Guest{num !== 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={() => handleSearch()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition-colors"
              >
                Search
              </button>
              </div>
          </div>
        </div>
      </div>
      
      {/* Search Results */}
      <div className="container mx-auto px-4 py-8">
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}
        
        {!loading && !error && properties.length === 0 && searchParams.destination && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No properties found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or exploring a different destination.</p>
          </div>
        )}
        
        {!loading && !error && properties.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              {properties.length} properties found in {searchParams.destination}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <img 
                      src={property.images[0]} 
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                    {property.source && (
                      <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        {property.source}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{property.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{property.location.city}, {property.location.address}</p>
                    
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <span className="text-gray-700 ml-1">{property.rating}</span>
                      </div>
                      <span className="text-gray-500 text-sm ml-2">({property.reviewCount} reviews)</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {property.amenities.slice(0, 3).map((amenity, i) => (
                        <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          {amenity}
                        </span>
                      ))}
                      {property.amenities.length > 3 && (
                        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          +{property.amenities.length - 3}
                        </span>
                      )}
                    </div>
                    
                    {property.vacationStyles && property.vacationStyles.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-600 mb-1">Perfect for:</p>
                        <div className="flex flex-wrap gap-1">
                          {property.vacationStyles.map((style, i) => (
                            <span key={i} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                              {style}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-end mt-4">
                      <div>
                        <span className="text-xl font-bold">${property.price.amount}</span>
                        <span className="text-gray-600 text-sm ml-1">
                          {property.price.perNight ? '/night' : 'total'}
                        </span>
                      </div>
                      
                      <a 
                        href={`/property/${property.id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded transition-colors"
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
