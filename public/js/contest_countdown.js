var table = document.getElementById("display-all-contests");
var rows = table.getElementsByTagName("tr");
var deadlineArr = [];
for (var i = 0; i < rows.length - 1; i++) {
    var tr = document.getElementById(i.toString(10));
    var dt = tr.getElementsByTagName("td");
    deadlineArr[i] = new Date(dt[2].innerText);
}
var x = setInterval(function () {
    for (var i = 0; i < rows.length - 1; i++) {
        var deadline = new Date(deadlineArr[i]).getTime();
        var now = new Date().getTime();
        var t = deadline - now;
        var days = Math.floor(t / (1000 * 60 * 60 * 24));
        var hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((t % (1000 * 60)) / 1000);
        var tr = document.getElementById(i.toString(10));
        var td = tr.getElementsByTagName("td")
        td[2].innerHTML = days + "d "
            + hours + "h " + minutes + "m " + seconds + "s ";
        if (t < 0) {
            clearInterval(x);
            td[2].innerHTML = "Running";
        }
    }
}, 1000);
