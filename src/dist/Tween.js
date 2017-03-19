import {
	add
	, remove
	, now
}
from './core';
import Easing from './Easing';
import Interpolation from './Interpolation';

class Tween {
	constructor( object = {} ) {

		this.object = object;
		this._valuesStart = Object.assign( {}, object );
		this._valuesStartRepeat = Object.assign( {}, object );
		this._valuesEnd = {};
		this._chainedTweens = [];

		this._duration = 1000;
		this._easingFunction = Easing.Linear.None;
		this._interpolationFunction = Interpolation.None;

		this._startTime = 0;
		this._delayTime = 0;
		this._repeat = 0;
		this._r = 0;
		this._repeatDelayTime = 0;
		this._reverseDelayTime = 0;
		this._isPlaying = false;
		this._yoyo = false;
		this._reversed = false;

		this._onStartCallbackFired = false;
		this._events = {};
		this._pausedTime = 0;

		return this;

	}
	isPlaying() {
		return this._isPlaying;
	}
	isStarted() {
		return this._onStartCallbackFired;
	}
	reverse() {

		let {
			_valuesStartRepeat
			, _yoyo
			, _valuesEnd
			, _valuesStart
		} = this;

		// Reassign starting values, restart by making startTime = now
		for ( let property in _valuesStartRepeat ) {

			if ( typeof( _valuesEnd[ property ] ) === 'string' ) {
				_valuesStartRepeat[ property ] = _valuesStartRepeat[ property ] + parseFloat( _valuesEnd[ property ] );
			}

			if ( _yoyo ) {
				let tmp = _valuesStartRepeat[ property ];

				_valuesStartRepeat[ property ] = _valuesEnd[ property ];
				_valuesEnd[ property ] = tmp;
			}

			_valuesStart[ property ] = _valuesStartRepeat[ property ];

		}

		this._reversed = !this._reversed;

		return this;
	}
	off( name, fn ) {
		if ( this._events[ name ] === undefined ) {
			return this;
		}
		if ( name !== undefined && fn !== undefined ) {
			this._events[ name ].filter( event => {
				if ( event === fn ) {
					return false;
				}
				return true;
			} );
		} else if ( name !== undefined && fn === undefined ) {
			this._events[ name ] = [];
		}
		return this;
	}
	on( name, fn ) {
		if ( this._events[ name ] === undefined ) {
			this._events[ name ] = [];
		}
		this._events[ name ].push( fn );
		return this;
	}
	once( name, fn ) {
		if ( this._events[ name ] === undefined ) {
			this._events[ name ] = [];
		}
		return this.on( name, ( ...args ) => {
			fn.call( this, ...args );
			this.off( name );
		} );
	}
	emit( name, ...args ) {

		if ( this._events[ name ] === undefined ) {
			return this;
		}
		this._events[ name ].map( event => {
			event.call( this, ...args );
		} );
		return this;

	}
	pause() {

		if ( !this._isPlaying ) {
			return this;
		}

		this._isPlaying = false;

		TWEEN.remove( this );
		this._pausedTime = TWEEN.now();

		return this.emit( 'pause', this.object );
	}
	play() {

		if ( this._isPlaying ) {
			return this;
		}

		this._isPlaying = true;

		this._startTime += TWEEN.now() - this._pausedTime;
		TWEEN.add( this );
		this._pausedTime = TWEEN.now();

		return this.emit( 'play', this.object );
	}
	restart( noDelay ) {

		this._startTime = TWEEN.now() + ( noDelay ? 0 : this._delayTime );

		if ( !this._isPlaying ) {
			TWEEN.add( this );
		}

		return this.emit( 'restart', this._object );

	}
	seek( time, keepPlaying ) {

		this._startTime = TWEEN.now() + Math.max( 0, Math.min(
			time, this._duration ) );

		this.emit( 'seek', time, this._object );

		return keepPlaying ? this : this.pause();

	}
	duration( amount ) {

		this._duration = amount;

		return this;
	}
	to( properties = {}, duration = 1000 ) {

		this._valuesEnd = properties;
		this._duration = duration;

		return this;

	}
	start( time ) {

		let {
			_startTime
			, _delayTime
		} = this;

		_startTime = time !== undefined ? time : TWEEN.now();
		_startTime += _delayTime;

		this._startTime = _startTime;

		TWEEN.add( this );

		this._isPlaying = true;

		return this;

	}
	stop() {

		let {
			_isPlaying
			, _onStopCallback
			, object
		} = this;

		if ( !_isPlaying ) {
			return this;
		}

		TWEEN.remove( this );
		this._isPlaying = false;

		this.stopChainedTweens();
		return this.emit( 'stop', object );

	}
	end() {

		const {
			_startTime
			, _duration
		} = this;

		return this.update( _startTime + _duration );

	}
	stopChainedTweens() {

		let {
			_chainedTweens
		} = this;

		_chainedTweens.map( item => item.stop() );

		return this;

	}
	delay( amount ) {

		this._delayTime = amount;

		return this;

	}
	repeat( times ) {

		this._repeat = times;
		this._r = times;

		return this;

	}
	repeatDelay( amount ) {

		this._repeatDelayTime = amount;

		return this;

	}
	reverseDelay( amount ) {

		this._reverseDelayTime = amount;

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
	update( time ) {

		let {
			_onStartCallbackFired
			, _chainedTweens
			, _easingFunction
			, _interpolationFunction
			, _repeat
			, _repeatDelayTime
			, _reverseDelayTime
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

			this.emit( 'start', object );

			this._onStartCallbackFired = true;
		}

		elapsed = ( time - _startTime ) / _duration;
		elapsed = elapsed > 1 ? 1 : elapsed;

		value = _easingFunction( elapsed );

		for ( property in _valuesEnd ) {

			let start = _valuesStart[ property ];
			let end = _valuesEnd[ property ];

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

		this.emit( 'update', object, elapsed );

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
						let tmp = _valuesStartRepeat[ property ];

						_valuesStartRepeat[ property ] = _valuesEnd[ property ];
						_valuesEnd[ property ] = tmp;
					}

					_valuesStart[ property ] = _valuesStartRepeat[ property ];

				}

				this.emit( _reversed ? 'repeat' : 'reverse', object );

				if ( _yoyo ) {
					this._reversed = !_reversed;
				}

				if ( _reversed && _repeatDelayTime ) {
					this._startTime = time + _repeatDelayTime;
				} else if ( !_reversed && _reverseDelayTime ) {
					this._startTime = time + _reverseDelayTime;
				} else {
					this._startTime = time + _delayTime;
				}

				return true;

			} else {

				this.emit( 'complete', object );

				_chainedTweens.map( tween => tween.start( _startTime + _duration ) );

				this._repeat = this._r;

				return false;

			}
		}
		return true;
	}
}

export default Tween;