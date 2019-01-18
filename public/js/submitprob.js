var config = {
	apiKey: "AIzaSyAGzg2lKl-mAFh_H_OZGOMG10IivR5xvzw",
	authDomain: "maniacdb-123.firebaseapp.com",
	databaseURL: "https://maniacdb-123.firebaseio.com",
	projectId: "maniacdb-123",
	storageBucket: "maniacdb-123.appspot.com",
	messagingSenderId: "710862225127"
};
firebase.initializeApp(config);

const question_id = window.location.href.split ("?")[1];
var prob_no = $("#prob-no");
const data = {
	"code":"_fill",
	"qID":"_fill",
	"language":"_fill"
};
const settings = {
	"async": true,
	"crossDomain": true,
	"url": "http://localhost:3000/solution",
	"method": "POST",
	"headers": {
	  "Content-Type": "application/json",
	  "cache-control": "no-cache"
	},
	"processData": false,
	"data": "_fill"
};

var ref = firebase.database ().ref ('questions/'+question_id);
prob_no.append ("<a target = '_blank' href='/question?qID=" + question_id + "'>" + question_id + "</a> ");
ref.on ("value", function (snapshot) {
    var ques_details = snapshot.val ();
    prob_no.append ("<a target = '_blank' href='/question?qID=" + question_id + "'>" + ques_details.Name + "</a>");
});

const submitSolution = () => {
	data.code = editor.getValue();
	data.language = $('#language').val();
	data.qID = question_id;
	settings.data = JSON.stringify(data);

	$.ajax(settings).done(function (response) {
		console.log(response);
		window.alert(response);
	});
}
