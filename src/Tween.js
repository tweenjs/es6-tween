// TWEEN.js
let _tweens = [];

class TWEEN {
	static getAll() {
		return _tweens
	}
	static removeAll() {
		_tweens = []
	}
	static add( tween ) {
		_tweens.push( tween );
	}
	static remove( tween ) {
		_tweens.filter( tweens => tweens !== tween );
	}
	static now() {
		return performance.now();
	}
	static update( time, preserve ) {

		if ( _tweens.length === 0 ) {

			return false;

		}

		var i = 0;

		time = time !== undefined ? time : TWEEN.now();

		while ( i < _tweens.length ) {

			if ( _tweens[ i ].update( time ) || preserve ) {
				i++;
			} else {
				_tweens.splice( i, 1 );
			}

		}

		return true;
	}
}

// TWEEN.Tween.js
TWEEN.Tween = class {
	constructor( object = {} ) {

		this.object = object;
		this._valuesStart = Object.assign( {}, object );
		this._valuesStartRepeat = Object.assign( {}, object );
		this._valuesEnd = {};
		this._chainedTweens = [];

		this._duration = 1000;
		this._easingFunction = TWEEN.Easing.Linear.None;
		this._interpolationFunction = TWEEN.Interpolation.None;

		this._startTime = null;
		this._delayTime = 0;
		this._repeat = 0;
		this._repeatDelayTime = 0;
		this._isPlaying = false;
		this._yoyo = false;
		this._reversed = false;

		this._onUpdateCallback = null;
		this._onStartCallback = null;
		this._onStartCallbackFired = false;
		this._onCompleteCallback = null;
		this._onStopCallback = null;

		return this;

	}
	to( properties = {}, duration = 1000 ) {

		this._valuesEnd = properties;
		this._duration = duration;

		return this;

	}
	start( time ) {

		let { _startTime, _delayTime } = this;

		_startTime = time !== undefined ? time : TWEEN.now();
		_startTime += _delayTime;

		this._startTime = _startTime;

		TWEEN.add( this );

		this._isPlaying = true;

		return this;

	}
	stop() {

		let { _isPlaying, _onStopCallback, _object } = this;

		if ( !_isPlaying ) {
			return this;
		}

		TWEEN.remove( this );
		this._isPlaying = false;

		if ( _onStopCallback !== null ) {
			_onStopCallback( _object );
		}

		this.stopChainedTweens();
		return this;

	}
	end() {

		const { _startTime, _duration } = this;

		return this.update( _startTime + _duration );

	}
	stopChainedTweens() {

		let { _chainedTweens } = this;

		_chainedTweens.map( item => item.stop() );

		return this;

	}
	delay( amount ) {

		this._delayTime = amount;

		return this;

	}
	repeat( times ) {

		this._repeat = times;

		return this;

	}
	repeatDelay( amount ) {

		this._repeatDelayTime = amount;

		return this;

	}
	yoyo( state ) {

		this._yoyo = state;

		return this;

	}
	easing( fn ) {

		this._easingFunction = fn;

		return this;

	}
	interpolation( fn ) {

		this._interpolationFunction = fn;

		return this;

	}
	chain( ...args ) {

		this._chainedTweens = args;

		return this;

	}
	onStart( fn ) {

		this._onStartCallback = fn;

		return this;

	}
	onUpdate( fn ) {

		this._onUpdateCallback = fn;

		return this;

	}
	onComplete( fn ) {

		this.onCompleteCallback = fn;

		return this;

	}
	update( time ) {

		let {
			_onUpdateCallback
			, _onStartCallback
			, _onStartCallbackFired
			, _onCompleteCallback
			, _chainedTweens
			, _easingFunction
			, _interpolationFunction
			, _repeat
			, _repeatDelayTime
			, _delayTime
			, _yoyo
			, _reversed
			, _startTime
			, _duration
			, _valuesStart
			, _valuesStartRepeat
			, _valuesEnd
			, object
		} = this;

		let property;
		let elapsed;
		let value;

		if ( time < _startTime ) {
			return true;
		}

		if ( _onStartCallbackFired === false ) {

			if ( _onStartCallback !== null ) {
				_onStartCallback( object );
			}

			this._onStartCallbackFired = true;
		}

		elapsed = ( time - _startTime ) / _duration;
		elapsed = elapsed > 1 ? 1 : elapsed;

		value = _easingFunction( elapsed );

		for ( property in _valuesEnd ) {

			const start = _valuesStart[ property ];
			const end = _valuesEnd[ property ];

			if ( end instanceof Array ) {

				object[ property ] = _interpolationFunction( end, value );

			} else {

				// Parses relative end values with start as base (e.g.: +10, -3)
				if ( typeof( end ) === 'string' ) {

					if ( end.charAt( 0 ) === '+' || end.charAt( 0 ) === '-' ) {
						end = start + parseFloat( end );
					} else {
						end = parseFloat( end );
					}
				}

				// Protect against non numeric properties.
				if ( typeof( end ) === 'number' ) {
					object[ property ] = start + ( end - start ) * value;
				}

			}

		}

		if ( _onUpdateCallback ) {
			_onUpdateCallback( object, elapsed );
		}

		if ( elapsed === 1 ) {

			if ( _repeat > 0 ) {

				if ( isFinite( _repeat ) ) {
					_repeat--;
				}

				// Reassign starting values, restart by making startTime = now
				for ( property in _valuesStartRepeat ) {

					if ( typeof( _valuesEnd[ property ] ) === 'string' ) {
						_valuesStartRepeat[ property ] = _valuesStartRepeat[ property ] + parseFloat( _valuesEnd[ property ] );
					}

					if ( _yoyo ) {
						var tmp = _valuesStartRepeat[ property ];

						_valuesStartRepeat[ property ] = _valuesEnd[ property ];
						_valuesEnd[ property ] = tmp;
					}

					_valuesStart[ property ] = _valuesStartRepeat[ property ];

				}

				if ( _yoyo ) {
					this._reversed = !_reversed;
				}

				if ( _repeatDelayTime ) {
					this._startTime = time + _repeatDelayTime;
				} else {
					this._startTime = time + _delayTime;
				}

				return true;

			} else {

				if ( _onCompleteCallback !== null ) {

					_onCompleteCallback.call( _object, _object );
				}

				for ( var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++ ) {
					// Make the chained tweens start exactly at the time they should,
					// even if the `update()` method was called way past the duration of the tween
					_chainedTweens[ i ].start( _startTime + _duration );
				}

				return false;

			}
		}
		return true;
	}
}

TWEEN.Easing = {

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

			return k === 0 ? 0 : 1024 ** ( k - 1 );

		},

		Out( k ) {

			return k === 1 ? 1 : 1 - 2 ** ( -10 * k );

		},

		InOut( k ) {

			if ( k === 0 ) {
				return 0;
			}

			if ( k === 1 ) {
				return 1;
			}

			if ( ( k *= 2 ) < 1 ) {
				return 0.5 * ( 1024 ** ( k - 1 ) );
			}

			return 0.5 * ( -( 2 ** ( -10 * ( k - 1 ) ) ) + 2 );

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

			return -( 2 ** ( 10 * ( k - 1 ) ) ) * Math.sin( ( k - 1.1 ) * 5 * Math.PI );

		},

		Out( k ) {

			if ( k === 0 ) {
				return 0;
			}

			if ( k === 1 ) {
				return 1;
			}

			return 2 ** ( -10 * k ) * Math.sin( ( k - 0.1 ) * 5 * Math.PI ) + 1;

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
				return -0.5 * ( 2 ** ( 10 * ( k - 1 ) ) ) * Math.sin( ( k - 1.1 ) * 5 * Math.PI );
			}

			return 0.5 * ( 2 ** ( -10 * ( k - 1 ) ) ) * Math.sin( ( k - 1.1 ) * 5 * Math.PI ) + 1;

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

			return 1 - TWEEN.Easing.Bounce.Out( 1 - k );

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
				return TWEEN.Easing.Bounce.In( k * 2 ) * 0.5;
			}

			return TWEEN.Easing.Bounce.Out( k * 2 - 1 ) * 0.5 + 0.5;

		}

	}

};

TWEEN.Interpolation = {

	Linear( v, k ) {

		const m = v.length - 1;
		const f = m * k;
		const i = Math.floor( f );
		const fn = TWEEN.Interpolation.Utils.Linear;

		if ( k < 0 ) {
			return fn( v[ 0 ], v[ 1 ], f );
		}

		if ( k > 1 ) {
			return fn( v[ m ], v[ m - 1 ], m - f );
		}

		return fn( v[ i ], v[ i + 1 > m ? m : i + 1 ], f - i );

	},

	Bezier( v, k ) {

		let b = 0;
		const n = v.length - 1;
		const pw = Math.pow;
		const bn = TWEEN.Interpolation.Utils.Bernstein;

		for ( let i = 0; i <= n; i++ ) {
			b += pw( 1 - k, n - i ) * pw( k, i ) * v[ i ] * bn( n, i );
		}

		return b;

	},

	CatmullRom( v, k ) {

		const m = v.length - 1;
		let f = m * k;
		let i = Math.floor( f );
		const fn = TWEEN.Interpolation.Utils.CatmullRom;

		if ( v[ 0 ] === v[ m ] ) {

			if ( k < 0 ) {
				i = Math.floor( f = m * ( 1 + k ) );
			}

			return fn( v[ ( i - 1 + m ) % m ], v[ i ], v[ ( i + 1 ) % m ], v[ ( i + 2 ) % m ], f - i );

		} else {

			if ( k < 0 ) {
				return v[ 0 ] - ( fn( v[ 0 ], v[ 0 ], v[ 1 ], v[ 1 ], -f ) - v[ 0 ] );
			}

			if ( k > 1 ) {
				return v[ m ] - ( fn( v[ m ], v[ m ], v[ m - 1 ], v[ m - 1 ], f - m ) - v[ m ] );
			}

			return fn( v[ i ? i - 1 : 0 ], v[ i ], v[ m < i + 1 ? m : i + 1 ], v[ m < i + 2 ? m : i + 2 ], f - i );

		}

	},

	Utils: {

		Linear( p0, p1, t ) {

			return ( p1 - p0 ) * t + p0;

		},

		Bernstein( n, i ) {

			const fc = TWEEN.Interpolation.Utils.Factorial;

			return fc( n ) / fc( i ) / fc( n - i );

		},

		Factorial: ( ( () => {

			const a = [ 1 ];

			return n => {

				let s = 1;

				if ( a[ n ] ) {
					return a[ n ];
				}

				for ( let i = n; i > 1; i-- ) {
					s *= i;
				}

				a[ n ] = s;
				return s;

			};

		} ) )(),

		CatmullRom( p0, p1, p2, p3, t ) {

			const v0 = ( p2 - p0 ) * 0.5;
			const v1 = ( p3 - p1 ) * 0.5;
			const t2 = t * t;
			const t3 = t * t2;

			return ( 2 * p1 - 2 * p2 + v0 + v1 ) * t3 + ( -3 * p1 + 3 * p2 - 2 * v0 - v1 ) * t2 + v0 * t + p1;

		}

	}
}

// AMD/RequireJS
if ( typeof( define ) === "function" && define.amd ) {
	define( [], function() {
		return TWEEN;
	} );
	// NodeJS
} else if ( typeof( module ) !== "undefined" && module.exports ) {
	module.exports = TWEEN;
	// Browser
} else if ( typeof( window ) !== "undefined" && window.document ) {
	window.TWEEN = TWEEN;
	// WebWorker
} else if ( typeof self !== "undefined" && self.importScripts !== undefined ) {
	self.TWEEN = TWEEN;
	// On somecase (on TV with QT (JS compiler) this worked)
} else if ( typeof( exports ) !== "undefined" && typeof( global ) !== "undefined" ) {
	exports.TWEEN = Tween;
	// Else somewhere
} else {
	this.TWEEN = TWEEN;
}
