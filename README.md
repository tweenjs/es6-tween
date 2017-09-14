# es6-tween

ES6 implementation of <a href="https://github.com/tweenjs/tween.js">tween.js</a>

[![size](http://img.badgesize.io/https://unpkg.com/es6-tween?cache=false)](http://unpkg.com/es6-tween)
[![gzipsize](http://img.badgesize.io/https://unpkg.com/es6-tween?compression=gzip&cache=false)](http://unpkg.com/es6-tween)
[![CDNJS](https://img.shields.io/cdnjs/v/es6-tween.svg)](https://cdnjs.com/libraries/es6-tween)
[![jsdelivr](https://img.shields.io/badge/cdn-jsdelivr-brightgreen.svg)](https://cdn.jsdelivr.net/npm/es6-tween)  [![unpkg](https://img.shields.io/badge/cdn-unpkg-brightgreen.svg)](https://unpkg.com/es6-tween)  [![npmcdn](https://img.shields.io/badge/cdn-npmcdn-brightgreen.svg)](https://npmcdn.com/es6-tween)
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![license](https://img.shields.io/github/license/tweenjs/es6-tween.svg)]()
[![Travis tests][travis-image]][travis-url]
[![Flattr this][flattr-image]][flattr-url]
<br/>
[![NPM](https://nodei.co/npm/es6-tween.png?downloads=true&stars=true)](https://nodei.co/npm/es6-tween/)

```javascript
let coords = { x: 0, y: 0 };
let tween = new TWEEN.Tween(coords)
	.to({ x: 100, y: 100 }, 1000)
	.on('update', ({x, y}) => {
		console.log(`The values is x: ${x} and y: ${y}`);
	})
	.start();

TWEEN.autoPlay(true); // simplify the your code
}
```

# Adversiting
* Backers will be show there
* The user @dalisoft is looking for job, you can contact to me via [e-mail](mailto:dalisoft@mail.ru), or at [Twitter](https://twitter.com/dalisoft)


# News (`Lite` version is released)!

You can use the `Lite` version of ES6 which lighter (~8Kb minified), faster (~10% faster executioin), simpler (like the original one), memory effecient and better (can tween second-level Objects/Array). Optimized for runtime performance, no-lag anymore.
When you want building mobile apps that loading files from server, use `Lite` for better performance.
Differences when using `Lite`:
* 2-times lighter size
* No `Timeline` instance
* No `String` tween support
* No `Deep tween` support (does 2-level)
* Uses original `Interpolation` instances for `Bezier` interpolation
* Faster performance and execution speed
* Memory effecient
* No more shims required
* No `Plugins` support
* No `DOM Get/Set`, `Renderer` instance/plugin/add-on support
* No full-Event system, just 3 event support (`onStart`, `onUpdate`, `onComplete`)
* No `seek`, `reverse` support
* No event fire when `stop`, `pause`, `etc`
* No `*`, `/`, `%` relatives support


## Plugins

Starting at `v3`, we provide excluded plugins from core, so our core becomes lighter and faster. [Here our plugins list](https://www.npmjs.com/browse/keyword/es6-tween)


## Demos

* Demo #1 [Morphing SVG Shape + Cross-browser SVG Transform](https://codepen.io/dalisoft/pen/mMJmxX)
* Demo #2 [Morphing SVG Shape](https://codepen.io/dalisoft/pen/BdLydv)
* Demo #3 [Timeline](https://codepen.io/dalisoft/pen/mMRWdr)

## Installation

Download the [library](https://raw.githubusercontent.com/tweenjs/es6-tween/master/src/Tween.js) and include it in your code:

```html
<script src="js/Tween.js"></script>
```

### CDN-Hosted version

* See [cdnjs-hosted version](https://cdnjs.com/libraries/es6-tween) for get which result you want
* NOTE: `@latest` suffix sometimes saves life by loading latest, because sometimes CDN services will not load the latest

* Now you can load from CDN both version `Full` and `Lite`

```html
<!-- jsDelivr -->
<!-- Full -->
<script src="https://cdn.jsdelivr.net/npm/es6-tween"></script>

<!-- Lite -->
<script src="https://cdn.jsdelivr.net/npm/es6-tween/lite/Tween.min.js"></script>



<!-- unpkg -->
<!-- Full -->
<script src="https://unpkg.com/es6-tween"></script>

<!-- Lite -->
<script src="https://unpkg.com/es6-tween/lite/Tween.min.js"></script>


<!-- npmcdn -->
<!-- Full -->
<script src="https://npmcdn.com/es6-tween"></script>

<!-- Lite -->
<script src="https://npmcdn.com/es6-tween/lite/Tween.min.js"></script>
```


### More advanced users might want to...

#### Using `grunt`

PR are welcome...

#### Using `gulp`

PR are welcome...

#### Using `import`

```javascript
// Full
import { Easing, Tween, autoPlay } from 'es6-tween'

// Lite
import { Easing, Interpolation, Tween, autoPlay } from 'es6-tween/src/Tween.Lite'
```

#### Using [getlibs](https://github.com/activewidgets/getlibs)

```html
<script src="https://unpkg.com/getlibs"></script>
<script type="x-module">
// ES6
// Full
import { Easing, Tween, autoPlay } from 'es6-tween'

// Lite
import { Easing, Interpolation, Tween, autoPlay } from 'es6-tween/src/Tween.Lite'


// CommonJS
// Full
const { Tween, Easing, autoPlay } = require('es6-tween')

// Lite
const { Easing, Interpolation, Tween, autoPlay } = require('es6-tween/lite/Tween')
</script>
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
// Full
const { Tween, Easing, autoPlay } = require('es6-tween');

// Lite
const { Tween, Interpolation, Easing, autoPlay } = require('es6-tween/lite/Tween');
```

And you can use Tween.js as in all other examples--for example:

```javascript
const t = new Tween( /* etc */ );
t.start();
```

You can run script commands to build modules into single `UMD` compatible file:

#### Using commands

```bash
$ npm run build # builds production files
# or
$ npm run dev # builds and watchs development files
```

Then reference the library source:

```html
<script src="dist/Tween.min.js"></script>
```

## Features

* Tweens everything you give them, string, number, number of arrays, number of object, all-to, interpolators and much more. Endless possibilites
* Can use CSS units (e.g. appending `px`)
* Can interpolate colours
* Easing functions are reusable outside of Tween
* Can also use custom easing functions
* Much of easings

## Documentation

* Original source: <a href="https://github.com/tweenjs/tween.js">check out at here</a>
* [User guide](./docs/user_guide.md)
* [Wiki page](https://github.com/tweenjs/es6-tween/wiki)
* [Compatiblity](./compatibility/comp_support.md)
* [Tutorial](http://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/)  using tween.js with three.js

## Compatiblity Testing

Thanks to BrowserStack for providing us testing in a real devices to make it cross-browser, bug-free and better.
BrowserStack saved my countless hours, before i spent on testing much of time, now it's very easy. I recommend to others use this service.
I sure, BrowserStack helps us to make it, so i am linking to BrowserStack as our sponsor.
[<img src="https://cloud.githubusercontent.com/assets/7864462/12837037/452a17c6-cb73-11e5-9f39-fc96893bc9bf.png" alt="Browser Stack Logo" width="400">](https://www.browserstack.com/)

## Examples

Demos with this version are not yet implemented, sorry.

## Tests

```bash
npm test
```

or you can go [here](https://travis-ci.org/tweenjs/es6-tween) for more information, tests and etc...

every time you want to run the tests.

If you want to add any feature or change existing features, you *must* run the tests to make sure you didn't break anything else. If you send a PR to add something new and it doesn't have tests, or the tests don't pass, the PR won't be accepted. See [contributing](CONTRIBUTING.md) for more information.

## People

[All contributors](http://github.com/tweenjs/es6-tween/contributors).

## Thanks to: 
* [es6-tween contributors](https://github.com/tweenjs/es6-tween/graphs/contributors)
* Rollup, Buble, Travis CI, BrowserStack and others (make issue, if i'm missed you) with their teams, devs and supporters

## Projects using es6-tween

If you using our app and happy with this and share your app? Please make PR and we append to there your project

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
