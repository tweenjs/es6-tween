# CHANGELOG

## v1.10.6

#### Fixes
- Fixed `dist` folder files (changed to latest)


## v1.10.5

#### Improvements
- Improved demo with more real example

#### NEW features
- Added `Composite#Init` feature

## v1.10.3: Much new features

#### Fixes
- Fixed bug where `Composite` plugin sometime doesn't worked

#### NEW features
- Added `Timeline` feature
- Added `Plugins` feature
- Added `Composite Scroll` feature
- Added function argument passing feature
- Added `Composite#Render` feature

#### Deprecation
- Deprecated `Composite#setStyle`
- Deprecated `Composite#style`


## v1.5.1: New `Composite` and deprecated function

#### Fixes (Triggered v1.5.x+1)
- To avoid error for tests, we removed `TWEEN.cloneTween(tween)` method

#### NEW (Triggered v1.x+1.?:0)
- feat(Composite): New `Composite` feature for working with DOM or drawers

## v1.4.1: Fix small issue

#### Fixes
- Fixed `NPM_TOKEN` issue and now removed from `README`

## v1.4.0: Improvements

#### Fixes
- `TWEEN.now` issue fixed, where it's failed tweens

#### Improvements
- Performance improved by almost `~15%`
- Improved timing
- `TWEEN.now` improvements

#### Optimization
- Optimized code for faster execution
- `emit` method arguments reduced to `5` for better performance
- `TWEEN.now` optimization
- Merged `requestAnimationFrame` function

#### NEW features
- Added new `reversed` method
- Added timing-correcter when `visibilitychange` event is called
- Added `test.html` for comparing performance


## v1.2.2: Most issue fixed

#### Fixes
- `reverse` method fix
- `emit`, `on`, `once`, `off` method for global `TWEEN` method fix
- timing sync issue partially fixed

#### Improvements
- Small-margin performance improvements
- Timing offset fixed

#### Optimization
- Optimized code speed

#### NEW features
- Coming soon...


## v1.2.1: Small bug-fix

#### Fixes
- Fixed bug with `package.json`

## v1.2.0: Big-change

#### Fixes
- Fixed bug for TWEEN#Tween@get
- Fixed bug for TWEEN#Tween@repeat
- Fixed time bug (especially for repeated tween)
- Now `jshint` does not runs error for `npm run test`
- Now `jscs` does not runs error for `npm run test`

#### Improvements
- Small-margin performance improvements

#### Optimization
- Optimized code quality

#### NEW features
- Added new string tweening support
- Added new Array tweening support
- Added new Object tweening support
- Added recursive tweening support

## Older versions...
- Please see releases page