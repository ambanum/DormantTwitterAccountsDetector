const mongoose = require('mongoose');

const TwitterUserBackupSchema = new mongoose.Schema({
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

const TwitterUserBackup = mongoose.model('TwitterUserBackup', TwitterUserBackupSchema);
module.exports = TwitterUserBackup;
