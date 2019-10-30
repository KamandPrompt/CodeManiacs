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
			visible: true,
			endDate: {$gt:Date.now()}
		}).sort({
			date: 1
		})
		.then((data) => {
			/**Changing the date-time format to display in the contest table */
			for (var i = 0; i < data.length; i++) {
				data[i].dt = moment(data[i].date).format("ll");
				data[i].tm = moment(data[i].date).format("H:mm:ss");
				var duration = data[i].duration;
				var x = duration%60;
				var temp = x+"m ";
				duration = Math.floor(duration/60);
				x = duration%24;
				if(duration){
					temp = x+"h "+temp;
					console.log(duration,temp,x)
					duration = Math.floor(duration/24);
					x = duration
					if(duration){
						temp = x+"d "+temp;
						console.log(temp);
					}
				}
				data[i].dur = temp;
			}
			console.log(data);
			// for (var i = 0; i < external.length; i++) {
				// external[i].dt = moment(external[i].date).format("ll");
				// external[i].tm = moment(external[i].date).format("H:mm:ss");
			// }
			contests.find({
				visible: true,
				endDate: {$lt:Date.now()}
			}). sort({
				date:1
			})
			.then((pastdata)=>{
				for (var i = 0; i < pastdata.length; i++) {
					pastdata[i].dt = moment(pastdata[i].date).format("ll");
					pastdata[i].tm = moment(pastdata[i].date).format("H:mm:ss");
					var duration = pastdata[i].duration;
					var x = duration%60;
					var temp = x+"m ";
					duration = Math.floor(duration/60);
					x = duration%24;
					if(x){
						temp = x+"h "+temp;
						console.log(duration,temp,x)
						duration = Math.floor(duration/24);
						x = duration
						if(x){
							temp = x+"d "+temp;
							console.log(temp);
						}
					}
					pastdata[i].dur = temp;
				}
				// console.log(pastdata)
				res.render("users_contests", {
					"contests": data,		// Codemaniacs contests
					"external": [],	// Other contests (codechef, codeforces)
					"pastcontests": pastdata
				});
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
		// console.log("data   ---------------------");
		// console.log(data);
		var contest_start = moment(data.date).format("YYYY-MM-DD H:mm:ss") > moment(Date.now()).format("YYYY-MM-DD H:mm:ss")
		if(contest_start){
			res.redirect("/contests/");
			return;
		}
		if(req.user!=null){
			var user = req.user.username;
			var contestId = contest;
			participation.find({
				contestCode:contestId,
				username:user
			}).then(async(partData)=>{
				if(partData.length===0){
					participation.create({
						contestCode:contestId,
						username:user,
						startTime:data.date,
						score:0,
						penalty:0,
						endTime:(moment(data.date).add(data.duration,'m').toDate())
					});
				}
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
			})
		}
		else{
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
		}
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
		participation.find({"contestCode":contest}).sort({'score': -1, 'penalty': 1}).then(async(participations) => {
			res.render("ranklist",{contest:data,list: participations});
		});
	});
}