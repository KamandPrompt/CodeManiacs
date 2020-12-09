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
	$('#newtestcases').append(testfile);
});
$('#rem').on('click', () => {
	$('#newtestcases').children().last().remove();
})

//Handlebar template
const source = document.getElementById('fileTemplate').innerHTML; //get template structure
const template = Handlebars.compile(source); //compile template
const testcases = {};
testcases.cases = [];

if (prev_tc) {
	prev_tc.cases.forEach(item => {
		let testfile = {
			"stdin": item.stdin,
			"stdout": item.stdout
		};
		$('#testcases').append(template(testfile));
	});
}

$("#NewTestcasesFiles").on('change', fileInputControl);
// fileInputControl(event);
function fileInputControl(event) {
	let fileInpControl = event.target;
	let files = fileInpControl.files;

	for(var i=0; i<files.length; i++) {
		let reader = new FileReader();
		reader.onload = function(event) {

			let data = event.target.result;
	
			let testfile = {
				stdin: '_fill',
				stdout: '_fill'
			};
			console.log(data);
			var x = data.split("\n\n");
			x[0] += "\n";
			console.log(x);
			testfile.stdin = x[0];
			testfile.stdout = x[1];
			testcases['cases'].push(testfile);
			// console.log();
		}
		reader.readAsText(files[i]);
	}
}

$('.submit').on('click', function () {
	//disable button
	$('.submit').toggleClass('is-loading');

	// creating question object
	const ques = {};

	ques.name = $("#QuesName").val();
	ques.qID = qID;
	ques.isVisible = ($("#isVisible").val() === 'true');
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
	ques.tags = $("#Tags").val().split(",").map(item => item.trim());
	ques.editorial = $("#Editorial").val();
	
	function check(data) {
		if(data !== null && data !== ''  && data !== undefined){
			return true;
		}
		return false;
	}

	if(check(ques.name) && check(ques.isVisible) && check(ques.description) && check(ques.constraints) && check(ques.memoryLimit) && check(ques.timeLimit)) {
		// Works fine;
		;
	}
	else {
		window.alert("All star marked fields must be non-empty!");
		//enable button
		$('.submit').toggleClass('is-loading');
		return 0;
	}
	
	if (ques.timeLimit < 1 || ques.memoryLimit < 1) {
		window.alert("Memory Limit and Time Limit must be greater than 0");
		//enable button
		$(".submit").toggleClass("is-loading");
		return 0;
	  }
	

	// creating testcase Object
	testcases.timeLimit = $("#TimeLimit").val();
	testcases.memoryLimit = $("#MemoryLimit").val();
	$('#testcases').children('div').each(function () {
		let testfile = {
			stdin: '_fill',
			stdout: '_fill'
		};
		testfile.stdin = $(this).find('.stdin').val();
		testfile.stdout = $(this).find('.stdout').val();
		testcases['cases'].push(testfile);
	});
	$('#newtestcases').children('div').each(function () {
		let testfile = {
			stdin: '_fill',
			stdout: '_fill'
		};
		testfile.stdin = $(this).find('.stdin').val();
		testfile.stdout = $(this).find('.stdout').val();
		testcases['cases'].push(testfile);
	});


	if (!testcases.cases.length) {
		window.alert("No Testcase added");
		//enable button
		$('.submit').toggleClass('is-loading');

		return 0;
	}

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
