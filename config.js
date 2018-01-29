var config = {};

config.crawler = {};
config.db = {};
config.stats = {};

config.crawler.protocol = "https";
config.crawler.subdomain = ["cc"];
config.crawler.domain = "gatech.edu";
config.crawler.maxConnections = 10;

config.db.file = "data/db_10.json";
config.db.autosaveInterval = 30000;

config.stats.file = "data/stats_10.csv";
config.stats.interval = 60000;

module.exports = config;