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
		this._valuesStart = Tween.createEmptyConst(object);
		this._valuesStartRepeat = Tween.createEmptyConst(object);
		this._valuesEnd = Tween.createEmptyConst(object);
		this._chainedTweens = [];

		this._duration = 1000;
		this._easingFunction = Easing.Linear.None;
		this._interpolationFunction = Interpolation.None;

		this._startTime = 0;
		this._delayTime = 0;
		this._repeat = 0;
		this._r = 0;
		this._isPlaying = false;
		this._yoyo = false;
		this._reversed = false;

		this._onStartCallbackFired = false;
		this._events = {};
		this._pausedTime = 0;

		return this;

	}
	static createEmptyConst (oldObject) {
		return typeof(oldObject) === "number" ? 0 : Array.isArray(oldObject) ? [] : typeof(oldObject) === "object" ? {} : '';
	}
	static checkValidness ( valid ) {
		return valid !== undefined && valid !== null && valid !== '' && valid !== NaN && valid !== Infinity;
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
			let eventsList = this._events[ name ], i = 0;
			while (i < eventsList.length) {
				if ( eventsList[i] === fn ) {
					eventsList.splice(i, 1);
				}
				i++
			}
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

		remove( this );
		this._pausedTime = now();

		return this.emit( 'pause', this.object );
	}
	play() {

		if ( this._isPlaying ) {
			return this;
		}

		this._isPlaying = true;

		this._startTime += now() - this._pausedTime;
		add( this );
		this._pausedTime = now();

		return this.emit( 'play', this.object );
	}
	restart( noDelay ) {

		this._repeat = this._r;
		this._startTime = now() + ( noDelay ? 0 : this._delayTime );

		if ( !this._isPlaying ) {
			add( this );
		}

		return this.emit( 'restart', this._object );

	}
	seek( time, keepPlaying ) {

		this._startTime = now() + Math.max( 0, Math.min(
			time, this._duration ) );

		this.emit( 'seek', time, this._object );

		return keepPlaying ? this : this.pause();

	}
	duration( amount ) {

		this._duration = amount;

		return this;
	}
	to( properties = {}, duration = 1000 ) {

		if ( typeof properties === "number" ) {
			let _vE = { Number: properties };
			this._valuesEnd = _vE;
		} else {
			this._valuesEnd = properties;
		}

		if ( typeof duration === "number" ) {
			this._duration = duration;
		} else if ( typeof duration === "object" ) {
			for ( let prop in duration ) {
				this[prop](duration[prop]);
			}
		}

		return this;

	}
	start( time ) {

		let {
			_startTime
			, _delayTime
			, _valuesEnd
			, _valuesStart
			, _valuesStartRepeat
			, object
		} = this;

		_startTime = time !== undefined ? time : now();
		_startTime += _delayTime;

		this._startTime = _startTime;

		for ( let property in _valuesEnd ) {

			// Check if an Array was provided as property value
			if (typeof object[property] === "number" && _valuesEnd[property] instanceof Array) {

				if (_valuesEnd[property].length === 0) {
					continue;
				}

				// Create a local copy of the Array with the start value at the front
				this._valuesEnd[property] = [object[property]].concat(_valuesEnd[property]);

			}

			// If `to()` specifies a property that doesn't exist in the source object,
			// we should not set that property in the object
			if (Tween.checkValidness(object[property]) === false) {
				continue;
			}

			this._valuesStart[property] = object[property];

			this._valuesStartRepeat[property] = _valuesStart[property] || 0;


		}

		add( this );

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

		remove( this );
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
	get ( time ) {
		this.update( time );
		return this._object;
	}
	update( time = now() ) {

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

			// Don't update properties that do not exist in the source object
			if (_valuesStart[property] === undefined) {
				continue;
			}

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
					this._repeat--;
				}


				// Reassign starting values, restart by making startTime = now
				this.reverse();

				this.emit( _reversed ? 'reverse' : 'repeat', object );

				if ( _yoyo ) {
					this._reversed = !_reversed;
				}

				if ( !_reversed && _repeatDelayTime !== undefined ) {
					this._startTime += _duration + _repeatDelayTime;
				} else if ( _reversed && _reverseDelayTime !== undefined ) {
					this._startTime += _duration + _reverseDelayTime;
				} else {
					this._startTime += _duration + _delayTime;
				}

				return true;

			} else {

				this.emit( 'complete', object );

				_chainedTweens.map( tween => tween.start( _startTime + _duration ) );

				return false;

			}
		}
		return true;
	}
}

export default Tween;