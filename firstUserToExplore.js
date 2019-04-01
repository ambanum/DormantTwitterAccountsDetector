require('dotenv').config();
const mongoose = require('mongoose');
const TwitterUserToExplore = require('./models/twitterUserToExplore');

const Twitter = require('twit');
const T = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

mongoose.connect(process.env.MONGO_URL);

T.get('users/show', { screen_name: process.env.USER_SEED }, function (error, user, response) {
    if (error) {
        return console.error(error);
    }

    TwitterUserToExplore.create({
        twitterId: user.id_str,
        screenName: user.screen_name,
        rawData: user,
        createdAt: new Date(),
    }).then(() => {
        mongoose.disconnect();
    });
});
