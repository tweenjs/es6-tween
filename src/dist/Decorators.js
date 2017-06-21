import Tween from './Tween';

const lin = k => k;

export function TweenInit (target) {
	const {
		from,
		to,
		duration = 1000,
		easing = lin,
		events,
		instance
	} = target;
	const tweenInstance = new Tween(from, instance).to(to, duration).easing(lin);
	if (events) {
		tweenInstance._events = events;
	}
	target.start = tweenInstance.start.bind(tweenInstance);
}