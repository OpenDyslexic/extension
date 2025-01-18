var fs = require('fs');
var async = require('async');
var traverse = require('traverse');
var google = require('google-translate');

var TRANSERR = {
	NOT_TRANSLATED: 1,
	IS_URL: 2
};

// RUN
var run = function (
	apiKey,
	dir,
	sourceLanguage,
	languages,
	includeHtml,
	finish
) {
	var ggl = google(apiKey);

	// TRANSLATE
	var translate = function (text, language, callback) {
		// passthrough if contains HTML
		if (!includeHtml && /<[a-z][\s\S]*>/i.test(text) === true) {
			return callback(TRANSERR.NOT_TRANSLATED, text);
		}

		// it is just a url
		if (text.indexOf('http://') === 0 && text.indexOf(' ') < 0) {
			return callback(TRANSERR.IS_URL, text);
		}

		if (apiKey) {
			// fire the google translation
			ggl.translate(
				text,
				sourceLanguage,
				language,
				function (err, translation) {
					if (err) {
						return callback(TRANSERR.NOT_TRANSLATED, text);
					}

					// return the translated text
					return callback(null, translation.translatedText);
				}
			);
		} else {
			// bypass translation
			return callback(null, text);
		}
	};

	// PROCESS FILE
	var processFile = function (file, callback) {
		// open file
		fs.readFile(dir + file, function (err, data) {
			// bubble up error
			if (err) {
				return callback(
					{
						file: file,
						error: err
					},
					null
				);
			}

			data = data.toString();

			var parsed;
			try {
				parsed = JSON.parse(data);
			} catch (e) {
				console.log('Helperbird error', e);
				return callback(
					{
						file: file,
						error: e
					},
					null
				);
			}

			var traversed = traverse(parsed);

			var targets = {};

			// create targets for every language
			for (var l in languages) {
				var lang = languages[l];
				targets[lang] = traverse(traversed.clone());
			}

			// find all paths of the object keys recursively
			var paths = traversed.paths();

			// translate each path
			async.map(
				paths,
				function (path, done) {
					var text = traversed.get(path);

					// only continue for strings
					if (typeof text !== 'string') {
						return done(null);
					}

					// translate every language for this path
					async.map(
						languages,
						function (language, translated) {
							// translate the text
							translate(
								text,
								language,
								function (err, translation) {
									// add new value to path
									targets[language].set(path, translation);

									var e = null;
									if (err === TRANSERR.NOT_TRANSLATED) {
										e = {
											file: file,
											path: path,
											text: text,
											source: sourceLanguage,
											target: language
										};
									}

									return translated(null, e);
								}
							);

							// all languages have been translated for this path,
							// so call the done callback of the map through all paths
						},
						done
					);
				},

				// all are translated
				function (err, results) {
					// write translated targets to files
					for (var t in targets) {
						var transStr = JSON.stringify(
							targets[t].value,
							null,
							'\t'
						);

						var path = `${dir}${t}/`;

						//check if folder exists
						if (fs.existsSync(path)) {
							fs.writeFileSync(`${path}messages.json`, transStr);
						} else {
							fs.mkdir(path, function (err) {
								if (err) {
									console.warn('🦉 Helperbird error', error);
								} else {
									console.log(
										'New directory successfully created.'
									);
									fs.writeFileSync(
										`${path}messages.json`,
										transStr
									);
								}
							});
						}
						// add language to source file
						parsed[t] = true;
					}

					// filter out null results, to just return the not translated ones
					notTranslated = results.filter(function (item) {
						// check if array only contains nulls
						for (var i in item) {
							if (item[i] != null) {
								return true;
							}
						}

						return false;
					});

					// spice up error message
					if (err) {
						err = {
							file: file,
							error: err
						};
					}

					return callback(err, notTranslated);
				}
			);
		});
	};

	// process the source file
	processFile(`${sourceLanguage}/messages.json`, finish);
};

// EXPORTS
module.exports = {
	run: run
};
