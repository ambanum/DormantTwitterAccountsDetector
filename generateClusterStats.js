const generateData = require('./scripts/cluster_stats');
var CronJob = require('cron').CronJob;

let i = 0;
new CronJob('*/10 * * * *', function () {
    console.log('Generate stats', i++);
    generateData();
}, null, true, 'Europe/Paris');
