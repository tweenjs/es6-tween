// TWEEN.js
let _tweens = [];
let _time = 0;
let isStarted = false;
let _autoPlay = false;
let _tick;
let _events = {};

const getAll = () => {
	return _tweens;
}

const autoPlay = ( state ) => {
	_autoPlay = state;
}

const removeAll = () => {
	_tweens = []
}

const add = ( tween ) => {
	_tweens.push( tween );

	if ( _autoPlay && !isStarted ) {
		autoStart( now() );
		isStarted = true;
	}

}

const emit = ( ev, ...args ) {
	if ( _events[ ev ] !== undefined ) {
		_events[ ev ].map( event => event( ...args ) );
	}
}

const off = ( ev, fn ) {
	if ( ev === undefined || _events[ ev ] === undefined ) {
		return;
	}
	if ( fn !== undefined ) {
		let eventsList = _events[ name ]
			, i = 0;
		while ( i < eventsList.length ) {
			if ( eventsList[ i ] === fn ) {
				eventsList.splice( i, 1 );
			}
			i++
		}
	} else {
		_events[ name ] = [];
	}
}

const on = ( ev, fn ) {
	if ( _events[ ev ] === undefined ) {
		_events[ ev ] = [];
	}
	_events[ ev ].push( fn );
}

const once = ( ev, fn ) {
	if ( _events[ ev ] === undefined ) {
		_events[ ev ] = [];
	}
	on( ev, ( ...args ) => {
		fn( ...args );
		off( ev );
	} );
}

const remove = ( tween ) => {
	_tweens.filter( tweens => tweens !== tween );
	let i = 0
		, tweenFind;
	while ( i < _tweens.length ) {
		tweenFind = _tweens[ i ];
		if ( tweenFind === tween ) {
			_tweens.splice( i, 1 );
		}
		i++
	}
}

const now = () => {
	return _time;
}

const update = ( time, preserve ) => {

	time = time !== undefined ? time : now();

	_time = time;

	emit( 'update', time );

	if ( _tweens.length === 0 ) {

		return false;

	}

	emit( 'realupdate', time, _tweens );

	let i = 0;
	while ( i < _tweens.length ) {

		if ( _tweens[ i ].update( time ) || preserve ) {
			i++;
		} else {
			_tweens.splice( i, 1 );
		}

	}

	return true;
}

function autoStart( time ) {
	if ( update( _time ) ) {
		_time = time;
		_tick = requestAnimationFrame( autoStart );
	} else {
		isStarted = false;
		cancelAnimationFrame( _tick );
	}
}

export { getAll, removeAll, remove, add, now, update, autoPlay, on, once, off, emit };