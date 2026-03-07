/*!
 * @name Text Typer Plugin
 * @description Text ticker/typer animation for crazy things
 * @license MIT-License
 * @requires: es6-tween core files for running this plugin
 */

(function (factory) {
    "use strict";
    if (typeof define === "function" && define.amd) {
        define(['es6-tween'], factory);
    } else if (typeof module !== "undefined" && module.exports && !!require('es6-tween')) {
        module.exports = factory(require('es6-tween'));
    } else if (typeof exports !== "undefined" && exports["TWEEN"]) {
        factory(exports["TWEEN"]);
    } else if (typeof window !== "undefined" && window["TWEEN"]) {
        factory(window["TWEEN"]);
    } else if (this["TWEEN"]) {
        factory(this["TWEEN"]);
    }
}
    (function (TWEEN) {
        "use strict";

        var htmlTag = /([<>:;])+/g;
        var charsRandom = String("0~1!2@3#4$5%6^7&8*9(0)A-a_B=b+C[c{D]d}E;e:G\g|H/h?I,i<J.>j'K\"kLlMmNnOoPpQqRrSsTtUuVvWwYyXxZz")
        var Plugins = TWEEN.Plugins;
		var typer = Plugins.typer = {};
        typer.init = function (s, e, p) {
            this.et = e.text || e;
            this.typet = e && e.char !== undefined ? e.char : s && s.char !== undefined ? s.char : "_";
            this.useRandomChars = s && s.randomChars !== undefined ? s.randomChars : e && e.randomChars !== undefined ? e.randomChars : true;
            this.st = s && s.text !== undefined ? s.text : typeof s === 'string' ? s : this.node.innerHTML;
            return this;
        };
        typer.update = function (cv, sv, ev, v, e, prop) {
            var s = this.st, e = this.et, t = this.typet, isProgress = v < 1 && v > 0, useRandomChars = this.useRandomChars && isProgress, len = Math.max(s.length, e.length), tlen = v * len, dangle = (isProgress ? charsRandom.charAt((charsRandom.length * Math.random()) | 0) : '');
            t = ((tlen | 0) % 2) && isProgress ? t : '';
            var type = e.substr(0, tlen) + (useRandomChars && !htmlTag.test(dangle) ? dangle : '') + t + s.substr(tlen, len);
            this.node.innerHTML = type;
        };

		var num = Plugins.number = {};
		num.init = function (s, e, p) {
			this.snv = parseFloat(s);
			this.env = parseFloat(e) - this.snv;
			return this;
		};
		num.update = function (cv, sv, ev, v, e, prop) {
			this.node.textContent = this.snv + this.env * v;
		}
    }));