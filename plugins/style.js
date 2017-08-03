/*!
 * @name CSS Plugin
 * @package es6tween-plugin-css
 * @version v0.1-beta
 * @license MIT-License
 * @requires: es6-tween core files for running this plugin
 */

(function(factory) {
  "use strict";
  if (typeof define === "function" && define.amd) {
    define(['es6-tween'], factory);
  } else if (typeof module !== "undefined" && module.exports && require('es6-tween') !== undefined) {
    module.exports = factory(require('es6-tween'));
  } else if (typeof exports !== "undefined" && exports.TWEEN && exports.TWEEN) {
    factory(exports.TWEEN);
  } else if (typeof window !== "undefined" && window.TWEEN && window.TWEEN) {
    factory(window.TWEEN);
  }
}(function(TWEEN) {
  "use strict";

  var Plugins = TWEEN.Plugins;

  var css = Plugins.css = function(Tween, start, end) {
    this.node = Tween.node;
  }

  var p = css.prototype;
  p.postprocess = function(start, end) {
    this.simulated = end;
  }
  p.update = function(value) {
    var vals = this.simulated(value);
    var node = this.node;

    for (let p in vals) {
      node.style[p] = vals[p];
    }

  };
}));