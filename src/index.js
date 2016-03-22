const _tweens = [];

export const getAll = () => _tweens.slice(0); // return a copy instead of the actual array

export function removeAll() {
	_tweens.length = 0;
}

export function add(tween) {
	_tweens.push(tween);
}

export function remove(tween) {
	const i = _tweens.indexOf(tween);

	if (i !== -1) {
		_tweens.splice(i, 1);
	}
}

// Include a performance.now polyfill
let nowFunc;

if (typeof window !== 'undefined' && 'performance' in window && 'now' in window.performance) {
	nowFunc = () => window.performance.now();
} else if (typeof window !== 'undefined') {
	// IE 8
	Date.now = (Date.now || function now() {
		return new Date().getTime();
	});
	const offset = window.performance.timing && window.performance.timing.navigationStart ?
		window.performance.timing.navigationStart : Date.now();
	nowFunc = () => {
		window.performance.now = () => Date.now() - offset;
	};
} else {
	// node js
	let hr = 0;
	nowFunc = () => {
		hr = process.hrtime();
		return (hr[0] * 1000 + hr[1] / 1e6);
	};
}

let curTime = 0;
export function update(time) {
	if (_tweens.length === 0) {
		return false;
	}

	let i = 0;

	curTime = time !== undefined ? time : nowFunc();

	while (i < _tweens.length) {
		if (_tweens[i].update(curTime)) {
			i++;
		} else {
			_tweens.splice(i, 1);
		}
	}

	return true;
}

import * as Ease from './ease';
export const Easing = Ease;
export const now = nowFunc;
export { Tween } from './tween';
import * as InterpolationFn from './interpolation';
export const Interpolation = InterpolationFn;
