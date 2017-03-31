import cloneTween from './clone';

import Plugins from './Plugins';

export default class Composite {
	constructor(domNode) {

		let self = this;

		this.mode = 'dom';
		this.domNode = domNode;
		this.plugins = {};
		let pluginList = this.plugins;

		this.render = function (object) {

			for (let p in pluginList) {

				pluginList[p] && pluginList[p].update && pluginList[p].update(this, object);

			}

			return this;
		};
		return this;
	}
	applyPlugin(name) {
		if (Plugins[name] !== undefined) {
			this.plugins[name] = Plugins[name](this);
		}
		return this;
	}
	drawMode(mode = 'dom') {
		// TO-DO: Implement SVG and Canvas mode
		this.mode = mode;
		return this;
	}
	set object(obj) {
		return this.render(obj);
	}
	cloneLayer() {
		return cloneTween(this, {}, Composite)
	}
	appendTo(node) {
		node.appendChild(this.domNode);
		return this;
	}
}
