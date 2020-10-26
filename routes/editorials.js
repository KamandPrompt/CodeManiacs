var express = require("express");
var router = express.Router();
var editorials = require("../controls/editorials");

router.get("/", editorials.showAll);

router.get("/:qID", editorials.showOne);

module.exports = router;