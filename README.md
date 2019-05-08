# es6-tween

- High-performant animations without headaches
- Simple, modular and functional animation library for web and node
- Tweening library that needs to use where performance matter
- Flexible, extendable, modular and resource-efficient tweening library

[![NPM Min Size][npm-min-size]][unpkg-url]
[![NPM Gzip Size][npm-gzip-size]][unpkg-url]
[![CDNJS][cdnjs-image]][cdnjs-url]
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![license](https://img.shields.io/github/license/tweenjs/es6-tween.svg)]()
[![Travis tests][travis-image]][travis-url]
<br/>
[![NPM](https://nodei.co/npm/es6-tween.png?downloads=true&stars=true)](https://nodei.co/npm/es6-tween/)

# Note

We already know what is tweening and why it's need, so there no need to describe it's, Google will do this if you want.
**This library is not made as alternative to another libraries, it's has own pros and cons**

# Docs

- [See docs at GitBook](https://tweenjs.gitbook.io/es6-tween/)
- [Homepage](https://tweenjs.github.io/es6-tween/) (not completed)
- [API documentation](./API.md)
- [Wiki page](https://github.com/tweenjs/es6-tween/wiki)

```javascript
TWEEN.autoPlay(true); // simplify the your code

let coords = { x: 0, y: 0 };
let tween = new TWEEN.Tween(coords)
  .to({ x: 100, y: 100 }, 1000)
  .on('update', ({ x, y }) => {
    console.log(`The values is x: ${x} and y: ${y}`);
  })
  .start();
```

## Plugins

Starting at `v3`, we provide excluded plugins from core, so our core becomes lighter and faster. [Here our plugins list](https://www.npmjs.com/browse/keyword/es6-tween)

## Demos

- Demo #1 [Morphing SVG Shape + Cross-browser SVG Transform](https://codepen.io/dalisoft/pen/mMJmxX)
- Demo #2 [Morphing SVG Shape](https://codepen.io/dalisoft/pen/BdLydv)
- Collection on the [Codepen](https://codepen.io/collection/DapBmv/)

## Installation

Download the [library](https://unpkg.com/es6-tween/bundled/Tween.js) and include it in your code:

```html
<script src="bundled/Tween.js"></script>
```

### CDN-Hosted version

- See [cdnjs-hosted version](https://cdnjs.com/libraries/es6-tween) for get which result you want
- NOTE: `@latest` suffix sometimes saves life by loading latest, because sometimes CDN services will not load the latest

- Now you can load from CDN

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
import { Easing, Tween, autoPlay } from 'es6-tween';
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
const t = new Tween(/* etc */);
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

- Tweens everything you give them, string, number, number of arrays, number of object, all-to, interpolators and much more. Endless possibilites
- Can use CSS units (e.g. appending `px`)
- Can interpolate colours
- Easing functions are reusable outside of Tween
- Can also use custom easing functions
- Much of easings

## Compatiblity Testing

Thanks to BrowserStack for providing us testing in a real devices to make it cross-browser, bug-free and better.
BrowserStack saved my countless hours, before i spent on testing much of time, now it's very easy. I recommend to others use this service.
I sure, BrowserStack helps us to make it, so i am linking to BrowserStack as our sponsor.
[<img src="https://cloud.githubusercontent.com/assets/7864462/12837037/452a17c6-cb73-11e5-9f39-fc96893bc9bf.png" alt="Browser Stack Logo" width="400">](https://www.browserstack.com/)

## Tests

```bash
$ yarn test
```

or you can go [here](https://travis-ci.org/tweenjs/es6-tween) for more information, tests and etc...

every time you want to run the tests.

If you want to add any feature or change existing features, you _must_ run the tests to make sure you didn't break anything else. If you send a PR to add something new and it doesn't have tests, or the tests don't pass, the PR won't be accepted. See [contributing](CONTRIBUTING.md) for more information.

## People

- [All contributors](https://github.com/tweenjs/es6-tween/contributors).
- [es6-tween contributors](https://github.com/tweenjs/es6-tween/graphs/contributors)/

## Thanks to

these tools developers and to their community and without these tools maybe this library wouldn't be possible

- [GitHub](https://github.com/)
- [Travis CI](http://travis-ci.org)
- [BrowserStack](https://www.browserstack.com/)
- [Node.js](https://nodejs.org/en/)
- [ESLint](http://eslint.org)
- [jsDoc](http://usejsdoc.org) ([docdash theme](https://github.com/clenemt/docdash))
- [Rollup](https://rollupjs.org/guide/en)
- [Babel](https://babeljs.io)
- [Ava](https://github.com/avajs/ava)
- [Puppeteer](https://pptr.dev)
- [UglifyJS v3](https://github.com/mishoo/UglifyJS2)
- [Husky](https://github.com/typicode/husky)

## Projects using es6-tween

- [ft](https://github.com/2players/ft)
- [react-heartwood-components](https://www.npmjs.com/package/@sprucelabs/react-heartwood-components)
- [el-controls](https://github.com/eljs/el-controls)
- [lightweight-pixijs-engine](https://github.com/dgzornoza/lightweight-pixijs-engine#readme)
- [vue-sliderx](https://www.npmjs.com/package/vue-sliderx)
- [vue-mapbox-feature](https://cityseer.github.io/vue-mapbox-feature)
- [vuxtras](https://github.com/homerjam/vuxtras#readme)
- [Slye](https://github.com/Slye3D/slye#readme)
- [react-3d-globe](https://chrisrzhou.github.io/react-3d-globe/)

It's great to see this library to be used in production and/or library, thank you!

If you have projects using es6-tween, please make issue or PR, i will add here your project too :)

[npm-min-size]: https://img.shields.io/bundlephobia/min/es6-tween.svg
[npm-gzip-size]: https://img.badgesize.io/https://unpkg.com/es6-tween?compression=gzip
[npm-image]: https://img.shields.io/npm/v/es6-tween.svg
[npm-url]: https://npmjs.org/package/es6-tween
[downloads-image]: https://img.shields.io/npm/dm/es6-tween.svg
[travis-image]: https://travis-ci.org/tweenjs/es6-tween.svg?branch=master
[travis-url]: https://travis-ci.org/tweenjs/es6-tween
[cdnjs-image]: https://img.shields.io/cdnjs/v/es6-tween.svg
[cdnjs-url]: https://cdnjs.com/libraries/es6-tween
[unpkg-url]: https://unpkg.com/es6-tween
