var contests = require("../models/contests");
var moment = require("moment");
const scrape = require('../scrapers/contestScraper').scrape;

exports.showContests = async (req, res, next) => {
	let external = await scrape();
	external.sort((a, b) => (a.date > b.date) ? 1 : -1);
	contests.find({
			visible: true
		}).sort({
			date: 1
		})
		.then((data) => {
			console.log(data);

			for (var i = 0; i < data.length; i++) {
				data[i].dt = moment(data[i].date).format("ll");
				data[i].tm = moment(data[i].date).format("H:mm:ss");
			}
			for (var i = 0; i < external.length; i++) {
				external[i].dt = moment(external[i].date).format("ll");
				external[i].tm = moment(external[i].date).format("H:mm:ss");
			}
			res.render("users_contests", {
				"contests": data,
				"external": external
			});
		})
		.catch((err) => {
			console.log(err);
		})
}