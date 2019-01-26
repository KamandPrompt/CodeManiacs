var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var logger = require("morgan");
var mongoose = require("mongoose");
var expressValidator = require("express-validator");
var session = require("express-session");
var configDb = require("./config/database");
var passport = require("passport");
var publicRoute = require("./routes/index");
var adminRoute = require("./routes/admin");
var usersRoute = require("./routes/users");
var functions = require("./controls/functions");

mongoose.connect(configDb.database, { useNewUrlParser: true });
var db = mongoose.connection;

db.once("open", () => {
    console.log("MongoDB connected!");
});

db.on("error", (err) => {
    console.log(err);
});

var app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine("html", require("ejs").renderFile);
app.use(express.static(path.join(__dirname, "public")));

// Express-session-middleware
app.use(session({
    secret: "code-maniacs-session",
    resave: true,
    saveUninitialized: true
}));

// Express-validator-middleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

/**
 * Passport-middleware
 */

app.listen(port, () => {
    console.log("Server started at port " + port);
});
app.use("/", publicRoute);
app.use("/user", usersRoute);

app.use("/admin", adminRoute);

app.get("/submit/:qID", (req, res, next) => {
    res.render("solution_submit");
});

app.post("/submit/:qID", functions.submitSolution);

app.post("/problem/:qID", (req, res, next) => {
    res.redirect('/submit/' + req.params.qID);
});

exports = module.exports = app;
