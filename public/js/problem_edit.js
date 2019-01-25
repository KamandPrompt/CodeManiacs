const qID = window.location.href.split("edit/")[1];

const settings = {
	"async": true,
	"crossDomain": true,
	"url": qID,
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

//Handlebar template
const source = document.getElementById('fileTemplate').innerHTML; //get template structure
const template = Handlebars.compile(source); //compile template

/**
 * Fetch the problem data and show it on their
 * respective fields.
 */


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
		window.alert(response);

	});

});
