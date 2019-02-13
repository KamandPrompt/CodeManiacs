const cheerio = require('cheerio');
const rp = require('request-promise');
const userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.81 Safari/537.36';
const options = {
	uri: '',
	headers: {
		'User-Agent': userAgent
	},
	transform: function (body) {
		return cheerio.load(body);
	}
};

exports.scrape = async () => {
	const scrapedData = await Promise.all([codeForcesScrape(), codeChefScrape()]);
	return [].concat(...scrapedData);
}

const codeForcesScrape = async () => {
	const data = [];
	options.uri = 'https://codeforces.com/contests';
	const $ = await rp(options);
	const a = $(".datatable tbody").eq(0).children('tr[data-contestid]').each((i, element) => {
		const contest = {
			"name": "",
			"code": "",
			"date": "",
			"duration": "",
			"link": "",
			"platform": "CodeForces",
			"website": 'https://codeforces.com'
		};
		col = $(element).children('td');
		contest.code = $(element).attr('data-contestid');
		contest.name = col.eq(0).text().trim();
		let duration = col.eq(3).text().trim();
		duration = duration.split(":").map(num => Number(num));
		let l = duration.length;
		contest.duration = duration[l - 1] + duration[l - 2] * 60;
		contest.duration += duration[l - 3] ? +(duration[l - 3] * 24 * 60) : 0;
		// since js is not run, therefore time returned has a timezone of moscow,
		// but there is no stamp for timezone, so +0300 is appended
		// remove +0300 when using puppeteer
		contest.date = new Date(col.eq(2).text() + " +0300");
		contest.link = contest.website + "/contests/" + contest.code;
		data.push(contest);
	});
	return data;
}
const codeChefScrape = async () => {
	const data = [];

	options.uri = 'https://www.codechef.com/contests';
	const $ = await rp(options);
	const a = $(".dataTable tbody").slice(0, 2).children('tr').each((i, element) => {
		const contest = {
			"name": "",
			"code": "",
			"link": "",
			"date": "",
			"end": "",
			"duration": "",
			"platform": "CodeChef",
			"website": 'https://www.codechef.com'
		};
		col = $(element).children('td');
		contest.code = col.eq(0).text();
		contest.name = col.eq(1).text();
		contest.link = contest.website + col.eq(1).find('a').attr('href');
		contest.date = new Date(col.eq(2).text());
		contest.end = new Date(col.eq(3).text());
		contest.duration = (contest.end - contest.date) / 60000;
		data.push(contest);
	});
	return data;
}
