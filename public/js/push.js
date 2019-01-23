const testFile = '<div class="box" ><h2 class="subtitle">TestFile</h2><textarea class="textarea stdin" placeholder="Stdin"></textarea><textarea class="textarea stdout" placeholder="Stdout"></textarea></div>'
const settings = {
	"async": true,
	"crossDomain": true,
	"url": "http://localhost:3000/question/submit",
	"method": "POST",
	"headers": {
		"Content-Type": "application/json",
		"cache-control": "no-cache"
	},
	"processData": false,
	"data": "_fill"
};

$('#add').on('click', () => {
	$('#testcases').append(testFile);
});
$('#rem').on('click', () => {
	$('#testcases').children().last().remove();
})

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
		ques
	};
	settings.data = JSON.stringify(data);
	$.ajax(settings).done(function (response) {
		//enable button
		$('.submit').toggleClass('is-loading');

		//show response
		console.log(response);
		window.alert(response);

		//empty the textarea
		$('textarea').val('');
	});

});
