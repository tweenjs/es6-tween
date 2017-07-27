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
		skewY: 1,
		x: 1,
		y: 1,
		z: 1
	}
};

export default class Plugins {
	static Attr(Composite) {
		let layer = this.domNode
		return {
			update(Tween, RenderObject) {
				for (let p in RenderObject) {
					if (cache.transform[p] || cache.filter[p]) continue;
					layer.setAttribute(p, RenderObject[p]);
				}
			}
		}
	}
	static Style() {
		let layer = this.domNode,
		style = layer.style;
		return {
			update(Tween, RenderObject) {
				for (let p in RenderObject) {
					if (cache.transform[p] || cache.filter[p]) continue;
					style[p] = RenderObject[p];
				}
			}
		}
	}
	static Transform() {
		let layer = this.domNode,
		style = layer.style;
		return {
			update(Tween, RenderObject) {
				let transform = '';
				for (let p in RenderObject) {
				if (cache.filter[p]) continue;
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
	static SVGTransform(xPos, yPos) {
		let layer = this.domNode,
		bbox = {};
		return {
			update(Tween, RenderObject) {
				let transform = '';
				for (let p in RenderObject) {
				if (!cache.transform[p]) continue;
				if (bbox.x === undefined || bbox.y === undefined) {
					this.setOrigin(xPos, yPos);
					continue;
				}
					if (p === 'rotate') {
						transform += ` rotate(${RenderObject[p]} ${bbox.x} ${bbox.y})`;
					} else if (p === 'x' || p === 'y') {
						transform += ` translate(${RenderObject.x || 0}, ${RenderObject.y || 0})`;
					} else {
						transform += ` ${p}(${RenderObject[p]})`;
					}
				}
				if (transform) {
					layer.setAttribute('transform', transform)
				}
				return this;
			},
			init(Tween, RenderObject) {

				return this.setOrigin(xPos, yPos);

			},
			setOrigin(x, y) {

				let { width, height, left, top } = layer.getBoundingClientRect();

				x = typeof(x) === "number" ? left + x : typeof x === "string" && x.indexOf('%') > -1 ? left + (width * (parseFloat(x) / 100)) : left + (width / 2);
				y = typeof(y) === "number" ? left + y : typeof y === "string" && y.indexOf('%') > -1 ? top + (height * (parseFloat(y) / 100)) : top + (height / 2);

				if (bbox.x !== undefined && bbox.y !== undefined) {

				x += x - diffX;
				y += y - diffY;

				}

				bbox.x = x;
				bbox.y = y;

				return this;
			}
		}
	}
	static Filter() {
		let layer = this.domNode,
		style = layer.style;
		return {
			update(Tween, RenderObject) {
				let filter = '';
				for (let p in RenderObject) {
				if (cache.transform[p]) continue;
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
	static Scroll() {
		let layer = this.domNode;
		return {
			update: (Tween, RenderObject) => {
				for (let p in RenderObject) {
					layer[p] = RenderObject[p];
				}
			}
		}
	}
};
