import './shim/object_assign';

import './shim/raf';

import './shim/isArray';

import { getAll, add, removeAll, remove, update, autoPlay, now } from './dist/core';

import Easing from './dist/Easing';

import Tween from './dist/Tween';

import Interpolation from './dist/Interpolation';

import cloneTween from './dist/clone';

export { getAll, add, removeAll, remove, update, cloneTween, autoPlay, now, Tween, Easing, Interpolation };