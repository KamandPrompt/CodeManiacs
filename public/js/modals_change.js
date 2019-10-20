// Hide modal on opening another modal
$('.close-modal', '#loginModal').click(function() {
    $('#loginModal').modal('hide');
});
$('.close-modal', '#signupModal').click(function() {
    $('#signupModal').modal('hide');
});

$('#loginform').on('submit', function(e){
    e.preventDefault();
    var data = $(this).serialize();
    $.post('/user/login', data, function(result) {
        if (result.valid==true){
            document.location.reload();
        } else {
            $('#errormsg').text(result.message);
        }
    });
});

$('#signupform').on('submit', function(e){
    e.preventDefault();
    var data = $(this).serialize();
    $.post('/user/signup', data, function(result) {
        if (result.valid==true){
            document.location.reload();
        } else {
            $('#errormsg2').text(result.message);
        }
    });
});