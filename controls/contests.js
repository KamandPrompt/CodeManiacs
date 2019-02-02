var contests = require("../models/contests");
var moment = require("moment");

exports.showContests = async (req, res, next) => {
    contests.find({ visible: true }).sort({ date: 1 })
        .then((data) => {
            console.log(data);
            for (var i = 0; i < data.length; i++) {
                data[i].dt = moment(data[i].date).format("ll");
                data[i].tm = moment(data[i].date).format("H:mm:ss");
            }
            res.render("all_contests", { contests: data });
        })
        .catch((err) => {
            console.log(err);
        })
}
