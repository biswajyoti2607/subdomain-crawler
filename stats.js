var Config = require('./config');
var LokiDB = require('lokijs');
var Lfsa = require('./node_modules/lokijs/src/loki-fs-structured-adapter.js');
var fs = require('fs');

function init() {
	var config = Config;
	var adapter = new Lfsa();
	var db = new LokiDB(config.db.file, {
		adapter : adapter,
		autoload: true, 
		autoloadCallback: function() {
			try {
				var pages = db.getCollection("pages");
				if(pages == null) {
					pages = db.addCollection('pages', {unique: ['url']});
				}
				var crawled = pages.find({'processed': true});
				var notCrawled = pages.find({'processed': false});
				var stats = crawled.length + "," + notCrawled.length;
				console.log(stats);
				stats = stats + "\n";
				fs.appendFile(config.stats.file, stats, function (err) {
					if(err) {
						console.log("Error while saving file :: " + err);
					}
				});
			} catch (ex) {
				console.log("Exception while collecting stats :: " + ex);
			}
			
		}
	});
}
setInterval(init, Config.stats.interval);