const settings = {
  async: true,
  crossDomain: true,
  url: "/admin/new-contest",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "cache-control": "no-cache",
  },
  processData: false,
  data: "_fill",
};


$(".submit").on('click', function(){
  
	//disable button
	$('.submit').toggleClass('is-loading');

	// creating contest object
	const newContest = {

	code: $("#contestCode").val(),
	name: $("#contestName").val(),
  date: $("#date").val()+" "+$("#startTime").val(),
  endDate:0,
	duration: $("#duration").val(),
  visible: $("#visibility").val(),
  problemsID: $("#problemsID").val().split(",").map(qID => qID.trim())
	
  };
  
  // console.log(newContest);
  
	// Check whether all star marked fields have value or not
	function check(data) {
		if(data !== null && data !== ''  && data !== undefined){
			return true;
		}
		return false;
	}

	if(check(newContest.code) && check(newContest.name) && check(newContest.date) && check(newContest.duration) && check(newContest.visible)) {
		// Works fine;
		;
  }
	else {
		window.alert("All star marked fields must be non-empty!");
		//enable button
		$('.submit').toggleClass('is-loading');
		return 0;
  }
  
  if(newContest.visible !== 1 && newContest.visible!==0) {
		window.alert("The value of visibility can be 1 or 0 only.");
		//enable button
		$('.submit').toggleClass('is-loading');
		return 0;
  }
  
  

	//send data to server;
	const data = {
    newContest
	};
	settings.data = JSON.stringify(data);
	$.ajax(settings).done(function (response) {
		//enable button
		$('.submit').toggleClass('is-loading');

		//show response
		window.alert(response);

		//empty the input fields
		$('input').val('');
	});

});