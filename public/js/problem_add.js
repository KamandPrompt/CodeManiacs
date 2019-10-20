const testFile = '<div class="box" ><h2 class="subtitle">TestFile</h2><textarea class="textarea stdin" placeholder="Stdin"></textarea><textarea class="textarea stdout" placeholder="Stdout"></textarea></div>'
const settings = {
	"async": true,
	"crossDomain": true,
	"url": "/admin/add",
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

	ques.name = $("#QuesName").val();
	ques.isVisible = Boolean($("#isVisible").val());
	ques.description = $("#Description").val();
	ques.inputFormat = $("#InputFormat").val();
	ques.outputFormat = $("#OutputFormat").val();
	ques.constraints = $("#Constraints").val();
	ques.sampleInput = $("#SampleInput").val();
	ques.sampleOutput = $("#SampleOutput").val();
	ques.explanation = $("#Explanation").val();
	ques.difficulty = Number($("#DifficultyLevel").val());
	ques.problemSetter = $("#ProblemSetter").val();
	ques.timeLimit = $("#TimeLimit").val();
	ques.memoryLimit = Number($("#MemoryLimit").val());
	ques.tags = $("#Tags").val().split(",").map(item => item.trim()) ;
	ques.editorial = $("#Editorial").val();

	// creating testcase Object
	const testcases = {};
	testcases.timeLimit = $("#TimeLimit").val();
	testcases.memoryLimit = $("#MemoryLimit").val();
	testcases.cases = [];
	$('#testcases').children('div').each(function () {
		let testfile = {
			stdin: '_fill',
			stdout: '_fill'
		};
		testfile.stdin = $(this).find('.stdin').val();
		testfile.stdout = $(this).find('.stdout').val();
		testcases['cases'].push(testfile);
	});

	if(!testcases.cases.length) {
		window.alert("No Testcase added");
		//enable button
		$('.submit').toggleClass('is-loading');
		
		return 0;
	}

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
		window.alert(response);

		//empty the textarea
		$('textarea').val('');
	});

});
