import Tween from './Tween';

export default class Timeline {
	constructor () {
		this._private = {
			tweens: [],
			fullTime: 0
		};
		return this;
	}
	add (tween) {
		if (tween instanceof Tween) {
			this._private.tweens.push(tween);
		} else if (!Array.isArray(tween) && typeof tween === "object") {
			let tweenExample = new Tween({x:0});
				for ( let p in tween ) {
					tweenExample[p](tween[p]);
				}
			this.add(tweenExample)
		} else if (typeof tween === "object") {
			tween.map(add => {
				this.add(add);
			});
		}
		return this;
	}
	start () {
		this._private.tweens.map(tween => {
			tween.start(this._private.fullTime);
		});
		this._private.fullTime = Math.max.apply(0, this._private.tweens.reduce((prev, curr) => {
			return curr._duration > prev ? curr._duration : prev;
		}, 0));
		return this;
	}
};