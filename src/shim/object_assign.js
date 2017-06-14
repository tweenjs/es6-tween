if ( Object.assign === undefined ) {
	Object.assign = (first, ...args) => {
			args.map(obj => {
				for ( let p in obj ) {
					first[p] = obj[p];
				}
			});
		return first;
	}
}
