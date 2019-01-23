var config = {
	apiKey: "AIzaSyAGzg2lKl-mAFh_H_OZGOMG10IivR5xvzw",
	authDomain: "maniacdb-123.firebaseapp.com",
	databaseURL: "https://maniacdb-123.firebaseio.com",
	projectId: "maniacdb-123",
	storageBucket: "maniacdb-123.appspot.com",
	messagingSenderId: "710862225127"
};
firebase.initializeApp(config);

const question_id = window.location.href.split("?")[1];
var prob_no = $("#prob-no");
const data = {
	"code": "_fill",
	"qID": "_fill",
	"language": "_fill"
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

//hide result table
$('.table').hide();

//Handlebar template
const source = document.getElementById('result').innerHTML; //get template structure
const template = Handlebars.compile(source); //compile template

var ref = firebase.database().ref('questions/' + question_id);
ref.on("value", function (snapshot) {
	var ques_details = snapshot.val();
	prob_no.append("<a target = '_blank' href='/question/display?qID=" + question_id + "'>" + question_id + " - " + ques_details.Name + "</a>");
});

const submitSolution = () => {
	//disable button
	$("button").prop("disabled", true);

	data.code = editor.getValue();
	data.language = $('#language').val();
	data.qID = question_id;
	settings.data = JSON.stringify(data);

	$.ajax(settings).done(function (response) {
		//enable button
		$("button").removeAttr('disabled');
		//show result table
		$('.table').show();
		//empty previous results
		$('tbody').empty();

		response.forEach((item, index) => {
			console.log(index, item);

			//compile row and add to table
			const data = {
				number: index,
				time: item["time"],
				memory: item["memory"],
				result: item["status"]["description"]
			};
			const compiledRow = template(data);
			$('tbody').append(compiledRow);
		});
	});
}
