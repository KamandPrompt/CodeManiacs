var express = require("express");
var router = express.Router();
var admin = require("../controls/admin");

/**Admin homepage displaying all the problems created till now */
router.get("/", admin.displayAllProblems);

/**Display page for creating a new problem */
router.get("/add", (req, res, next) => {
    res.render("problem_add");
});

/**Display page for editing the existing problem having qID = params:qID */
router.get("/edit/:qID", admin.getQuestion);

/**POST: creating a new problem */
router.post("/add", admin.addQuestion);

/**PUT: editing the problem qID */
router.put("/edit/:qID", admin.editQuestion);

/**POST: deleting the problem qID */
router.post("/dlt_prob/:qID", admin.deleteProblem);

/**POST: deleting the constest params:contCode */
router.post("/dlt_contest/:contCode", admin.deleteContest);

/**Display page to create a new contest */
router.get("/new-contest", (req, res, next) => {
    res.render("new_contest");
});

/**POST: creating a new contest */
router.post("/new-contest", admin.createContest);

/**Display page consisting all the created contests */
router.get("/my-contests", admin.myContests);

/**Display page to edit the contest params:contCode */
router.get("/edit-contest/:contCode", admin.displayEditContest);

/**POST: edit the contest params:contCode */
router.post("/edit-contest/:contCode", admin.editContest);

module.exports = router;
