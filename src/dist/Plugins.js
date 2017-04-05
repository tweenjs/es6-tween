const cache = {
	filter: {
		grayscale: 1,
		brightness: 1,
		sepia: 1,
		invert: 1,
		saturate: 1,
		contrast: 1,
		blur: 1,
		hueRotate: 1,
		dropShadow: 1
	},
	transform: {
		translate: 1,
		translateX: 1,
		translateY: 1,
		translateZ: 1,
		rotate: 1,
		rotateX: 1,
		rotateY: 1,
		rotateZ: 1,
		scale: 1,
		scaleX: 1,
		scaleY: 1,
		scaleZ: 1,
		skew: 1,
		skewX: 1,
		skewY: 1
	}
};

export default class Plugins {
	static DOM(Composite) {
		let layer = Composite.domNode,
		style = layer.style;
		return {
			update(Tween, RenderObject) {
				for (let p in RenderObject) {
					style[p] = RenderObject[p];
				}
			}
		}
	}
	static Transform(Composite) {
		let layer = Composite.domNode,
		style = layer.style;
		return {
			update(Tween, RenderObject) {
				let transform = '';
				for (let p in RenderObject) {
					if (p === 'x' || p === 'y' || p === 'z') {
						transform += ' translate3d( ' + (RenderObject.x || '0px') + ', ' + (RenderObject.y || '0px') + ', ' + (RenderObject.z || '0px') + ')';
					} else if (cache.transform[p]) {
						transform += ` ${ p }( ${ RenderObject[p] })`;
					}
				}
				if (transform) {
					style.transform = transform;
				}
			}
		}
	}
	static Filter(Composite) {
		let layer = Composite.domNode,
		style = layer.style;
		return {
			update(Tween, RenderObject) {
				let filter = '';
				for (let p in RenderObject) {
					if (cache.filter[p]) {
						filter += ` ${ p }( ${ RenderObject[p] })`;
					}
				}
				if (filter) {
					style.webkitFilter = style.filter = filter;
				}
			}
		}
	}
	static Scroll(Composite) {
		let layer = Composite.domNode;
		return {
			update: (Tween, RenderObject) => {
				for (let p in RenderObject) {
					layer[p] = RenderObject[p];
				}
			}
		}
	}
};
