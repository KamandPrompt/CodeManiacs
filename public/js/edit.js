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

const settings = {
	"async": true,
	"crossDomain": true,
	"url": "http://localhost:3000/question/edit",
	"method": "PUT",
	"headers": {
		"Content-Type": "application/json",
		"cache-control": "no-cache"
	},
	"processData": false,
	"data": "_fill"
};

//add & remove buttons for testfile
$('#add').on('click', () => {
	//compile testfile box and add to table
	const testfile = template({});
	$('#testcases').append(testfile);
});
$('#rem').on('click', () => {
	$('#testcases').children().last().remove();
})

//getting the question ID from url
const url = window.location.href;
const qID = url.substring(url.lastIndexOf('qID=') + 4)

//Handlebar template
const source = document.getElementById('fileTemplate').innerHTML; //get template structure
const template = Handlebars.compile(source); //compile template

//getting reference of the corresponding DB folders
const databaseRef = firebase.database().ref('questions/' + qID);
const testcaseRef = firebase.database().ref('testcases/' + qID);

//display current values
databaseRef.once('value').then(snapshot => {
	const ques = snapshot.val()
	//Put code to display current values of problem statement
	$("#QuesName").val(ques.Name);
	$("#Description").val(ques.Description);
	$("#InputFormat").val(ques.InputFormat);
	$("#OutputFormat").val(ques.OutputFormat);
	$("#Constraints").val(ques.Constraints);
	$("#SampleInput").val(ques.SampleInput);
	$("#SampleOutput").val(ques.SampleOutput);
	$("#Explanation").val(ques.Explanation);
	$("#DifficultyLevel").val(ques.Difficulty);
	$("#ProblemSetter").val(ques.Setter);
	$("#TimeLimit").val(ques.Time);
	$("#MemoryLimit").val(ques.Memory);
	$("#Tags").val(ques.Tags);
	$("#Editorial").val(ques.Editorial);
});
testcaseRef.once('value').then(snapshot => {
	const files = snapshot.val().files;
	files.forEach((item, index) => {
		console.log(index, item);
		//compile testfile box and add to table
		const testfile = template(item);
		$('#testcases').append(testfile);
	});

});


$('.submit').on('click', function () {

	//disable button
	$('.submit').toggleClass('is-loading');

	// creating question object
	const ques = {};

	ques.Name = $("#QuesName").val();
	ques.Description = $("#Description").val();
	ques.InputFormat = $("#InputFormat").val();
	ques.OutputFormat = $("#OutputFormat").val();
	ques.Constraints = $("#Constraints").val();
	ques.SampleInput = $("#SampleInput").val();
	ques.SampleOutput = $("#SampleOutput").val();
	ques.Explanation = $("#Explanation").val();
	ques.Difficulty = $("#DifficultyLevel").val();
	ques.Setter = $("#ProblemSetter").val();
	ques.Time = $("#TimeLimit").val();
	ques.Memory = $("#MemoryLimit").val();
	ques.Tags = $("#Tags").val();
	ques.Editorial = $("#Editorial").val();

	// creating testcase Object
	const testcases = {};
	testcases.Time = $("#TimeLimit").val();
	testcases.Memory = $("#MemoryLimit").val();
	testcases.files = [];
	$('#testcases').children('div').each(function () {
		let testfile = {
			stdin: '_fill',
			stdout: '_fill'
		};
		testfile.stdin = $(this).find('.stdin').val();
		testfile.stdout = $(this).find('.stdout').val();
		testcases['files'].push(testfile);
	});

	//send data to server;
	const data = {
		testcases,
		ques,
		qID
	};
	settings.data = JSON.stringify(data);
	$.ajax(settings).done(function (response) {
		//enable button
		$('.submit').toggleClass('is-loading');

		//show response
		console.log(response);
		window.alert(response);

	});

});
