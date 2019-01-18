var express = require ("express");
var bodyParser = require ("body-parser");
var path = require ("path");
var app = express();
const logger = require('morgan');
const solution = require('./routes/solution');
var routes = require ("./routes/index.js");
const port = 3000;

app.set ("view engine", "ejs");
app.set ("views", path.join (__dirname, "views"));
app.use(logger('dev'))
app.use (bodyParser.json ());
app.use (bodyParser.urlencoded ({extended: false}));
app.engine ("html", require ("ejs").renderFile);
app.use (express.static (path.join (__dirname, "public")));

app.use ("/", routes);
app.use('/solution',solution);

app.listen (port, () => {
    console.log ("Server started at port " + port);	
});

exports = module.exports = app
