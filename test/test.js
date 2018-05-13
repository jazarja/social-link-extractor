'use strict';

const expect = require('chai').expect;
const extractor = require('../index');

describe('social-link-extractor', () => {
    it('should extract traveloka social profile links', (done) => {
        extractor.extract("https://www.traveloka.com/en/")
            .then((result)=>{
                console.log(JSON.stringify(result,null,4));
                expect(result.length).to.equal(4);
                done();
            })
    }).timeout(30000);

    it('should extract bca social profile links', (done) => {
        extractor.extract("https://www.bca.co.id/")
            .then((result)=>{
                console.log(JSON.stringify(result,null,4));
                expect(result.length).to.equal(1);
                done();
            })
    }).timeout(30000);

    it('should extract detik social profile links', (done) => {
        extractor.extract("https://www.detik.com/")
            .then((result)=>{
                console.log(JSON.stringify(result,null,4));
                expect(result.length).to.equal(4);
                done();
            })
    }).timeout(30000);
});