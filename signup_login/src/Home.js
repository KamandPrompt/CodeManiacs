import React, { Component } from 'react';
import fire from './config/Fire';

class Home extends Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
    }


    logout() {
        fire.auth().signOut();
    }

    render() {
        return (
            <div className = "Home">
                <span>
                    <div color = 'red'>Logged In!!!  </div>
                    <h1>Welcome to Home</h1> 
                    <h3>This is only a sample home page,, and can be repalced with the existing home page !!!</h3>
                    <button onClick={this.logout}>Logout</button>
                    <h1>CodeManiacss {fire.auth().currentUser.displayName}</h1>
                    <img
                    alt="profile picture"
                    src={fire.auth().currentUser.photoURL}
                    />
                </span>
            </div>
        );

    }

}

export default Home;

