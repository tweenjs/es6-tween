# es6tween-plugin-transform

# DEPRECATED: Please Use `es6tween-plugin-render` plug-in for more compatibility and performance...

# Usage

```javascript
import { Tween } from 'es6-tween';
import 'es6tween-plugin-transform';

let tween = new Tween(document.querySelector('#myCircleSVG'), {rotate:0}).to({rotate:360,transform:true}, 2000).start();
```