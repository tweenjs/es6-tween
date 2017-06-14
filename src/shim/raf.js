let ROOT = typeof(window) !== "undefined" ? window : typeof(global) !== "undefined" ? global : new Function('return this')();
let _vendor = ['webkit', 'moz', 'ms', 'o'];
let animFrame = 'AnimationFrame';
let rafSuffixForVendor = 'Request' + animFrame;
let cafSuffixForVendor = 'Cancel' + animFrame;
let cafSuffixForVendor2 = 'CancelRequest' + animFrame;
let _timeout = setTimeout;
let _clearTimeout = clearTimeout;

if ( ROOT.requestAnimationFrame === undefined ) {

	let _raf, now, lastTime = Date.now(), frameMs = (50 / 3), fpsSec = frameMs;

	_vendor.map(vendor => {
		if ((_raf = ROOT[vendor + rafSuffixForVendor]) === undefined) {
			_raf = (fn) => {
				return _timeout(() => {
					now = Date.now();
					fn(now - lastTime);
					fpsSec = frameMs + (Date.now() - now);
				}, fpsSec);
			}
		}
	});

	if (_raf !== undefined) {
		ROOT.requestAnimationFrame = _raf;
	}
}

if ( ROOT.cancelAnimationFrame === undefined && (ROOT.cancelAnimationFrame = ROOT.cancelRequestAnimationFrame) === undefined ) {
	let _caf;

	_vendor.map(vendor => {
		if ((_caf = ROOT[vendor + cafSuffixForVendor]) === undefined && (_caf = ROOT[vendor + cafSuffixForVendor2]) === undefined) {
			_caf = (fn) => {
				return _clearTimeout(fn);
			}
		}
	});

	if (_caf !== undefined) {
		ROOT.cancelAnimationFrame = _caf;
	}
}
