import Tween from './Tween';

export default function cloneTween(obj = {}, configs = {}) {
    let copyTween = new Tween({x:0});
	for ( let config in obj ) {
		if (configs[config] !== undefined) {
		copyTween[config] = configs[config];
		} else {
		copyTween[config] = obj[config];
		}
	}
	return copyTween;
}