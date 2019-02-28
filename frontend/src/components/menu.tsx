import * as React from 'react';
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

interface MenuProps {
  toggleModal: () => void;
}

const Menu = ({ toggleModal }: MenuProps) => {
  const [active, setActive] = useState(false);
  let button: HTMLElement;

  useEffect(() => {
    document.addEventListener('click', handleExceptMenuClick);
    return () => {
      document.removeEventListener('click', handleExceptMenuClick);
    };
  });

  const handleMenuClick = (e: any): void => {
    button = e.target;
    setActive(!active);
  };

  const handleExceptMenuClick = (e: any): void => {
    if (active && button !== e.target) {
      setActive(false);
    }
  };

  return (
    <div className={(active ? 'is-active' : '') + ' dropdown is-right'}>
      <div className="dropdown-trigger">
        <button
          className="button"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={handleMenuClick}>
          <span>menu</span>
          <span className="icon is-small">
            <i className="fas fa-bars" aria-hidden="true" />
          </span>
        </button>
      </div>

      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          <NavLink className="dropdown-item" exact to="/">
            Home
          </NavLink>
          <a className="dropdown-item" onClick={toggleModal}>
            Form
          </a>
          <NavLink className="dropdown-item" exact to="/list">
            List
          </NavLink>
          <a className="dropdown-item" href="/feed">
            RSS
          </a>
        </div>
      </div>
    </div>
  );
};

export default Menu;
