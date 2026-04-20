import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAdmin, isAuthenticated, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="container nav-content">
        <Link to="/" className="brand">
          RoomPG
        </Link>

        <nav>
          <Link to="/">Home</Link>
          {isAuthenticated && <Link to="/my-bookings">My Bookings</Link>}
          {isAdmin && <Link to="/admin">Admin</Link>}
        </nav>

        <div className="auth-actions">
          {isAuthenticated ? (
            <>
              <span className="welcome">Hi, {user.name}</span>
              <button onClick={logout} className="secondary-btn" type="button">
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="primary-btn">
              Login / Register
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
