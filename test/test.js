'use strict';

const expect = require('chai').expect;
const extractor = require('../index');

describe('social-link-extractor', () => {
    it('should extract deep social profile links', (done) => {
        extractor.extract("http://www.mypinkfriday.com/")
            .then((result)=>{
                console.log(JSON.stringify(result,null,4));
                expect(result.length).to.equal(4);
                done();
            })
    }).timeout(30000);

    it('should detect social media link', (done) => {
        extractor.extract("https://www.instagram.com/nickiminaj")
            .then((result)=>{
                console.log(JSON.stringify(result,null,4));
                expect(result.length).to.equal(1);
                done();
            })
    }).timeout(30000);


    it('should parse tiktok link', (done) => {
        let result = extractor.parseUrl("https://www.tiktok.com/@omgitsnikefinesse?langCountry=en")

                console.log(JSON.stringify(result,null,4));
                done();
    }).timeout(30000);

    it('should parse twitter link', (done) => {
        let result = extractor.parseUrl("https://twitter.com/celloutfitter?lang=es")

        console.log(JSON.stringify(result,null,4));
        done();
    }).timeout(30000);
});