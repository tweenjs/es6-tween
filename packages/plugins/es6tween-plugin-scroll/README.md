# es6-tween-plugin-scroll

# Usage

```javascript
import { Tween } from 'es6-tween';
import 'es6-tween-plugin-scroll';

let tween = new Tween(document.querySelector('#myBody'), {scrollTop:200/*optional*/,scrollLeft:0/*optional*/}).to({scrollTop:'#myTarget',scrollLeft:500}, 2000).start();
```