export default class Plugins {
	static DOM (Composite) {
		let layer = Composite.domNode, style = layer.style;
		return {
			update (Tween, RenderObject) {
				for (let p in RenderObject) {
					style[p] = RenderObject[p];
				}
			}
		}
	}
	static Scroll (Composite) {
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