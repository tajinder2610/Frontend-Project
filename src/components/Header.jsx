import { Link } from 'react-router';

const Header = () => {
    return (
        <div className="header">
            <ul>
                <li><Link to="/">Movies</Link></li>
                <li><Link to="/watchlist">WatchList</Link></li>
            </ul>
        </div>
    )
}

export default Header;