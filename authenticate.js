var firebase = require('firebase');

var config = {
    apiKey: "AIzaSyC8Qd4lGFTLkhRIMbBZuX7ieyJPZ3A9EgI",
    authDomain: "codemaniacs-547ed.firebaseapp.com",
    databaseURL: "https://codemaniacs-547ed.firebaseio.com",
    storageBucket: "codemaniacs-547ed.appspot.com",
};
firebase.initializeApp(config);

function signUp(email, password, respond, callback){
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then( function(){
            respond();
        })
        .catch(function(error){
            callback(error);
        });
}

function signIn(email, password, respond, callback){
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then( function(){
            respond();
        })
        .catch(function(error){
           callback(error);
        });
}

function signOut(respond, callback){
    firebase.auth().signOut().then(function(){
        respond();
    }).catch(function(error){
        callback(error);
    });
}

module.exports = {signUp, signIn, signOut}