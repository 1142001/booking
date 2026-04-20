import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

const initialProperty = {
  title: '',
  description: '',
  location: '',
  type: 'room',
  rentPerMonth: '',
  deposit: '',
  availableBeds: 1,
  amenities: '',
  images: ''
};

const AdminPage = () => {
  const [propertyForm, setPropertyForm] = useState(initialProperty);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState([]);
  const [feedback, setFeedback] = useState('');

  const normalizedForm = useMemo(
    () => ({
      ...propertyForm,
      amenities: propertyForm.amenities
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      images: propertyForm.images
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      rentPerMonth: Number(propertyForm.rentPerMonth),
      deposit: Number(propertyForm.deposit || 0),
      availableBeds: Number(propertyForm.availableBeds || 1)
    }),
    [propertyForm]
  );

  const fetchDashboard = async () => {
    const [bookingsRes, statsRes] = await Promise.all([
      api.get('/bookings/admin/all'),
      api.get('/properties/stats/overview')
    ]);
    setBookings(bookingsRes.data);
    setStats(statsRes.data);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPropertyForm((prev) => ({ ...prev, [name]: value }));
  };

  const createProperty = async (event) => {
    event.preventDefault();
    try {
      await api.post('/properties', normalizedForm);
      setFeedback('Property created successfully.');
      setPropertyForm(initialProperty);
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Unable to create property');
    }
  };

  const updateStatus = async (bookingId, status) => {
    try {
      await api.patch(`/bookings/admin/${bookingId}/status`, { status });
      setFeedback(`Booking moved to ${status}`);
      fetchDashboard();
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Failed to update booking status');
    }
  };

  return (
    <div className="container page">
      <h1>Admin Panel</h1>
      {feedback && <p className="success">{feedback}</p>}

      <section className="grid stats">
        {stats.map((item) => (
          <article key={item._id} className="card">
            <h3>{item._id?.toUpperCase()}</h3>
            <p>Total Properties: {item.totalProperties}</p>
            <p>Avg Rent: ₹{Math.round(item.averageRent || 0)}</p>
          </article>
        ))}
      </section>

      <section className="card">
        <h2>Add New Property</h2>
        <form className="form" onSubmit={createProperty}>
          <input name="title" placeholder="Title" value={propertyForm.title} onChange={handleChange} required />
          <textarea
            name="description"
            placeholder="Description"
            value={propertyForm.description}
            onChange={handleChange}
            required
          />
          <input
            name="location"
            placeholder="Location"
            value={propertyForm.location}
            onChange={handleChange}
            required
          />
          <select name="type" value={propertyForm.type} onChange={handleChange}>
            <option value="room">Room</option>
            <option value="pg">PG</option>
          </select>
          <input
            name="rentPerMonth"
            type="number"
            placeholder="Rent Per Month"
            value={propertyForm.rentPerMonth}
            onChange={handleChange}
            required
          />
          <input
            name="deposit"
            type="number"
            placeholder="Deposit"
            value={propertyForm.deposit}
            onChange={handleChange}
          />
          <input
            name="availableBeds"
            type="number"
            placeholder="Available Beds"
            value={propertyForm.availableBeds}
            onChange={handleChange}
          />
          <input
            name="amenities"
            placeholder="Amenities (comma separated)"
            value={propertyForm.amenities}
            onChange={handleChange}
          />
          <input
            name="images"
            placeholder="Image URLs (comma separated)"
            value={propertyForm.images}
            onChange={handleChange}
          />
          <button className="primary-btn" type="submit">
            Create Property
          </button>
        </form>
      </section>

      <section>
        <h2>All Bookings</h2>
        <div className="booking-list">
          {bookings.map((booking) => (
            <article key={booking._id} className="card booking-card">
              <h3>{booking.property?.title}</h3>
              <p>
                {booking.user?.name} ({booking.user?.email})
              </p>
              <p>
                Status: <span className={`status ${booking.status}`}>{booking.status}</span>
              </p>
              <div className="row-actions">
                {['confirmed', 'cancelled', 'completed'].map((status) => (
                  <button
                    key={status}
                    className="secondary-btn"
                    onClick={() => updateStatus(booking._id, status)}
                    type="button"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
