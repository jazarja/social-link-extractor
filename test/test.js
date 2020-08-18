'use strict';

const expect = require('chai').expect;
const extractor = require('../index');

describe('social-link-extractor', () => {
    it('should extract deep social links', async () => {
        let result = await extractor.extract("https://famepick.com/", true)
        console.log(JSON.stringify(result,null,4));
        expect(result.length).to.equal(4);
    }).timeout(30000);

    it('should detect social media link', async () => {
        let result = await extractor.extract("https://www.instagram.com/nickiminaj")
        console.log(JSON.stringify(result,null,4));
        expect(result.length).to.equal(1);
    }).timeout(30000);

    it('should parse tiktok link', async ()  => {
        let result = await extractor.extract("https://www.tiktok.com/@omgitsnikefinesse?langCountry=en")
        console.log(JSON.stringify(result,null,1));
        expect(result.length).to.equal(1);
    }).timeout(30000);

    it('should parse twitter link', async ()  => {
        let result = await extractor.extract("https://twitter.com/celloutfitter?lang=es")

        console.log(JSON.stringify(result,null,1));
    }).timeout(30000);

    it('should parse twitter link 2', async ()  => {
        let result = await extractor.extract("http://www.twitter.com/carolinemanzo")
        console.log(JSON.stringify(result,null,4));
        expect(result.length).to.equal(1);
    }).timeout(30000);

    it('should parse snapchat link', async () => {
        let result = await extractor.extract("https://www.snapchat.com/add/theconceptgeek");
        console.log(JSON.stringify(result,null,4));
        expect(result.length).to.equal(1);
    }).timeout(30000);

    it('should parse tapbio link', async () => {
        let result = await extractor.extract("https://tap.bio/@sparkofwanderlust");
        console.log(JSON.stringify(result,null,4));
        expect(result.length).to.equal(1);
    }).timeout(30000);

    it('should parse campsite link', async () => {
        let result = await extractor.extract("https://campsite.bio/camper");
        console.log(JSON.stringify(result,null,4));
        expect(result.length).to.equal(1);
    }).timeout(30000);

    it('should parse swipop link', async () => {
        let result = await extractor.extract("http://www.swipop.co/@/nass");
        console.log(JSON.stringify(result,null,4));
        expect(result.length).to.equal(1);
    }).timeout(30000);

    it('should parse ContactInBio link', async () => {
        let result = await extractor.extract("https://allmy.link/wearehalfhuman");
        console.log(JSON.stringify(result,null,4));
        expect(result.length).to.equal(1);
    }).timeout(30000);

    it('should parse ContactInBio link', async () => {
        let result = await extractor.extract("https://heavenlights.contactin.bio/");
        console.log(JSON.stringify(result,null,4));
        expect(result.length).to.equal(1);
    }).timeout(30000);

    it('should parse ShorBy link', async () => {
        let result = await extractor.extract("https://shor.by/9ASb");
        console.log(JSON.stringify(result,null,4));
        expect(result.length).to.equal(1);
    }).timeout(30000);

    it('should extract deep linktree link', async () => {
        let result = await extractor.extract("https://www.instagram.com/opinimu.id/", true, true);
        console.log(JSON.stringify(result,null,1));
        expect(result.length).to.equal(3);
    }).timeout(30000);

    it('should extract deep linkfol.io link', async () => {
        let result = await extractor.extract("https://www.instagram.com/famepick/?hl=en", true, true);
        console.log(JSON.stringify(result,null,1));
        expect(result.length).to.equal(2);
    }).timeout(30000);

});
