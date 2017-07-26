

let _tweens = {};
let isStarted = false;
let _autoPlay = false;
let _tick;
let _events = {};
let root = typeof (window) !== "undefined" ? window : typeof (global) !== "undefined" ? global : {};
let _nextId = 0;

Object.defineProperty(_tweens, "length", {
	enumerable: false,
	writable: true,
	value: 0
});

const emit = function(name, a, b, c, d, e) {
	let eventFn = _events[name];

	if (eventFn) {
		let i = eventFn.length;
		while (i--) {
			eventFn[i].call(this, a, b, c, d, e);
		}
	}
}

const on = (ev, fn) => {
	if (_events[ev] === undefined) {
		_events[ev] = [];
	}
	_events[ev].push(fn);
}

const once = (ev, fn) => {
	if (_events[ev] === undefined) {
		_events[ev] = [];
	}
	on(ev, (...args) => {
		fn(...args);
		off(ev);
	});
}

const off = (ev, fn) => {
	if (ev === undefined || _events[ev] === undefined) {
		return;
	}
	if (fn !== undefined) {
		let eventsList = _events[name]
			, i = 0;
		while (i < eventsList.length) {
			if (eventsList[i] === fn) {
				eventsList.splice(i, 1);
			}
			i++
		}
	} else {
		_events[name] = [];
	}
}

const add = tween => {
	let { id } = tween;
	_tweens[id] = tween;
	_tweens.length++;

	if (_autoPlay && !isStarted) {
		update();
		isStarted = true;
		emit('start');
	}
	emit('add', tween, _tweens);

}

const nextId = () => {
	let id = _nextId;
	_nextId++;
	return id;
}

const getAll = () => {
	return _tweens;
}

const autoPlay = (state) => {
	_autoPlay = state;
}

const removeAll = () => {
	_tweens = {}

	Object.defineProperty(_tweens, "length", {
		enumerable: false,
		writable: true,
		value: 0
	});
}

const get = tween => {

	for ( let searchTween in _tweens ) {

	if (tween.id === +searchTween) {

		return _tweens[+searchTween];

	}

	}

	return null;

}

const has = tween => {

	return get(tween) !== null;

}

const remove = tween => {
	for ( let searchTween in _tweens ) {
		if (tween.id === +searchTween) {
			delete _tweens[+searchTween];
			_tweens.length--;
		}
	}
}

let now = function () {
	if (typeof (process) !== "undefined" && process.hrtime !== undefined) {
		return function () {
			let time = process.hrtime();

			// Convert [seconds, nanoseconds] to milliseconds.
			return time[0] * 1000 + time[1] / 1000000;
		};
	}
	// In a browser, use window.performance.now if it is available.
	else if (root.performance !== undefined &&
		root.performance.now !== undefined) {

		// This must be bound, because directly assigning this function
		// leads to an invocation exception in Chrome.
		return root.performance.now.bind(root.performance)
	}
	// Use Date.now if it is available.
	else {
		let offset = root.performance && root.performance.timing && root.performance.timing.navigationStart ? root.performance.timing.navigationStart : Date.now();
		return function () {
			return Date.now() - offset;
		}
	}
}();

const update = (time, preserve) => {

	time = time !== undefined ? time : now();

	if (_autoPlay) {
		_tick = requestAnimationFrame(update);
	}
	emit('update', time, _tweens);

	if (_tweens.length === 0) {

		isStarted = false;
		cancelAnimationFrame(_tick);
		emit('stop', time);
		return false;

	}

	for ( let i in _tweens ) {

		if (_tweens[i].update(time) || preserve) {
			i++;
		} else {
			delete _tweens[+i];
			_tweens.length--;
		}

	}

	return true;
}

// Normalise time when visiblity is changed (if available) ...
if (root.document) {
	let doc = root.document, timeDiff = 0, timePause = 0;
	doc.addEventListener('visibilitychange', (ev) => {
		if (_tweens.length === 0) {
			return false;
		}
		if (document.hidden) {
			timePause = now();
		} else {
			timeDiff = now() - timePause;

			for ( let tween in _tweens ) {

			tween._startTime += timeDiff

			}

		}
		return true;
	})
}

export { get, has, nextId, getAll, removeAll, remove, add, now, update, autoPlay, on, once, off, emit };