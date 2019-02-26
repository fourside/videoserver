import * as React from 'react';
import { NavLink } from 'react-router-dom';

interface MenuProps {
  toggleModal: () => void
}
interface MenuState {
  active: "" | "is-active"
}

export default class Menu extends React.Component<MenuProps, MenuState> {
  button: HTMLElement;
  constructor(props) {
    super(props)
    this.state = {
      active: ""
    };
    document.addEventListener('click', this.handleExceptMenuClick.bind(this));
  }

  componentWillUnmount() :void {
    document.removeEventListener('click', this.handleExceptMenuClick.bind(this));
  }

  handleMenuClick(e :any) :void {
    this.button = e.target;
    const active = this.state.active === "" ? "is-active" : "";
    this.setState({
      active: active
    });
  }

  handleExceptMenuClick(e :any) :void {
    if (this.state.active === "is-active" && this.button !== e.target) {
      this.setState({
        active: ""
      });
    }
  }

  render() {
    return (
      <div className={this.state.active + " dropdown is-right"}>

        <div className="dropdown-trigger">
          <button className="button" aria-haspopup="true" aria-controls="dropdown-menu" onClick={(e) => this.handleMenuClick(e)}>
            <span>menu</span>
            <span className="icon is-small">
              <i className="fas fa-bars" aria-hidden="true"></i>
            </span>
          </button>
        </div>

        <div className="dropdown-menu" id="dropdown-menu" role="menu">
          <div className="dropdown-content">
            <NavLink className="dropdown-item" exact to="/">Home</NavLink>
            <a className="dropdown-item" onClick={() => this.props.toggleModal()} >Form</a>
            <NavLink className="dropdown-item" exact to="/list">List</NavLink>
            <a className="dropdown-item" href="/feed">RSS</a>
          </div>
        </div>

      </div>
    );
  }
}
