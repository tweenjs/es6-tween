# es6tween-plugin-attr

# Usage

```javascript
import { Tween } from 'es6-tween';
import 'es6tween-plugin-attr';

let tween = new Tween({node:document.querySelector('#myCircleSVG'), attr: {r:50}}).to({attr:{r:150}}, 2000).start();
```