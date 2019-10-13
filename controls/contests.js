var contests = require("../models/contests");
var participation = require("../models/participation");
var moment = require("moment");
var problems = require("../models/problems");
const scrape = require('../scrapers/contestScraper').scrape;

/**Display the user contests page 
 * route: /contests
*/
exports.showContests = async (req, res, next) => {
	/**Getting the scrapped data of Codechef and Codeforces */
	// let external = await scrape();
	/**Sorting the contest in ascending order of start time */
	// external.sort((a, b) => (a.date > b.date) ? 1 : -1);
	
	/**CodeManiacs contests that are visible to the users
	 * in ascending order of it's starting time
	 */
	contests.find({
			visible: true
		}).sort({
			date: 1
		})
		.then((data) => {
			console.log(data);
			/**Changing the date-time format to display in the contest table */
			for (var i = 0; i < data.length; i++) {
				data[i].dt = moment(data[i].date).format("ll");
				data[i].tm = moment(data[i].date).format("H:mm:ss");
			}
			// for (var i = 0; i < external.length; i++) {
				// external[i].dt = moment(external[i].date).format("ll");
				// external[i].tm = moment(external[i].date).format("H:mm:ss");
			// }
			res.render("users_contests", {
				"contests": data,		// Codemaniacs contests
				"external": []	// Other contests (codechef, codeforces)
			});
		})
		.catch((err) => {
			console.log(err);
		})
}

/**Display a user contest with problems 
 * route: /contests/:contestCode
*/
exports.showContest = async (req, res, next) => {
	var contest = req.params.contestCode;
	contests.findOne({
		code:contest
	}).then( async (data) => {
		var problemsList = [];
		var problemsID = data.problemsID;
		for (var i=0; i<problemsID.length; i++) {
			await problems.findOne({
				qID: problemsID[i]
			}).then((problem) => {
				problemsList.push(problem);
			});
		}
		res.render("contest_display", {problems: problemsList, contest: data});
	});
}

exports.ranklist = async(req,res,next) =>{
	var contest = req.params.contestCode;
	console.log(contest);
	contests.find({code:contest}).then((data)=>{
		console.log(data);
		if(data.length === 0){
			res.render("404");
			return;
		}
		console.log(data);
		console.log(typeof(contest));
		var participations = participation.find({"contestCode":contest});
		res.render("ranklist",{contest:data,list: participations});
	});
}