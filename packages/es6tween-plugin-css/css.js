/*!
 * @name CSS Plugin
 * @license MIT-License
 * @requires: es6-tween core files for running this plugin
 */

(function (factory) {
    "use strict";
    if (typeof define === "function" && define.amd) {
        define(['es6-tween', 'tweenizr'], function (es6Tween, Tweenizr) {
            return factory(es6Tween || Tweenizr);
        });
    } else if (typeof module !== "undefined" && module.exports && (require('es6-tween') || require('tweenizr'))) {
        module.exports = factory(require('es6-tween') || require('tweenizr'));
    } else if (typeof exports !== "undefined" && (exports.TWEEN || exports.Tweenizr)) {
        factory(exports.TWEEN || exports.Tweenizr);
    } else if (typeof window !== "undefined" && (window.TWEEN || window.Tweenizr)) {
        factory(window.TWEEN || window.Tweenizr);
    }
}
    (function (TWEEN) {
        "use strict";

        var Plugins = TWEEN.Plugins;

        var transform3dMap = {
            x: true,
            y: true,
            skew: true,
            scale: true,
            scaleX: true,
            scaleY: true,
            scaleZ: true,
            scale3d: true,
            translate: true,
            skewX: true,
            skewY: true,
            translate3d: true,
            z: true,
            rotate: true,
            rotateX: true,
            rotateY: true,
            rotateZ: true,
            scrollTop: true,
            scrollLeft: true
        };

        var css = Plugins.css = function (Tween, start, end) {
            if (!Tween.node) {
                return false;
            }
            this.style = Tween.node.style;
            this.obj = Tween.object || Tween._from;
        }
        var p = css.prototype;
        p.update = function () {
            var render = this.obj;
            var style = this.style;
            for (var prop in render) {
                if (Plugins[prop] || transform3dMap[prop])
                    continue;
                style[prop] = render[prop];
            }
        };
    }));
