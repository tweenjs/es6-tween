/**
 * @name Executing Tweening via HTML Attribute and JSON Plugin
 * @license MIT-License
 * @requires: es6-tween core files for running this plugin
 */

import { Tween, Selector, Easing, isRunning, autoPlay } from 'es6-tween';

if (!isRunning()) {
  autoPlay(true);
}

const AttrInfo = {
  from: 'anim-from',
  to: 'anim-to',
  opts: 'anim-opts',
  onEv: 'anim-on',
  targ: 'anim-target'
} as const;

const _parseDot = function (value: string, targ: Record<string, any>) {
  let values;
  if (value.indexOf('.') !== -1) {
    values = value.split('.');
    let t = values.shift() as (typeof values)[number];
    if (targ[t] !== undefined) {
      return values.reduce(function (prev, curr) {
        return prev[curr] !== undefined ? prev[curr] : prev;
      }, targ[t]);
    }
    return targ;
  }
  return targ;
};

const JSONTypes = {
  Infinity: Infinity,
  true: true,
  false: false,
  NaN: NaN
} as const;
const alphaTypes = /([A-Za-z]+)/g;
const getTypeFromString = function (v: string | keyof typeof JSONTypes) {
  return typeof v === 'string' && JSONTypes[v] !== undefined
    ? JSONTypes[v]
    : !alphaTypes.test(v)
      ? parseFloat(v)
      : v.indexOf('.') !== -1 && v.indexOf(',') === -1
        ? v.indexOf('In') !== -1 || v.indexOf('Out') !== -1
          ? _parseDot(v, Easing)
          : v
        : v.indexOf(',') !== -1
          ? v.split(',').map(getTypeFromString)
          : v;
};
var runTween = function (
  elem: Element[],
  _from,
  _to,
  _opts,
  originalTarget,
  attrOn
) {
  if (elem && elem.length !== undefined) {
    for (var i = 0, len = elem.length; i < len; i++) {
      runTween(
        elem[i],
        _from,
        _to,
        _opts,
        originalTarget.length !== undefined
          ? originalTarget[i]
          : originalTarget,
        attrOn
      );
    }
  } else {
    var tween = Tween.fromTo(elem, _from, _to, _opts);
    if (attrOn) {
      originalTarget.addEventListener(attrOn, function () {
        tween.start();
      });
    } else {
      tween.start();
    }
  }
};

var allElem =
  document.all !== undefined
    ? document.all
    : !!document.querySelectorAll
      ? document.querySelectorAll('*')
      : [];
for (var i = 0, len = allElem.length; i < len; i++) {
  var elem = allElem[i];
  var originalTarget = elem;
  var attrFrom = elem.getAttribute(AttrInfo.from);
  var attrTo = elem.getAttribute(AttrInfo.to);
  var attrOpt = elem.getAttribute(AttrInfo.opts);
  var attrOn = elem.getAttribute(AttrInfo.onEv);
  var attrTarget = elem.getAttribute(AttrInfo.targ);

  var _from = attrFrom ? JSON.parse(attrFrom) : null;
  var _to = attrTo ? JSON.parse(attrTo) : null;
  var _opts = attrOpt ? JSON.parse(attrOpt) : {};

  if (!_from && !_to) {
    continue;
  }

  for (var p in _opts) {
    _opts[p] = getTypeFromString(_opts[p]);
  }

  if (attrTarget) {
    elem = Selector(attrTarget, true);
  }
  runTween(elem, _from, _to, _opts, originalTarget, attrOn);
}

export function parseJSON(inputJSON: string) {
  let parsedJSON;
  if (typeof inputJSON === 'string') {
    parsedJSON = JSON.parse(inputJSON);
  }
  for (let el in parsedJSON) {
    var item = parsedJSON[el];
    var _from = item.from;
    var _to = item.to;
    var _opts = item.opts;
    var elem = Selector(el, true);
    var originalTarget = elem;
    var attrOn = item.on;
    var attrTarget = item.target;

    if (!_from && !_to) {
      continue;
    }

    for (var p in _opts) {
      _opts[p] = getTypeFromString(_opts[p]);
    }

    if (attrTarget) {
      elem = Selector(attrTarget, true);
    }

    runTween(elem, _from, _to, _opts, originalTarget, attrOn);
  }
}
