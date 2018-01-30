(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var cssUtils_1 = __webpack_require__(2);
function matches(e, selector) {
    return (e.matches || e.msMatchesSelector).call(e, selector);
}
exports.matches = matches;
function doesRuleApply(element, rule) {
    if (rule.selector instanceof HTMLElement) {
        return element === rule.selector;
    }
    return matches(element, rule.selector);
}
exports.doesRuleApply = doesRuleApply;
function parseInlineStyle(element) {
    return cssUtils_1.parseDeclaration(element.getAttribute('style')).map(function (_a) {
        var name = _a.name, value = _a.value;
        return ({ name: name, value: value, selector: element });
    });
}
exports.parseInlineStyle = parseInlineStyle;
// TODO: link rels
function getAllRulesInDocument(document, filter) {
    if (filter === void 0) { filter = function () { return true; }; }
    var elementsWithStyleAttributes = document.querySelectorAll('[style]');
    var inlineStyleRules = [].filter.call(elementsWithStyleAttributes, filter).reduce(function (agg, element) { return agg.concat(parseInlineStyle(element)); }, []);
    var styleTags = [].slice.call(document.querySelectorAll('style')).filter(filter).reverse().reduce(function (agg, e) { return agg.concat(cssUtils_1.parseStylesheet(e.innerHTML)); }, []);
    return inlineStyleRules.concat(cssUtils_1.sortRulesBySpecificFirst(styleTags));
}
exports.getAllRulesInDocument = getAllRulesInDocument;
function getRawComputedStyle(rules, element) {
    return rules.reduce(function (style, rule) {
        return style[rule.name] || !doesRuleApply(element, rule) ? style : __assign({}, style, (_a = {}, _a[rule.name] = rule.value, _a));
        var _a;
    }, {});
}
exports.getRawComputedStyle = getRawComputedStyle;
function getMatchingElements(document, rule) {
    return typeof (rule.selector) === 'string' ? [].slice.call(document.querySelectorAll(rule.selector)) : [rule.selector];
}
exports.getMatchingElements = getMatchingElements;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var randomFromSeed = __webpack_require__(9);

var ORIGINAL = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
var alphabet;
var previousSeed;

var shuffled;

function reset() {
    shuffled = false;
}

function setCharacters(_alphabet_) {
    if (!_alphabet_) {
        if (alphabet !== ORIGINAL) {
            alphabet = ORIGINAL;
            reset();
        }
        return;
    }

    if (_alphabet_ === alphabet) {
        return;
    }

    if (_alphabet_.length !== ORIGINAL.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. You submitted ' + _alphabet_.length + ' characters: ' + _alphabet_);
    }

    var unique = _alphabet_.split('').filter(function(item, ind, arr){
       return ind !== arr.lastIndexOf(item);
    });

    if (unique.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. These characters were not unique: ' + unique.join(', '));
    }

    alphabet = _alphabet_;
    reset();
}

function characters(_alphabet_) {
    setCharacters(_alphabet_);
    return alphabet;
}

function setSeed(seed) {
    randomFromSeed.seed(seed);
    if (previousSeed !== seed) {
        reset();
        previousSeed = seed;
    }
}

function shuffle() {
    if (!alphabet) {
        setCharacters(ORIGINAL);
    }

    var sourceArray = alphabet.split('');
    var targetArray = [];
    var r = randomFromSeed.nextValue();
    var characterIndex;

    while (sourceArray.length > 0) {
        r = randomFromSeed.nextValue();
        characterIndex = Math.floor(r * sourceArray.length);
        targetArray.push(sourceArray.splice(characterIndex, 1)[0]);
    }
    return targetArray.join('');
}

function getShuffled() {
    if (shuffled) {
        return shuffled;
    }
    shuffled = shuffle();
    return shuffled;
}

/**
 * lookup shuffled letter
 * @param index
 * @returns {string}
 */
function lookup(index) {
    var alphabetShuffled = getShuffled();
    return alphabetShuffled[index];
}

module.exports = {
    characters: characters,
    seed: setSeed,
    lookup: lookup,
    shuffled: getShuffled
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var specificity = __webpack_require__(3);
var specificityComparator = function (selector1, selector2) {
    var selectors = [selector1, selector2];
    var isString = selectors.map(function (s) { return typeof (s) === 'string'; });
    if (!isString[0]) {
        return -1;
    }
    if (isString[0] && !isString[1]) {
        return 1;
    }
    var res = selectors.map(function (s) { return specificity.calc(s)[0]; });
    for (var i = 1; i < 4; i++) {
        if (res[0].specificity[i] !== res[1].specificity[i]) {
            return res[1].specificity[i] - res[0].specificity[i];
        }
    }
    return -1;
};
// yeah I know this doesn't cover strings. tough luck for now, not willing to integrate a full-blown parser, as it will reduce freedom
function clearComments(css) {
    return css.replace(/\/(\*(.|[\r\n])*?\*\/)|(\/[^\n]*)/ig, '');
}
function parseDeclaration(rawCss) {
    var css = clearComments(rawCss);
    var declarationRegex = /\s*([^;:\s]+)\s*:\s*([^;:]+)\s*;?\s*/;
    var index = 0;
    var parsed = null;
    var declaration = [];
    while (parsed = css && declarationRegex.exec(css.substr(index))) {
        declaration.push({ name: parsed[1].trim(), value: parsed[2].trim() });
        index += parsed.index + parsed[0].length;
    }
    return declaration;
}
exports.parseDeclaration = parseDeclaration;
function parseStylesheet(rawCss) {
    var css = clearComments(rawCss);
    var ruleRegex = /([^{}]+){([^{}]+)}/;
    var index = 0;
    var parsed = null;
    var rules = [];
    var _loop_1 = function () {
        var selector = parsed[1].trim();
        var style = parseDeclaration(parsed[2]);
        rules = rules.concat(style.map(function (entry) { return (__assign({ selector: selector }, entry)); }));
        index += parsed.index + parsed[0].length;
    };
    while (parsed = css && ruleRegex.exec(css.substr(index))) {
        _loop_1();
    }
    return rules;
}
exports.parseStylesheet = parseStylesheet;
function sortRulesBySpecificFirst(rules) {
    return rules.sort(function (a, b) { return specificityComparator(a.selector, b.selector); });
}
exports.sortRulesBySpecificFirst = sortRulesBySpecificFirst;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var specimen = __webpack_require__(4)

module.exports.calc = function (selector) {
    return calc(selector)
}

module.exports.vs = function (selector1, selector2) {
    var res1 = calc(selector1)[0]
    var res2 = calc(selector2)[0]
    for (var i = 1; i < 4; i++) {
        if (res1.specificity[i] != res2.specificity[i]) {
            var winner = Math.max(res1.specificity[i], res2.specificity[i])
            if (winner == res1.specificity[i]) return selector1
            else if( winner == res2.specificity[i]) return selector2
        }
    }
    return 'draw'
}

function calc (selector) {
    var selectors = arraySelector(selector)
    var res = []
    selectors.forEach(function (selector) {
        var calcResult = specimen(selector)
        res.push({
            'selector': selector,
            'specificity': calcResult,
            'a': calcResult[1],
            'b': calcResult[2],
            'c': calcResult[3]
        })
    })
    return res
}

function arraySelector (selector) {
    var arrSel = selector.split(',')
    arrSel.forEach(function (sel, i) {
        arrSel[i] = sel.trim()
    })
    return arrSel
}

function isOnlyClassSelector (selector) {
    console.log(selector)
    if (selector.match(/^\.|\s/)) return true
    return false
}


/***/ }),
/* 4 */
/***/ (function(module, exports) {

// Matches and caputures attribute selectors. E.g., `[foo=bar]`
var ATTRIBUTE = /(\[[^\]]+\])/g;

// Matches and captures ID selectors. E.g., `#foo`
var ID = /(#[^\s\.\[\]:]+)/g;

// Matches and captures class selectors. E.g., `.foo`
var CLASS = /(\.[^\s\.:]+)/g;

// Matches and captures pseudo-element selectors. E.g., `::before`
var PSEUDO_ELEMENT = /(::[^\s\.:]+|:first-line|:first-letter|:before|:after)/g;

// Matches and captures pseduo-class selectors. E.g., `:hover`
var PSEUDO_CLASS = /(:[^\s\.:]+)/g;

// Matches and captures element selectors. E.g., `div`
var ELEMENT = /([^\s\.:]+)/g;

// Matches the negation pseudo-class, capturing its argument.
//
// Example:
//
//   ":not(.it)".replace(RE_NOT, '$1');
//   //=> .it
//
var NOT = /:not\(([^\)]*)\)/g;

// Matches selectors and combinators that have no affect on specificity. Also
// matches consecutive whitespace.
//
// Example:
//
//   ".foo  >  .bar~#baz".replace(RE_CRUFT, ' ');
//   //=> .foo .bar .baz
//
var CRUFT = /[\*\s\+>~]+/g;


exports = module.exports = specimen;

/**
 * Calulate the specificity of one or more CSS selectors.
 *
 * @param {String|Array} selectors
 * @returns {Array|undefined} specificity
 */
function specimen(selectors) {
  var isDefined;
  var results = [];

  if (!selectors) { return; }

  if (typeof selectors === 'string') {
    selectors = selectors.split(',');
  } else if (!Array.isArray(selectors)) {
    // An invalid type was given.
    return;
  }

  selectors.forEach(function (selector) {
    var s = specificity(selector);

    isDefined = isDefined || !!s;

    results.push(s);
  });

  if (isDefined) {
    return (results.length > 1) ? results : results[0];
  }
}


/**
 * Calulate the specificity of a single CSS selector.
 *
 * @param {String} selector CSS selector
 * @returns {Array|undefined} specificity
 */
function specificity(selector) {

  if (typeof selector !== 'string') { return; }

  /**
   * Returns the number of times `selector` from the parent scope matches the
   * given regular expression.
   *
   * If there is there is at least one match, all matches are removed from
   * `selector`. This is to prevent subsequent calls to `tally()` from reporting
   * false positives.
   *
   * @param {RegExp} regexp regular express to try
   * @return {Number} number of matches
   */
  function tally(regexp) {
    var m = selector.match(regexp);

    if (!m) { return 0; }

    selector = selector.replace(regexp, '');
    return m.length;
  }


  // Counters for each selector category.
  var a = 0, b = 0, c = 0;

  // Massage the incoming selector a bit.
  selector = selector
    // Remove negation pseudo-classes, but retain their arguments.
    .replace(NOT, ' $1 ')
    // Replace crufty characters with a single space.
    .replace(CRUFT, ' ');

  // Tally up the selectors for each category.
  a += tally(ID);
  b += tally(ATTRIBUTE);
  b += tally(CLASS);

  // Check for pseudo-elements before pseudo-classes. Pseudo-elements can look
  // exactly like a pseudo-class when used with a single colon. E.g., `:before`
  c += tally(PSEUDO_ELEMENT);
  b += tally(PSEUDO_CLASS);

  // Only elements should remain
  c += tally(ELEMENT);

  return [0, a, b, c];
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var randomByte = __webpack_require__(10);

function encode(lookup, number) {
    var loopCounter = 0;
    var done;

    var str = '';

    while (!done) {
        str = str + lookup( ( (number >> (4 * loopCounter)) & 0x0f ) | randomByte() );
        done = number < (Math.pow(16, loopCounter + 1 ) );
        loopCounter++;
    }
    return str;
}

module.exports = encode;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var domUtils_1 = __webpack_require__(0);
var shortid = __webpack_require__(7);
var domUtils_2 = __webpack_require__(0);
exports.getAllRulesInDocument = domUtils_2.getAllRulesInDocument;
exports.getRawComputedStyle = domUtils_2.getRawComputedStyle;
function run(document, processors, id) {
    if (id === void 0) { id = 'rawss'; }
    var ITEM_ID_ATTR_NAME = "data-" + id + "-id";
    var MANAGER_ID = id + "-manager";
    var allRules = domUtils_1.getAllRulesInDocument(document, function (element) { return !domUtils_1.matches(element, "#" + MANAGER_ID); });
    var cache = new WeakMap();
    function issueRawStyle(element) {
        if (cache.has(element)) {
            return cache.get(element);
        }
        var style = domUtils_1.getRawComputedStyle(allRules, element);
        cache.set(element, style);
        return style;
    }
    function issueID(element) {
        if (element.hasAttribute(ITEM_ID_ATTR_NAME)) {
            return element.getAttribute(ITEM_ID_ATTR_NAME);
        }
        var id = shortid.generate();
        element.setAttribute(ITEM_ID_ATTR_NAME, id);
        return id;
    }
    function issueStyleManager() {
        var existing = document.getElementById(MANAGER_ID);
        if (existing) {
            return existing;
        }
        var manager = document.createElement('style');
        document.head.appendChild(manager);
        manager.setAttribute('id', MANAGER_ID);
        return manager;
    }
    var styleChanges = new Map();
    processors.forEach(function (processor) {
        new Set(allRules.filter(processor.match)
            .reduce(function (els, rule) { return els.concat(domUtils_1.getMatchingElements(document, rule)); }, []))
            .forEach(function (element) {
            var rawStyle = issueRawStyle(element);
            var newStyle = processor.process(rawStyle, element);
            styleChanges.set(element, Object.assign({}, styleChanges.get(element), newStyle));
        });
    });
    var styleEntries = [];
    styleChanges.forEach(function (value, key) { return styleEntries.push([key, value]); });
    var kebabCase = function (string) { return string.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\s+/g, '-').toLowerCase(); };
    var cssText = "\n    " + styleEntries.map(function (_a) {
        var element = _a[0], style = _a[1];
        return "[" + ITEM_ID_ATTR_NAME + "='" + issueID(element) + "'] {" + Object.keys(style).map(function (name) { return "\n        " + kebabCase(name) + ": " + style[name] + " !important;\n    "; }) + "}";
    }) + "\n    ";
    console.log(cssText);
    var manager = issueStyleManager();
    manager.innerHTML = cssText;
}
exports.run = run;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(8);


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var alphabet = __webpack_require__(1);
var encode = __webpack_require__(5);
var decode = __webpack_require__(11);
var build = __webpack_require__(12);
var isValid = __webpack_require__(13);

// if you are using cluster or multiple servers use this to make each instance
// has a unique value for worker
// Note: I don't know if this is automatically set when using third
// party cluster solutions such as pm2.
var clusterWorkerId = __webpack_require__(14) || 0;

/**
 * Set the seed.
 * Highly recommended if you don't want people to try to figure out your id schema.
 * exposed as shortid.seed(int)
 * @param seed Integer value to seed the random alphabet.  ALWAYS USE THE SAME SEED or you might get overlaps.
 */
function seed(seedValue) {
    alphabet.seed(seedValue);
    return module.exports;
}

/**
 * Set the cluster worker or machine id
 * exposed as shortid.worker(int)
 * @param workerId worker must be positive integer.  Number less than 16 is recommended.
 * returns shortid module so it can be chained.
 */
function worker(workerId) {
    clusterWorkerId = workerId;
    return module.exports;
}

/**
 *
 * sets new characters to use in the alphabet
 * returns the shuffled alphabet
 */
function characters(newCharacters) {
    if (newCharacters !== undefined) {
        alphabet.characters(newCharacters);
    }

    return alphabet.shuffled();
}

/**
 * Generate unique id
 * Returns string id
 */
function generate() {
  return build(clusterWorkerId);
}

// Export all other functions as properties of the generate function
module.exports = generate;
module.exports.generate = generate;
module.exports.seed = seed;
module.exports.worker = worker;
module.exports.characters = characters;
module.exports.decode = decode;
module.exports.isValid = isValid;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Found this seed-based random generator somewhere
// Based on The Central Randomizer 1.3 (C) 1997 by Paul Houle (houle@msc.cornell.edu)

var seed = 1;

/**
 * return a random number based on a seed
 * @param seed
 * @returns {number}
 */
function getNextValue() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed/(233280.0);
}

function setSeed(_seed_) {
    seed = _seed_;
}

module.exports = {
    nextValue: getNextValue,
    seed: setSeed
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var crypto = typeof window === 'object' && (window.crypto || window.msCrypto); // IE 11 uses window.msCrypto

function randomByte() {
    if (!crypto || !crypto.getRandomValues) {
        return Math.floor(Math.random() * 256) & 0x30;
    }
    var dest = new Uint8Array(1);
    crypto.getRandomValues(dest);
    return dest[0] & 0x30;
}

module.exports = randomByte;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var alphabet = __webpack_require__(1);

/**
 * Decode the id to get the version and worker
 * Mainly for debugging and testing.
 * @param id - the shortid-generated id.
 */
function decode(id) {
    var characters = alphabet.shuffled();
    return {
        version: characters.indexOf(id.substr(0, 1)) & 0x0f,
        worker: characters.indexOf(id.substr(1, 1)) & 0x0f
    };
}

module.exports = decode;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var encode = __webpack_require__(5);
var alphabet = __webpack_require__(1);

// Ignore all milliseconds before a certain time to reduce the size of the date entropy without sacrificing uniqueness.
// This number should be updated every year or so to keep the generated id short.
// To regenerate `new Date() - 0` and bump the version. Always bump the version!
var REDUCE_TIME = 1459707606518;

// don't change unless we change the algos or REDUCE_TIME
// must be an integer and less than 16
var version = 6;

// Counter is used when shortid is called multiple times in one second.
var counter;

// Remember the last time shortid was called in case counter is needed.
var previousSeconds;

/**
 * Generate unique id
 * Returns string id
 */
function build(clusterWorkerId) {

    var str = '';

    var seconds = Math.floor((Date.now() - REDUCE_TIME) * 0.001);

    if (seconds === previousSeconds) {
        counter++;
    } else {
        counter = 0;
        previousSeconds = seconds;
    }

    str = str + encode(alphabet.lookup, version);
    str = str + encode(alphabet.lookup, clusterWorkerId);
    if (counter > 0) {
        str = str + encode(alphabet.lookup, counter);
    }
    str = str + encode(alphabet.lookup, seconds);

    return str;
}

module.exports = build;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var alphabet = __webpack_require__(1);

function isShortId(id) {
    if (!id || typeof id !== 'string' || id.length < 6 ) {
        return false;
    }

    var characters = alphabet.characters();
    var len = id.length;
    for(var i = 0; i < len;i++) {
        if (characters.indexOf(id[i]) === -1) {
            return false;
        }
    }
    return true;
}

module.exports = isShortId;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = 0;


/***/ })
/******/ ]);
});
//# sourceMappingURL=lefil.js.map