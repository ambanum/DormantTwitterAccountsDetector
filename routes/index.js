const express = require('express');
const router = express.Router();
const i18n = require('i18n');

const _ = require('lodash');
const TwitterUser = require('../models/twitterUser');
const TwitterUserToExplore = require('../models/twitterUserToExplore');

/* GET home page. */
router.get('/:lang?', function(req, res, next) {
	const lang = req.params.lang || 'en';
	i18n.setLocale(res.locals, lang);
    let twitterUserCount, twitterUserToExploreCount;
    
	TwitterUser.find({}).count()
		.then((count) => {
			twitterUserCount = count;
			return TwitterUserToExplore.find({}).count();
		})
		.then((count) => {
			twitterUserToExploreCount = count;
			console.log("i18n.getLocale()", req.getLocale());
			
			res.render('index', { lang: lang , count: (twitterUserCount + twitterUserToExploreCount), twitterUserCount, twitterUserToExploreCount });
		})
		.catch(next);
});

module.exports = router;
