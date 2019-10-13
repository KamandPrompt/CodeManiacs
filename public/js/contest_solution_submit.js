const question_id = window.location.href.split("/")[4];
const contest_id = window.location.href.split("/")[2];
var prob_no = $("#prob-no");
const data = {
	"code": "_fill",
	"qID": "_fill",
	"language": "_fill"
};
const settings = {
	"async": true,
	"crossDomain": true,
	"url": "/contest/"+ contest_id + "/submit/" + question_id,
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

prob_no.append("<a target = '_blank' href='/problem/" + question_id + "'>" + question_id + "</a>");

const submitSolution = () => {
	document.getElementById("running").style.display = "block";
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

		document.getElementById("running").style.display = "none";

		response.forEach((item, index) => {

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

const goBack = () => {
	window.location.href = "/problem/" + question_id ;
}
