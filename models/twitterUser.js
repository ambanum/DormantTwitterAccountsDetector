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
	followers: Array,
	friends: Array,
	rawData: Object,
	createdAt: Date
});

const TwitterUser = mongoose.model('TwitterUser', twitterUserSchema);
module.exports = TwitterUser;
