var Config = require('./config');
var Crawler = require("crawler");
var Converter = require('rel-to-abs');
var LokiDB = require('lokijs');
var Lfsa = require('./node_modules/lokijs/src/loki-fs-structured-adapter.js');

function checkInDomain(link, domain) {
	if(link.startsWith("http")) {
		return link.split("//")[1].split("/")[0].indexOf(domain) !== -1;
	}
	return false;
}

function checkInSubdomain(link, config) {
	for(var id in config.crawler.subdomain) {
		return checkInDomain(link, config.crawler.subdomain[id] + "." + config.crawler.domain);
	}
}

function init() {
	var config = Config;
	var adapter = new Lfsa();
	var db = new LokiDB(config.db.file, {
		adapter : adapter,
		autosave: true, 
		autosaveInterval: config.db.autosaveInterval, 
		autoload: true, 
		autoloadCallback: function() {
			var pages = db.getCollection("pages");
			if(pages == null) {
				pages = db.addCollection('pages', {unique: ['url']});
			}
			var crawler = new Crawler({
				maxConnections : config.crawler.maxConnections,
				callback : function (error, res, done) {
					if(error){
						console.log("Error in callback :: " + error);
					}else{
						try {
							var contentType = res.headers['content-type'];
							if(typeof contentType !== "undefined" && contentType.indexOf("text/html") !== -1) {
								var $ = res.$;
								var savedPage = pages.by('url', res.request.uri.href);
								if(typeof savedPage == "undefined") {
									pages.insert({url : res.request.uri.href, processed : true, content : $("title").text()});
								} else {
									savedPage.processed = true;
									savedPage.content = $("title").text();
									pages.update(savedPage);
								}
								$("a").each(function() {
									var converted = Converter.convert($.html(this), res.request.uri.href);
									var link = $(converted).attr("href");
									if(typeof link !== "undefined") {
										link = link.split("#")[0];
										if(checkInSubdomain(link, config) && typeof pages.by('url', link) == "undefined") {
											pages.insert({url : link, processed : false, content : ""});
											crawler.queue(link);
										}
									}
								});
							}
						} catch(e) {
							console.log("Exception in callback :: URL = " + res.request.uri.href + " , exception =  " + e);
						}
					}
					done();
				}
			});
			for(var id in config.crawler.subdomain) {
				var link = config.crawler.protocol + "://" + config.crawler.subdomain[id] + "." + config.crawler.domain;
				if(typeof pages.by('url', link) == "undefined") {
					pages.insert({url : link, processed : false, content : ""});
				}
			}
			var currUrls = pages.find({'processed': false});
			for(var id in currUrls) {
				crawler.queue(currUrls[id]);
			}
		}
	});
}
init();