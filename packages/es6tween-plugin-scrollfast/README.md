# es6-tween-plugin-scrollfast

# Usage

```javascript
import { Tween } from 'es6-tween';
import 'es6-tween-plugin-scrollfast';

let tween = new Tween(document.querySelector('#myBody'), {scrollY:0}).to({scrollY:300}, 2000).start();
```