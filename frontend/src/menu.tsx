import * as React from 'react';

export default class Menu extends React.Component<{}, {}> {
  render() {
    return (
      <div className="dropdown">

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
            <a href="#" className="dropdown-item">
              Dropdown item
            </a>
            <a className="dropdown-item">
              Other dropdown item
            </a>
            <a href="#" className="dropdown-item is-active">
              Active dropdown item
            </a>
            <a href="#" className="dropdown-item">
              Other dropdown item
            </a>
          </div>
        </div>

      </div>
    );
  }
}
