# es6tween-plugin-render
It's renderer plugin for es6-tween for doing DOM and SVG stuffs (setting style) easy and fast (not fastest in the world, but enough fast)

# Usage

```javascript
import { Tween } from 'es6-tween';
import 'es6tween-plugin-render';

let tween = new Tween(document.querySelector('#myPath'), {x:'5%').to({x:'50%'}, 2000).start();
```