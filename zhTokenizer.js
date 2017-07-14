/* ================================================= */
/* zhTokenizer - Bloodhound Tokenizer for Chinese    */
/* ================================================= */

/* by Fai Chan (iafnahc@gmail.com) July 2017 */
/* Use with Bloodhound.js and Typeahead.js (https://github.com/twitter/typeahead.js/blob/master/doc/bloodhound.md) */

/* e.g. */
/*
_data = new Bloodhound({
        queryTokenizer: zhTokenizer.str,
        datumTokenizer: zhTokenizer.props_obj('title', 'content', 'keywords'),
        identify: function(obj) { return obj.id; },
        prefetch: {url: faq_json_url, cache: false, transform: _data_handler }
    });
*/

(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define("zhTokenizer", [], function(a0) {
            return root["zhTokenizer"] = factory(a0);
        });
    } else if (typeof exports === "object") {
        module.exports = factory();
    } else {
        root["zhTokenizer"] = factory();
    }
})(this, function() {

    function _str (str) {

        var TAG_patt = /<[^<]+>/g;
        var LATIN_patt = /([A-Za-z0-9À-ÖØ-öø-ɏ])+/g;

        // Remove HTML tags first
        str = str.replace(TAG_patt, '');

        // First handle the Latin words
        var result = LATIN_patt.test(str) ? str.match(LATIN_patt) : [];

        // Break string to array, put every character, and every 2 characters into tokens
        for (var i = 0; i < str.length; i++) {
            var token = str.substr(i, 1);
            if (isCJKIdeographs(token)) result.push(token);
            token = str.substr(i, 2);
            if (isCJKIdeographs(token)) result.push(token);
        }

        return result;

        function isCJKIdeographs(str) {

            var CJK_IDEOGRAPHS_RANGES = [
                [0x4E00, 0x62FF],[0x6300, 0x77FF], [0x7800, 0x8CFF], [0x8D00, 0x9FFF],[0x3400, 0x4DBF],[0x20000,0x215FF],[0x21600,0x230FF],[0x23100,0x245FF],[0x24600,0x260FF],[0x26100,0x275FF],[0x27600,0x290FF],[0x29100,0x2A6DF],[0x2A700,0x2B73F],[0x2B740,0x2B81F],[0x2B820,0x2CEAF],[0xF900, 0xFAFF],[0x1F200, 0x1F2FF]
            ];

            for (var i = 0; i < str.length; i++) {
            
                var char_code = str.charCodeAt(i);
                var char_flag = false;

                for (var j in CJK_IDEOGRAPHS_RANGES) {
                    var range = CJK_IDEOGRAPHS_RANGES[j];
                    if (char_code >= range[0] && char_code <= range[1]) { char_flag=true; break; }
                }

                if (!char_flag) return false;

            }

            return true;

        }

    };

    var zhTokenizer = function() {
        "use strict";
        function zhTokenizer() {};
        zhTokenizer.str = _str;
        zhTokenizer.props_obj = function() {
            var props = arguments;
            return function (obj) {
                var results = [];
                for (var i in props) {
                    results=results.concat(_str(obj[props[i]])) 
                }
                return results;
            }
        };
        return zhTokenizer;
    }();
    return zhTokenizer;
});




