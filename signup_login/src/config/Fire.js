import firebase from"firebase";
const config= {
    apiKey: "AIzaSyC8Qd4lGFTLkhRIMbBZuX7ieyJPZ3A9EgI",
    authDomain: "codemaniacs-547ed.firebaseapp.com",
    databaseURL: "https://codemaniacs-547ed.firebaseio.com",
    storageBucket: "codemaniacs-547ed.appspot.com",
};
const fire = firebase.initializeApp(config);
export default fire;