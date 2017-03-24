export default function joinToString (__array__like) {
	let str = '';
	for ( let i = 0, len = __array__like.length; i < len; i++ ) {
		str += __array__like[i];
	}
	return str;
}