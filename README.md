# es6-tween

ES6 implementation of <a href="https://github.com/tweenjs/tween.js">tween.js</a>

[![size](http://img.badgesize.io/https://unpkg.com/es6-tween?cache=false)](https://unpkg.com/es6-tween)
[![gzipsize](http://img.badgesize.io/https://unpkg.com/es6-tween?compression=gzip&cache=false)](https://unpkg.com/es6-tween)
[![CDNJS](https://img.shields.io/cdnjs/v/es6-tween.svg)](https://cdnjs.com/libraries/es6-tween)
[![jsdelivr](https://img.shields.io/badge/cdn-jsdelivr-brightgreen.svg)](https://cdn.jsdelivr.net/npm/es6-tween)  [![unpkg](https://img.shields.io/badge/cdn-unpkg-brightgreen.svg)](https://unpkg.com/es6-tween)  [![npmcdn](https://img.shields.io/badge/cdn-npmcdn-brightgreen.svg)](https://npmcdn.com/es6-tween)
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![license](https://img.shields.io/github/license/tweenjs/es6-tween.svg)]()
[![Travis tests][travis-image]][travis-url]
[![Flattr this][flattr-image]][flattr-url]
<br/>
[![NPM](https://nodei.co/npm/es6-tween.png?downloads=true&stars=true)](https://nodei.co/npm/es6-tween/)

# What is tween?

```
Inbetweening or tweening is a key process in all types of animation, including computer animation. It is the process of generating intermediate frames between two images, called key frames, to give the appearance that the first image evolves smoothly into the second image. Inbetweens are the drawings which create the illusion of motion.
```

# What means this in Javascript

```
Implementing tween in Javascript always has been hardly, especially in 2009-2012years, but there have been much of leaders, one of these GreenSock Animation Platform, shifty, CollieJS, CreateJS TweenJS and our tween.js.
The @sole, @mrdoob and other contributors did the job amazing and worked hardly to make web better, interactive and live
```

# It's not tween.js!

```
Yes, we just implemented tween.js in ES6 for easier, understandable syntax to ES6 users and it's not successful as tween.js, but our users anyway uses this, it's awesome
```

# Why another one, there a lot of tweening library?

```
Yes, why another? Just we want to create library while keeping balance between feature-set/flexibility, performance and size. It's not hard, but not easy too. We work for users who users, who STARRED (Thank you, you're amazing)
```

# Alternatives

- GSAP
- kute.js
- tween.js
- TweenJS
- animejs
- Velocity.js
- Shifty
- jsAnim
- MooFX
- and a lot of these

# But these alternatives
not all of them does support the extend-ability and does not perform as well. Each of these has own Pros/Cons, we create own idea, create

- Plug-in/Extend-ability powered tweening library
- Performant, Memory, Power and CPU effecient
- Lower file-size for better load-time, it makes app faster and performant, nothing can change this

```javascript
TWEEN.autoPlay(true); // simplify the your code

let coords = { x: 0, y: 0 };
let tween = new TWEEN.Tween(coords)
	.to({ x: 100, y: 100 }, 1000)
	.on('update', ({x, y}) => {
		console.log(`The values is x: ${x} and y: ${y}`);
	})
	.start();

```

## Plugins

Starting at `v3`, we provide excluded plugins from core, so our core becomes lighter and faster. [Here our plugins list](https://www.npmjs.com/browse/keyword/es6-tween)


## Demos

* Demo #1 [Morphing SVG Shape + Cross-browser SVG Transform](https://codepen.io/dalisoft/pen/mMJmxX)
* Demo #2 [Morphing SVG Shape](https://codepen.io/dalisoft/pen/BdLydv)
* Collection on the [Codepen](https://codepen.io/collection/DapBmv/)

## Installation

Download the [library](https://raw.githubusercontent.com/tweenjs/es6-tween/master/ts/Tween.ts) and include it in your code:

```html
<script src="bundled/Tween.js"></script>
```

### CDN-Hosted version

* See [cdnjs-hosted version](https://cdnjs.com/libraries/es6-tween) for get which result you want
* NOTE: `@latest` suffix sometimes saves life by loading latest, because sometimes CDN services will not load the latest

* Now you can load from CDN

```html
<!-- jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/es6-tween"></script>


<!-- unpkg -->
<script src="https://unpkg.com/es6-tween"></script>


<!-- npmcdn -->
<script src="https://npmcdn.com/es6-tween"></script>
```


### More advanced users might want to...

#### Using `import`

```javascript
import { Easing, Tween, autoPlay } from 'es6-tween'
```

#### Using [getlibs](https://github.com/activewidgets/getlibs)

```html
<script src="https://unpkg.com/getlibs"></script>
<script type="x-module">
// ES6
import { Easing, Tween, autoPlay } from 'es6-tween'


// CommonJS
const { Tween, Easing, autoPlay } = require('es6-tween')
</script>
```

#### Using `npm` or `yarn`

```bash
$ yarn add es6-tween
# or
$ npm install es6-tween
```

Then include the Tween.js module with the standard node.js `require`:

```javascript
const { Tween, Easing, autoPlay } = require('es6-tween');
```

And you can use Tween.js as in all other examples--for example:

```javascript
const t = new Tween( /* etc */ );
t.start();
```

You can run script commands to build modules into single `UMD` compatible file:

#### Using commands

```bash
$ yarn build # builds production files
# or
$ yarn dev # builds and watchs development files
```

Then reference the library source:

```html
<script src="bundled/Tween.min.js"></script>
```

## Features

* Tweens everything you give them, string, number, number of arrays, number of object, all-to, interpolators and much more. Endless possibilites
* Can use CSS units (e.g. appending `px`)
* Can interpolate colours
* Easing functions are reusable outside of Tween
* Can also use custom easing functions
* Much of easings

## Compatiblity
All ES5 supported browsers including IE9+

#### Browsers
* Chrome
* Firefox 3.5+
* Opera 9.5+
* IE8+
* Safari 5.1+

#### OS (Fully working)
* Android 4.1+
* iOS6+
* WP8.5+
* OS X
* Windows 7+

#### Device
* iPhone
* iPad
* Android devices
* Nokia Lumia
* Samsung devices
* - all devices should compatible with supported OS

#### Package managers
* `bower`
* `npm`
* `yarn`

#### Bundler
* `Rollup`

#### Transpiler
* `Buble`

## Documentation

* Original source: <a href="https://github.com/tweenjs/tween.js">check out at here</a>
* [Full documentation](https://tweenjs.github.io/es6-tween/)
* [API documentation](./API.md)
* [Wiki page](https://github.com/tweenjs/es6-tween/wiki)
* [Tutorial](https://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/)  using tween.js with three.js

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

[All contributors](https://github.com/tweenjs/es6-tween/contributors).

## Thanks to: 
* [es6-tween contributors](https://github.com/tweenjs/es6-tween/graphs/contributors)
* Rollup, Buble, Travis CI, BrowserStack, jsDoc, docdash theme, TypeScript and others (make issue, if i'm missed you) with their teams, devs and supporters

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
