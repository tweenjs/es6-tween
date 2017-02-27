let ROOT = typeof(window) !== "undefined" ? window : typeof(global) !== "undefined" ? global : this;

if ( ROOT.Map === undefined ) {
	ROOT.Map = class Map {
		constructor () {
			let _obj = {};

			this.set = function ( property, value ) {

				_obj[property] = value;

				return this;

			};

			this.get = ( property ) => {

				return _obj[property];

			};

			this.has = function ( property ) {

				return this.get(property) !== undefined;

			};

			return this;
		}
	}
}