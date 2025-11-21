import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { NavigationProps } from '../types';
import { ArrowLeft, Search, MapPin, Home, Filter, X } from 'lucide-react';
import { propertyService } from '../src/services/property.service';

export const PropertySearch: React.FC<NavigationProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [error, setError] = useState('');

  const [searchParams, setSearchParams] = useState({
    city: '',
    locality: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    minArea: '',
    maxArea: '',
    bedrooms: '',
    bathrooms: '',
    furnishingStatus: '',
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    searchProperties();
  }, []);

  const searchProperties = async () => {
    setLoading(true);
    setError('');

    try {
      const params: any = {};
      if (searchParams.city) params.city = searchParams.city;
      if (searchParams.locality) params.locality = searchParams.locality;
      if (searchParams.propertyType) params.propertyType = searchParams.propertyType;
      if (searchParams.minPrice) params.minPrice = parseFloat(searchParams.minPrice);
      if (searchParams.maxPrice) params.maxPrice = parseFloat(searchParams.maxPrice);
      if (searchParams.minArea) params.minArea = parseFloat(searchParams.minArea);
      if (searchParams.maxArea) params.maxArea = parseFloat(searchParams.maxArea);
      if (searchParams.bedrooms) params.bedrooms = parseInt(searchParams.bedrooms);
      if (searchParams.bathrooms) params.bathrooms = parseInt(searchParams.bathrooms);
      if (searchParams.furnishingStatus) params.furnishingStatus = searchParams.furnishingStatus;

      const response = await propertyService.searchProperties(params);
      if (response.success && response.data) {
        setProperties(response.data.properties || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search properties');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchProperties();
  };

  const clearFilters = () => {
    setSearchParams({
      city: '',
      locality: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      minArea: '',
      maxArea: '',
      bedrooms: '',
      bathrooms: '',
      furnishingStatus: '',
    });
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div ref={containerRef} className="min-h-screen w-full bg-luxury-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#D9A44120,_transparent_40%)] opacity-40 pointer-events-none"></div>
      
      <div ref={contentRef} className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="group flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors uppercase text-xs tracking-widest font-bold"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-serif text-white mb-4">Property Search</h1>
          <p className="text-white/40">Find your perfect property</p>
        </div>

        <form onSubmit={handleSearch} className="glass-panel p-6 rounded-sm border border-white/10 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Select
                label="City"
                value={searchParams.city}
                onChange={(e) => setSearchParams({ ...searchParams, city: e.target.value })}
                options={[
                  { value: '', label: 'All Cities' },
                  { value: 'Mumbai', label: 'Mumbai' },
                  { value: 'Delhi', label: 'Delhi' },
                  { value: 'Bangalore', label: 'Bangalore' },
                ]}
              />
            </div>
            <Input
              label="Locality"
              type="text"
              value={searchParams.locality}
              onChange={(e) => setSearchParams({ ...searchParams, locality: e.target.value })}
              placeholder="e.g., Bandra, Worli"
            />
            <div>
              <Select
                label="Property Type"
                value={searchParams.propertyType}
                onChange={(e) => setSearchParams({ ...searchParams, propertyType: e.target.value })}
                options={[
                  { value: '', label: 'All Types' },
                  { value: 'apartment', label: 'Apartment' },
                  { value: 'villa', label: 'Villa' },
                  { value: 'penthouse', label: 'Penthouse' },
                  { value: 'studio', label: 'Studio' },
                  { value: 'plot', label: 'Plot' },
                ]}
              />
            </div>
          </div>

          <div className="flex gap-4 items-end">
            <Button type="submit" disabled={loading} className="flex items-center gap-2">
              <Search size={16} />
              {loading ? 'Searching...' : 'Search'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2"
            >
              <Filter size={16} />
              Filters
            </Button>
            {(searchParams.minPrice || searchParams.maxPrice || searchParams.bedrooms) && (
              <Button
                type="button"
                variant="text"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <X size={16} />
                Clear
              </Button>
            )}
          </div>

          {filtersOpen && (
            <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Min Price"
                  type="number"
                  value={searchParams.minPrice}
                  onChange={(e) => setSearchParams({ ...searchParams, minPrice: e.target.value })}
                  placeholder="Min"
                />
                <Input
                  label="Max Price"
                  type="number"
                  value={searchParams.maxPrice}
                  onChange={(e) => setSearchParams({ ...searchParams, maxPrice: e.target.value })}
                  placeholder="Max"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Min Area (sqft)"
                  type="number"
                  value={searchParams.minArea}
                  onChange={(e) => setSearchParams({ ...searchParams, minArea: e.target.value })}
                  placeholder="Min"
                />
                <Input
                  label="Max Area (sqft)"
                  type="number"
                  value={searchParams.maxArea}
                  onChange={(e) => setSearchParams({ ...searchParams, maxArea: e.target.value })}
                  placeholder="Max"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Bedrooms"
                  type="number"
                  value={searchParams.bedrooms}
                  onChange={(e) => setSearchParams({ ...searchParams, bedrooms: e.target.value })}
                  placeholder="Any"
                />
                <Input
                  label="Bathrooms"
                  type="number"
                  value={searchParams.bathrooms}
                  onChange={(e) => setSearchParams({ ...searchParams, bathrooms: e.target.value })}
                  placeholder="Any"
                />
              </div>
              <div>
                <Select
                  label="Furnishing"
                  value={searchParams.furnishingStatus}
                  onChange={(e) => setSearchParams({ ...searchParams, furnishingStatus: e.target.value })}
                  options={[
                    { value: '', label: 'Any' },
                    { value: 'unfurnished', label: 'Unfurnished' },
                    { value: 'semi-furnished', label: 'Semi-Furnished' },
                    { value: 'fully-furnished', label: 'Fully-Furnished' },
                  ]}
                />
              </div>
            </div>
          )}
        </form>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center text-white/40 py-12">Loading properties...</div>
          ) : properties.length === 0 ? (
            <div className="col-span-full text-center text-white/40 py-12">
              <Home size={48} className="mx-auto mb-4 opacity-50" />
              <p>No properties found. Try adjusting your search criteria.</p>
            </div>
          ) : (
            properties.map((property) => (
              <div
                key={property.id}
                className="glass-panel p-6 rounded-sm border border-white/10 hover:border-luxury-gold/30 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-white font-serif text-lg mb-2 group-hover:text-luxury-gold transition-colors">
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-2 text-white/40 text-sm">
                      <MapPin size={14} />
                      <span>{property.locality}, {property.city}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-white/60 text-sm">Price</span>
                    <span className="text-luxury-gold font-bold">{formatPrice(property.price)}</span>
                  </div>
                  {property.pricePerSqft && (
                    <div className="flex justify-between">
                      <span className="text-white/60 text-sm">Price/sqft</span>
                      <span className="text-white/80">₹{property.pricePerSqft.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-white/60 text-sm">Area</span>
                    <span className="text-white/80">{property.areaSqft} sqft</span>
                  </div>
                  {(property.bedrooms || property.bathrooms) && (
                    <div className="flex justify-between">
                      <span className="text-white/60 text-sm">Details</span>
                      <span className="text-white/80">
                        {property.bedrooms && `${property.bedrooms} BHK`}
                        {property.bedrooms && property.bathrooms && ' • '}
                        {property.bathrooms && `${property.bathrooms} Bath`}
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    onNavigate('dashboard');
                  }}
                >
                  View Details
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

