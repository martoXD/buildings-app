import * as React from "react";
import { Link } from "react-router-dom";
import './styles/Footer.scss';

export class Footer extends React.Component {

  render() {
    return (
        <div className="footer-container">
            <div>
                <Link to='/'>Homepage</Link>
                <Link to='/buildings'>Details</Link>
            </div>
            <h2>The Building App</h2>
        </div>
    );
  }
}

export default Footer;
