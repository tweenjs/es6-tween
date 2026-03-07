# es6-tween-plugin-keyframe

# Usage

```javascript
import { Tween } from 'es6-tween';
import 'es6-tween-plugin-keyframe';

let tween = new Tween(myDomNode, {x:0}).to({keyframe:{50:{x:100},100:{x:0}}}, 2000).start();
```