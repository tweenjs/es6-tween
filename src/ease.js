export const Linear = {

	None: (k) => k,

};

export const Quadratic = {

	In: (k) => k * k,

	Out: (k) => k * (2 - k),

	InOut(k) {
		const n = k * 2;
		const o = k - 1;
		if (n < 1) {
			return 0.5 * n * n;
		}

		return - 0.5 * (o * (n - 2) - 1);
	},

};

export const Cubic = {

	In: (k) => k * k * k,

	Out: (k) => {
		const n = k - 1;
		return n * n * n + 1;
	},

	InOut: (k) => {
		let n = k * 2;
		if (n < 1) {
			return 0.5 * n * n * n;
		}
		return 0.5 * ((n -= 2) * n * n + 2);
	},

};

export const Quartic = {

	In: (k) => k * k * k * k,

	Out: (k) => {
		const n = k - 1;
		return 1 - (n * n * n * n);
	},

	InOut: (k) => {
		let n = k * 2;
		if (n < 1) {
			return 0.5 * n * n * n * n;
		}

		return - 0.5 * ((n -= 2) * n * n * n - 2);
	},

};

export const Quintic = {

	In: (k) => k * k * k * k * k,

	Out: (k) => {
		const n = k - 1;
		return n * n * n * n * n + 1;
	},

	InOut: (k) => {
		let n = k * 2;
		if (n < 1) {
			return 0.5 * n * n * n * n * n;
		}

		return 0.5 * ((n -= 2) * n * n * n * n + 2);
	},

};

export const Sinusoidal = {

	In: (k) => 1 - Math.cos(k * Math.PI / 2),

	Out: (k) => Math.sin(k * Math.PI / 2),

	InOut: (k) => 0.5 * (1 - Math.cos(Math.PI * k)),

};

export const Exponential = {

	In: (k) => k === 0 ? 0 : Math.pow(1024, k - 1),

	Out: (k) => k === 1 ? 1 : 1 - Math.pow(2, - 10 * k),

	InOut: (k) => {
		const n = k * 2;
		if (k === 0) {
			return 0;
		}

		if (k === 1) {
			return 1;
		}

		if (n < 1) {
			return 0.5 * Math.pow(1024, n - 1);
		}

		return 0.5 * (- Math.pow(2, - 10 * (n - 1)) + 2);
	},

};

export const Circular = {

	In: (k) => 1 - Math.sqrt(1 - k * k),

	Out: (k) => {
		const n = k - 1;
		return Math.sqrt(1 - (n * n));
	},

	InOut: (k) => {
		let n = k * 2;
		if (n < 1) {
			return - 0.5 * (Math.sqrt(1 - n * n) - 1);
		}

		return 0.5 * (Math.sqrt(1 - (n -= 2) * n) + 1);
	},

};

export const Elastic = {

	In: (k) => {
		let s;
		let a = 0.1;
		const p = 0.4;
		const n = k - 1;
		if (k === 0) {
			return 0;
		}

		if (k === 1) {
			return 1;
		}

		if (!a || a < 1) {
			a = 1;
			s = p / 4;
		} else {
			s = p * Math.asin(1 / a) / (2 * Math.PI);
		}

		return - (a * Math.pow(2, 10 * n) * Math.sin((n - s) * (2 * Math.PI) / p));
	},

	Out: (k) => {
		let s;
		let a = 0.1;
		const p = 0.4;

		if (k === 0) {
			return 0;
		}

		if (k === 1) {
			return 1;
		}

		if (!a || a < 1) {
			a = 1;
			s = p / 4;
		} else {
			s = p * Math.asin(1 / a) / (2 * Math.PI);
		}

		return (a * Math.pow(2, - 10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1);
	},

	InOut(k) {
		let s;
		let a = 0.1;
		const p = 0.4;
		let n = k * 2;
		if (k === 0) {
			return 0;
		}

		if (k === 1) {
			return 1;
		}

		if (!a || a < 1) {
			a = 1;
			s = p / 4;
		} else {
			s = p * Math.asin(1 / a) / (2 * Math.PI);
		}

		if (n < 1) {
			return - 0.5 * (a * Math.pow(2, 10 * (n -= 1)) * Math.sin((n - s) * (2 * Math.PI) / p));
		}

		return a * Math.pow(2, -10 * (n -= 1)) * Math.sin((n - s) * (2 * Math.PI) / p) * 0.5 + 1;
	},

};

export const Back = {

	In: (k) => {
		const s = 1.70158;
		return k * k * ((s + 1) * k - s);
	},

	Out(k) {
		const s = 1.70158;
		const n = k - 1;
		return n * n * ((s + 1) * n + s) + 1;
	},

	InOut(k) {
		const s = 1.70158 * 1.525;
		let n = k * 2;
		if (n < 1) {
			return 0.5 * (n * n * ((s + 1) * n - s));
		}

		return 0.5 * ((n -= 2) * n * ((s + 1) * n + s) + 2);
	},

};

export const Bounce = {

	In: (k) => 1 - Bounce.Out(1 - k),

	Out: (k) => {
		let n = k;
		if (n < (1 / 2.75)) {
			return 7.5625 * n * n;
		} else if (n < (2 / 2.75)) {
			return 7.5625 * (n -= (1.5 / 2.75)) * n + 0.75;
		} else if (n < (2.5 / 2.75)) {
			return 7.5625 * (n -= (2.25 / 2.75)) * n + 0.9375;
		}
		return 7.5625 * (n -= (2.625 / 2.75)) * n + 0.984375;
	},

	InOut: (k) => {
		if (k < 0.5) {
			return Bounce.In(k * 2) * 0.5;
		}

		return Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
	},
};
