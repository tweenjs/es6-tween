# es6-tween-parser-exechtml

# Usage

```javascript
import { Tween } from 'es6-tween';
import 'es6-tween-parser-exechtml';

XHR.load('myAnim.json').then(TWEEN.parseJSON)
```

# Attributes
- For all attributes on HTML will apply prefix `anim-`, like `anim-on="click"`.

- `from` - From values
- `to` - To values
- `opts` - Options (params/config)
- `on` - Event (when trigger?)
- `target` - Not animation itself, select target
