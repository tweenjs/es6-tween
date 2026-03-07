/*!
 * @name Executing Tweening via HTML Attribute and JSON Plugin
 * @license MIT-License
 * @requires: es6-tween core files for running this plugin
 */

( function( TWEEN, factory ) {
        "use strict";
        if ( typeof define === "function" && define.amd ) {
            define( [ 'es6-tween' ], function( es6Tween ) {
                return factory( es6Tween );
            } );
        } else if ( typeof module !== "undefined" && module.exports && require( 'es6-tween' ) ) {
            module.exports = factory( require( 'es6-tween' ) );
        } else if ( typeof exports !== "undefined" && exports[ TWEEN ] ) {
            factory( exports[ TWEEN ] );
        } else if ( typeof window !== "undefined" && window[ TWEEN ] ) {
            factory( window[ TWEEN ] );
        }
    }
    ( 'TWEEN', function( TWEEN ) {
        "use strict";

        var Plugins = TWEEN.Plugins;
        var Tween = TWEEN.Tween;
        var Selector = TWEEN.Selector;
        var Easing = TWEEN.Easing;

        if ( !TWEEN.isRunning() ) {
            TWEEN.autoPlay( true );
        }

        var AttrInfo = {
            from: "anim-from",
            to: "anim-to",
            opts: "anim-opts",
            onEv: "anim-on",
            targ: "anim-target"
        };

        var _parseDot = function( dot, targ ) {
            if ( dot.indexOf( '.' ) !== -1 ) {
                dot = dot.split( '.' );
                var t = dot.shift();
                if ( targ[ t ] !== undefined ) {
                    return dot.reduce( function( prev, curr ) {
                        return prev[ curr ] !== undefined ? prev[ curr ] : prev;
                    }, targ[ t ] );

                }
                return targ;
            }
            return targ;
        };

        var JSONTypes = {
            "Infinity": Infinity,
            "true": true,
            "false": false,
            "NaN": NaN
        }
        var alphaTypes = /([A-Za-z]+)/g;
        var getTypeFromString = function( v ) {
            return typeof v === 'string' && JSONTypes[ v ] !== undefined ? JSONTypes[ v ] : !alphaTypes.test( v ) ?
                parseFloat( v ) : v.indexOf( '.' ) !== -1 && v.indexOf( ',' ) === -1 ? ( v.indexOf( 'In' ) !==
                    -1 || v.indexOf( 'Out' ) !== -1 ) ? _parseDot( v, Easing ) : v : v.indexOf( "," ) !== -1 ?
                v.split( "," )
                .map( getTypeFromString ) : v;
        }
        var runTween = function( elem, _from, _to, _opts, originalTarget, attrOn ) {
            if ( elem && elem.length !== undefined ) {
                for ( var i = 0, len = elem.length; i < len; i++ ) {
                    runTween( elem[ i ], _from, _to, _opts, originalTarget.length !== undefined ?
                        originalTarget[ i ] : originalTarget, attrOn )
                }
            } else {
                var tween = Tween.fromTo( elem, _from, _to, _opts )
                if ( attrOn ) {
                    originalTarget.addEventListener( attrOn, function() {
                        tween.start();
                    } )
                } else {
                    tween.start();
                }
            }
        }

        var allElem = document.all !== undefined ? document.all : !!document.querySelectorAll ? document.querySelectorAll(
            '*' ) : [];
        for ( var i = 0, len = allElem.length; i < len; i++ ) {
            var elem = allElem[ i ];
            var originalTarget = elem;
            var attrFrom = elem.getAttribute( AttrInfo.from );
            var attrTo = elem.getAttribute( AttrInfo.to );
            var attrOpt = elem.getAttribute( AttrInfo.opts );
            var attrOn = elem.getAttribute( AttrInfo.onEv );
            var attrTarget = elem.getAttribute( AttrInfo.targ );

            var _from = attrFrom ? JSON.parse( attrFrom ) : null;
            var _to = attrTo ? JSON.parse( attrTo ) : null;
            var _opts = attrOpt ? JSON.parse( attrOpt ) : {};

            if ( !_from && !_to ) {
                continue;
            }

            for ( var p in _opts ) {
                _opts[ p ] = getTypeFromString( _opts[ p ] );
            }

            if ( attrTarget ) {
                elem = Selector( attrTarget, true );
            }
            runTween( elem, _from, _to, _opts, originalTarget, attrOn )


        }

        TWEEN.parseJSON = function( _encodedJSON ) {
            if ( typeof _encodedJSON === 'string' ) {
                _encodedJSON = JSON.parse( _encodedJSON );
            }
            for ( var el in _encodedJSON ) {
                var item = _encodedJSON[ el ];
                var _from = item.from;
                var _to = item.to;
                var _opts = item.opts;
                var elem = Selector( el, true );
                var originalTarget = elem;
                var attrOn = item.on;
                var attrTarget = item.target;

                if ( !_from && !_to ) {
                    continue;
                }

                for ( var p in _opts ) {
                    _opts[ p ] = getTypeFromString( _opts[ p ] );
                }

                if ( attrTarget ) {
                    elem = Selector( attrTarget, true );
                }

                runTween( elem, _from, _to, _opts, originalTarget, attrOn )
            }
        };

    } ) );