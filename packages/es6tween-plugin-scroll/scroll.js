/*!
 * @name Scroll Plugin
 * @license MIT-License
 * @requires: es6-tween core files for running this plugin
 */

(function(TWEEN, factory) {
  "use strict";
  if (typeof define === "function" && define.amd) {
    define(['es6-tween'], function(es6Tween) {
		return factory(es6Tween);
	});
  } else if (typeof module !== "undefined" && module.exports && require('es6-tween')) {
    module.exports = factory(require('es6-tween'));
  } else if (typeof exports !== "undefined" && exports[TWEEN]) {
    factory(exports[TWEEN]);
  } else if (typeof window !== "undefined" && window[TWEEN]) {
    factory(window[TWEEN]);
  }
}('TWEEN', function(TWEEN) {
  "use strict";

  var Plugins = TWEEN.Plugins;
  var Selector = TWEEN.Selector;

  var getOffset = function (v, p, n) {
	if (typeof v === 'string') {
		v = Selector(v);
	}
	return v !== undefined && v !== null ? v.nodeType ? v.getBoundingClientRect()[p === 'scrollLeft' ? 'left' : 'top'] : typeof v === 'number' ? v : v : n[p];
  }

  Plugins.scrollTop = Plugins.scrollLeft = {
	init: function(start, end, prop) {
    var node = this.node;
	this.sv = getOffset(start, prop, node);
	this.ev = getOffset(end, prop, node) - this.s;
    }
  };
  Plugins.scrollTop.update = Plugins.scrollLeft.update = function(cv, sv, ev, value, e, prop) {
    this.node[prop] = this.sv + this.ev * value;
  };
}));