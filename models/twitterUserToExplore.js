const mongoose = require('mongoose');

const twitterUserSchema = new mongoose.Schema({
	screenName: {
		type: String,
		required: true,
		unique: true,
	},
	twitterId: {
		type: Number,
		required: true,
		unique: true,
	},
	rawData: Object,
	createdAt: Date
});

const TwitterUserToExplore = mongoose.model('TwitterUserToExplore', twitterUserSchema);
module.exports = TwitterUserToExplore;
