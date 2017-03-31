import Tween from './Tween';

export default function cloneTween(obj = {}, configs = {}, Constructor_Ex = Tween) {
    let copyTween = new Constructor_Ex();
	for ( let config in obj ) {
		if (configs[config] !== undefined) {
		copyTween[config] = configs[config];
		} else {
		copyTween[config] = obj[config];
		}
	}
	return copyTween;
}