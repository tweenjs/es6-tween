/*!
 * @name CSS Renderer Plugin
 * @description CSS Rendering with full-power of JavaScript, no fail...
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

        // Some variables to be working correctly

        // Get prefix
        var doc = window.document;

        if (typeof doc === 'undefined') {
            return false;
        }

        var HYPEN_PREFIX = null;
        var Prefixes = ["Webkit", "Moz", "Ms", "ms", "O"];
        var Property = "Transform";
		var _isSetPropertySupported = false;
        var el,
            s;
        if (!doc || !doc.createElement) {
            HYPEN_PREFIX = 'Webkit'; // It should be Webkit/V8 as it's Node.js
        } else {
            el = document.createElement('div');
            s = el.style;
			_isSetPropertySupported = ('setProperty' in s) && typeof s.setProperty === 'function';
            if (Property in s) {
                HYPEN_PREFIX = ''; // Modern prefix-free browsers
            } else {
                for (var i = 0, len = Prefixes.length; i < len; i++) {
                    var pref = Prefixes[i];
                    if ((pref + Property) in s) {
                        HYPEN_PREFIX = pref;
                        break;
                    }
                }
            }
        }
        var CSS_PREFIX = HYPEN_PREFIX ? "-" + HYPEN_PREFIX.toLowerCase() + "-" : '';

        // Prefix
        var _prefix = function (property) {
            var propPrefixed = String(HYPEN_PREFIX + property[0].toUpperCase() + property.substr(1));
            return propPrefixed in s ? propPrefixed : property;
        };

        // Check SVG Elem
        var hasSVGSupport = window.SVGElement;
        var isSVGElement = function (node) {
            return hasSVGSupport && node instanceof SVGElement;
        };

        // Check 3D support for CSS3 Transform
        var IS3D = _prefix('perspective') in s;

        // Performance Optimization
        var GlobalRoundProps = {
            left: true,
            top: true,
            right: true,
            bottom: true
        };

        var TransformProps = {
            x: true,
            y: true,
            z: true,
            translate: true,
            translate3d: true,
            scale: true,
            scaleX: true,
            scaleY: true,
            scaleZ: true,
            scale3d: true,
            rotateX: true,
            rotateY: true,
            rotateZ: true,
            rotate: true,
            skew: true,
            skewX: true,
            skewY: true,
            transformPerspective: true
        };

        var FilterProps = {
            grayscale: 1,
            brightness: 1,
            sepia: 1,
            invert: 1,
            saturate: 1,
            contrast: 1,
            blur: 1,
            'hue-rotate': 1,
            'drop-shadow': 1
        };

        var ExceptedProperty = {
            transformOrder: true,
            clearProps: true,
            roundProps: true,
            decimalProps: true,
            transformOrigin: true
        };

		var Plugins = TWEEN.Plugins;

        var AttrProperty = {
            d: true,
            points: true,
            x1: true,
            y1: true,
            x2: true,
            y2: true,
            r: true,
            rx: true,
            ry: true,
            cx: true,
            cy: true,
            stopColor: true
        };

        var ScrollProperty = {
            scrollTop: true,
            scrollLeft: true
        };

        var StaticProperty = {
            display: true,
            visibility: true,
            cssFloat: true,
            backfaceVisibility: true,
            transformStyle: true
        };

        var defaultTransformOrder = ["transformPerspective", "x", "y", "z", "scaleX", "scaleY", "scaleY", "scale", "rotateX", "rotateY", "rotateZ", "rotate", "skewX", "skewY", "skew"];

        var transformProp = _prefix('transform');
        var filterProp = _prefix('filter');

        var CSSPlugin = {
			init: function CSSPlugin(CurrentObject, Start, End) {

			var Tween = this;
            var node = Tween.node;

            if (!node) {
                return false;
            }

            this.node = node;
            this._style = node.style;
            var transformOrder = End.transformOrder || defaultTransformOrder;
            var clearProps = End.clearProps;
            this.roundProps = End.roundProps;
            var transformOrigin = End.transformOrigin,
                isSVGNode = isSVGElement(node),
                is3DNode = IS3D && !isSVGNode,
                orderLen = transformOrder.length,
                obj = Tween.object;

            if (transformOrder.length < defaultTransformOrder.length) {
                transformOrder = defaultTransformOrder.reduce(function (p, c) {
                    if (p.indexOf(c) === -1) {
                        p.push(c);
                    }
                    return p;
                }, transformOrder);
            }
            this.transformOrder = transformOrder;

            var transformOriginFunc;
            var bbox,
                originTweenX = 0,
                originTweenY = 0,
                setTransformDOM = false;

            var pxsfx = isSVGNode ? 0 : 'px';
            var degsfx = isSVGNode ? 0 : 'deg';
            var smoothOriginPrepend = '',
                smoothOriginAppend = '';
            var _style = node.style;

            if (!transformOrigin && isSVGNode) {
                transformOrigin = "0% 0%";
            }
            if (transformOrigin) {
                if (isSVGNode) {
                    transformOriginFunc = function (origin, i) {
                        if (origin.indexOf("px") !== -1) {
                            return bbox[i === 0 ? "x" : "y"] + parseFloat(origin);

                        } else if (origin.indexOf("%") !== -1) {
                            return bbox[i === 0 ? "x" : "y"] + (bbox[i === 0 ? "width" : "height"] * (parseFloat(origin) / 100))
                        }
                        return parseFloat(origin);
                    };
                    bbox = node.getBBox();
                    transformOrigin = transformOrigin.split(" ").map(transformOriginFunc);
                    originTweenX = transformOrigin[0];
                    originTweenY = transformOrigin[1];
                    smoothOriginPrepend = 'translate(' + originTweenX + ',' + originTweenY + ') ';
                    smoothOriginAppend = 'translate(' + -originTweenX + ',' + -originTweenY + ') ';
                } else {
                    transformOriginFunc = function (origin, i) {
                        if (origin.indexOf("%") !== -1) {
                            return (node[i === 0 ? "offsetWidth" : "offsetHeight"] * (parseFloat(origin) / 100));
                        }
                        return parseFloat(origin);
                    };
                    var orig = transformOrigin.split(" ").map(transformOriginFunc);
                    node.style.transformOrigin = transformOrigin;
                    originTweenX = orig[0];
                    originTweenY = orig[1];
                    if (is3DNode) {
                        smoothOriginPrepend = 'translate3d(' + originTweenX + pxsfx + ',' + originTweenY + pxsfx + ', 0px) ';
                    } else {
                        smoothOriginPrepend = 'translate(' + originTweenX + pxsfx + ',' + originTweenY + pxsfx + ') ';
                    }
                }
                this.transformOrigin = transformOrigin;
                this.transformOriginFunc = transformOriginFunc;

            }
            this.is3DNode = is3DNode;
            this.isSVGNode = isSVGNode;
            this.pxsfx = pxsfx;
            this.degsfx = degsfx;
            this.setTransformDOM = setTransformDOM;
            this.smoothOriginPrepend = smoothOriginPrepend;
            this.smoothOriginAppend = smoothOriginAppend;
            this.clearProps = clearProps;

            for (var prop in obj) {
                var prefProp = _prefix(prop);
                if (prop !== prefProp) {
                    var vs = Start[prop],
                        ve = End[prop],
                        vb = obj[prop];
                    Start[prop] = null;
                    obj[prop] = null;
                    Start[prefProp] = vs;
                    obj[prefProp] = vb;
                    delete Start[prop];
                    delete obj[prop];
                    if (prop in End) {
                        End[prefProp] = ve;
                        End[prop] = null;
                        delete End[prop];
                    }
                }
            }
            for (var prop in StaticProperty) {
                if (!(prop in node.style)) {
                    continue
                }
                if (Start[prop] !== undefined) {
                    node.style[_prefix(prop)] = Start[prop];
                    Start[prop] = null;
                    delete Start[prop];
                }
                if (End[prop] !== undefined) {
                    node.style[_prefix(prop)] = End[prop];
                    End[prop] = null;
                    delete End[prop];
                }
                node.style[_prefix('transformOrigin')] = transformOrigin;
            }
            return this;
        },
            setOrigin: function (origin) {
                var transformOriginFunc = this.transformOriginFunc;
                if (isSVGNode) {
                    var transformOrigin = this.transformOrigin.split(" ");
                    var oldX = transformOrigin[0];
                    var oldY = transformOrigin[1];
                    var orig = origin.split(" ").map(transformOriginFunc);
                    var newX = orig[0];
                    var newY = orig[1];
                    var diffX = newX - oldX;
                    var diffY = newY - oldY;
                    originTweenX = newX;
                    originTweenY = newY;
                    transformOrigin[0] += diffX;
                    transformOrigin[1] += diffY;
                    var xOrig = transformOrigin[0],
                        yOrig = transformOrigin[1];
                    originTweenX += Math.abs(xOrig - oldX);
                    originTweenY += Math.abs(yOrig - oldY);
                    smoothOriginPrepend = 'translate(' + originTweenX + ',' + originTweenY + ')';
                    smoothOriginAppend = 'translate(' + -xOrig + ',' + -yOrig + ')';
                } else {
                    var orig = origin.split(" ").map(transformOriginFunc);
                    originTweenX += orig[0];
                    originTweenY += orig[1];
                    transformOrigin = origin;
                    setTransformDOM = false;
                    if (is3DNode) {
                        smoothOriginPrepend = 'translate3d( ' + originTweenX + pxsfx + ',' + originTweenY + pxsfx + ',0px)';
                    } else {
                        smoothOriginPrepend = 'translate(' + originTweenX + pxsfx + ',' + originTweenY + pxsfx + ')';
                    }
                    this.smoothOriginPrepend = smoothOriginPrepend;
                    this.smoothOriginAppend = smoothOriginAppend;
                }
                return this;
            },
            translateDecimal: 10,
            rotateDecimal: 100,
            scaleDecimal: 1000,
            defPx: '0px',
			def: function (v, u, d) {
				return !v ? d : typeof v === 'number' ? v + u : v;
			},
            update: function (style, t) {

                var roundProps = this.roundProps;
                var clearProps = this.clearProps;
                var node = this.node;
                var _style = this._style;
                var transformOrder = this.transformOrder;
                var is3DNode = this.is3DNode;
                var isSVGNode = this.isSVGNode;
                var setTransformDOM = this.setTransformDOM;
                var pxsfx = this.pxsfx;
                var degsfx = this.degsfx;
                var smoothOriginPrepend = this.smoothOriginPrepend;
                var smoothOriginAppend = this.smoothOriginAppend;
                var i = 0;
                var orderLen = transformOrder.length;
                var transform;
                var cssFilter;
                var translateSet;
                var trd = 10;
                var rtd = 100;
                var std = 1000;
                var defpx = 0 + pxsfx;
				var def = CSSPlugin.def;

                for (var p in style) {
                    if (typeof style[p] === 'number') {
                        if (roundProps && roundProps.indexOf(p) !== -1 || GlobalRoundProps[p]) {
                            style[p] = style[p] | 0;
                        }
                        if (p === 'x' || p === 'y' || p === 'z') {
                            style[p] = (((style[p] * trd) | 0) / trd);
                        } else if (p === 'scale' || p === 'scaleX' || p === 'scaleY' || p === 'scaleZ') {
                            style[p] = ((style[p] * std) | 0) / std
                        } else if (p === 'rotate' || p === 'rotateZ') {
                            style[p] = (((style[p] * rtd) | 0) / rtd);
                        }
                    }
                    if (Plugins[p] || TransformProps[p] || ExceptedProperty[p]) {
                        continue;
                    } else if (FilterProps[p]) {
                        cssFilter = cssFilter || '';
                        cssFilter += p + '(' + style[p] + ') ';
                    } else if (ScrollProperty[p]) {
                        node[p] = style[p];
                    } else if (AttrProperty[p]) {
                        node.setAttribute(p, style[p]);
                    } else if (p.indexOf('--') === 0 && _isSetPropertySupported) {
						_style.setProperty(p, style[p])
					} else {
                        _style[p] = style[p];
                    }
                }

                for (; i < orderLen; i++) {
                    var p = transformOrder[i];
                    if (style[p] !== undefined) {
                        transform = transform || '';
                        if (p === 'x' || p === 'y' || p === 'z') {
                            if (!translateSet) {
                                transform += is3DNode ? 'translate3d(' + def(style.x, pxsfx, defpx) + ',' + def(style.y, pxsfx, defpx) + ',' + def(style.z, pxsfx, defpx) + ') ' : 'translate(' + def(style.x, pxsfx, defpx) + ',' + def(style.y, pxsfx, defpx) + ') ';
                                translateSet = true;
                            }
                        } else if (p === 'scale' || p === 'scaleX' || p === 'scaleY' || p === 'scaleZ') {
                            transform += is3DNode ? 'scale3d(' + (style.scaleX !== undefined ? style.scaleX : style.scale !== undefined ? style.scale : 1) + ',' + (style.scaleY !== undefined ? style.scaleY : style.scale !== undefined ? style.scale : 1) + ',' + (style.scaleZ !== undefined ? style.scaleZ : style.scale !== undefined ? style.scale : 1) + ') ' : 'scale(' + (style.scaleX !== undefined ? style.scaleX : style.scale !== undefined ? style.scale : 1) + ',' + (style.scaleY !== undefined ? style.scaleY : style.scale !== undefined ? style.scale : 1) + ') ';
                        } else if (p === 'transformPerspective') {
                            transform += 'perspective(' + style[p] + ') ';
                        } else if (p === 'rotate' || p === 'rotateZ') {
							var rotateValue = style[p];
							if (typeof rotateValue === 'number') {
								rotateValue += degsfx;
							}
                            transform += p + '(' + rotateValue + ') ';
                        } else {
                            transform += p + '(' + style[p] + ') ';
                        }
                    }
                }

                if (transform) {
                    if (isSVGNode) {
                        node.setAttribute('transform', smoothOriginPrepend + transform + smoothOriginAppend);
                    } else {
                        _style[transformProp] = smoothOriginPrepend + transform;
                    }
                    transform = null;
                }
                if (cssFilter) {
                    _style[filterProp] = cssFilter;
                    cssFilter = null;
                }

                if (t === 1 && clearProps) {
                    for (var i = 0, len = clearProps.length; i < len; i++) {
                        var p = clearProps[i];
                        if (isSVGNode && node.getAttribute(p)) {
                            node.removeAttribute(p);
                        } else {
                            _style[p] = '';
                        }
                    }
                }
            }
        }

        TWEEN.Tween.Renderer = CSSPlugin;

    }));
