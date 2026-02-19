import React from "react";
import { MapPin, Instagram } from "lucide-react";
import "./Header.css";

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-container">
        {/* Left Section: Logo & Location */}
        <div className="header-left">
          {/* Logo Replica */}
          <a href="/" style={{ textDecoration: "none" }}>
            <div className="logo-wrapper">
              <span className="logo-main">Mocha Mono Vol.2</span>
              <span className="logo-sub">by SSOCIETY</span>
            </div>
          </a>

          {/* Location Picker */}
          <div className="location-picker">
            <div className="icon-circle">
              <MapPin className="location-icon" />
            </div>
            <div className="location-text">
              <span className="city-name">Bhubaneswar, Odisha</span>
            </div>
          </div>
        </div>

        <div className="right">
          <a
            href="https://wa.me/917327822710"
            className="social-icon-btn-right whatsapp-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="whatsapp.png" alt="WhatsApp" className="icon-svg" />
          </a>

          <a
            href="https://www.instagram.com/ssocietybyscale?igsh=dDV4dGlya2x0cjR2"
            className="social-icon-btn-right instagram-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram className="icon-svg" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
