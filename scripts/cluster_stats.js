const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const fs = require('fs');


url = "mongodb://localhost";
dbName = "twitterUserRecorder"

const client = new MongoClient(url, { useNewUrlParser: true });

function generate() {
	client.connect(function(err) {
			assert.equal(null, err);
			const db = client.db(dbName);
			db.collection('twitterusers').find(
					query={},
					options={
							"projection": {
									"screenName": 1,
									"createdAt": 1,
									"rawData.followers_count": 1,
									"rawData.friends_count": 1,
									"rawData.statuses_count": 1,
									"_id": 0,
							},
					},
			).toArray(function(err, docs) {
					assert.equal(null, err);

					const statsByDate = {};
					const dates = [];

					docs.forEach(function(doc) {
							const followersCount = doc['rawData']['followers_count'];
							const followingsCount = doc['rawData']['friends_count'];
							const tweetsCount = doc['rawData']['statuses_count'];
							const screenName = doc['screenName'];
							const fetchDate = doc['createdAt'];

							fetchDate.setMilliseconds(0);
							fetchDate.setSeconds(0);
							const minutes = fetchDate.getMinutes(0);
							const truncatedMinutes = Math.floor(minutes/20)*20;
							fetchDate.setMinutes(truncatedMinutes);

							if (!(fetchDate in statsByDate)) {
									dates.push(fetchDate);
									statsByDate[fetchDate] = {
											'screenNames': [],
											'followersCounts': [],
											'followingsCounts': [],
											'tweetsCounts': [],
									};
							}

							statsByDate[fetchDate]['screenNames'].push(screenName);
							statsByDate[fetchDate]['followersCounts'].push(followersCount);
							statsByDate[fetchDate]['followingsCounts'].push(followingsCount);
							statsByDate[fetchDate]['tweetsCounts'].push(tweetsCount);
					});

					dates.sort((a, b) => a.getTime() - b.getTime());

					let outputStr = '';

					let previousDate = null;

					const nbAccountsSeries = [];
					const followersMeanSeries = [];
					const followersMedianSeries = [];
					const followersFirstDecileSeries = [];
					const followersLastDecileSeries = [];
					const followingsMeanSeries = [];
					const followingsMedianSeries = [];
					const followingsFirstDecileSeries = [];
					const followingsLastDecileSeries = [];
					const tweetsMeanSeries = [];
					const tweetsMedianSeries = [];
					const tweetsFirstDecileSeries = [];
					const tweetsLastDecileSeries = [];

					dates.forEach(function(date) {
							const followers = statsByDate[date]['followersCounts'].sort((a, b) => a - b);
							const followings = statsByDate[date]['followingsCounts'].sort((a, b) => a - b);
							const tweets = statsByDate[date]['tweetsCounts'].sort((a, b) => a - b);

							const nbAccounts = statsByDate[date]['screenNames'].length;
							const medianIndex = Math.floor(nbAccounts/2);
							const firstDecileIndex = Math.floor(nbAccounts/10);
							const lastDecileIndex = Math.floor(nbAccounts*9/10);

							const followersMean = followers.reduce((a, b) => a + b)/nbAccounts;
							const followersMedian = followers[medianIndex];
							const followersFirstDecile = followers[firstDecileIndex];
							const followersLastDecile = followers[lastDecileIndex];

							const followingsMean = followings.reduce((a, b) => a + b)/nbAccounts;
							const followingsMedian = followings[medianIndex];
							const followingsFirstDecile = followings[firstDecileIndex];
							const followingsLastDecile = followings[lastDecileIndex];

							const tweetsMean = tweets.reduce((a, b) => a + b)/nbAccounts;
							const tweetsMedian = tweets[medianIndex];
							const tweetsFirstDecile = tweets[firstDecileIndex];
							const tweetsLastDecile = tweets[lastDecileIndex];

							outputStr += `${date}, ${nbAccounts}, ${followersMean}, ${followersMedian}, ${followersFirstDecile}, ${followersLastDecile}, ${followingsMean}, ${followingsMedian}, ${followingsFirstDecile}, ${followingsLastDecile}, ${tweetsMean}, ${tweetsMedian}, ${tweetsFirstDecile}, ${tweetsLastDecile}\n`;

							if (!!previousDate) {
									const previousDateList = statsByDate[previousDate]['screenNames'];
									const currentDateList = statsByDate[date]['screenNames'];

									const removed = previousDateList.filter(x => !currentDateList.includes(x));
									const added = currentDateList.filter(x => !previousDateList.includes(x));

									if (!!removed.length) {
											console.log(`At date ${date}, ${removed.length} users were removed: ${removed}`);
									}
									if (!!added.length) {
											console.log(`At date ${date}, ${added.length} users were added: ${added}`);
									}
							}

							nbAccountsSeries.push(nbAccounts);
							followersMeanSeries.push(followersMean);
							followersMedianSeries.push(followersMedian);
							followersFirstDecileSeries.push(followersFirstDecile);
							followersLastDecileSeries.push(followersLastDecile);
							followingsMeanSeries.push(followingsMean);
							followingsMedianSeries.push(followingsMedian);
							followingsFirstDecileSeries.push(followingsFirstDecile);
							followingsLastDecileSeries.push(followingsLastDecile);
							tweetsMeanSeries.push(tweetsMean);
							tweetsMedianSeries.push(tweetsMedian);
							tweetsFirstDecileSeries.push(tweetsFirstDecile);
							tweetsLastDecileSeries.push(tweetsLastDecile);

							previousDate = date;
					});

					let jsFile = 'window.TwitterUserGraph = {data: {}};';
					jsFile += `window.TwitterUserGraph.data.datesISO = ${JSON.stringify(dates.map((date) => date.toISOString()))};\n`
					jsFile += `window.TwitterUserGraph.data.nbAccountsSeries = ${JSON.stringify(nbAccountsSeries)};\n`
					jsFile += `window.TwitterUserGraph.data.followersMeanSeries = ${JSON.stringify(followersMeanSeries)};\n`
					jsFile += `window.TwitterUserGraph.data.followersMedianSeries = ${JSON.stringify(followersMedianSeries)};\n`
					jsFile += `window.TwitterUserGraph.data.followersFirstDecileSeries = ${JSON.stringify(followersFirstDecileSeries)};\n`
					jsFile += `window.TwitterUserGraph.data.followersLastDecileSeries = ${JSON.stringify(followersLastDecileSeries)};\n`
					jsFile += `window.TwitterUserGraph.data.followingsMeanSeries = ${JSON.stringify(followingsMeanSeries)};\n`
					jsFile += `window.TwitterUserGraph.data.followingsMedianSeries = ${JSON.stringify(followingsMedianSeries)};\n`
					jsFile += `window.TwitterUserGraph.data.followingsFirstDecileSeries = ${JSON.stringify(followingsFirstDecileSeries)};\n`
					jsFile += `window.TwitterUserGraph.data.followingsLastDecileSeries = ${JSON.stringify(followingsLastDecileSeries)};\n`
					jsFile += `window.TwitterUserGraph.data.tweetsMeanSeries = ${JSON.stringify(tweetsMeanSeries)};\n`
					jsFile += `window.TwitterUserGraph.data.tweetsMedianSeries = ${JSON.stringify(tweetsMedianSeries)};\n`
					jsFile += `window.TwitterUserGraph.data.tweetsFirstDecileSeries = ${JSON.stringify(tweetsFirstDecileSeries)};\n`
					jsFile += `window.TwitterUserGraph.data.tweetsLastDecileSeries = ${JSON.stringify(tweetsLastDecileSeries)};\n`
					jsFile += '\n';

					// fs.writeFileSync('clusterStats.txt', outputStr)
					fs.writeFileSync('public/javascripts/clusterStatsData.js', jsFile)

					client.close();
			});
	});
}

module.exports = generate;
