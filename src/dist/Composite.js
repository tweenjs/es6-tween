import Plugins from './Plugins';

export default class Composite {
	constructor(domNode) {

		let self = this;

		this.domNode = domNode;
		this.plugins = {};
		let pluginList = this.plugins;

		this.render = function (object) {

			for (let p in pluginList) {

				pluginList[p] && pluginList[p].update && pluginList[p].update(this, object);

			}

			return this;
		};

		this.fetch = function () {

			if (Object.keys(this.object).length) {

				return this;

			}

			for (let p in pluginList) {

				pluginList[p] && pluginList[p].fetch && pluginList[p].fetch(this);

			}

			return this;
		};

		this.init = function (object) {

			for (let p in pluginList) {

				pluginList[p] && pluginList[p].init && pluginList[p].init(this, object);

			}

			return this;
		}

		return this;
	}
	applyPlugin(name) {
		if (Plugins[name] !== undefined) {
			this.plugins[name] = Plugins[name](this);
		}
		return this;
	}
	set object(obj) {
		return this.render(obj);
	}
	appendTo(node) {
		node.appendChild(this.domNode);
		return this;
	}
}
