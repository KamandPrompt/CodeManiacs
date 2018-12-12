var express = require ("express");
var bodyParser = require ("body-parser");
var path = require ("path");
var app = express();
var routes = require ("./routes/index.js");
const port = 3000;

app.set ("view engine", "ejs");
app.set ("views", path.join (__dirname, "views"));
app.use (bodyParser.json ());
app.use (bodyParser.urlencoded ({extended: false}));
app.engine ("html", require ("ejs").renderFile);
app.use ("/", routes);
app.listen (port, () => {
    console.log ("Server started at port " + port);
});

exports = module.exports = app