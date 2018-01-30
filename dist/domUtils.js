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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var cssUtils_1 = __webpack_require__(3);
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
    return cssUtils_1.parseDeclaration(element.hasAttribute('raw-style') ? element.getAttribute('raw-style') : element.getAttribute('style')).map(function (_a) {
        var name = _a.name, value = _a.value;
        return ({ name: name, value: value, selector: element });
    });
}
exports.parseInlineStyle = parseInlineStyle;
var loadedExternalStyles = new WeakMap();
function getStylesheetText(e) {
    switch (e.tagName) {
        case 'STYLE': return e.innerHTML;
        case 'LINK': return loadedExternalStyles.get(e);
    }
}
function getAllRules(rootElement, filter) {
    if (filter === void 0) { filter = function () { return true; }; }
    var elementsWithStyleAttributes = rootElement.querySelectorAll('[style],[raw-style]');
    var inlineStyleRules = [].filter.call(elementsWithStyleAttributes, filter).reduce(function (agg, element) { return agg.concat(parseInlineStyle(element)); }, []).reverse();
    var styleTags = [].map.call(document.styleSheets, function (s) { return s.ownerNode; }).filter(function (n) {
        return n &&
            (rootElement.compareDocumentPosition(rootElement) | Node.DOCUMENT_POSITION_CONTAINS)
            && filter(n);
    })
        .reverse()
        .reduce(function (agg, e) { return agg.concat(cssUtils_1.parseStylesheet(getStylesheetText(e))); }, []);
    return inlineStyleRules.concat(cssUtils_1.sortRulesBySpecificFirst(styleTags));
}
exports.getAllRules = getAllRules;
function waitForStylesToBeLoaded(rootElement) {
    var _this = this;
    var links = rootElement.querySelectorAll('link[rel="stylesheet"]');
    var linksWithoutStyles = [].filter.call(links, function (link) { return !loadedExternalStyles.has(link); });
    return Promise.all(linksWithoutStyles.map(function (link) { return __awaiter(_this, void 0, void 0, function () {
        var response, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, fetch(link.href, { headers: { 'Content-Type': link.type } })];
                case 1:
                    response = _d.sent();
                    _b = (_a = loadedExternalStyles).set;
                    _c = [link];
                    return [4 /*yield*/, response.text()];
                case 2:
                    _b.apply(_a, _c.concat([_d.sent()]));
                    return [2 /*return*/];
            }
        });
    }); }));
}
exports.waitForStylesToBeLoaded = waitForStylesToBeLoaded;
function getRawComputedStyle(rules, element) {
    return rules.reduce(function (style, rule) {
        return style[rule.name] || !doesRuleApply(element, rule) ? style : __assign({}, style, (_a = {}, _a[rule.name] = rule.value, _a));
        var _a;
    }, {});
}
exports.getRawComputedStyle = getRawComputedStyle;
function getMatchingElements(rootElement, rule) {
    return typeof (rule.selector) === 'string' ? [].slice.call(rootElement.querySelectorAll(rule.selector)) : [rule.selector];
}
exports.getMatchingElements = getMatchingElements;


/***/ }),
/* 2 */,
/* 3 */
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
var specificity = __webpack_require__(4);
var specificityComparator = function (a, b) {
    if (a.rule.important !== b.rule.important) {
        return b.rule.important ? 1 : -1;
    }
    var selectors = [a.rule.selector, b.rule.selector];
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
    return a.index - b.index;
};
// yeah I know this doesn't cover strings. tough luck for now, not willing to integrate a full-blown parser, as it will reduce freedom
function clearComments(css) {
    return css.replace(/\/(\*(.|[\r\n])*?\*\/)|(\/[^\n]*)/ig, '');
}
function parseDeclaration(rawCss) {
    var css = clearComments(rawCss);
    var declarationRegex = /\s*([^;:\s]+)\s*:\s*([^;:!]+)\s*(\!important)?;?\s*/;
    var index = 0;
    var parsed = null;
    var declaration = [];
    while (parsed = css && declarationRegex.exec(css.substr(index))) {
        var entry = { name: parsed[1].trim(), value: parsed[2].trim() };
        if (parsed[3]) {
            entry.important = true;
        }
        declaration.push(entry);
        index += parsed.index + parsed[0].length;
    }
    return declaration;
}
exports.parseDeclaration = parseDeclaration;
function parseStylesheet(rawCss) {
    if (!rawCss) {
        return [];
    }
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
    return rules
        .map(function (rule, index) { return ({ rule: rule, index: index }); })
        .sort(specificityComparator)
        .map(function (e) { return e.rule; });
}
exports.sortRulesBySpecificFirst = sortRulesBySpecificFirst;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var specimen = __webpack_require__(5)

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
/* 5 */
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


/***/ })
/******/ ]);
});
//# sourceMappingURL=domUtils.js.map