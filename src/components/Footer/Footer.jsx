import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLocationDot,
  faLock,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import classes from "./Footer.module.css";

function Footer() {
  return (
    <footer className={classes.footer}>
      <div className={classes.columsn}>
        <div>
          <p className={classes.brand}>
            IM<span>-Tech</span>
          </p>
          <p className={classes.about}>
            Headphones, laptops, smartphones and gaiming gear. Everything you
            need to upgrade your setup, in one place.
          </p>
        </div>

        <div>
          <h3>Shop</h3>
          <ul>
            <li>
              <Link to="/">All Items</Link>
            </li>
            <li>
              <Link to="/favorites">My Favorites</Link>
            </li>
            <li>
              <Link to="/orders">My Orders</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3>Account</h3>
          <ul>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3>Contact</h3>
          <ul>
            <li>
              <FontAwesome icon={faPhone} /> 01-23456789
            </li>
            <li>
              <FontAwesome icon={faEnvelope} /> support@im-tech.com
            </li>
            <li>
              <FontAwesome icon={faLocationDot} /> Tel Aviv, Israel
            </li>
          </ul>
        </div>

        <div classes={classes.bottom}>
          <span>© 2026 IM-Tech. All rights reserved.</span>
          <span>
            <FontAwesomeIcon icon={faLock} /> Secure checkout
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
