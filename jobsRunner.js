require('dotenv').config();
const mongoose = require('mongoose');
const TwitterUserBackup = require('./models/twitterUserBackup');
const TwitterUser = require('./models/twitterUser');
const TwitterUserToExplore = require('./models/twitterUserToExplore');
var CronJob = require('cron').CronJob;

const Twitter = require('twit');
const T = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

mongoose.connect(process.env.MONGO_URL);

const MAX_TWEET_COUNT = 15;
const MAX_RATIO_FRIENDS_FOLLOWERS = 3;
const MIN_CREATION_DATE = 'Fri Feb 01 00:00:00 +0000 2019';


function getFollowers(user) {
    console.log('-> Fetch user', user.screenName, user.twitterId);
    // WARNING limited with the 200 firsts users, must check others pages
    return T.get('followers/list', { screen_name: user.screenName, count: 200 }).catch((err) => {
        console.error(err.message);

        return null;
    });
}

const runJob = function () {
    TwitterUserToExplore
        .findOne({})
        .then((twitterUserToExplore) => {
            if (!twitterUserToExplore) {
                console.log('no more users to check');
                return;
            }

            getFollowers(twitterUserToExplore)
                .then((response) => {
                    if (!response) {
                        console.log(`Remove ${twitterUserToExplore.screenName}: can't be explored (Error or protected account)`);
                        twitterUserToExplore.remove();
                        return;
                    }
                    const followers = response.data.users;

                    followers.forEach((follower) => {

                        TwitterUserBackup.findOneAndUpdate(
                            {
                                twitterId: follower.id_str,
                            },
                            {
                                twitterId: follower.id_str,
                                screenName: follower.screen_name,
                                rawData: follower,
                                createdAt: new Date(),
                            },
                            { upsert: true, new: true, setDefaultsOnInsert: true }
                        ).then((user) => {
                            console.log(`\tBackuped or update: ${user.screenName}`);
                            if (follower.protected) {
                                console.log(`\tSkip ${follower.screen_name}: protected`);
                                return;
                            }

                            if (Date.parse(follower.created_at) < new Date(MIN_CREATION_DATE)) {
                                console.log(`\tSkip ${follower.screen_name}: created before ${new Date(MIN_CREATION_DATE).toDateString()}`);
                                return;
                            }

                            if (follower.statuses_count > MAX_TWEET_COUNT) {
                                console.log(`\tSkip ${follower.screen_name}: has ${follower.statuses_count} tweets`);
                                return;
                            }

                            if ((follower.friends_count / follower.followers_count) < MAX_RATIO_FRIENDS_FOLLOWERS) {
                                console.log(`\tSkip ${follower.screen_name}: ratio friends/followers ${(follower.friends_count / follower.followers_count)}`);
                                return;
                            }

                            TwitterUserToExplore.findOne({ twitterId: follower.id_str })
                                .then((alreadyWaitingToBeExploredUser) => {
                                    return TwitterUser.findOne({ twitterId: follower.id_str })
                                        .then((alreadyExploredUser) => {
                                            return {
                                                alreadyWaitingToBeExploredUser,
                                                alreadyExploredUser
                                            };
                                        });
                                })
                                .then(({ alreadyWaitingToBeExploredUser, alreadyExploredUser }) => {
                                    if (alreadyExploredUser) {
                                        console.log(`\tSkip ${alreadyExploredUser.screenName} (${alreadyExploredUser.twitterId}) as it's already explored`);
                                        return;
                                    }

                                    if (alreadyWaitingToBeExploredUser) {
                                        console.log(`\tSkip ${alreadyWaitingToBeExploredUser.screenName} (${alreadyWaitingToBeExploredUser.twitterId}) as it's already waiting to be explored`);
                                        return;
                                    }

                                    TwitterUserToExplore.create({
                                        twitterId: follower.id_str,
                                        screenName: follower.screen_name,
                                        rawData: follower,
                                        createdAt: new Date(),
                                    });
                                });
                        });
                    });

                    TwitterUser.findOne({ twitterId: twitterUserToExplore.twitterId })
                        .then((alreadyExploredUser) => {
                            if (alreadyExploredUser) {
                                console.log(`\tSkip user ${alreadyExploredUser.screenName}: already explored`);
                                return;
                            }

                            if (Date.parse(twitterUserToExplore.rawData.created_at) < new Date(MIN_CREATION_DATE)) {
                                console.log(`\tSkip ${twitterUserToExplore.rawData.screen_name}: created before ${new Date(MIN_CREATION_DATE).toDateString()}"`);
                                return;
                            }

                            if (twitterUserToExplore.rawData.statuses_count > MAX_TWEET_COUNT) {
                                console.log(`\tSkip ${twitterUserToExplore.rawData.screen_name}: has ${twitterUserToExplore.rawData.statuses_count} tweets`);
                                return;
                            }

                            if ((twitterUserToExplore.rawData.friends_count / twitterUserToExplore.rawData.followers_count) < MAX_RATIO_FRIENDS_FOLLOWERS) {
                                console.log(`\tSkip ${twitterUserToExplore.rawData.screen_name}: ratio friends/followers ${(twitterUserToExplore.rawData.friends_count / twitterUserToExplore.rawData.followers_count)}`);
                                return;
                            }

                            TwitterUser.create({
                                twitterId: twitterUserToExplore.twitterId,
                                screenName: twitterUserToExplore.screenName,
                                rawData: twitterUserToExplore.rawData,
                                createdAt: new Date(),
                                followers: followers,
                            });
                        });

                    // use mongoose delete instead of find and remove to avoid concurrency problems                        
                    twitterUserToExplore.remove();
                });
        });
};

let i = 0;
new CronJob('*/1 * * * *', function () {
    console.log('Run job', i++);
    runJob();
}, null, true, 'Europe/Paris');

function getRateLimitStatus() {
    T.get('application/rate_limit_status', { resources: 'followers' }, function (error, response) {
        console.log(response);
    });
}

