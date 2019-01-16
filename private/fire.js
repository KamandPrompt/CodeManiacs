var admin = require('firebase-admin');
var serviceAccount = require('./firebaseServiceKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://maniacdb-123.firebaseio.com'
});

const dbRef = admin.database();
module.exports.dbRef = dbRef;