'use strict'

var parse = require('../shipping').parse;

describe('Shipping Parser', function() {

    it('parses a condition', function() {
        var ast = {
            dateSpecified: false,
            calculateShippingAs: 'PASS_ON_TO_CUSTOMER'
        };
        parse('if flexible pass').should.eql(ast);
    });

    it('parses condition with no date', function() {
        var ast = {
            calculateShippingAs: 'PASS_ON_TO_CUSTOMER'
        };
        parse('then pass').should.eql(ast);
    });

    it('parses conditions', function() {
        var ast = [
            {
                dateSpecified: false,
                calculateShippingAs: 'CHEAPLY_AS_POSSIBLE'
            },
            {
                dateSpecified: true,
                calculateShippingAs: 'PASS_ON_TO_CUSTOMER'
            }
        ];
        parse('if flexible cheaply if specified pass').should.eql(ast);
    });

    it('parses rule with condition', function() {
        var ast = [
            {
                isDomestic: true,
                conditions: [
                    {
                        dateSpecified: false,
                        calculateShippingAs: 'CHEAPLY_AS_POSSIBLE'
                    }
                ]
            }
        ];
        parse('when domestically if flexible cheaply').should.eql(ast);
    });

    it('parses rule with conditions', function() {
        var ast = [
            {
                isDomestic: true,
                conditions: [
                    {
                        dateSpecified: false,
                        calculateShippingAs: 'CHEAPLY_AS_POSSIBLE'
                    },
                    {
                        dateSpecified: true,
                        calculateShippingAs: 'PASS_ON_TO_CUSTOMER'
                    }
                ]
            }
        ];
        parse('when domestically if flexible cheaply if specified pass').should.eql(ast);
    });

    it('parses rules with conditions', function() {
        var ast = [
            {
                isDomestic: true,
                conditions: [
                    {
                        dateSpecified: false,
                        calculateShippingAs: 'CHEAPLY_AS_POSSIBLE'
                    },
                    {
                        dateSpecified: true,
                        calculateShippingAs: 'PASS_ON_TO_CUSTOMER'
                    }
                ]
            },
            {
                isDomestic: false,
                conditions: [
                    {
                        calculateShippingAs: 'CHEAPLY_AS_POSSIBLE'
                    }
                ]
            }
        ];
        var dsl = "when domestically if flexible cheaply if specified pass\n";
        dsl += 'when internationally then cheaply';

        parse(dsl).should.eql(ast);
    });

    it('ignores transitionary words', function() {
        var ast = [
            {
                isDomestic: true,
                conditions: [
                    {
                        dateSpecified: false,
                        calculateShippingAs: 'CHEAPLY_AS_POSSIBLE'
                    },
                    {
                        dateSpecified: true,
                        calculateShippingAs: 'PASS_ON_TO_CUSTOMER'
                    }
                ]
            },
            {
                isDomestic: false,
                conditions: [
                    {
                        calculateShippingAs: 'CHEAPLY_AS_POSSIBLE'
                    }
                ]
            }
        ];
        var dsl = "when shipping domestically\n";
            dsl += "if delivery date is flexible ship as cheaply as possible\n";
            dsl += "if delivery date is specified pass shipping cost on to customer\n";
        dsl += "when shipping internationally\n";
            dsl += "then ship as cheaply as possible";

        parse(dsl).should.eql(ast);
    });

});
