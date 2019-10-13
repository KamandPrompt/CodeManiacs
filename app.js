var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var logger = require("morgan");
var mongoose = require("mongoose");
var expressValidator = require("express-validator");
var session = require("express-session");
var configDb = require("./config/database");
var passport = require("passport");
var localStrategy = require('passport-local').Strategy;
var publicRoute = require("./routes/index");
var adminRoute = require("./routes/admin");
var usersRoute = require("./routes/users");
var problems = require("./controls/problems");
var enforceAuthentication = require('./controls/auth').enforceAuthentication;
var lang = require("./config/lang")

mongoose.Promise = global.Promise;
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
app.use(bodyParser.json({ limit: "30MB", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30MB", extended: true }));
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

app.use(passport.initialize());
app.use(passport.session());

var user = require('./models/users');
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.listen(port, () => {
    console.log("Server started at port " + port);
});

/**GET: Setting global variable for the logged in user */
app.get("*", (req, res, next) => {
    res.locals.user = req.user || null;
    console.log("User: " + res.locals.user);
    next();
});

/**POST: Setting global variable for the logged in user */
app.post("*", (req, res, next) => {
    res.locals.user = req.user || null;
    console.log("User: " + res.locals.user);
    next();
});

app.use("/", publicRoute);
app.use("/user", usersRoute);

app.use("/admin", enforceAuthentication(true, true), adminRoute);

app.get("/contests/:contestCode/submit/:qID",enforceAuthentication(true,false),(req,res,next) => {
    res.render("contest_solution_submit" ,{ langlist: lang});
});

/**Display the page to submit problem qID */
app.get("/submit/:qID", enforceAuthentication(true, false), (req, res, next) => {
    res.render("solution_submit", { langlist: lang });
});

app.post("/contests/:contestCode/submit/:qID",enforceAuthentication(true,false), problems.submitContestSolution); 

/**POST: submitting the problem qID */
app.post("/submit/:qID", enforceAuthentication(true, false), problems.submitSolution);

/**POST: after clicking the submit button on the problem display page */
app.post("/problem/:qID", (req, res, next) => {
    res.redirect('/submit/' + req.params.qID);
});

/**Display page when error 404: page not found occur */
app.use((req, res, next) => {
    res.status(404);
    res.render("not_found");
})

exports = module.exports = app;
