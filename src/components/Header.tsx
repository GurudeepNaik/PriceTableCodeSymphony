import { Link } from "react-router-dom";
import './style.css'
const Header = () => {
  return (
    <div className="header">
      <h1 className="h1header">Price Tables</h1>
      <div className="linkContainer">
        <Link className="header__link" to="/basePrice">
          GET BASE PRICE TABLE
        </Link>
        <Link className="header__link" to="/slotPrice">
          GET SLOT PRICE TABLE
        </Link>
      </div>
    </div>
  );
};

export default Header;
