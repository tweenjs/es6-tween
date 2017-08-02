import Tween from './Tween'

const lin = k => k

export default function TweenInit (target) {
  const {
    from,
    to,
    duration = 1000,
    easing = lin,
    events,
    instance
  } = target
  const tweenInstance = new Tween(from, instance).to(to, duration).easing(easing)
  if (events) {
    tweenInstance._events = events
  }

  target.start = tweenInstance.start.bind(tweenInstance)
}
