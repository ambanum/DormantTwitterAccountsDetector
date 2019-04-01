var express = require('express');
var router = express.Router();

const _ = require('lodash');
const TwitterUser = require('../models/twitterUser');
const TwitterUserToExplore = require('../models/twitterUserToExplore');

/* GET home page. */
router.get('/', function(req, res, next) {
    let twitterUserCount, twitterUserToExploreCount;
    
	TwitterUser.find({}).count()
		.then((count) => {
			twitterUserCount = count;
			return TwitterUserToExplore.find({}).count();
		})
		.then((count) => {
			twitterUserToExploreCount = count;
			res.render('index', { count: (twitterUserCount + twitterUserToExploreCount), twitterUserCount, twitterUserToExploreCount });
		})
		.catch(next);
});

module.exports = router;
