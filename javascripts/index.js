if (!window.TwitterUserGraph) {
	document.querySelector('.graphs').style.display = 'none';
	document.querySelector('.graph-title').style.display = 'none';
} else {
	// use second element of pathname as the first one is `twitter-bot-clusters`
	const langInUrl = window.location.pathname.split('/')[2];
	i18next.init({
		lng: (['en', 'fr'].includes(langInUrl) && langInUrl) || 'en',
		resources: {
			en: {
				translation: {
					"number of accounts": "Number of accounts",
					"means": "Means",
					"median": "Median",
					"first decile": "First decile",
					"ninth decile": "Ninth Decile",
					"evolution of the number of accounts still active": "Evolution of the number of accounts still active",
					"evolution of the number of subscribers": "Evolution of the number of subscribers",
					"evolution of the number of subscriptions": "Evolution of the number of subscriptions",
					"evolution of the number of tweets": "Evolution of the number of tweets",
				}
			},
			fr: {
				translation: {
					"number of accounts": "Nombre de comptes",
					"means": "Moyenne",
					"median": "Médiane",
					"first decile": "Premier décile",
					"ninth decile": "Neuvième décile",
					"evolution of the number of accounts still active": "Évolution du nombre de comptes encore actifs",
					"evolution of the number of subscribers": "Évolution du nombre d'abonnés",
					"evolution of the number of subscriptions": "Évolution du nombre d'abonnements",
					"evolution of the number of tweets": "Évolution du nombre de tweets",
				}
			}
		}
	}, function (err, t) {
		// initialized and ready to go!
		TwitterUserGraph.data.datesISO.unshift('x');
		TwitterUserGraph.data.nbAccountsSeries.unshift(t('number of accounts'));
		TwitterUserGraph.data.followersMeanSeries.unshift(t('means'));
		TwitterUserGraph.data.followersMedianSeries.unshift(t('median'));
		TwitterUserGraph.data.followersFirstDecileSeries.unshift(t('first decile'));
		TwitterUserGraph.data.followersLastDecileSeries.unshift(t('ninth decile'));
		TwitterUserGraph.data.followingsMeanSeries.unshift(t('means'));
		TwitterUserGraph.data.followingsMedianSeries.unshift(t('median'));
		TwitterUserGraph.data.followingsFirstDecileSeries.unshift(t('first decile'));
		TwitterUserGraph.data.followingsLastDecileSeries.unshift(t('ninth decile'));
		TwitterUserGraph.data.tweetsMeanSeries.unshift(t('means'));
		TwitterUserGraph.data.tweetsMedianSeries.unshift(t('median'));
		TwitterUserGraph.data.tweetsFirstDecileSeries.unshift(t('first decile'));
		TwitterUserGraph.data.tweetsLastDecileSeries.unshift(t('ninth decile'));

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
			title: { text: t('evolution of the number of accounts still active') },
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
			title: { text: t('evolution of the number of subscribers') },
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
			title: { text: t('evolution of the number of subscriptions') },
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
			title: { text: t('evolution of the number of tweets') },
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
	});
}
