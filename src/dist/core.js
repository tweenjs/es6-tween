// TWEEN.js
let _tweens = [];
let isStarted = false;
let _autoPlay = false;
let _tick;
let _events = {};
let root = typeof( window ) !== "undefined" ? window : typeof( global ) !== "undefined" ? global : this;

const getAll = () => {
	return _tweens;
}

const autoPlay = ( state ) => {
	_autoPlay = state;
}

const removeAll = () => {
	_tweens = []
}

const emit = ( name, ...args ) => {
	let eventFn = _events[ name ];

	if ( !eventFn ) {
		return;
	}

	let i = eventFn.length;
	while ( i-- ) {
		eventFn[ i ].call( this, ...args );
	}
}

const off = ( ev, fn ) => {
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

const add = ( tween ) => {
	_tweens.push( tween );

	if ( _autoPlay && !isStarted ) {
		autoStart( now() );
		isStarted = true;
		emit( 'start' );
	}
	emit( 'add', tween, _tweens );

}

const on = ( ev, fn ) => {
	if ( _events[ ev ] === undefined ) {
		_events[ ev ] = [];
	}
	_events[ ev ].push( fn );
}

const once = ( ev, fn ) => {
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
			emit( 'remove', tween, _tweens );
			_tweens.splice( i, 1 );
		}
		i++
	}
}

const now = () => {
	return root.performance !== undefined && root.performance.now ? root.performance.now() : Date.now();
}

const update = ( time, preserve ) => {

	time = time !== undefined ? time : now();

	emit( 'update', time, _tweens );

	if ( _tweens.length === 0 ) {

		return false;

	}

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
	if ( update( time ) ) {
		_tick = requestAnimationFrame( autoStart );
	} else {
		isStarted = false;
		cancelAnimationFrame( _tick );
		emit( 'stop', time );
	}
}

export { getAll, removeAll, remove, add, now, update, autoPlay, on, once, off, emit };