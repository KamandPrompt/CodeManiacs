import React, { Component } from 'react';
<<<<<<< HEAD
import fire from './config/Fire';
import { HashRouter as Router, Route, Link, NavLink } from 'react-router-dom';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';
import Home from './Home';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = ({
      user: null,
    });
    this.authListener = this.authListener.bind(this);
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    fire.auth().onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        this.setState({ user });
        localStorage.setItem('user', user.uid);
      } else {
        this.setState({ user: null });
        localStorage.removeItem('user');
      }
    });
  }
  render() {
    const style = this.state.user ? {display: 'none'}:{}
    return (
      <Router basename="/reactrs/">
        <div className="App">
          <div className="App__Aside" style = {style} ></div>
          <div className="App__Form" >
            <div className="PageSwitcher" style = {style}>
                <NavLink to="/sign-in" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Sign In</NavLink>
                <NavLink exact to="/sign-up" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Sign Up</NavLink>
              </div>
              <div id = "title" className="heading" style = {style}>
              <font size='16' face='comic-de-sans' color='white'><b><u>USER REGISTRATION</u></b></font></div>
          {this.state.user ? (
            <Home />
            ) :
            ( <div>
              <Route exact path="/sign-up" component={SignUpForm}>
              </Route>
              <Route path="/sign-in" component={SignInForm}>
              </Route>
              </div>
          )}

          </div>
=======
import { HashRouter as Router, Route, Link, NavLink } from 'react-router-dom';
import SignUpForm from './pages/SignUpForm';
import SignInForm from './pages/SignInForm';

import './App.css';

class App extends Component {
  render() {
    return (
      <Router basename="/react-auth-ui/">
        <div className="App">
          <div className="App__Aside"></div>
          <div className="App__Form">
            <div className="PageSwitcher">
                <NavLink to="/sign-in" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Sign In</NavLink>
                <NavLink exact to="/" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Sign Up</NavLink>
              </div>

              <div className="FormTitle">
                  <NavLink to="/sign-in" activeClassName="FormTitle__Link--Active" className="FormTitle__Link">Sign In</NavLink> or <NavLink exact to="/" activeClassName="FormTitle__Link--Active" className="FormTitle__Link">Sign Up</NavLink>
              </div>

              <Route exact path="/" component={SignUpForm}>
              </Route>
              <Route path="/sign-in" component={SignInForm}>
              </Route>
          </div>

>>>>>>> 5b86dc6d2ed41996a4abd16f552cdb2ee987a29b
        </div>
      </Router>
    );
  }
}

export default App;
