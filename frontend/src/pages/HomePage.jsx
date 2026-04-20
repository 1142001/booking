import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import PropertyCard from '../components/PropertyCard';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({ type: '', location: '', minRent: '', maxRent: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { isAuthenticated } = useAuth();

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return params.toString();
  }, [filters]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/properties${queryString ? `?${queryString}` : ''}`);
      setProperties(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [queryString]);

  const handleBooking = async (property) => {
    if (!isAuthenticated) {
      setMessage('Please login before booking.');
      return;
    }

    try {
      await api.post('/bookings', {
        property: property._id,
        checkInDate: new Date(),
        durationMonths: 3,
        occupants: 1,
        notes: 'Booking created from quick action card'
      });
      setMessage('Booking request submitted successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Booking failed');
    }
  };

  const onFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container page">
      <h1>Find your next room / PG stay</h1>
      <div className="card filters">
        <select name="type" value={filters.type} onChange={onFilterChange}>
          <option value="">All types</option>
          <option value="room">Room</option>
          <option value="pg">PG</option>
        </select>
        <input
          type="text"
          name="location"
          placeholder="Search location"
          value={filters.location}
          onChange={onFilterChange}
        />
        <input
          type="number"
          name="minRent"
          placeholder="Min Rent"
          value={filters.minRent}
          onChange={onFilterChange}
        />
        <input
          type="number"
          name="maxRent"
          placeholder="Max Rent"
          value={filters.maxRent}
          onChange={onFilterChange}
        />
      </div>

      {message && <p className="success">{message}</p>}
      {loading ? <p>Loading properties...</p> : null}

      <div className="grid">
        {properties.map((property) => (
          <PropertyCard key={property._id} property={property} onBook={handleBooking} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
