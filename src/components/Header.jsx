import { Link } from 'react-router';

const Header = () => {
  return (
    <div className="header">
      
      <Link to="/" className="logo neon-logo">
        D<span className="play-o">▶</span>PE MOVIEZ
      </Link>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/watchlist">WatchList</Link></li>
      </ul>
    </div>
  );
};

export default Header;