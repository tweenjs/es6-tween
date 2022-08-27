# es6-tween-plugin-event

# Usage

```javascript
import { Tween } from 'es6-tween';
import 'es6-tween-plugin-event';

let tween = new Tween(myDomNode, {x:0}).to({event:{mousedown:{x:100},mouseup:{x:0}}}, 2000).start();
```