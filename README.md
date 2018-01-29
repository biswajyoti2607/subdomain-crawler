# subdomain-crawler
Node based web crawler to crawl a specified subdomain

## Architecture
This is a barebones web crawler built for the specific purpose of crawling specified subdomain(s) of a configured domain. The crawler uses the subdomain URL as the seed and conducts a breadth first search of all the links which are within that subdomain. The subdomain is configured in the config file. Once a page is crawled, all the links belonging to the subdomain are added to the crawling queue and the in-memory database. The crawler is rate limited by the maximum number of connections it shall make simultaneously. When the link from the queue is crawled, it's title is extracted and stored and is marked as 'processing done' in the database.

## Installation
Clone the repository and install npm dependancies. Ensure latest LTS versions of node and npm are already installed. 
    
    $ npm install

## Configuration
The configuration file is config.json
- config.crawler.protocol : determines the protocol to be used - 'http' or 'https'
- config.crawler.subdomain : list of subdomains to be crawled
- config.crawler.domain : the domain name
- config.crawler.maxConnections : maximum number of simultaneous connections
- config.db.file : persistance file of the in-memory database
- config.db.autosaveInterval : time interval in milliseconds when then in-memory database shall be synced with the persisted file
- config.stats.file : file storing the statistics collected
- config.stats.interval : time interval in milliseconds when the statistics should be collected

## Running
    
    $ npm start

This starts both the crawler (index.js) and the statistics collector (stats.js)
