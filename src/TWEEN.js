let _tweens = [];

class TWEEN {
	static getAll () {
		return _tweens
	}
	static removeAll () {
		_tweens = []
	}
	static add ( tween ) {
		_tweens.push( tween );
	}
	static remove ( tween ) {
		_tweens.filter(tweens => tweens !== tween);
	}
	static now () {
		return performance.now();
	}
	static update ( time, preserve ) {

		if (_tweens.length === 0) {

			return false;

		}

		var i = 0;

			time = time !== undefined ? time : TWEEN.now();

			while (i < _tweens.length) {

				if (_tweens[i].update(time) || preserve) {
					i++;
				} else {
					_tweens.splice(i, 1);
				}

			}

			return true;
	}
}
