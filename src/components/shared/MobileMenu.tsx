import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./MobileMenu.css";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="mobile-menu">
      <button className="menu-toggle" onClick={toggleMenu}>
        {isOpen ? "✕" : "☰"}
      </button>
      {isOpen && (
        <nav className="mobile-nav">
          <ul>
            <li>
              <NavLink to="/products" onClick={closeMenu}>
                📊 Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/products" onClick={closeMenu}>
                📦 Products
              </NavLink>
            </li>
            <li>
              <NavLink to="#" onClick={closeMenu}>
                👥 Customers
              </NavLink>
            </li>
            <li>
              <NavLink to="#" onClick={closeMenu}>
                📋 Orders
              </NavLink>
            </li>
            <li>
              <NavLink to="#" onClick={closeMenu}>
                📈 Reports
              </NavLink>
            </li>
            {user?.role === "admin" && (
              <li>
                <NavLink to="#" onClick={closeMenu}>
                  👤 Users
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default MobileMenu;
