if (!window.TwitterUserGraph) {
	document.querySelector('.graphs').style.display = 'none';
	document.querySelector('.graph-title').style.display = 'none';
} else {

	TwitterUserGraph.data.datesISO.unshift('x');
	TwitterUserGraph.data.nbAccountsSeries.unshift('Nombre de comptes');
	TwitterUserGraph.data.followersMeanSeries.unshift('Moyenne');
	TwitterUserGraph.data.followersMedianSeries.unshift('Médiane');
	TwitterUserGraph.data.followersFirstDecileSeries.unshift('Premier décile');
	TwitterUserGraph.data.followersLastDecileSeries.unshift('Neuvième décile');
	TwitterUserGraph.data.followingsMeanSeries.unshift('Moyenne');
	TwitterUserGraph.data.followingsMedianSeries.unshift('Médiane');
	TwitterUserGraph.data.followingsFirstDecileSeries.unshift('Premier décile');
	TwitterUserGraph.data.followingsLastDecileSeries.unshift('Neuvième décile');
	TwitterUserGraph.data.tweetsMeanSeries.unshift('Moyenne');
	TwitterUserGraph.data.tweetsMedianSeries.unshift('Médiane');
	TwitterUserGraph.data.tweetsFirstDecileSeries.unshift('Premier décile');
	TwitterUserGraph.data.tweetsLastDecileSeries.unshift('Neuvième décile');

	var optionsAxis = {
			y: {
				padding: 0,
				min: 0,
			},
			x: {
					type: 'timeseries',
					tick: {
							format: '%m/%d %Hh%M'
					}
			}
	};

	c3.generate({
			title: { text: 'Évolution du nombre de comptes encore actifs' },
			size: {
					height: 500,
			},
			bindto: '#nbAccounts',
			point: { show: false },
			data: {
					x: 'x',
					xFormat: '%Y-%m-%dT%H:%M:%S.%LZ',
					columns: [
							TwitterUserGraph.data.datesISO,
							TwitterUserGraph.data.nbAccountsSeries,
					]
			},
			axis: optionsAxis,
	});

	c3.generate({
			title: { text: 'Évolution du nombre d\'abonnés' },
			size: {
					height: 500,
			},
			bindto: '#followers',
			point: { show: false },
			data: {
					x: 'x',
					xFormat: '%Y-%m-%dT%H:%M:%S.%LZ',
					columns: [
							TwitterUserGraph.data.datesISO,
							TwitterUserGraph.data.followersMedianSeries,
							TwitterUserGraph.data.followersFirstDecileSeries,
							TwitterUserGraph.data.followersMeanSeries,
							TwitterUserGraph.data.followersLastDecileSeries,
					]
			},
			colors: {
				"Moyenne": "#FF0000",
				"Médiane": "#FF0000",
				"Premier décile": "#FF0000",
				"Neuvième décile": "#FF0000",
			},
			axis: optionsAxis,
	});

	c3.generate({
			title: { text: 'Évolution du nombre d\'abonnements' },
			size: {
					height: 500,
			},
			bindto: '#followings',
			point: { show: false },
			data: {
					x: 'x',
					xFormat: '%Y-%m-%dT%H:%M:%S.%LZ',
					columns: [
							TwitterUserGraph.data.datesISO,
							TwitterUserGraph.data.followingsMedianSeries,
							TwitterUserGraph.data.followingsFirstDecileSeries,
							TwitterUserGraph.data.followingsMeanSeries,
							TwitterUserGraph.data.followingsLastDecileSeries,
					]
			},
			axis: optionsAxis,
	});

	c3.generate({
			title: { text: 'Évolution du nombre de tweets' },
			bindto: '#tweets',
			size: {
					height: 500,
			},
			point: { show: false },
			data: {
					x: 'x',
					xFormat: '%Y-%m-%dT%H:%M:%S.%LZ',
					columns: [
							TwitterUserGraph.data.datesISO,
							TwitterUserGraph.data.tweetsMedianSeries,
							TwitterUserGraph.data.tweetsFirstDecileSeries,
							TwitterUserGraph.data.tweetsMeanSeries,
							TwitterUserGraph.data.tweetsLastDecileSeries,
					]
			},
			axis: optionsAxis,
	});
}