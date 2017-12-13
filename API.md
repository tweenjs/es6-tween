<a name="TWEEN"></a>

## TWEEN : <code>object</code>
Lightweight, effecient and modular ES6 version of tween.js

**Kind**: global namespace  
**License**: MIT  
**Copyright**: 2017 @dalisoft and es6-tween contributors  
**Example**  
```js
// ES6const {add, remove, isRunning, autoPlay} = TWEEN
```

* [TWEEN](#TWEEN) : <code>object</code>
    * [.now](#TWEEN.now) ⇒
    * [.Plugins](#TWEEN.Plugins) : <code>object</code>
    * [.Easing](#TWEEN.Easing) : <code>object</code>
    * [.Interpolation](#TWEEN.Interpolation) : <code>object</code>
    * [.Interpolator](#TWEEN.Interpolator) ⇒ <code>function</code>
    * ~~[.Timeline](#TWEEN.Timeline) : <code>object</code>~~
    * [.Tween](#TWEEN.Tween) : <code>object</code>
        * [.Tween#setMaxListener(count)](#TWEEN.Tween.Tween+setMaxListener)
        * [.Tween#on(event, callback)](#TWEEN.Tween.Tween+on)
        * [.Tween#once(event, callback)](#TWEEN.Tween.Tween+once)
        * [.Tween#off(event, callback)](#TWEEN.Tween.Tween+off)
        * [.Tween#emit(event)](#TWEEN.Tween.Tween+emit)
        * [.Tween#isPlaying()](#TWEEN.Tween.Tween+isPlaying) ⇒ <code>boolean</code>
        * [.Tween#isStarted()](#TWEEN.Tween.Tween+isStarted) ⇒ <code>boolean</code>
        * [.Tween#reverse([state])](#TWEEN.Tween.Tween+reverse)
        * [.Tween#reversed()](#TWEEN.Tween.Tween+reversed) ⇒ <code>boolean</code>
        * [.Tween#pause()](#TWEEN.Tween.Tween+pause)
        * [.Tween#play()](#TWEEN.Tween.Tween+play)
        * [.Tween#restart([noDelay])](#TWEEN.Tween.Tween+restart)
        * ~~[.Tween#seek(time, [keepPlaying])](#TWEEN.Tween.Tween+seek)~~
        * [.Tween#duration(amount)](#TWEEN.Tween.Tween+duration)
        * [.Tween#to(properties, [duration])](#TWEEN.Tween.Tween+to)
        * [.Tween#start(time)](#TWEEN.Tween.Tween+start)
        * [.Tween#stop()](#TWEEN.Tween.Tween+stop)
        * [.Tween#delay(amount)](#TWEEN.Tween.Tween+delay)
        * [.Tween#chainedTweens(arguments)](#TWEEN.Tween.Tween+chainedTweens)
        * [.Tween#repeat(amount)](#TWEEN.Tween.Tween+repeat)
        * [.Tween#reverseDelay(amount)](#TWEEN.Tween.Tween+reverseDelay)
        * [.Tween#yoyo(state, [_easingReverse])](#TWEEN.Tween.Tween+yoyo)
        * [.Tween#easing(_easingFunction)](#TWEEN.Tween.Tween+easing)
        * [.Tween#interpolation(_interpolationFunction)](#TWEEN.Tween.Tween+interpolation)
        * [.Tween#update(time, [preserve], [forceTime])](#TWEEN.Tween.Tween+update)
    * [.add(tween)](#TWEEN.add)
    * [.onTick(fn)](#TWEEN.onTick)
    * [.FrameThrottle([frameCount])](#TWEEN.FrameThrottle)
    * [.autoPlay(state)](#TWEEN.autoPlay)
    * [.removeAll()](#TWEEN.removeAll)
    * [.get(tween)](#TWEEN.get) ⇒ <code>Tween</code>
    * [.has(tween)](#TWEEN.has) ⇒ <code>Boolean</code>
    * [.remove(tween)](#TWEEN.remove)
    * [.update([time], [preserve])](#TWEEN.update)
    * [.isRunning()](#TWEEN.isRunning) ⇒ <code>Boolean</code>

<a name="TWEEN.now"></a>

### TWEEN.now ⇒
Get browser/Node.js current time-stamp

**Kind**: static property of [<code>TWEEN</code>](#TWEEN)  
**Returns**: Normalised current time-stamp in milliseconds  
**Example**  
```js
TWEEN.now
```
<a name="TWEEN.Plugins"></a>

### TWEEN.Plugins : <code>object</code>
The plugins store object

**Kind**: static namespace of [<code>TWEEN</code>](#TWEEN)  
**Example**  
```js
let num = Plugins.num = function (node, start, end) {return t => start + (end - start) * t}
```
<a name="TWEEN.Easing"></a>

### TWEEN.Easing : <code>object</code>
List of full easings

**Kind**: static namespace of [<code>TWEEN</code>](#TWEEN)  
**Example**  
```js
import {Tween, Easing} from 'es6-tween'// then set via new Tween({x:0}).to({x:100}, 1000).easing(Easing.Quadratic.InOut).start()
```
<a name="TWEEN.Interpolation"></a>

### TWEEN.Interpolation : <code>object</code>
List of full Interpolation

**Kind**: static namespace of [<code>TWEEN</code>](#TWEEN)  
**Example**  
```js
import {Interpolation, Tween} from 'es6-tween'let bezier = Interpolation.Beziernew Tween({x:0}).to({x:[0, 4, 8, 12, 15, 20, 30, 40, 20, 40, 10, 50]}, 1000).interpolation(bezier).start()
```
<a name="TWEEN.Interpolator"></a>

### TWEEN.Interpolator ⇒ <code>function</code>
Tween helper for plugins

**Kind**: static namespace of [<code>TWEEN</code>](#TWEEN)  
**Returns**: <code>function</code> - Returns function that accepts number between `0-1`  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>any</code> | Initial position |
| b | <code>any</code> | End position |

<a name="TWEEN.Timeline"></a>

### ~~TWEEN.Timeline : <code>object</code>~~
***Deprecated***

Timeline main constructor.It works same as `Tween` instance, using `.repeat`, `.restart` or `etc` works like a `Tween`, so please see `Tween` class for methods

**Kind**: static namespace of [<code>TWEEN</code>](#TWEEN)  
**Extends**: <code>Tween</code>  

| Param | Type | Description |
| --- | --- | --- |
| [params] | <code>Object</code> | Default params for new tweens |

**Example**  
```js
let tl = new Timeline({delay:200})
```
<a name="TWEEN.Tween"></a>

### TWEEN.Tween : <code>object</code>
Tween main constructor

**Kind**: static namespace of [<code>TWEEN</code>](#TWEEN)  

| Param | Type | Description |
| --- | --- | --- |
| node | <code>Object</code> \| <code>Element</code> | Node Element or Tween initial object |
| [object] | <code>Object</code> | If Node Element is using, second argument is used for Tween initial object |

**Example**  
```js
let tween = new Tween(myNode, {width:'100px'}).to({width:'300px'}, 2000).start()
```

* [.Tween](#TWEEN.Tween) : <code>object</code>
    * [.Tween#setMaxListener(count)](#TWEEN.Tween.Tween+setMaxListener)
    * [.Tween#on(event, callback)](#TWEEN.Tween.Tween+on)
    * [.Tween#once(event, callback)](#TWEEN.Tween.Tween+once)
    * [.Tween#off(event, callback)](#TWEEN.Tween.Tween+off)
    * [.Tween#emit(event)](#TWEEN.Tween.Tween+emit)
    * [.Tween#isPlaying()](#TWEEN.Tween.Tween+isPlaying) ⇒ <code>boolean</code>
    * [.Tween#isStarted()](#TWEEN.Tween.Tween+isStarted) ⇒ <code>boolean</code>
    * [.Tween#reverse([state])](#TWEEN.Tween.Tween+reverse)
    * [.Tween#reversed()](#TWEEN.Tween.Tween+reversed) ⇒ <code>boolean</code>
    * [.Tween#pause()](#TWEEN.Tween.Tween+pause)
    * [.Tween#play()](#TWEEN.Tween.Tween+play)
    * [.Tween#restart([noDelay])](#TWEEN.Tween.Tween+restart)
    * ~~[.Tween#seek(time, [keepPlaying])](#TWEEN.Tween.Tween+seek)~~
    * [.Tween#duration(amount)](#TWEEN.Tween.Tween+duration)
    * [.Tween#to(properties, [duration])](#TWEEN.Tween.Tween+to)
    * [.Tween#start(time)](#TWEEN.Tween.Tween+start)
    * [.Tween#stop()](#TWEEN.Tween.Tween+stop)
    * [.Tween#delay(amount)](#TWEEN.Tween.Tween+delay)
    * [.Tween#chainedTweens(arguments)](#TWEEN.Tween.Tween+chainedTweens)
    * [.Tween#repeat(amount)](#TWEEN.Tween.Tween+repeat)
    * [.Tween#reverseDelay(amount)](#TWEEN.Tween.Tween+reverseDelay)
    * [.Tween#yoyo(state, [_easingReverse])](#TWEEN.Tween.Tween+yoyo)
    * [.Tween#easing(_easingFunction)](#TWEEN.Tween.Tween+easing)
    * [.Tween#interpolation(_interpolationFunction)](#TWEEN.Tween.Tween+interpolation)
    * [.Tween#update(time, [preserve], [forceTime])](#TWEEN.Tween.Tween+update)

<a name="TWEEN.Tween.Tween+setMaxListener"></a>

#### Tween.Tween#setMaxListener(count)
Sets max `event` listener's count to Events system

**Kind**: static method of [<code>Tween</code>](#TWEEN.Tween)  

| Param | Type | Description |
| --- | --- | --- |
| count | <code>number</code> | Event listener's count |

<a name="TWEEN.Tween.Tween+on"></a>

#### Tween.Tween#on(event, callback)
Adds `event` to Events system

**Kind**: static method of [<code>Tween</code>](#TWEEN.Tween)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | Event listener name |
| callback | <code>function</code> | Event listener callback |

<a name="TWEEN.Tween.Tween+once"></a>

#### Tween.Tween#once(event, callback)
Adds `event` to Events system.Removes itself after fired once

**Kind**: static method of [<code>Tween</code>](#TWEEN.Tween)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | Event listener name |
| callback | <code>function</code> | Event listener callback |

<a name="TWEEN.Tween.Tween+off"></a>

#### Tween.Tween#off(event, callback)
Removes `event` from Events system

**Kind**: static method of [<code>Tween</code>](#TWEEN.Tween)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | Event listener name |
| callback | <code>function</code> | Event listener callback |

<a name="TWEEN.Tween.Tween+emit"></a>

#### Tween.Tween#emit(event)
Emits/Fired/Trigger `event` from Events system listeners

**Kind**: static method of [<code>Tween</code>](#TWEEN.Tween)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | Event listener name |

<a name="TWEEN.Tween.Tween+isPlaying"></a>

#### Tween.Tween#isPlaying() ⇒ <code>boolean</code>
**Kind**: static method of [<code>Tween</code>](#TWEEN.Tween)  
**Returns**: <code>boolean</code> - State of playing of tween  
**Example**  
```js
tween.isPlaying() // returns `true` if tween in progress
```
<a name="TWEEN.Tween.Tween+isStarted"></a>

#### Tween.Tween#isStarted() ⇒ <code>boolean</code>
**Kind**: static method of [<code>Tween</code>](#TWEEN.Tween)  
**Returns**: <code>boolean</code> - State of started of tween  
**Example**  
```js
tween.isStarted() // returns `true` if tween in started
```
<a name="TWEEN.Tween.Tween+reverse"></a>

#### Tween.Tween#reverse([state])
Reverses the tween state/direction

**Kind**: static method of [<code>Tween</code>](#TWEEN.Tween)  

| Param | Type | Description |
| --- | --- | --- |
| [state] | <code>boolean</code> | Set state of current reverse |

**Example**  
```js
tween.reverse()
```
<a name="TWEEN.Tween.Tween+reversed"></a>

#### Tween.Tween#reversed() ⇒ <code>boolean</code>
**Kind**: static method of [<code>Tween</code>](#TWEEN.Tween)  
**Returns**: <code>boolean</code> - State of reversed  
**Example**  
```js
tween.reversed() // returns `true` if tween in reversed state
```
<a name="TWEEN.Tween.Tween+pause"></a>

#### Tween.Tween#pause()
Pauses tween

**Kind**: static method of [<code>Tween</code>](#TWEEN.Tween)  
**Example**  
```js
tween.pause()
```
<a name="TWEEN.Tween.Tween+play"></a>

#### Tween.Tween#play()
Play/Resume the tween

**Kind**: static method of [<code>Tween</code>](#TWEEN.Tween)  
**Example**  
```js
tween.play()
```
<a name="TWEEN.Tween.Tween+restart"></a>

#### Tween.Tween#restart([noDelay])
Restarts tween from initial value

**Kind**: static method of [<code>Tween</code>](#TWEEN.Tween)  

| Param | Type | Description |
| --- | --- | --- |
| [noDelay] | <code>boolean</code> | If this param is set to `true`, restarts tween without `delay` |

**Example**  
```js
tween.restart()
```
<a name="TWEEN.Tween.Tween+seek"></a>

#### ~~Tween.Tween#seek(time, [keepPlaying])~~
***Deprecated***

Seek tween value by `time`. Note: Not works as excepted. PR are welcome

**Kind**: static method of [<code>Tween</code>](#TWEEN.Tween)  

| Param | Type | Description |
| --- | --- | --- |
| time | <code>Time</code> | Tween update time |
| [keepPlaying] | <code>boolean</code> | When this param is set to `false`, tween pausing after seek |

**Example**  
```js
tween.seek(500)
```
<a name="TWEEN.Tween.Tween+duration"></a>

#### Tween.Tween#duration(amount)
Sets tween duration

**Kind**: static method of [<code>Tween</code>](#TWEEN.Tween)  

| Param | Type | Description |
| --- | --- | --- |
| amount | <code>number</code> | Duration is milliseconds |

**Example**  
```js
tween.duration(2000)
```
<a name="TWEEN.Tween.Tween+to"></a>

#### Tween.Tween#to(properties, [duration])
Sets target value and duration

**Kind**: static method of [<code>Tween</code>](#TWEEN.Tween)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| properties | <code>object</code> |  | Target value (to value) |
| [duration] | <code>number</code> \| <code>Object</code> | <code>1000</code> | Duration of tween |

**Example**  
```js
let tween = new Tween({x:0}).to({x:100}, 2000)
```
<a name="TWEEN.Tween.Tween+start"></a>

#### Tween.Tween#start(time)
Start the tweening

**Kind**: static method of [<code>Tween</code>](#TWEEN.Tween)  

| Param | Type | Description |
| --- | --- | --- |
| time | <code>number</code> \| <code>string</code> | setting manual time instead of Current browser timestamp or like `+1000` relative to current timestamp |

**Example**  
```js
tween.start()
```
<a name="TWEEN.Tween.Tween+stop"></a>

#### Tween.Tween#stop()
Stops the tween

**Kind**: static method of [<code>Tween</code>](#TWEEN.Tween)  
**Example**  
```js
tween.stop()
```
<a name="TWEEN.Tween.Tween+delay"></a>

#### Tween.Tween#delay(amount)
Set delay of tween

**Kind**: static method of [<code>Tween</code>](#TWEEN.Tween)  

| Param | Type | Description |
| --- | --- | --- |
| amount | <code>number</code> | Sets tween delay / wait duration |

**Example**  
```js
tween.delay(500)
```
<a name="TWEEN.Tween.Tween+chainedTweens"></a>

#### Tween.Tween#chainedTweens(arguments)
Chained tweens

**Kind**: static method of [<code>Tween</code>](#TWEEN.Tween)  

| Param | Type | Description |
| --- | --- | --- |
| arguments | <code>any</code> | Arguments list |

**Example**  
```js
tween.chainedTweens(tween1, tween2)
```
<a name="TWEEN.Tween.Tween+repeat"></a>

#### Tween.Tween#repeat(amount)
Sets how times tween is repeating

**Kind**: static method of [<code>Tween</code>](#TWEEN.Tween)  

| Param | Type | Description |
| --- | --- | --- |
| amount | <code>amount</code> | the times of repeat |

**Example**  
```js
tween.repeat(5)
```
<a name="TWEEN.Tween.Tween+reverseDelay"></a>

#### Tween.Tween#reverseDelay(amount)
Set delay of each repeat alternate of tween

**Kind**: static method of [<code>Tween</code>](#TWEEN.Tween)  

| Param | Type | Description |
| --- | --- | --- |
| amount | <code>number</code> | Sets tween repeat alternate delay / repeat alternate wait duration |

**Example**  
```js
tween.reverseDelay(500)
```
<a name="TWEEN.Tween.Tween+yoyo"></a>

#### Tween.Tween#yoyo(state, [_easingReverse])
Set `yoyo` state (enables reverse in repeat)

**Kind**: static method of [<code>Tween</code>](#TWEEN.Tween)  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>boolean</code> | Enables alternate direction for repeat |
| [_easingReverse] | <code>function</code> | Easing function in reverse direction |

**Example**  
```js
tween.yoyo(true)
```
<a name="TWEEN.Tween.Tween+easing"></a>

#### Tween.Tween#easing(_easingFunction)
Set easing

**Kind**: static method of [<code>Tween</code>](#TWEEN.Tween)  

| Param | Type | Description |
| --- | --- | --- |
| _easingFunction | <code>function</code> | Easing function, applies in non-reverse direction if Tween#yoyo second argument is applied |

**Example**  
```js
tween.easing(Easing.Elastic.InOut)
```
<a name="TWEEN.Tween.Tween+interpolation"></a>

#### Tween.Tween#interpolation(_interpolationFunction)
Set interpolation

**Kind**: static method of [<code>Tween</code>](#TWEEN.Tween)  

| Param | Type | Description |
| --- | --- | --- |
| _interpolationFunction | <code>function</code> | Interpolation function |

**Example**  
```js
tween.interpolation(Interpolation.Bezier)
```
<a name="TWEEN.Tween.Tween+update"></a>

#### Tween.Tween#update(time, [preserve], [forceTime])
Updates initial object to target value by given `time`

**Kind**: static method of [<code>Tween</code>](#TWEEN.Tween)  

| Param | Type | Description |
| --- | --- | --- |
| time | <code>Time</code> | Current time |
| [preserve] | <code>boolean</code> | Prevents from removing tween from store |
| [forceTime] | <code>boolean</code> | Forces to be frame rendered, even mismatching time |

**Example**  
```js
tween.update(100)
```
<a name="TWEEN.add"></a>

### TWEEN.add(tween)
Adds tween to list

**Kind**: static method of [<code>TWEEN</code>](#TWEEN)  

| Param | Type | Description |
| --- | --- | --- |
| tween | <code>Tween</code> | Tween instance |

**Example**  
```js
let tween = new Tween({x:0})tween.to({x:200}, 1000)TWEEN.add(tween)
```
<a name="TWEEN.onTick"></a>

### TWEEN.onTick(fn)
Adds ticker like event

**Kind**: static method of [<code>TWEEN</code>](#TWEEN)  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | callback |

**Example**  
```js
TWEEN.onTick(time => console.log(time))
```
<a name="TWEEN.FrameThrottle"></a>

### TWEEN.FrameThrottle([frameCount])
Sets after how much frames empty updating should stop

**Kind**: static method of [<code>TWEEN</code>](#TWEEN)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [frameCount] | <code>number</code> | <code>120</code> | count of frames that should stop after all tweens removed |

**Example**  
```js
TWEEN.FrameThrottle(60)
```
<a name="TWEEN.autoPlay"></a>

### TWEEN.autoPlay(state)
Runs update loop automaticlly

**Kind**: static method of [<code>TWEEN</code>](#TWEEN)  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>Boolean</code> | State of auto-run of update loop |

**Example**  
```js
TWEEN.autoPlay(true)
```
<a name="TWEEN.removeAll"></a>

### TWEEN.removeAll()
Removes all tweens from list

**Kind**: static method of [<code>TWEEN</code>](#TWEEN)  
**Example**  
```js
TWEEN.removeAll() // removes all tweens, stored in global tweens list
```
<a name="TWEEN.get"></a>

### TWEEN.get(tween) ⇒ <code>Tween</code>
**Kind**: static method of [<code>TWEEN</code>](#TWEEN)  
**Returns**: <code>Tween</code> - Matched tween  

| Param | Type | Description |
| --- | --- | --- |
| tween | <code>Tween</code> | Tween Instance to be matched |

**Example**  
```js
TWEEN.get(tween)
```
<a name="TWEEN.has"></a>

### TWEEN.has(tween) ⇒ <code>Boolean</code>
**Kind**: static method of [<code>TWEEN</code>](#TWEEN)  
**Returns**: <code>Boolean</code> - Status of Exists tween or not  

| Param | Type | Description |
| --- | --- | --- |
| tween | <code>Tween</code> | Tween Instance to be matched |

**Example**  
```js
TWEEN.has(tween)
```
<a name="TWEEN.remove"></a>

### TWEEN.remove(tween)
Removes tween from list

**Kind**: static method of [<code>TWEEN</code>](#TWEEN)  

| Param | Type | Description |
| --- | --- | --- |
| tween | <code>Tween</code> | Tween instance |

**Example**  
```js
TWEEN.remove(tween)
```
<a name="TWEEN.update"></a>

### TWEEN.update([time], [preserve])
Updates global tweens by given time

**Kind**: static method of [<code>TWEEN</code>](#TWEEN)  

| Param | Type | Description |
| --- | --- | --- |
| [time] | <code>number</code> | Timestamp |
| [preserve] | <code>Boolean</code> | Prevents tween to be removed after finish |

**Example**  
```js
TWEEN.update(500)
```
<a name="TWEEN.isRunning"></a>

### TWEEN.isRunning() ⇒ <code>Boolean</code>
The state of ticker running

**Kind**: static method of [<code>TWEEN</code>](#TWEEN)  
**Returns**: <code>Boolean</code> - Status of running updates on all tweens  
**Example**  
```js
TWEEN.isRunning()
```
