// Initialize Firebase
var config = {
	apiKey: "AIzaSyAGzg2lKl-mAFh_H_OZGOMG10IivR5xvzw",
	authDomain: "maniacdb-123.firebaseapp.com",
	databaseURL: "https://maniacdb-123.firebaseio.com",
	projectId: "maniacdb-123",
	storageBucket: "maniacdb-123.appspot.com",
	messagingSenderId: "710862225127"
};
firebase.initializeApp(config);

//getting reference of the Questions folder
const databaseRef = firebase.database().ref('questions');

//Handlebar template
const source = document.getElementById('problem').innerHTML; //get template structure
const template = Handlebars.compile(source); //compile template

let start = 1; //current number of rows in the table

async function addRow(Qnum) {

    // getting the data
    const name = databaseRef.child(Qnum).child('Name').once('value');
    const tag = databaseRef.child(Qnum).child('Tags').once('value');
    const diff = databaseRef.child(Qnum).child('Difficulty').once('value');
    let row = await Promise.all([name,tag,diff]);
    row = row.map(item => item.val());
    const data = {
        number:Qnum,
        name:row[0],
        tag:row[1],
        diff:row[2]
    };
    const compiledRow = template(data);

    // code to add compiledRow to the table
    $('tbody').append(compiledRow);
}

function addMultiple(limit) {
    let i = 0;
    for(i = start;i<=limit && i<=start+10;i++){
        addRow(i);
    }
    start = i;
    if(i>limit){
        $('.button').hide();
    }
}

databaseRef.child('Total').once('value').then(
    tot => {
        const limit = tot.val();
        $('.table')
        .ready(() =>{
            addMultiple(limit);
            $('.button')
            .on(
                'click',
                () =>{ addMultiple(limit);}
            )
        }
        )
    }
)