
const interpolatePath = (ap, bp, t) => {
	let bufferString = ''
	for (let i = 0, len = ap.length; i < len; i++) {
	  let {x: xf, y: yf, curve, moveTo} = ap[i]
	  let {x: xt, y: yt, curve: curve2} = bp[i]
	  let x = xf + (xt - xf) * t
	  let y = yf + (yt - yf) * t
	  if (moveTo) {
		bufferString += 'M' + x + ',' + y
	  } else if (curve && curve2) {
		let { type, x1, y1, x2, y2 } = curve
		let { x1: x3, y1: y3, x2: x4, y2: y4 } = curve2
		if (type === 'cubic') {
		  bufferString += 'C' + (x1 + (x3 - x1) * t) + ',' + (y1 + (y3 - y1) * t) + ',' + (x2 + (x4 - x2) * t) + ',' + (y2 + (y4 - y2) * t) + ',' + x + ',' + y
		} else if (type === 'quadratic') {
		  bufferString += 'Q' + (x1 + (x3 - x1) * t) + ',' + (y1 + (y3 - y1) * t) + ',' + x + ',' + y
		}
	  } else {
		bufferString += 'L' + x + ',' + y
	  }
	}
	return bufferString
  }
  
  export default interpolatePath