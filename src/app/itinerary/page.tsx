'use client';

import { useState } from 'react';

export default function ItineraryPage() {
  const [itinerary, setItinerary] = useState({
    title: 'My Trip',
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 2,
    days: []
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItinerary(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleStartPlanningClick = () => {
    if (!itinerary.destination || !itinerary.startDate || !itinerary.endDate) {
      alert('Please fill in all required fields.');
      return;
    }
    
    // Calculate number of days
    const start = new Date(itinerary.startDate);
    const end = new Date(itinerary.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Generate empty days
    const days = Array.from({ length: diffDays }, (_, i) => {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      
      return {
        date: date.toISOString().split('T')[0],
        items: []
      };
    });
    
    setItinerary(prev => ({
      ...prev,
      days
    }));
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Plan Your Perfect Trip</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Create a detailed itinerary with accommodations, activities, and transportation.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Start Your Itinerary</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Itinerary Title</label>
              <input
                type="text"
                name="title"
                value={itinerary.title}
                onChange={handleInputChange}
                placeholder="e.g., Summer Vacation 2025"
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <input
                type="text"
                name="destination"
                value={itinerary.destination}
                onChange={handleInputChange}
                placeholder="e.g., Tokyo, Japan"
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={itinerary.startDate}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={itinerary.endDate}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Travelers</label>
              <select
                name="travelers"
                value={itinerary.travelers}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>{num} Traveler{num !== 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={handleStartPlanningClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition-colors"
            >
              Start Planning
            </button>
            
            {itinerary.days.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Your {itinerary.days.length}-day Itinerary</h3>
                
                <div className="space-y-4">
                  {itinerary.days.map((day, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-semibold">Day {index + 1}: {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</h4>
                      
                      {day.items.length === 0 ? (
                        <p className="text-gray-500 text-sm mt-2">No activities planned yet. Click "Add Activity" to get started.</p>
                      ) : (
                        <div className="mt-2">
                          {/* Activities would be listed here */}
                        </div>
                      )}
                      
                      <button className="mt-2 text-blue-600 text-sm hover:underline">
                        + Add Activity
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors">
                    Save Itinerary
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
