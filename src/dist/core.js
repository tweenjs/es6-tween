// TWEEN.js
let _tweens = [];
let _time = 0;
let isStarted = false;
let _autoPlay = false;
let _tick;

const getAll = () => {
	return _tweens;
}

const autoPlay = (state) => {
	_autoPlay = state;
}

const removeAll = () => {
	_tweens = []
}

const add = (tween) => {
	_tweens.push(tween);

	if (_autoPlay && !isStarted) {
		autoStart(now());
		isStarted = true;
	}

}

const remove = (tween) => {
	_tweens.filter(tweens => tweens !== tween);
}

const now = () => {
	return _time;
}

const update = (time, preserve) => {

	time = time !== undefined ? time : now();

	_time = time;

	if (_tweens.length === 0) {

		return false;

	}

	let i = 0;
	while (i < _tweens.length) {

		if (_tweens[i].update(time) || preserve) {
			i++;
		} else {
			_tweens.splice(i, 1);
		}

	}

	return true;
}

function autoStart(time) {
	if (update(_time)) {
		_time = time;
		_tick = requestAnimationFrame(autoStart);
	} else {
		isStarted = false;
		cancelAnimationFrame(_tick);
	}
}

export { getAll, removeAll, remove, add, now, update, autoPlay };
