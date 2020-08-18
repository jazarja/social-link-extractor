Social Link Extractor
=====================

A small library to extract social profile links from HTML page.

## Installation

  `npm install social-link-extractor`

## Usage

    const social = require('social-link-extractor');

    async ()=>{
        let result = social.extract("https://www.bca.co.id/");
        console.log(JSON.stringify(result,null,4));
    }
    
## Tests

  `npm test`

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.
