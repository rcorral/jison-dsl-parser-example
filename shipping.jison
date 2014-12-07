/* description: Parses a shipping DSL. */

/* lexical grammar */
%lex
%%

\s+                                               /* skip whitespace */
\n|\r                                             /* skip whitespace */
when                                              return 'WHEN'
then                                              return 'THEN'
domestically|internationally                      return 'LOCATION'
flexible|specified                                return 'DATE_SPECIFIED'
cheaply|pass                                      return 'SHIPPING_TYPE'
if                                                return 'IF'
<<EOF>>                                           return 'EOF'
shipping|delivery|date|is|ship|as|possible|cost|on|to|customer        /* skip transitionary words */
.                                                 return 'INVALID'

/lex

%start start

/* declarations */

%{

    function merge(a, b) {
        if (!Array.isArray(a)) {
            return [a, b];
        }

        return a.push(b);
    }

    function normalizeRules(rules) {
        if (!Array.isArray(rules)) {
            rules = [rules];
        }

        return rules;
    }

    function rule(isDomestic, conditions) {
        if (!Array.isArray(conditions)) {
            conditions = [conditions];
        }

        return {
            isDomestic: isDomestic,
            conditions: conditions
        };
    }

    function isDomestic($s) {
        return 'domestically' === $s;
    }

    function condition(shipping, date) {
        obj = {
            calculateShippingAs: shipping
        }

        if (date != null) {
            obj.dateSpecified = date;
        }

        return obj;
    }

    function mapDate($s) {
        if ($s.toLowerCase() === 'flexible') {
            return false;
        } else if ($s.toLowerCase() === 'specified') {
            return true;
        }
    }

    function mapShipping($s) {
        if ($s.toLowerCase() === 'cheaply') {
            return 'CHEAPLY_AS_POSSIBLE';
        } else if ($s.toLowerCase() === 'pass') {
            return 'PASS_ON_TO_CUSTOMER';
        }
    }

%}

%% /* language grammar */

start  : rules EOF {return normalizeRules($1);}
       | conditions EOF {return $1;} // This is here to show the versatility of jison
       ;

rules : rules rule
        {$$ = merge($1, $2);}
    | rule
    ;

rule : WHEN LOCATION conditions
         {$$ = rule(isDomestic($2), $3);}
     ;

conditions : conditions condition
        {$$ = merge($1, $2);}
    | condition
    ;

condition : IF DATE_SPECIFIED SHIPPING_TYPE {$$ = condition(mapShipping($3), mapDate($2));}
          | THEN SHIPPING_TYPE {$$ = condition(mapShipping($2))}
          ;
