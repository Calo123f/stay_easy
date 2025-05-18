export default function DestinationsPage() {
  const destinations = [
    {
      name: 'Bali, Indonesia',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
      description: 'Tropical paradise with stunning beaches, vibrant culture, and lush landscapes.',
      properties: 3245,
      styles: ['Beach', 'Culture', 'Nature']
    },
    {
      name: 'Paris, France',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
      description: 'The City of Light offers iconic landmarks, world-class cuisine, and charming streets.',
      properties: 4521,
      styles: ['City', 'Culture', 'Romance']
    },
    {
      name: 'Tokyo, Japan',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
      description: 'A fascinating blend of ultramodern and traditional culture, with excellent food and shopping.',
      properties: 3789,
      styles: ['City', 'Culture', 'Food']
    },
    {
      name: 'New York City, USA',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
      description: 'The Big Apple features iconic skyscrapers, diverse neighborhoods, and world-class entertainment.',
      properties: 5023,
      styles: ['City', 'Shopping', 'Nightlife']
    },
    {
      name: 'Santorini, Greece',
      image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e',
      description: 'Famous for its stunning whitewashed buildings, blue domes, and breathtaking sunsets.',
      properties: 1876,
      styles: ['Beach', 'Romance', 'Luxury']
    },
    {
      name: 'Barcelona, Spain',
      image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4',
      description: 'Vibrant city known for its architecture, beaches, and lively culture.',
      properties: 3541,
      styles: ['City', 'Beach', 'Culture']
    },
    {
      name: 'Phuket, Thailand',
      image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5',
      description: 'Thailand\'s largest island offers beautiful beaches, lush mountains, and vibrant nightlife.',
      properties: 2932,
      styles: ['Beach', 'Nightlife', 'Nature']
    },
    {
      name: 'London, UK',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad',
      description: 'Historic city with royal heritage, iconic landmarks, and diverse cultural scenes.',
      properties: 4875,
      styles: ['City', 'Culture', 'History']
    },
    {
      name: 'Cancun, Mexico',
      image: 'https://images.unsplash.com/photo-1570737044899-e1ab58c8ea29',
      description: 'Popular resort destination with beautiful beaches and crystal-clear waters.',
      properties: 2156,
      styles: ['Beach', 'Resort', 'Nightlife']
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Explore Popular Destinations</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Discover amazing places around the world, from tropical paradises to vibrant cities.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {destinations.map((destination, index) => (
            <a 
              key={index} 
              href={`/search?destination=${destination.name}`}
              className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-60">
                <img 
                  src={destination.image} 
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h2 className="text-white font-bold text-xl mb-1">{destination.name}</h2>
                  <p className="text-white/80 text-sm">{destination.properties} properties</p>
                </div>
              </div>
              
              <div className="p-4">
                <p className="text-gray-700 mb-3">{destination.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {destination.styles.map((style, i) => (
                    <span key={i} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                      {style}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
