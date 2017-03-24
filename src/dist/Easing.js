const Easing = {

	Linear: {

		None( k ) {

			return k;

		}

	},

	Quadratic: {

		In( k ) {

			return k * k;

		},

		Out( k ) {

			return k * ( 2 - k );

		},

		InOut( k ) {

			if ( ( k *= 2 ) < 1 ) {
				return 0.5 * k * k;
			}

			return -0.5 * ( --k * ( k - 2 ) - 1 );

		}

	},

	Cubic: {

		In( k ) {

			return k * k * k;

		},

		Out( k ) {

			return --k * k * k + 1;

		},

		InOut( k ) {

			if ( ( k *= 2 ) < 1 ) {
				return 0.5 * k * k * k;
			}

			return 0.5 * ( ( k -= 2 ) * k * k + 2 );

		}

	},

	Quartic: {

		In( k ) {

			return k * k * k * k;

		},

		Out( k ) {

			return 1 - ( --k * k * k * k );

		},

		InOut( k ) {

			if ( ( k *= 2 ) < 1 ) {
				return 0.5 * k * k * k * k;
			}

			return -0.5 * ( ( k -= 2 ) * k * k * k - 2 );

		}

	},

	Quintic: {

		In( k ) {

			return k * k * k * k * k;

		},

		Out( k ) {

			return --k * k * k * k * k + 1;

		},

		InOut( k ) {

			if ( ( k *= 2 ) < 1 ) {
				return 0.5 * k * k * k * k * k;
			}

			return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );

		}

	},

	Sinusoidal: {

		In( k ) {

			return 1 - Math.cos( k * Math.PI / 2 );

		},

		Out( k ) {

			return Math.sin( k * Math.PI / 2 );

		},

		InOut( k ) {

			return 0.5 * ( 1 - Math.cos( Math.PI * k ) );

		}

	},

	Exponential: {

		In( k ) {

			return k === 0 ? 0 : Math.pow( 1024, ( k - 1 ) );

		},

		Out( k ) {

			return k === 1 ? 1 : 1 - Math.pow( -10 * k, 2 );

		},

		InOut( k ) {

			if ( k === 0 ) {
				return 0;
			}

			if ( k === 1 ) {
				return 1;
			}

			if ( ( k *= 2 ) < 1 ) {
				return 0.5 * Math.pow( 1024, ( k - 1 ) );
			}

			return 0.5 * ( -Math.pow( -10 * ( k - 1 ), 2 ) + 2 );

		}

	},

	Circular: {

		In( k ) {

			return 1 - Math.sqrt( 1 - k * k );

		},

		Out( k ) {

			return Math.sqrt( 1 - ( --k * k ) );

		},

		InOut( k ) {

			if ( ( k *= 2 ) < 1 ) {
				return -0.5 * ( Math.sqrt( 1 - k * k ) - 1 );
			}

			return 0.5 * ( Math.sqrt( 1 - ( k -= 2 ) * k ) + 1 );

		}

	},

	Elastic: {

		In( k ) {

			if ( k === 0 ) {
				return 0;
			}

			if ( k === 1 ) {
				return 1;
			}

			return -Math.pow( ( 10 * ( k - 1 ) ), 2 ) * Math.sin( ( k - 1.1 ) * 5 * Math.PI );

		},

		Out( k ) {

			if ( k === 0 ) {
				return 0;
			}

			if ( k === 1 ) {
				return 1;
			}

			return Math.pow( -10 * k, 2 ) * Math.sin( ( k - 0.1 ) * 5 * Math.PI ) + 1;

		},

		InOut( k ) {

			if ( k === 0 ) {
				return 0;
			}

			if ( k === 1 ) {
				return 1;
			}

			k *= 2;

			if ( k < 1 ) {
				return -0.5 * Math.pow( ( 10 * ( k - 1 ) ), 2 ) * Math.sin( ( k - 1.1 ) * 5 * Math.PI );
			}

			return 0.5 * Math.pow( -10 * ( k - 1 ), 2 ) * Math.sin( ( k - 1.1 ) * 5 * Math.PI ) + 1;

		}

	},

	Back: {

		In( k ) {

			const s = 1.70158;

			return k * k * ( ( s + 1 ) * k - s );

		},

		Out( k ) {

			const s = 1.70158;

			return --k * k * ( ( s + 1 ) * k + s ) + 1;

		},

		InOut( k ) {

			const s = 1.70158 * 1.525;

			if ( ( k *= 2 ) < 1 ) {
				return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
			}

			return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );

		}

	},

	Bounce: {

		In( k ) {

			return 1 - Easing.Bounce.Out( 1 - k );

		},

		Out( k ) {

			if ( k < ( 1 / 2.75 ) ) {
				return 7.5625 * k * k;
			} else if ( k < ( 2 / 2.75 ) ) {
				return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
			} else if ( k < ( 2.5 / 2.75 ) ) {
				return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
			} else {
				return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
			}

		},

		InOut( k ) {

			if ( k < 0.5 ) {
				return Easing.Bounce.In( k * 2 ) * 0.5;
			}

			return Easing.Bounce.Out( k * 2 - 1 ) * 0.5 + 0.5;

		}

	},

	Stepped( steps ) {
		return function( k ) {
			return Math.floor( k * steps ) / steps;
		}
	},

	Noisy( randomProportion, easingFunction ) {
		var normalProportion = 1.0 - randomProportion;
		return function( k ) {
			return randomProportion * Math.random() + normalProportion * easingFunction( k );
		}

	},

	// Credits:
	// @michaelvillar for dynamics.js easing/physics
	// Adapted by @dalisoft
	get bezier() {
			var b
				, d;
			b = function( b, d, g, f, h ) {
				var k = Math.pow( 1 - b, 3 )
					, l = 3 * Math.pow( 1 - b, 2 ) * b
					, m = 3 * ( 1 - b ) * Math.pow( b, 2 );
				b = Math.pow( b, 3 );
				return {
					x: k * d.x + l * g.x + m * f.x + b * h.x
					, y: k * d.y + l * g.y + m * f.y + b * h.y
				}
			};
			d = function( b, d ) {
				var g
					, f
					, h = 0
					, k = 0
					, l = d.length
					, m = 0
					, q = 1
					, w = ( q + m ) / 2;
				for ( g = null; k < l; ) {
					f = d[ k ];
					b >= f( 0 )
						.x && b <= f( 1 )
						.x && ( g = f );
					if ( null !== g )
						break;
					k++
				}
				if ( !g )
					return 1;
				for ( f = g( w )
					.x; 1E-4 < Math.abs( b - f ) && 100 > h; )
					b > f ? m = w : q = w, w = ( q + m ) / 2, f = g( w )
					.x, h++;
				return g( w )
					.y
			};
			return function( c ) {
				null == c && ( c = {} );
				var e = c.points
					, g = function() {
						var c
							, d = 0
							, k = e.length;
						g = [];
						for ( c = function( d, c ) {
								return g.push( function( e ) {
									return b( e, d, d.cp[ d.cp.length - 1 ], c.cp[ 0 ], c )
								} )
							}; d < k && !( d >= e.length - 1 ); )
							c( e[ d ], e[ d + 1 ] ), d++;
						return g
					}
					();
				return function( b ) {
					return d( b, g )
				}
			}
		}
	, easeInOut( b ) {
		var d
			, c;
		null == b && ( b = {} );
		d = null != ( c = b.friction ) ? c : Easing.easeInOut.defaults.friction;
		return Easing.bezier( {
			points: [ {
					x: 0
					, y: 0
					, cp: [ {
							x: .92 - d / 1E3
							, y: 0
							}
						]
					}, {
					x: 1
					, y: 1
					, cp: [ {
							x: .08 + d / 1E3
							, y: 1
							}
						]
					}
				]
		} )
	}
	, easeIn( b ) {
		var d
			, c;
		null == b && ( b = {} );
		d = null != ( c = b.friction ) ? c : Easing.easeIn.defaults.friction;
		return Easing.bezier( {
			points: [ {
					x: 0
					, y: 0
					, cp: [ {
							x: .92 - d / 1E3
							, y: 0
							}
						]
					}, {
					x: 1
					, y: 1
					, cp: [ {
							x: 1
							, y: 1
							}
						]
					}
				]
		} )
	}
	, easeOut( b ) {
		var d
			, c;
		null == b && ( b = {} );
		d = null != ( c = b.friction ) ? c : Easing.easeOut.defaults.friction;
		return Easing.bezier( {
			points: [ {
					x: 0
					, y: 0
					, cp: [ {
							x: 0
							, y: 0
							}
						]
					}, {
					x: 1
					, y: 1
					, cp: [ {
							x: .08 + d / 1E3
							, y: 1
							}
						]
					}
				]
		} )
	}
	, spring( b ) {
		var d
			, c
			, e
			, g
			, f;
		null == b && ( b = {} );
		Tools.extend( b, Easing.spring.defaults, true );
		e = Math.max( 1, b.frequency / 20 );
		g = Math.pow( 20, b.friction / 100 );
		f = b.anticipationSize / 1E3;
		d = function( d ) {
			var c
				, e;
			e = f / ( 1 - f );
			c = ( e - 0 ) / ( e - 0 );
			return ( .8 - c ) / e * d * b.anticipationStrength / 100 + c
		};
		c = function( b ) {
			return Math.pow( g / 10, -b ) * ( 1 - b )
		};
		return function( b ) {
			var g
				, l
				, m
				, q;
			q = b / ( 1 - f ) - f / ( 1 - f );
			b < f ? ( m = f / ( 1 - f ) - f / ( 1 - f ), g = 0 / ( 1 - f ) - f / (
					1 - f ), m = Math.acos(
					1 / d( m ) ), l = ( Math.acos( 1 / d( g ) ) - m ) / ( e * -f ), g =
				d ) : ( g = c, m = 0, l = 1 );
			return 1 - g( q ) * Math.cos( e * ( b - f ) * l + m )
		}
	}
	, bounce( b ) {
		var d
			, c
			, e
			, g;
		null == b && ( b = {} );
		Tools.extend( b, Easing.bounce.defaults );
		e = Math.max( 1, b.frequency / 20 );
		g = Math.pow( 20, b.friction / 100 );
		d = function( b ) {
			return Math.pow( g / 10, -b ) * ( 1 - b )
		};
		c = function( b ) {
			return d( b ) * Math.cos( e * b * 1 + -1.57 )
		};
		c.initialForce = !0;
		return c
	}
	, gravity( b ) {
		var d
			, c
			, e
			, g
			, f
			, h;
		null == b && ( b = {} );
		Tools.extend( b, Easing.gravity.defaults );
		c = Math.min( b.bounciness / 1250, .8 );
		g = b.elasticity / 1E3;
		e = [];
		d = function() {
				var e;
				e = Math.sqrt( .02 );
				e = {
					a: -e
					, b: e
					, H: 1
				};
				b.initialForce && ( e.a = 0, e.b *= 2 );
				for ( ; .001 < e.H; )
					d = e.b - e.a, e = {
						a: e.b
						, b: e.b + d * c
						, H: e.H * c * c
					};
				return e.b
			}
			();
		h = function( c, e, f, g ) {
			d = e - c;
			c = 2 / d * g - 1 - 2 * c / d;
			f = c * c * f - f + 1;
			b.initialForce && ( f = 1 - f );
			return f
		};
		( function() {
			var f
				, h
				, m;
			f = Math.sqrt( 2 / ( 100 * d * d ) );
			h = {
				a: -f
				, b: f
				, H: 1
			};
			b.initialForce && ( h.a = 0, h.b *= 2 );
			e.push( h );
			for ( m = []; 1 > h.b && .001 < h.H; )
				f = h.b - h.a, h = {
					a: h.b
					, b: h.b + f * c
					, H: h.H * g
				}
				, m.push( e.push( h ) );
			return m
		} )();
		f = function( c ) {
			var d
				, f;
			f = 0;
			for ( d = e[ f ]; !( c >= d.a && c <= d.b ) && ( f += 1, d = e[ f ], d ); );
			return d ? h( d.a, d.b, d.H, c ) : b.initialForce ? 0 : 1
		};
		f.initialForce = b.initialForce;
		return f
	}
	, forceWithGravity( b ) {
		null == b && ( b = {} );
		Tools.extend( b, Easing.forceWithGravity.defaults );
		b.initialForce = !0;
		return Easing.gravity( b )
	}

};

Easing.spring.defaults = {
	frequency: 300
	, friction: 200
	, anticipationSize: 0
	, anticipationStrength: 0
};
Easing.bounce.defaults = {
	frequency: 300
	, friction: 200
};
Easing.forceWithGravity.defaults = Easing.gravity.defaults = {
	bounciness: 400
	, elasticity: 200
};
Easing.easeInOut.defaults = Easing.easeIn.defaults = Easing.easeOut.defaults = {
	friction: 500
};

export default Easing;