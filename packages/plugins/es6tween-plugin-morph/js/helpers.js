export const style = {
	fill: 'none',
	fillOpacity: '1',
	fillRule: 'nonzero',
	stroke: 'none',
	strokeWidth: 'none',
	strokeDasharray: 'none',
	strokeDashoffset: '0px',
	strokeLinecap: 'butt',
	strokeLinejoin: 'miter',
	strokeOpacity: '1',
	opacity: '1',
	vectorEffect: 'none'
  }
  
  export const mainAttr = {
	id: true,
	'class': true
  }
  
  export const _propTypes = {
	g: { shapes: true },
	path: { d: true },
	polygon: { points: true },
	polyline: { points: true },
	rect: {
	  width: true,
	  height: true,
	  x: true,
	  y: true,
	  rx: true,
	  ry: true
	},
	circle: {
	  cx: true,
	  cy: true,
	  r: true
	},
	ellipse: {
	  cx: true,
	  cy: true,
	  rx: true,
	  ry: true
	},
	line: {
	  x1: true,
	  y1: true,
	  x2: true,
	  y2: true
	}
  }
  
  export const getProps = (node, attrs, type, _style, a) => {
	let _attr = {}
	if (type === 'g') {
	  let children = [].slice.call(node.children)
	  _attr.styles = children.map(p => ({}))
	  _attr.attrs = children.map(p => ({}))
	  _attr.shapes = children.map((p, i) => nodeFetch(p, _attr.styles[i], _attr.attrs[i]))
	} else {
	  for (let p in attrs) {
		let attr = node.getAttribute(p)
		if (attr) {
		  _attr[p] = isNaN(+attr) ? attr : +attr
		}
	  }
	  if (_style) {
		for (let p in style) {
		  let attr = node.style[p] || node.getAttribute(p)
		  if (attr) {
			_style[p] = isNaN(+attr) ? attr : +attr
		  }
		}
	  }
	  if (a) {
		for (let p in mainAttr) {
		  let attr = node.getAttribute(p)
		  if (attr) {
			a[p] = attr
		  }
		}
	  }
	}
	_attr.elem = node
	_attr.type = type
	return _attr
  }
  
  export function nodeFetch (node, style, attr) {
	let isNode = node !== undefined && node.nodeType !== undefined
	let type = isNode && node.tagName.toLowerCase()
	let propType = isNode && _propTypes[type]
	return isNode ? getProps(node, propType, type, style, attr) : typeof node === 'string' ? { type: 'path', d: node } : typeof node === 'object' ? node : null
  }
  
  export const areaPoints = polygon => polygon.reduce((area, {x, y}, i) => {
	const {x: x1, y: y1} = i === 0 ? polygon[polygon.length - 1] : polygon[i - 1]
	area += ((x1 + x) * (y1 - y)) / 2
	return area
  }, 0)