'use strict';

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36';

const Promise = require('bluebird');
const _ = require('lodash');
const cheerio = require('cheerio');
const rp = require('request-promise');
const rules = require('./rules');

const downloadHtml = (url) => {
    let options = {
        uri: url,
        qs: {
        },
        headers: {
            'User-Agent': USER_AGENT
        },
        timeout: 90000,
        maxRedirects: 10,
        jar: true,
        rejectUnauthorized: false
    };

    return rp(options);
};

const extractFromHtml = (html) => {
    return new Promise((resolve, reject)=>{
        const $ = cheerio.load(html)
        let links = [];

        $('a').each(function(i, elem) {
            let link = $(this).attr('href');
            if (link && link.toLowerCase().indexOf('http') === 0)
                links.push($(this).attr('href'));
        });

        resolve(links);
    })
        .map((link)=>{
            let socialLink = undefined;
            _.each(rules, (rule)=>{
                let pattern = rule.url.replace(/\./g , "\\.").replace(/\//g , "\\/").replace("%s", "(.*)");
                let re1 = new RegExp(pattern);
                let found = re1.test(link);
                if (found) {
                    let m = re1.exec(link);
                    socialLink = {
                        "name" : rule.name,
                        "link" : m[0],
                        "username" : m[1]
                    }
                }
            });
            return socialLink;
        })
        .then((result)=>{
            return _.uniqBy(_.compact(result), 'link');
        })
};

module.exports.extract = (url) => {
    return downloadHtml(url)
        .then((result)=>{
            return extractFromHtml(result)
        })
};

module.exports.extractFromHtml= extractFromHtml;