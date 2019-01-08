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

var ref = firebase.database ().ref ('questions/'+question_id);
prob_no.append ("<a target = '_blank' href='/question?qID=" + question_id + "'>" + question_id + "</a> ");
ref.on ("value", function (snapshot) {
    var ques_details = snapshot.val ();
    prob_no.append ("<a target = '_blank' href='/question?qID=" + question_id + "'>" + ques_details.Name + "</a>");
});
