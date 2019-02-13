var contests = require("../models/contests");
var moment = require("moment");
const scrape = require('../scrapers/contestScraper').scrape;

/**Display the user contest page 
 * route: /contests
*/
exports.showContests = async (req, res, next) => {
	/**Getting the scrapped data of Codechef and Codeforces */
	let external = await scrape();
	/**Sorting the contest in ascending order of start time */
	external.sort((a, b) => (a.date > b.date) ? 1 : -1);
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
			for (var i = 0; i < external.length; i++) {
				external[i].dt = moment(external[i].date).format("ll");
				external[i].tm = moment(external[i].date).format("H:mm:ss");
			}
			res.render("users_contests", {
				"contests": data,		// Codemaniacs contests
				"external": external	// Other contests (codechef, codeforces)
			});
		})
		.catch((err) => {
			console.log(err);
		})
}
