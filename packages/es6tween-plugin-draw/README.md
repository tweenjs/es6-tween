# es6-tween-plugin-draw

# Usage

```javascript
import { Tween } from 'es6-tween';
import 'es6-tween-plugin-draw';

let tween = new Tween(document.querySelector('#myCircleSVG'), {draw:'0 100%'}).to({draw:'50% 50%'}, 2000).start();
```

# Motion path / Along path

```javascript
import { Tween } from 'es6-tween';
import 'es6-tween-plugin-draw';

let tween = new Tween(document.querySelector('#myCircleSVG'), {/* any yours */}).to({alongPath:'#myPathShape'}, 2000).start(); // moves #myCircleSVG along #myPathShape
```

### or

```javascript
import { Tween } from 'es6-tween';
import 'es6-tween-plugin-draw';

let tween = new Tween(document.querySelector('#myPathShape'), {/* any yours */}).to({motionPath:'#myCircleSVG'}, 2000).start(); // moves #myCircleSVG along #myPathShape
```