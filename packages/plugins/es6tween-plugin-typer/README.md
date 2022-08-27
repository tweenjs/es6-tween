# es6tween-plugin-typer

# Usage

```javascript
import { Tween } from 'es6-tween';
import 'es6tween-plugin-typer';

let tween = new Tween(document.querySelector('#mySpan'), {typer:'Start'}).to({typer:'End'}, 2000).start(); // Demo with no config
```

# Config

Syntax with config

```javascript
{
	typer:{
	text: 'My Text', /* Your text */
	char: '_', /* looks nice, especially for bash-like UI, after random text applies (or just char if useRandomChars is `false`)
	useRandomChars: true /* looks really cool */
	}
}
```