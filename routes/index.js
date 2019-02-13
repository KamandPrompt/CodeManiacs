var express = require("express");
var router = express.Router();
var contests = require("../controls/contests");
var problems = require("../controls/problems");

/**Getting the homepage */
router.get("/", (req, res) => {
    res.render("index");
});

/**Display the contribution page */
router.get("/contribution", (req, res) => {
    res.render("contribution");
});

/**Display the user contest page */
router.get("/contests", contests.showContests);

/**Display the problem set visible to the users */
router.get("/problems/all", problems.problemSet);

/**Display the problem with qID */
router.get("/problem/:qID", problems.displayProblem);

/**Display the user ranklist page */
router.get("/rankings", problems.userRankings);

/**Display the IDE page */
router.get("/ide", problems.getIde);

/**POST: submitting the IDE code, input */
router.post("/ide", problems.postIde);

module.exports = router;
