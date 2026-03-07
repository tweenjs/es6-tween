# es6-tween-plugin-morph

[![size](http://img.badgesize.io/https://unpkg.com/es6tween-plugin-morph/morph.min.js?cache=false)](http://github.com/tweenjs/es6-tween)
[![gzipsize](http://img.badgesize.io/https://unpkg.com/es6tween-plugin-morph/morph.min.js?compression=gzip&cache=false)](http://github.com/tweenjs/es6-tween)


### Morph plug-in for ES6 tween
# Usage

```javascript
import { Tween } from 'es6-tween';
import 'es6-tween-plugin-morph';

let tween = new Tween(document.querySelector('#myPath'), {morph:{shape:'#circleSVGShape'}).to({morph:{shape:'#rectSVGShape'}}, 2000).start();
```

# Config

* `shape: Any` - If want to use `reverse/moveIndex`, you should `shape`
* `reverse: Boolean` - Reverses the path if your want change naturality
* `moveIndex: Number` - Changes the index of points to make better/worse naturality
* `approximate: Boolean` - Requires `flubber` library and makes animation a lot better