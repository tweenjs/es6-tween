# es6-tween

ES6 implementation of <a href="https://github.com/tweenjs/tween.js">tween.js</a>

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Travis tests][travis-image]][travis-url]
[![Flattr this][flattr-image]][flattr-url]
<br/>
[![NPM](https://nodei.co/npm/es6-tween.png?downloads=true&stars=true)](https://nodei.co/npm/es6-tween/)

```javascript
let coords = { x: 0, y: 0 };
let tween = new TWEEN.Tween(coords)
	.to({ x: 100, y: 100 }, 1000)
	.on('update', object => {
		console.log(object.x, object.y);
	})
	.start();

requestAnimationFrame(animate);

function animate(time) {
	requestAnimationFrame(animate);
	TWEEN.update(time);
}
```

## Installation

Download the [library](https://raw.githubusercontent.com/tweenjs/es6-tween/master/src/Tween.js) and include it in your code:

```html
<script src="js/Tween.js"></script>
```

### CDN-Hosted version

#### Using `unpkg` hosted version

You can also reference a `unpkg`-hosted version in your code, thanks to <a href="https://unpkg.com/#/">unpkg</a>. For example:

```html
<script src="https://unpkg.com/es6-tween/dist/Tween.min.js"></script>
```

#### Using [jsdelivr](https://github.com/jsdelivr) hosted version

You can also reference a @jsdelivr-hosted version in your code, thanks to [jsdelivr](https://github.com/jsdelivr). For example:

```html
<script src="https://cdn.jsdelivr.net/es6-tween/latest/Tween.min.js"></script>
```

#### Using `cdnjs` (TO-DO)

Sorry for that, but `cdnjs` doesn't accept none of my app, so if someone can from `cdnjs` contributors, would be nice.


### More advanced users might want to...

#### Use `import`

```javascript
import * as TWEEN from './node_modules/es6-tween/src/Tween';
```

#### Using `npm`, `yarn` or `bower`

```bash
$ yarn add es6-tween
# or
$ npm install es6-tween
# or
$ bower install es6-tween
```

Then include the Tween.js module with the standard node.js `require`:

```javascript
let TWEEN = require('es6-tween');
```

And you can use Tween.js as in all other examples--for example:

```javascript
let t = new TWEEN.Tween( /* etc */ );
t.start();
```

You can run script commands to build modules into single `UMD` compatible file:

#### Use `Webpack + Babel Transpiler`

```bash
npm run build
```

Then reference the library source:

```html
<script src="dist/Tween.min.js"></script>
```

## Bugs/Fixes

#### Helping to avoid false log of `jscs`
```bash
git config core.eol lf
git config core.autocrlf input
git rm --cached -r .
git reset --hard
```

## Features

* Does one thing and one thing only: tween properties
* Doesn't take care of CSS units (e.g. appending `px`)
* Doesn't interpolate colours
* Easing functions are reusable outside of Tween
* Can also use custom easing functions

## Documentation

* Original source: <a href="https://github.com/tweenjs/tween.js">check out at here</a>
* [User guide](./docs/user_guide.md)
* [Compatiblity](./compatibility/comp_support.md)
* [Tutorial](http://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/)  using tween.js with three.js

## Examples

[![Custom functions](http://tweenjs.github.io/tween.js/assets/examples/03_graphs.png)](http://tweenjs.github.io/tween.js/examples/12_graphs_custom_functions.html)
[source](./examples/12_graphs_custom_functions.html)
[![Stop all chained tweens](http://tweenjs.github.io/tween.js/assets/examples/11_stop_all_chained_tweens.png)](http://tweenjs.github.io/tween.js/examples/11_stop_all_chained_tweens.html) [source](./examples/11_stop_all_chained_tweens.html)
[![Yoyo](http://tweenjs.github.io/tween.js/assets/examples/10_yoyo.png)](http://tweenjs.github.io/tween.js/examples/10_yoyo.html) [source](./examples/10_yoyo.html)
[![Relative values](http://tweenjs.github.io/tween.js/assets/examples/09_relative.png)](http://tweenjs.github.io/tween.js/examples/09_relative_values.html) [source](./examples/09_relative_values.html)
[![Repeat](http://tweenjs.github.io/tween.js/assets/examples/08_repeat.png)](http://tweenjs.github.io/tween.js/examples/08_repeat.html) [source](./examples/08_repeat.html)
[![Dynamic to](http://tweenjs.github.io/tween.js/assets/examples/07_dynamic_to.png)](http://tweenjs.github.io/tween.js/examples/07_dynamic_to.html) [source](./examples/07_dynamic_to.html)
[![Array interpolation](http://tweenjs.github.io/tween.js/assets/examples/03_graphs.png)](http://tweenjs.github.io/tween.js/examples/06_array_interpolation.html) [source](./examples/06_array_interpolation.html)
[![Video and time](http://tweenjs.github.io/tween.js/assets/examples/06_video_and_time.png)](http://tweenjs.github.io/tween.js/examples/05_video_and_time.html) [source](./examples/05_video_and_time.html)
[![Simplest possible example](http://tweenjs.github.io/tween.js/assets/examples/04_simplest.png)](http://tweenjs.github.io/tween.js/examples/04_simplest.html) [source](./examples/04_simplest.html)
[![Graphs](http://tweenjs.github.io/tween.js/assets/examples/03_graphs.png)](http://tweenjs.github.io/tween.js/examples/03_graphs.html) [source](./examples/03_graphs.html)
[![Black and red](http://tweenjs.github.io/tween.js/assets/examples/02_black_and_red.png)](http://tweenjs.github.io/tween.js/examples/02_black_and_red.html) [source](./examples/02_black_and_red.html)
[![Bars](http://tweenjs.github.io/tween.js/assets/examples/01_bars.png)](http://tweenjs.github.io/tween.js/examples/01_bars.html) [source](./examples/01_bars.html)
[![hello world](http://tweenjs.github.io/tween.js/assets/examples/00_hello_world.png)](http://tweenjs.github.io/tween.js/examples/00_hello_world.html) [source](./examples/00_hello_world.html)

## Tests

You need to install `npm` first--this comes with node.js, so install that one first. Then, cd to `es6-tween`'s directory and run:

```bash
npm install
```

if running the tests for the first time, to install additional dependencies for running tests, and then run

```bash
npm test
```

every time you want to run the tests.

If you want to add any feature or change existing features, you *must* run the tests to make sure you didn't break anything else. If you send a PR to add something new and it doesn't have tests, or the tests don't pass, the PR won't be accepted. See [contributing](CONTRIBUTING.md) for more information.

## People

Maintainers: [sole](https://github.com/sole), [dalisoft](https://github.com/dalisoft).

[All contributors](http://github.com/tweenjs/tween.js/contributors).

## Projects using tween.js

[![A-Frame VR](http://tweenjs.github.io/tween.js/assets/projects/10_aframe.png)](https://aframe.io)
[![MOMA Inventing Abstraction 1910-1925](http://tweenjs.github.io/tween.js/assets/projects/09_moma.png)](http://www.moma.org/interactives/exhibitions/2012/inventingabstraction/)
[![Web Lab](http://tweenjs.github.io/tween.js/assets/projects/08_web_lab.png)](http://www.chromeweblab.com/)
[![MACCHINA I](http://tweenjs.github.io/tween.js/assets/projects/07_macchina.png)](http://5013.es/toys/macchina)
[![Minesweeper 3D](http://tweenjs.github.io/tween.js/assets/projects/06_minesweeper3d.png)](http://egraether.com/mine3d/)
[![ROME](http://tweenjs.github.io/tween.js/assets/projects/05_rome.png)](http://ro.me)
[![WebGL Globe](http://tweenjs.github.io/tween.js/assets/projects/04_webgl_globe.png)](http://data-arts.appspot.com/globe)
[![Androidify](http://tweenjs.github.io/tween.js/assets/projects/03_androidify.png)](http://www.androidify.com/)
[![The Wilderness Downtown](http://tweenjs.github.io/tween.js/assets/projects/01_wilderness.png)](http://thewildernessdowntown.com/)
[![Linechart](http://tweenjs.github.io/tween.js/assets/projects/00_linechart.png)](http://dejavis.org/linechart)

[npm-image]: https://img.shields.io/npm/v/es6-tween.svg
[npm-url]: https://npmjs.org/package/es6-tween
[downloads-image]: https://img.shields.io/npm/dm/es6-tween.svg
[downloads-url]: https://npmjs.org/package/es6-tween
[travis-image]: https://travis-ci.org/tweenjs/es6-tween.svg?branch=master
[travis-url]: https://travis-ci.org/tweenjs/es6-tween
[flattr-image]: https://api.flattr.com/button/flattr-badge-large.png
[flattr-url]: https://flattr.com/submit/auto?fid=kxw7jx&url=https%3A%2F%2Fgithub.com%2Ftweenjs%2Fes6-tween
[cdnjs-image]: https://img.shields.io/cdnjs/v/es6-tween.svg
[cdnjs-url]: https://cdnjs.com/libraries/es6-tween