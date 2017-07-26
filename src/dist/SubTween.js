const SubTween = (start, end, roundv = 100000) => {
	if (Array.isArray(start)) {
		end = end.map((v, i) => v === start[i] ? null : typeof v === "number" ? v - start[i] : typeof v === "string" ? v : SubTween(start[i], v));
		let map = [...start];
		return (t) => {
			for ( let i = 0, length = end.length; i < length; i++ ) {
				let v = end[i];
				if ( typeof v === "function" ) {
					map[i] = v(t);
				} else if (typeof v === "number") {
					map[i] = (((start[i] + v * t) * roundv) | 0) / roundv;
				}
			}
			return map;
		}
	} else if (typeof start === "object") {
		for ( let property in end ) {
			if (end[property] === start[property]) {
				end[property] = null;
			} else if ( typeof end[property] === "object" ) {
				end[property] = SubTween(start[property], end[property]);
			} else if (typeof start[property] === "number") {
				end[property] -= start[property];
			}
		}
		let map = {...start};
		return (t) => {
		for ( let property in end ) {
			let to = end[property];
			if ( typeof to === "function" ) {
				map[property] = to(t);
			} else if (typeof to === "number") {
				map[property] = (((start[property] + to * t) * roundv) | 0) / roundv;
			}
		}
			return map;
		}
	} else if (typeof start === "number") {
		end -= start;
		let isSame = start === end;
		return (t) => {
			return isSame ? end : (((start + end * t) * roundv) | 0) / roundv;
		}
	} else {
		let isSame = start === end;
		return (t) => isSame ? start : t >= 0.5 ? end : start;
	}
}
export default SubTween;