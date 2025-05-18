'use client';

import { useState, useEffect } from 'react';

export default function PropertyPage({ params }) {
  const { id } = params;
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we simulate fetching property details
    const fetchPropertyDetails = async () => {
      setLoading(true);
      
      try {
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Create mock property data
        const mockProperty = {
          id,
          name: `Luxury Beach Resort (ID: ${id})`,
          location: {
            city: 'Bali',
            address: '123 Ocean Drive, Seminyak',
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
            'https://images.unsplash.com/photo-1573843981267-be1999ff37cd',
            'https://images.unsplash.com/photo-1582719508461-905c673771fd',
          ],
          rating: 4.8,
          reviewCount: 356,
          amenities: ['Pool', 'WiFi', 'AC', 'Beach Access', 'Restaurant', 'Spa', 'Gym', 'Room Service'],
          description: 'This luxury beachfront resort offers stunning ocean views, world-class amenities, and exceptional service. Perfect for a relaxing tropical getaway. The property is just steps away from the pristine beach and features multiple swimming pools, fine dining restaurants, and a full-service spa.',
          source: 'booking.com',
          propertyType: 'Resort',
          vacationStyles: ['Beach', 'Relaxation', 'Luxury'],
          rooms: [
            {
              type: 'Deluxe Ocean View',
              price: 215,
              description: 'Spacious room with direct ocean views',
              beds: '1 King Bed',
              occupancy: 2,
              available: true
            },
            {
              type: 'Premium Suite',
              price: 350,
              description: 'Luxury suite with separate living area',
              beds: '1 King Bed',
              occupancy: 2,
              available: true
            },
            {
              type: 'Family Suite',
              price: 450,
              description: 'Large suite suitable for families',
              beds: '1 King Bed + 2 Single Beds',
              occupancy: 4,
              available: false
            }
          ],
          reviews: [
            {
              author: 'Sarah M.',
              rating: 5,
              date: '2024-11-15',
              comment: 'Absolutely stunning resort with impeccable service. The views were breathtaking and the staff went above and beyond. Highly recommend!'
            },
            {
              author: 'Michael T.',
              rating: 4,
              date: '2024-10-22',
              comment: 'Great location and beautiful property. The rooms were spacious and clean. Only downside was the restaurant being a bit pricey.'
            },
            {
              author: 'Jennifer K.',
              rating: 5,
              date: '2024-09-30',
              comment: 'Perfect stay from start to finish. The beach access was amazing and the pool area was never too crowded. Will definitely return!'
            }
          ],
          nearbyAttractions: [
            {
              name: 'Seminyak Beach',
              distance: '50m',
              type: 'Beach'
            },
            {
              name: 'Potato Head Beach Club',
              distance: '1.2km',
              type: 'Nightlife'
            },
            {
              name: 'Seminyak Square',
              distance: '1.5km',
              type: 'Shopping'
            }
          ]
        };
        
        setProperty(mockProperty);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Failed to load property details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPropertyDetails();
  }, [id]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error || !property) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error || 'Property not found'}</p>
          <a href="/search" className="text-blue-600 underline mt-2 inline-block">
            Back to search
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Property Gallery */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <a href="/search" className="text-blue-600 hover:underline inline-flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to search
            </a>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
          <p className="text-gray-600 mb-4">{property.location.address}, {property.location.city}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative h-96 rounded-lg overflow-hidden">
              <img 
                src={property.images[activeImageIndex]} 
                alt={`${property.name} - Image ${activeImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              
              <button 
                onClick={() => setActiveImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1))}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                onClick={() => setActiveImageIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1))}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {property.images.map((_, index) => (
                  <button 
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`h-2 w-2 rounded-full ${index === activeImageIndex ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-2xl font-bold">${property.price.amount}</div>
                  <div className="text-gray-600">{property.price.perNight ? 'per night' : 'total'}</div>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <span className="ml-1 font-semibold">{property.rating}</span>
                  <span className="ml-2 text-gray-600">({property.reviewCount} reviews)</span>
                </div>
              </div>
              
              <div className="border-t border-b border-gray-200 py-4 mb-4">
                <h3 className="font-semibold mb-2">Select Dates</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Check-in</label>
                    <input type="date" className="w-full border rounded-md p-2" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Check-out</label>
                    <input type="date" className="w-full border rounded-md p-2" />
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition-colors mb-4">
                Book Now
              </button>
              
              <div className="text-xs text-gray-500 text-center">
                You won't be charged yet
              </div>
              
              <div className="mt-4 border-t border-gray-200 pt-4">
                <h3 className="font-semibold mb-2">Price Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>${property.price.amount} x 5 nights</span>
                    <span>${property.price.amount * 5}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cleaning fee</span>
                    <span>$50</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service fee</span>
                    <span>$45</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>${property.price.amount * 5 + 50 + 45}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <a href={`https://${property.source}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                  View on {property.source}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Property Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-bold mb-4">About this property</h2>
              <p className="text-gray-700 mb-4">{property.description}</p>
              
              <h3 className="font-semibold mb-2">Perfect for</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {property.vacationStyles.map((style, index) => (
                  <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {style}
                  </span>
                ))}
              </div>
              
              <h3 className="font-semibold mb-2">Amenities</h3>
              <div className="grid grid-cols-2 gap-y-2">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-bold mb-4">Available Rooms</h2>
              {property.rooms.map((room, index) => (
                <div key={index} className={`border-b border-gray-200 py-4 ${index === 0 ? 'pt-0' : ''} ${index === property.rooms.length - 1 ? 'border-b-0 pb-0' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{room.type}</h3>
                      <p className="text-gray-600 text-sm">{room.description}</p>
                      <div className="mt-1 text-sm">
                        <span className="font-medium">Beds:</span> {room.beds}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Max occupancy:</span> {room.occupancy} guests
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold">${room.price}</div>
                      <div className="text-gray-600 text-sm">per night</div>
                         
                         {room.available ? (
                           <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1 rounded transition-colors">
                             Select
                           </button>
                         ) : (
                           <span className="mt-2 bg-red-100 text-red-600 text-sm px-3 py-1 rounded inline-block">
                             Not available
                           </span>
                         )}
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
               
               <div className="bg-white p-6 rounded-lg shadow-md">
                 <div className="flex justify-between items-center mb-4">
                   <h2 className="text-xl font-bold">Reviews</h2>
                   <div className="flex items-center">
                     <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                     </svg>
                     <span className="ml-1 font-semibold">{property.rating}</span>
                     <span className="mx-2">·</span>
                     <span>{property.reviewCount} reviews</span>
                   </div>
                 </div>
                 
                 <div className="space-y-4">
                   {property.reviews.map((review, index) => (
                     <div key={index} className={`${index !== 0 ? 'border-t border-gray-200 pt-4' : ''}`}>
                       <div className="flex justify-between items-center mb-2">
                         <h3 className="font-semibold">{review.author}</h3>
                         <div className="flex items-center">
                           <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                           </svg>
                           <span className="ml-1">{review.rating}</span>
                         </div>
                       </div>
                       <div className="text-gray-500 text-sm mb-2">{review.date}</div>
                       <p className="text-gray-700">{review.comment}</p>
                     </div>
                   ))}
                 </div>
                 
                 <div className="mt-6">
                   <button className="border border-gray-300 text-gray-700 font-medium rounded-md px-4 py-2 hover:bg-gray-50 transition-colors">
                     View all {property.reviewCount} reviews
                   </button>
                 </div>
               </div>
             </div>
             
             <div>
               <div className="bg-white p-6 rounded-lg shadow-md mb-6 sticky top-4">
                 <h2 className="text-xl font-bold mb-4">Location</h2>
                 
                 <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                   {/* In a real app, this would be a map component */}
                   <div className="text-gray-500">Map View</div>
                 </div>
                 
                 <h3 className="font-semibold mb-2">{property.location.address}, {property.location.city}</h3>
                 
                 <h3 className="font-semibold mt-4 mb-2">Nearby attractions</h3>
                 <div className="space-y-2">
                   {property.nearbyAttractions.map((attraction, index) => (
                     <div key={index} className="flex justify-between">
                       <span>{attraction.name}</span>
                       <span className="text-gray-600">{attraction.distance}</span>
                     </div>
                   ))}
                 </div>
                 
                 <button className="w-full mt-4 bg-white border border-blue-600 text-blue-600 font-semibold py-2 px-4 rounded-md hover:bg-blue-50 transition-colors">
                   View in Google Maps
                 </button>
               </div>
             </div>
           </div>
         </div>
       </div>
     );
   }
