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
