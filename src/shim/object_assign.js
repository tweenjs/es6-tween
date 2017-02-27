if ( Object.assign === undefined ) {
	Object.assign = (...args) => {
		let first = args.shift();
			args.map(obj => {
				for ( let p in obj ) {
					first[p] = obj[p];
				}
			});
		return first;
	}
}