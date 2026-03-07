# es6tween-tool-createui

# Usage

See [demo at here](https://codepen.io/dalisoft/pen/boBNaV)

```javascript
import 'es6tween-tool-createui';
import { Tween, createUi } from 'es6-tween';

let tween = new Tween(document.querySelector('#myCircleSVG'), {attr: {r:50}}).to({attr:{r:150}}, 2000).start();

createUi(tween, document.body)
```