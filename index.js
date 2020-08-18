'use strict';

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36';

const Promise = require('bluebird');
const _ = require('lodash');
const cheerio = require('cheerio');
const rp = require('request-promise');
const rules = require('./rules');
const debugParser = require('debug')('parser');

const downloadHtml = (url) => {
    let options = {
        uri: url,
        qs: {},
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

const parseUrl = (link, aggressive = false) => {
    if (!aggressive)
        link = link.split("?").shift();

    let list = [];
    let socialLink = undefined;
    let suffixDelimiter = "([^\\/]+)[\\/]*$";

    if (aggressive)
        suffixDelimiter = "([^ \\\"\\\'\\/]+)";

    let infixDelimiter="(.*)";

//    debugParser("INPUT:" + link);

    _.each(rules, (rule) => {
        let pattern =
            _.endsWith(rule.url, "%s" ) ?
                rule.url.replace(/\./g, "\\.").replace(/\//g, "\\/").replace("%s", suffixDelimiter) :
                rule.url.replace(/\./g, "\\.").replace(/\//g, "\\/").replace("%s", infixDelimiter);
        debugParser("HTTPS LINK:" + pattern);
        let re1 = new RegExp(pattern);
        let found = re1.test(link);
        if (found) {
            debugParser("FOUND")
            let m = re1.exec(link);
            socialLink = {
                "name": rule.name,
                "link": m[0],
                "username": m[1]
            }
        } else {
            let url = rule.url.replace("https://", "http://");

            pattern =
                _.endsWith(rule.url, "%s" ) ?
                    url.replace(/\./g, "\\.").replace(/\//g, "\\/").replace("%s", suffixDelimiter) :
                    url.replace(/\./g, "\\.").replace(/\//g, "\\/").replace("%s", infixDelimiter);

            debugParser("HTTP LINK:" + pattern);

            re1 = new RegExp(pattern);
            found = re1.test(link);
            if (found) {
                debugParser("FOUND")
                let m = re1.exec(link);
                socialLink = {
                    "name": rule.name,
                    "link": m[0],
                    "username": m[1]
                }
            } else if (aggressive) {
                let url = rule.url.replace("https://", ""); // Scan link without protocol

                pattern =
                    _.endsWith(rule.url, "%s" ) ?
                        url.replace(/\./g, "\\.").replace(/\//g, "\\/").replace("%s", suffixDelimiter) :
                        url.replace(/\./g, "\\.").replace(/\//g, "\\/").replace("%s", infixDelimiter);

                debugParser("TEXT:" + pattern);
                re1 = new RegExp(pattern);
                found = re1.test(link);
                if (found) {
                    debugParser("FOUND")
                    let m = re1.exec(link);
                    socialLink = {
                        "name": rule.name,
                        "link": m[0],
                        "username": m[1]
                    }
                }
            }
        }

        if (socialLink && rule.excludes) {
            _.each(rule.excludes, (text) => {
                debugParser("FOUND DENY PATTERN", text);
                if (socialLink.link.indexOf(text) > -1)
                    socialLink = undefined;
            })
        }

        if (aggressive && socialLink) {
            list.push(socialLink);
        }
    });

    if (aggressive) {
        return list;
    } else {
        return socialLink;
    }
};

const extractFromHtml = (html) => {
    const $ = cheerio.load(html)
    let links = [];

    $('a').each(function (i, elem) {
        let link = $(this).attr('href');
        if (link && link.toLowerCase().indexOf('http') === 0)
            links.push($(this).attr('href'));
    });

    let result = links.map((link) => {
        return parseUrl(link);
    })

    return _.uniqBy(_.compact(result), 'link');
};

module.exports.extractFromHtml = extractFromHtml;

const extractFromText = (text) => {
    let result = parseUrl(text, true)

    return _.uniqBy(_.compact(result), 'link');
};

module.exports.extractFromText = extractFromText;

module.exports.parseUrl = parseUrl;

module.exports.extract = async (url, deepExtract = false, aggressive = false) => {
    try {
        let r = parseUrl(url);
        if (!deepExtract && r) {
            return [r];
        } else {
            let result = await downloadHtml(url);
            if (!aggressive)
                return extractFromHtml(result); else
                return extractFromText(result);
        }
    } catch (error) {
        console.error("Extract error", error.message || error);
        return [];
    }
};


