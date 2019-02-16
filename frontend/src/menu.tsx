import * as React from 'react';
import { NavLink } from 'react-router-dom';

export default class Menu extends React.Component<{}, {}> {
  render() {
    return (
      <div className="dropdown is-right is-active">

        <div className="dropdown-trigger">
          <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
            <span>menu</span>
            <span className="icon is-small">
              <i className="fas fa-bars" aria-hidden="true"></i>
            </span>
          </button>
        </div>

        <div className="dropdown-menu" id="dropdown-menu" role="menu">
          <div className="dropdown-content">
            <NavLink className="dropdown-item" exact to="/">Home</NavLink>
            <NavLink className="dropdown-item" exact to="/list">List</NavLink>
            <a className="dropdown-item" href="/feed">RSS</a>
          </div>
        </div>

      </div>
    );
  }
}
