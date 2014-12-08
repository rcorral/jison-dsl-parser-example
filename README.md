Jison DSL parser example
========================

See [demo](http://rcorral.github.io/jison-dsl-parser-example/).

This is a simple shipping DSL parser. It's based on the code mentioned at the end of [this talk](https://www.youtube.com/watch?v=lm4jEcnWeKI) by Neil Green at JSConf 2014. I've simply written a different implementation of the DSL parser using [Jison](http://zaach.github.io/jison/).

It's a great talk, and should be watched before making sense of this parser.  
The tests should help you understand how the parser works and what it does.

Install
-------

`$ git clone git@github.com:rcorral/jison-dsl-parser-example.git`  
`$ cd jison-dsl-parser-example`  
`$ npm install`

Build Parser
------------

`$ npm run-script build`

Tests
-----

`$ npm test`

License
-------

MIT
