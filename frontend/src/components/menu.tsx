import * as React from 'react';
import { NavLink } from 'react-router-dom';

import Modal from './modal';
import Notification from './notification';
import Client from '../shared/client';

interface MenuState {
  active: "" | "is-active"
  category: Array<string>
  isModalOpen: boolean
  isNotified: boolean
}
export default class Menu extends React.Component<{}, MenuState> {
  button: HTMLElement;
  constructor(props) {
    super(props)
    this.state = {
      active: "",
      category: [],
      isModalOpen: false,
      isNotified: false
    };
    document.addEventListener('click', this.handleExceptMenuClick.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleExceptMenuClick.bind(this));
  }

  handleMenuClick(e) {
    this.button = e.target;
    const active = this.state.active === "" ? "is-active" : "";
    this.setState({
      active: active
    });
  }

  handleExceptMenuClick(e) {
    if (this.button !== e.target) {
      this.setState({
        active: ""
      });
    }
  }

  toggleModal() {
    this.setState((prev, props) => {
      const newState = !prev.isModalOpen;
      return { isModalOpen: newState };
    });
  }

  notifyHttp() {
    this.setState({
      isNotified: true
    });
    setTimeout(() => {
      this.setState({
        isNotified: false
      });
    }, 2000);
  }

  render() {
    new Client().getCategory()
      .then((json) => {
        this.setState({
          category: json
        })
      });
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
            <a className="dropdown-item" onClick={() => this.toggleModal()} >Form</a>
            <NavLink className="dropdown-item" exact to="/list">List</NavLink>
            {this.state.category.map((category, i) => (
              <NavLink className="dropdown-item" exact to={"/list/" + category} key={i} > List / {category}</NavLink>
            ))}
            <a className="dropdown-item" href="/feed">RSS</a>
          </div>
        </div>

        <Notification message="OK!" isShown={this.state.isNotified}/>
        <Modal
          closeModal={() => this.toggleModal()}
          notifyHttp={() => this.notifyHttp()}
          isOpen={this.state.isModalOpen}
          category={this.state.category}
        />

      </div>
    );
  }
}
