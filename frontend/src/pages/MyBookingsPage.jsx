import { useEffect, useState } from 'react';
import { api } from '../api/client';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await api.get('/bookings/mine');
        setBookings(data);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="container page">
        <p>Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="container page">
      <h1>My Bookings</h1>
      <div className="grid">
        {bookings.map((booking) => (
          <article key={booking._id} className="card">
            <h3>{booking.property?.title}</h3>
            <p>
              <strong>Location:</strong> {booking.property?.location}
            </p>
            <p>
              <strong>Check-in:</strong>{' '}
              {new Date(booking.checkInDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Status:</strong> <span className={`status ${booking.status}`}>{booking.status}</span>
            </p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default MyBookingsPage;
