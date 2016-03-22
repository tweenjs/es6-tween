import { Tween, getAll, removeAll, add, remove, update } from '../../src/index';
import { Quadratic } from '../../src/ease';
import test from 'ava';

test('hello', t => {
	t.true(!!Tween);
});

test('getAll', t => {
	t.true(getAll() instanceof Array);
});

test('new Tweens are added to tween array', t => {
	t.true(getAll().length === 0);
	const tween = new Tween();
	t.true(getAll().length === 0);
	tween.start();
	t.true(getAll().length === 1);
});

test('removeAll', t => {
	const tween = new Tween();
	removeAll();
	t.true(getAll().length === 0);
	removeAll();
	t.true(getAll().length === 0);
	tween.start();
	t.true(getAll().length === 1);
	removeAll();
	t.true(getAll().length === 0);
});

test('add', t => {
	const all = getAll();
	const numTweens = all.length;
	const tween = new Tween({});

	add(tween);

	t.is(numTweens + 1, getAll().length);
	t.notSame(all, getAll());
});

test('remove', t => {
	const all = getAll();
	const numTweens = all.length;
	const tw = new Tween({});

	add(tw);

	t.ok(all.indexOf(tw) === -1);
	t.ok(getAll().indexOf(tw) !== -1);

	remove(tw);

	t.is(numTweens, getAll().length);
	t.same(all, getAll());
	t.is(all.indexOf(t), -1);
});

test('update() returns false when done (no tweens to animate)', t => {
	removeAll();
	t.is(update(), false);
});

test('update() returns true when there are active tweens', t => {
	removeAll();

	const tw = new Tween({});
	tw.start();

	t.is(update(), true);
});

test('update() removes tweens when they are finished', t => {
	removeAll();

	const t1 = new Tween({}).to({}, 1000);
	const t2 = new Tween({}).to({}, 2000);

	t.is(getAll().length, 0);

	t1.start(0);
	t2.start(0);

	t.is(getAll().length, 2);

	update(0);
	t.is(getAll().length, 2);

	update(999);
	t.is(getAll().length, 2);

	update(1000);
	t.is(getAll().length, 1);
	t.is(getAll().indexOf(t1), -1);
	t.ok(getAll().indexOf(t2) !== -1);
});


// Tween tests

test('constructor', t => {
	const tw = new Tween({});
	t.ok(tw instanceof Tween, 'Pass');
});

test('Return the same tween instance for method chaining', t => {
	const tw = new Tween({});

	t.ok(tw.to({}, 0) instanceof Tween);
	t.is(tw.to({}, 0), tw);

	t.ok(tw.start() instanceof Tween);
	t.is(tw.start(), tw);

	t.ok(tw.stop() instanceof Tween);
	t.is(tw.stop(), tw);

	t.ok(tw.delay() instanceof Tween);
	t.is(tw.delay(), tw);

	t.ok(tw.easing() instanceof Tween);
	t.is(tw.easing(), tw);

	t.ok(tw.interpolation() instanceof Tween);
	t.is(tw.interpolation(), tw);

	t.ok(tw.chain() instanceof Tween);
	t.is(tw.chain(), tw);

	t.ok(tw.onStart() instanceof Tween);
	t.is(tw.onStart(), tw);

	t.ok(tw.onStop() instanceof Tween);
	t.is(tw.onStop(), tw);
	t.ok(tw.onUpdate() instanceof Tween);
	t.is(tw.onUpdate(), tw);

	t.ok(tw.onComplete() instanceof Tween);
	t.is(tw.onComplete(), tw);
});

test('Tween existing property', t => {
	const obj = { x: 1 };
	const tw = new Tween(obj);

	tw.to({ x: 2 }, 1000);
	tw.start(0);
	tw.update(1000);

	t.same(obj.x, 2);
});

test('Tween non-existing property', t => {
	const obj = { x: 1 };
	const tw = new Tween(obj);

	tw.to({ y: 0 }, 1000);
	tw.start(0);
	tw.update(1000);

	t.same(obj.x, 1);
	t.is(obj.y, undefined);
});

test('Tween non-null property', t => {
	const obj = { x: 1 };
	const tw = new Tween(obj);

	tw.to({ x: 2 }, 1000);
	tw.start(0);
	tw.update(1000);

	t.same(obj.x, 2);
	t.ok(obj.x !== null);
});

test('Tween function property', t => {
	const myFunction = () => {};

	const obj = { x: myFunction };
	const tw = new Tween(obj);

	tw.to({ x: myFunction });
	tw.start(0);
	tw.update(1000);

	t.ok(obj.x === myFunction);
});

test('Tween boolean property', t => {
	const obj = { x: true };
	const tw = new Tween(obj);

	tw.to({ x: () => {} });
	tw.start(0);
	tw.update(1000);

	t.ok(typeof obj.x === 'boolean');
	t.ok(obj.x);
});

test('Tween null property', t => {
	const obj = { x: null };
	const tw = new Tween(obj);

	tw.to({ x: 2 }, 1000);
	tw.start(0);
	tw.update(1000);

	t.same(obj.x, 2);
});

test('Tween undefined property', t => {
	const obj = { };
	const tw = new Tween(obj);

	tw.to({ x: 2 }, 1000);
	tw.start(0);
	tw.update(1000);

	t.is(obj.x, undefined);
});

test('Tween relative positive value, with sign', t => {
	const obj = { x: 0 };
	const tw = new Tween(obj);

	tw.to({ x: '+100' }, 1000);
	tw.start(0);
	tw.update(1000);

	t.is(obj.x, 100);
});

test('Tween relative negative value', t => {
	const obj = { x: 0 };
	const tw = new Tween(obj);

	tw.to({ x: '-100' }, 1000);
	tw.start(0);
	tw.update(1000);

	t.is(obj.x, -100);
});

test('String values without a + or - sign should not be interpreted as relative', t => {
	const obj = { x: 100 };
	const tw = new Tween(obj);

	tw.to({ x: '100' }, 1000);
	tw.start(0);
	tw.update(1000);

	t.is(obj.x, 100);
});

test('Test Tween.start()', t => {
	const obj = { };
	const tw = new Tween(obj);

	tw.to({ }, 1000);

	removeAll();
	t.is(getAll().length, 0); // TODO move to TWEEN test

	tw.start(0);

	t.is(getAll().length, 1); // TODO ditto
	t.is(getAll()[0], tw);
});

test('Test Tween.stop()', t => {
	const obj = { };
	const tw = new Tween(obj);

	tw.to({ x: 2 }, 1000);

	removeAll();

	tw.start();
	tw.stop();

	t.is(getAll().length, 0);
});

test('Test Tween.delay()', t => {
	const obj = { x: 1 };
	const tw = new Tween(obj);

	tw.to({ x: 2 }, 1000);
	tw.delay(500);
	tw.start(0);

	tw.update(100);

	t.same(obj.x, 1, 'Tween hasn\'t started yet');

	tw.update(1000);

	t.ok((obj.x !== 1) && (obj.x !== 2), 'Tween has started but hasn\'t finished yet');

	tw.update(1500);

	t.is(obj.x, 2, 'Tween finishes when expected');
});

// TODO: not really sure how to test this. Advice appreciated!
test('Test Tween.easing()', t => {
	const obj = { x: 0 };
	const tw = new Tween(obj);

	tw.to({ x: 1 }, 1000);

	tw.easing(Quadratic.In);
	tw.start(0);
	tw.update(500);
	t.is(obj.x, Quadratic.In(0.5));
});

// TODO test interpolation()

test('Test Tween.chain --with one tween', t => {
	const tw = new Tween({});
	let tStarted = false;
	let tCompleted = false;
	const t2 = new Tween({});
	let t2Started = false;

	removeAll();

	tw.to({}, 1000);
	t2.to({}, 1000);

	tw.chain(t2);

	tw.onStart(function() {
		tStarted = true;
	});

	tw.onComplete(function() {
		tCompleted = true;
	});

	t2.onStart(function() {
		t.is(tStarted, true);
		t.is(tCompleted, true);
		t.is(t2Started, false);
		t2Started = true;
	});

	t.is(tStarted, false);
	t.is(t2Started, false);

	tw.start(0);
	update(0);

	t.is(tStarted, true);
	t.is(t2Started, false);

	update(1000);

	t.is(tCompleted, true);

	update(1001);

	t.is(t2Started, true, 't2 is automatically started by tw');
});

test('Test Tween.chain --with several tweens in an array', t => {
	const tw = new Tween({});
	const chainedTweens = [];
	let numChained = 3;
	let numChainedStarted = 0;

	removeAll();

	tw.to({}, 1000);

	function onChainedStart() {
		numChainedStarted++;
	}

	for(let i = 0; i < numChained; i++){
		const chained = new Tween({});
		chained.to({}, 1000);

		chainedTweens.push(chained);

		chained.onStart(onChainedStart);
	}

	// NOTE: This is not the normal way to chain several tweens simultaneously
	// The usual way would be to specify them explicitly:
	// tw.chain(tween1, tween2, ... tweenN)
	// ... not to use apply to send an array of tweens
	tw.chain.apply(tw, chainedTweens);

	t.is(numChainedStarted, 0);

	tw.start(0);
	update(0);
	update(1000);
	update(1001);

	t.is(numChainedStarted, numChained, 'All chained tweens have been started');
});

test('Test Tween.chain allows endless loops', t => {
	const obj = { x: 0 };
	const t1 = new Tween(obj).to({ x: 100 }, 1000);
	const t2 = new Tween(obj).to({ x: 0 }, 1000);

	removeAll();

	t1.chain(t2);
	t2.chain(t1);

	t.is(obj.x, 0);

	// x == 0
	t1.start(0);
	update(0);

	t.is(obj.x, 0);

	update(500);
	t.is(obj.x, 50);

	// there... (x == 100)

	update(1000);
	t.is(obj.x, 100);

	update(1500);
	t.is(obj.x, 50);

	// ... and back again (x == 0)

	update(2000);
	t.is(obj.x, 0);

	update(2500);
	t.is(obj.x, 50);

	update(3000);
	t.is(obj.x, 100); // and x == 100 again
});

test('Test Tween.onStart', t => {
	const obj = { };
	const tw = new Tween(obj);
	let counter = 0;

	tw.to({ x: 2 }, 1000);
	tw.onStart(function() {
		t.ok(true, 'onStart callback is called');
		counter++;
	});

	t.same(counter, 0);

	tw.start(0);
	update(0);

	t.same(counter, 1);

	update(500);

	t.same(counter, 1, 'onStart callback is not called again');
});

test('Test Tween.onStop', t => {
	const obj = { };
	const tw = new Tween(obj);
	let counter = 0;

	tw.to({ x: 2 }, 1000);
	tw.onStop(function() {
		t.ok(true, 'onStop callback is called');
		counter++;
	});

	t.same(counter, 0);

	tw.stop();
	update(0);

	t.same(counter, 0, 'onStop callback not called when the tween hasn\'t started yet');

	tw.start(0);
	update(0);
	tw.stop();

	t.same(counter, 1, 'onStop callback is called if the tween has been started already and stop is invoked');

	update(500);
	tw.stop();

	t.same(counter, 1, 'onStop callback is not called again once the tween is stopped');
});

test('Test Tween.onUpdate', t => {
	const obj = { };
	const tw = new Tween(obj);
	let counter = 0;

	tw.to({ x: 2 }, 1000);
	tw.onUpdate(function() {
		counter++;
	});

	t.same(counter, 0);

	tw.start(0);

	update(0);
	t.same(counter, 1);

	update(500);
	t.same(counter, 2);

	update(600);
	t.same(counter, 3);

	update(1000);
	t.same(counter, 4);

	update(1500);
	t.same(counter, 4, 'onUpdate callback should not be called after the tween has finished');
});

test('Test Tween.onComplete', t => {
	const obj = { };
	const tw = new Tween(obj);
	let counter = 0;

	tw.to({ x: 2 }, 1000);
	tw.onComplete(function() {
		counter++;
	});

	t.same(counter, 0);

	tw.start(0);

	update(0);
	t.same(counter, 0);

	update(500);
	t.same(counter, 0);

	update(600);
	t.same(counter, 0);

	update(1000);
	t.same(counter, 1);

	update(1500);
	t.same(counter, 1, 'onComplete callback must be called only once');
});

test('Tween does not repeat by default', t => {
	removeAll();

	const obj = { x: 0 };
	const tw = new Tween(obj).to({ x: 100 }, 100);

	tw.start(0);

	update(0);
	t.is(obj.x, 0);

	update(50);
	t.is(obj.x, 50);

	update(100);
	t.is(obj.x, 100);

	update(150);
	t.is(obj.x, 100);
});

test('Test single repeat happens only once', t => {
	removeAll();

	const obj = { x: 0 };
	const tw = new Tween(obj).to({ x: 100 }, 100).repeat(1);

	tw.start(0);

	update(0);
	t.is(obj.x, 0);

	update(50);
	t.is(obj.x, 50);

	update(100);
	t.is(obj.x, 100);

	update(150);
	t.is(obj.x, 50);

	update(200);
	t.is(obj.x, 100);
});

test('Test Infinity repeat happens forever', t => {
	removeAll();

	const obj = { x: 0 };
	const tw = new Tween(obj).to({ x: 100 }, 100).repeat(Infinity);

	tw.start(0);

	update(0);
	t.is(obj.x, 0);

	update(50);
	t.is(obj.x, 50);

	update(100);
	t.is(obj.x, 100);

	update(150);
	t.is(obj.x, 50);

	update(200);
	t.is(obj.x, 100);

	update(250);
	t.is(obj.x, 50);
});

test('Test tweening relatively with repeat', t => {
	removeAll();

	const obj = { x: 0, y: 0 };
	const tw = new Tween(obj).to({ x: '+100', y: '-100' }, 100).repeat(1);

	tw.start(0);

	update(0);
	t.is(obj.x, 0);
	t.is(obj.y, 0);

	update(50);
	t.is(obj.x, 50);
	t.is(obj.y, -50);

	update(100);
	t.is(obj.x, 100);
	t.is(obj.y, -100);

	update(150);
	t.is(obj.x, 150);
	t.is(obj.y, -150);

	update(200);
	t.is(obj.x, 200);
	t.is(obj.y, -200);
});

test('Test yoyo with repeat Infinity happens forever', t => {
	removeAll();

	const obj = { x: 0 };
	const tw = new Tween(obj).to({ x: 100 }, 100).repeat(Infinity).yoyo(true);

	tw.start(0);

	update(0);
	t.is(obj.x, 0);

	update(25);
	t.is(obj.x, 25);

	update(100);
	t.is(obj.x, 100);

	update(125);
	t.is(obj.x, 75);

	update(200);
	t.is(obj.x, 0);

	update(225);
	t.is(obj.x, 25);
});

test('Test yoyo with repeat 1 happens once', t => {
	removeAll();

	const obj = { x: 0 };
	const tw = new Tween(obj).to({ x: 100 }, 100).repeat(1).yoyo(true);

	tw.start(0);

	update(0);
	t.is(obj.x, 0);

	update(25);
	t.is(obj.x, 25);

	update(100);
	t.is(obj.x, 100);

	update(125);
	t.is(obj.x, 75);

	update(200);
	t.is(obj.x, 0);

	update(225);
	t.is(obj.x, 0);
});


test('Test Tween.stopChainedTweens()', t => {
	const tw = new Tween({});
	let tStarted = false;
	let tCompleted = false;
	const t2 = new Tween({});
	let t2Started = false;

	removeAll();

	tw.to({}, 1000);
	t2.delay(500).to({}, 1000);

	tw.chain(t2);
	t2.chain(tw);

	tw.onStart(function() {
		tStarted = true;
	});

	tw.onComplete(function() {
		tCompleted = true;
	});

	t2.onStart(function() {
		t.is(tStarted, true);
		t.is(tCompleted, true);
		t.is(t2Started, false);
		t2Started = true;
	});

	t.is(tStarted, false);
	t.is(t2Started, false);

	tw.start(0);
	update(1001);
	tw.stop();
	
	t.is(tStarted, true);
	t.is(t2Started, false);
	t.is(getAll().length, 0);
});

test('Test Tween.chain progressess into chained tweens', t => {
	const obj = { tw: 1000 };

	// 1000 of nothing
	const blank = new Tween({}).to({}, 1000);

	// tween obj.tw from 1000 -> 2000 (in time with update time)
	const next = new Tween(obj).to({ tw: 2000 }, 1000);

	blank.chain(next).start(0);

	update(1500);
	t.is(obj.tw, 1500);

	update(2000);
	t.is(obj.tw, 2000);
});

// (function() {

// 	function getTests(TWEEN) {
		
		// var tests = {


		// 	'TWEEN.update() removes tweens when they are finished': function(test) {

		// 		TWEEN.removeAll();

		// 		var t1 = new TWEEN.Tween( {} ).to( {}, 1000 ),
		// 			t2 = new TWEEN.Tween( {} ).to( {}, 2000 );

		// 		test.equal( TWEEN.getAll().length, 0 );

		// 		t1.start( 0 );
		// 		t2.start( 0 );

		// 		test.equal( TWEEN.getAll().length, 2 );

		// 		TWEEN.update( 0 );
		// 		test.equal( TWEEN.getAll().length, 2 );

		// 		TWEEN.update( 999 );
		// 		test.equal( TWEEN.getAll().length, 2 );

		// 		TWEEN.update( 1000 );
		// 		test.equal( TWEEN.getAll().length, 1 );
		// 		test.equal( TWEEN.getAll().indexOf( t1 ), -1 );
		// 		test.ok( TWEEN.getAll().indexOf( t2 ) != -1 );
		// 		test.done();

		// 	},


		// 	// TWEEN.Tween tests

		// 	'constructor': function(test) {

		// 		var t = new TWEEN.Tween( {} );

		// 		test.ok( t instanceof TWEEN.Tween, 'Pass' );
		// 		test.done();

		// 	},

		// 	'Return the same tween instance for method chaining': function(test) {

		// 		var t = new TWEEN.Tween( {} );

		// 		test.ok( t.to({}, 0) instanceof TWEEN.Tween );
		// 		test.equal( t.to({}, 0), t );

		// 		test.ok( t.start() instanceof TWEEN.Tween );
		// 		test.equal( t.start(), t );

		// 		test.ok( t.stop() instanceof TWEEN.Tween );
		// 		test.equal( t.stop(), t );

		// 		test.ok( t.delay() instanceof TWEEN.Tween );
		// 		test.equal( t.delay(), t );

		// 		test.ok( t.easing() instanceof TWEEN.Tween );
		// 		test.equal( t.easing(), t );

		// 		test.ok( t.interpolation() instanceof TWEEN.Tween );
		// 		test.equal( t.interpolation(), t );

		// 		test.ok( t.chain() instanceof TWEEN.Tween );
		// 		test.equal( t.chain(), t );

		// 		test.ok( t.onStart() instanceof TWEEN.Tween );
		// 		test.equal( t.onStart(), t );

		// 		test.ok( t.onStop() instanceof TWEEN.Tween );
		// 		test.equal( t.onStop(), t );
				
		// 		test.ok( t.onUpdate() instanceof TWEEN.Tween );
		// 		test.equal( t.onUpdate(), t );

		// 		test.ok( t.onComplete() instanceof TWEEN.Tween );
		// 		test.equal( t.onComplete(), t );

		// 		test.done();

		// 	},

		// 	'Tween existing property': function(test) {

		// 		var obj = { x: 1 },
		// 			t = new TWEEN.Tween( obj );

		// 		t.to( { x: 2 }, 1000 );
		// 		t.start( 0 );
		// 		t.update( 1000 );

		// 		test.deepEqual( obj.x, 2 );
		// 		test.done();

		// 	},

		// 	'Tween non-existing property': function(test) {

		// 		var obj = { x: 1 },
		// 			t = new TWEEN.Tween( obj );

		// 		t.to( { y: 0 }, 1000 );
		// 		t.start( 0 );
		// 		t.update( 1000 );

		// 		test.deepEqual( obj.x, 1 );
		// 		test.equal( obj.y, undefined );
		// 		test.done();

		// 	},

		// 	'Tween non-null property': function(test) {

		// 		var obj = { x: 1 },
		// 			t = new TWEEN.Tween( obj );

		// 		t.to( { x: 2 }, 1000 );
		// 		t.start( 0 );
		// 		t.update( 1000 );

		// 		test.deepEqual( obj.x, 2 );
		// 		test.ok( obj.x !== null );
		// 		test.done();

		// 	},

		// 	'Tween function property': function(test) {

		// 		var my_function = function() {};

		// 		var obj = { x: my_function },
		// 			t = new TWEEN.Tween( obj );

		// 		t.to( { x: my_function } );
		// 		t.start( 0 );
		// 		t.update( 1000 );

		// 		test.ok( obj.x === my_function );
		// 		test.done();

		// 	},

		// 	'Tween boolean property': function(test) {

		// 		var obj = { x: true },
		// 			t = new TWEEN.Tween( obj );

		// 		t.to( { x: function() {} } );
		// 		t.start( 0 );
		// 		t.update( 1000 );

		// 		test.ok( typeof obj.x === 'boolean' );
		// 		test.ok( obj.x );
		// 		test.done();

		// 	},

		// 	'Tween null property': function(test) {

		// 		var obj = { x: null },
		// 			t = new TWEEN.Tween( obj );

		// 		t.to( { x: 2 }, 1000 );
		// 		t.start( 0 );
		// 		t.update( 1000 );

		// 		test.deepEqual( obj.x, 2 );
		// 		test.done();

		// 	},

		// 	'Tween undefined property': function(test) {

		// 		var obj = { },
		// 			t = new TWEEN.Tween( obj );

		// 		t.to( { x: 2 }, 1000 );
		// 		t.start( 0 );
		// 		t.update( 1000 );

		// 		test.equal( obj.x, undefined );
		// 		test.done();

		// 	},

		// 	'Tween relative positive value, with sign': function(test) {

		// 		var obj = { x: 0 },
		// 			t = new TWEEN.Tween( obj );

		// 		t.to( { x: '+100' }, 1000 );
		// 		t.start( 0 );
		// 		t.update( 1000 );

		// 		test.equal( obj.x, 100 );
		// 		test.done();

		// 	},

		// 	'Tween relative negative value': function(test) {

		// 		var obj = { x: 0 },
		// 			t = new TWEEN.Tween( obj );

		// 		t.to( { x: '-100' }, 1000 );
		// 		t.start( 0 );
		// 		t.update( 1000 );

		// 		test.equal( obj.x, -100 );
		// 		test.done();

		// 	},

		// 	'String values without a + or - sign should not be interpreted as relative': function(test) {

		// 		var obj = { x: 100 },
		// 			t = new TWEEN.Tween( obj );

		// 		t.to( { x: '100' }, 1000 );
		// 		t.start( 0 );
		// 		t.update( 1000 );

		// 		test.equal( obj.x, 100 );
		// 		test.done();

		// 	},

		// 	'Test TWEEN.Tween.start()': function(test) {

		// 		var obj = { },
		// 			t = new TWEEN.Tween( obj );

		// 		t.to( { }, 1000 );

		// 		TWEEN.removeAll();
		// 		test.equal( TWEEN.getAll().length, 0 ); // TODO move to TWEEN test

		// 		t.start( 0 );

		// 		test.equal( TWEEN.getAll().length, 1 ); // TODO ditto
		// 		test.equal( TWEEN.getAll()[0], t );
		// 		test.done();

		// 	},

		// 	'Test TWEEN.Tween.stop()': function(test) {

		// 		var obj = { },
		// 			t = new TWEEN.Tween( obj );

		// 		t.to( { x: 2 }, 1000 );

		// 		TWEEN.removeAll();

		// 		t.start();
		// 		t.stop();

		// 		test.equal( TWEEN.getAll().length, 0 );
		// 		test.done();

		// 	},

		// 	'Test TWEEN.Tween.delay()': function(test) {

		// 		var obj = { x: 1 },
		// 			t = new TWEEN.Tween( obj );

		// 		t.to( { x: 2 }, 1000 );
		// 		t.delay( 500 );
		// 		t.start( 0 );

		// 		t.update( 100 );

		// 		test.deepEqual( obj.x, 1, 'Tween hasn't started yet' );

		// 		t.update( 1000 );

		// 		test.ok( (obj.x !== 1) && (obj.x !== 2), 'Tween has started but hasn't finished yet' );

		// 		t.update( 1500 );

		// 		test.equal( obj.x, 2, 'Tween finishes when expected' );
		// 		test.done();

		// 	},

		// 	// TODO: not really sure how to test this. Advice appreciated!
		// 	'Test TWEEN.Tween.easing()': function(test) {

		// 		var obj = { x: 0 },
		// 			t = new TWEEN.Tween( obj );

		// 		t.to( { x: 1 }, 1000 );

		// 		t.easing( TWEEN.Easing.Quadratic.In );
		// 		t.start( 0 );
		// 		t.update( 500 );
		// 		test.equal( obj.x, TWEEN.Easing.Quadratic.In( 0.5 ) );
		// 		test.done();

		// 	},

		// 	// TODO test interpolation()

		// 	'Test TWEEN.Tween.chain --with one tween': function(test) {

		// 		var t = new TWEEN.Tween( {} ),
		// 			tStarted = false,
		// 			tCompleted = false,
		// 			t2 = new TWEEN.Tween( {} ),
		// 			t2Started = false;

		// 		TWEEN.removeAll();

		// 		t.to( {}, 1000 );
		// 		t2.to( {}, 1000 );

		// 		t.chain( t2 );

		// 		t.onStart(function() {
		// 			tStarted = true;
		// 		});

		// 		t.onComplete(function() {
		// 			tCompleted = true;
		// 		});

		// 		t2.onStart(function() {
		// 			test.equal( tStarted, true );
		// 			test.equal( tCompleted, true );
		// 			test.equal( t2Started, false );
		// 			t2Started = true;
		// 		});

		// 		test.equal( tStarted, false );
		// 		test.equal( t2Started, false );

		// 		t.start( 0 );
		// 		TWEEN.update( 0 );

		// 		test.equal( tStarted, true );
		// 		test.equal( t2Started, false );

		// 		TWEEN.update( 1000 );

		// 		test.equal( tCompleted, true );

		// 		TWEEN.update( 1001 );

		// 		test.equal( t2Started, true, 't2 is automatically started by t' );
		// 		test.done();

		// 	},

		// 	'Test TWEEN.Tween.chain --with several tweens in an array': function(test) {

		// 		var t = new TWEEN.Tween( {} ),
		// 			chainedTweens = [],
		// 			numChained = 3,
		// 			numChainedStarted = 0;

		// 		TWEEN.removeAll();

		// 		t.to( {}, 1000 );

		// 		function onChainedStart() {
		// 			numChainedStarted++;
		// 		}

		// 		for(var i = 0; i < numChained; i++ ){
		// 			var chained = new TWEEN.Tween( {} );
		// 				chained.to( {}, 1000 );

		// 			chainedTweens.push( chained );

		// 			chained.onStart(onChainedStart);
		// 		}

		// 		// NOTE: This is not the normal way to chain several tweens simultaneously
		// 		// The usual way would be to specify them explicitly:
		// 		// t.chain( tween1, tween2, ... tweenN)
		// 		// ... not to use apply to send an array of tweens
		// 		t.chain.apply( t, chainedTweens );

		// 		test.equal( numChainedStarted, 0 );

		// 		t.start( 0 );
		// 		TWEEN.update( 0 );
		// 		TWEEN.update( 1000 );
		// 		TWEEN.update( 1001 );

		// 		test.equal( numChainedStarted, numChained, 'All chained tweens have been started' );
		// 		test.done();

		// 	},

		// 	'Test TWEEN.Tween.chain allows endless loops': function(test) {

		// 		var obj = { x: 0 },
		// 			t1 = new TWEEN.Tween( obj ).to( { x: 100 }, 1000 ),
		// 			t2 = new TWEEN.Tween( obj ).to( { x: 0 }, 1000 );

		// 		TWEEN.removeAll();

		// 		t1.chain( t2 );
		// 		t2.chain( t1 );

		// 		test.equal( obj.x, 0 );

		// 		// x == 0
		// 		t1.start( 0 );
		// 		TWEEN.update( 0 );

		// 		test.equal( obj.x, 0 );

		// 		TWEEN.update( 500 );
		// 		test.equal( obj.x, 50 );

		// 		// there... (x == 100)

		// 		TWEEN.update( 1000 );
		// 		test.equal( obj.x, 100 );

		// 		TWEEN.update( 1500 );
		// 		test.equal( obj.x, 50 );

		// 		// ... and back again (x == 0)

		// 		TWEEN.update( 2000 );
		// 		test.equal( obj.x, 0);

		// 		TWEEN.update( 2500 );
		// 		test.equal( obj.x, 50 );

		// 		TWEEN.update( 3000 );
		// 		test.equal( obj.x, 100 ); // and x == 100 again
		// 		test.done();

		// 	},

		// 	'Test TWEEN.Tween.onStart': function(test) {

		// 		var obj = { },
		// 			t = new TWEEN.Tween( obj ),
		// 			counter = 0;

		// 		t.to( { x: 2 }, 1000 );
		// 		t.onStart( function() {
		// 			test.ok( true, 'onStart callback is called' );
		// 			counter++;
		// 		});

		// 		test.deepEqual( counter, 0 );

		// 		t.start( 0 );
		// 		TWEEN.update( 0 );

		// 		test.deepEqual( counter, 1 );

		// 		TWEEN.update( 500 );

		// 		test.deepEqual( counter, 1, 'onStart callback is not called again' );
		// 		test.done();

		// 	},

		// 	'Test TWEEN.Tween.onStop': function(test) {

		// 		var obj = { },
		// 			t = new TWEEN.Tween( obj ),
		// 			counter = 0;

		// 		t.to( { x: 2 }, 1000 );
		// 		t.onStop( function() {
		// 			test.ok( true, 'onStop callback is called' );
		// 			counter++;
		// 		});

		// 		test.deepEqual( counter, 0 );

		// 		t.stop();
		// 		TWEEN.update(0);

		// 		test.deepEqual( counter, 0, 'onStop callback not called when the tween hasn't started yet');

		// 		t.start( 0 );
		// 		TWEEN.update( 0 );
		// 		t.stop();

		// 		test.deepEqual( counter, 1, 'onStop callback is called if the tween has been started already and stop is invoked');

		// 		TWEEN.update( 500 );
		// 		t.stop();

		// 		test.deepEqual( counter, 1, 'onStop callback is not called again once the tween is stopped' );
		// 		test.done();

		// 	},

		// 	'Test TWEEN.Tween.onUpdate': function(test) {

		// 		var obj = { },
		// 			t = new TWEEN.Tween( obj ),
		// 			counter = 0;

		// 		t.to( { x: 2 }, 1000 );
		// 		t.onUpdate( function() {
		// 			counter++;
		// 		});

		// 		test.deepEqual( counter, 0 );

		// 		t.start( 0 );

		// 		TWEEN.update( 0 );
		// 		test.deepEqual( counter, 1 );

		// 		TWEEN.update( 500 );
		// 		test.deepEqual( counter, 2 );

		// 		TWEEN.update( 600 );
		// 		test.deepEqual( counter, 3 );

		// 		TWEEN.update( 1000 );
		// 		test.deepEqual( counter, 4 );

		// 		TWEEN.update( 1500 );
		// 		test.deepEqual( counter, 4, 'onUpdate callback should not be called after the tween has finished' );

		// 		test.done();

		// 	},

		// 	'Test TWEEN.Tween.onComplete': function(test) {

		// 		var obj = { },
		// 			t = new TWEEN.Tween( obj ),
		// 			counter = 0;

		// 		t.to( { x: 2 }, 1000 );
		// 		t.onComplete( function() {
		// 			counter++;
		// 		});

		// 		test.deepEqual( counter, 0 );

		// 		t.start( 0 );

		// 		TWEEN.update( 0 );
		// 		test.deepEqual( counter, 0 );

		// 		TWEEN.update( 500 );
		// 		test.deepEqual( counter, 0 );

		// 		TWEEN.update( 600 );
		// 		test.deepEqual( counter, 0 );

		// 		TWEEN.update( 1000 );
		// 		test.deepEqual( counter, 1 );

		// 		TWEEN.update( 1500 );
		// 		test.deepEqual( counter, 1, 'onComplete callback must be called only once' );
		// 		test.done();

		// 	},

		// 	'TWEEN.Tween does not repeat by default': function(test) {

		// 		TWEEN.removeAll();

		// 		var obj = { x: 0 },
		// 			t = new TWEEN.Tween( obj ).to( { x: 100 }, 100 );

		// 		t.start( 0 );

		// 		TWEEN.update( 0 );
		// 		test.equal( obj.x, 0 );

		// 		TWEEN.update( 50 );
		// 		test.equal( obj.x, 50 );

		// 		TWEEN.update( 100 );
		// 		test.equal( obj.x, 100 );

		// 		TWEEN.update( 150 );
		// 		test.equal( obj.x, 100 );
		// 		test.done();

		// 	},

		// 	'Test single repeat happens only once': function(test) {

		// 		TWEEN.removeAll();

		// 		var obj = { x: 0 },
		// 			t = new TWEEN.Tween( obj ).to( { x: 100 }, 100 ).repeat( 1 );

		// 		t.start( 0 );

		// 		TWEEN.update( 0 );
		// 		test.equal( obj.x, 0 );

		// 		TWEEN.update( 50 );
		// 		test.equal( obj.x, 50 );

		// 		TWEEN.update( 100 );
		// 		test.equal( obj.x, 100 );

		// 		TWEEN.update( 150 );
		// 		test.equal( obj.x, 50 );

		// 		TWEEN.update( 200 );
		// 		test.equal( obj.x, 100 );
		// 		test.done();

		// 	},

		// 	'Test Infinity repeat happens forever': function(test) {

		// 		TWEEN.removeAll();

		// 		var obj = { x: 0 },
		// 			t = new TWEEN.Tween( obj ).to( { x: 100 }, 100 ).repeat( Infinity );

		// 		t.start( 0 );

		// 		TWEEN.update( 0 );
		// 		test.equal( obj.x, 0 );

		// 		TWEEN.update( 50 );
		// 		test.equal( obj.x, 50 );

		// 		TWEEN.update( 100 );
		// 		test.equal( obj.x, 100 );

		// 		TWEEN.update( 150 );
		// 		test.equal( obj.x, 50 );

		// 		TWEEN.update( 200 );
		// 		test.equal( obj.x, 100 );

		// 		TWEEN.update( 250 );
		// 		test.equal( obj.x, 50 );
		// 		test.done();

		// 	},

		// 	'Test tweening relatively with repeat': function(test) {

		// 		TWEEN.removeAll();

		// 		var obj = { x: 0, y: 0 },
		// 			t = new TWEEN.Tween( obj ).to( { x: '+100', y: '-100' }, 100 ).repeat( 1 );

		// 		t.start( 0 );

		// 		TWEEN.update( 0 );
		// 		test.equal( obj.x, 0 );
		// 		test.equal( obj.y, 0 );

		// 		TWEEN.update( 50 );
		// 		test.equal( obj.x, 50 );
		// 		test.equal( obj.y, -50 );

		// 		TWEEN.update( 100 );
		// 		test.equal( obj.x, 100 );
		// 		test.equal( obj.y, -100 );

		// 		TWEEN.update( 150 );
		// 		test.equal( obj.x, 150 );
		// 		test.equal( obj.y, -150 );

		// 		TWEEN.update( 200 );
		// 		test.equal( obj.x, 200 );
		// 		test.equal( obj.y, -200 );
		// 		test.done();

		// 	},

		// 	'Test yoyo with repeat Infinity happens forever': function(test) {

		// 		TWEEN.removeAll();

		// 		var obj = { x: 0 },
		// 			t = new TWEEN.Tween( obj ).to( { x: 100 }, 100 ).repeat( Infinity ).yoyo(true);

		// 		t.start( 0 );

		// 		TWEEN.update( 0 );
		// 		test.equal( obj.x, 0 );

		// 		TWEEN.update( 25 );
		// 		test.equal( obj.x, 25 );

		// 		TWEEN.update( 100 );
		// 		test.equal( obj.x, 100 );

		// 		TWEEN.update( 125 );
		// 		test.equal( obj.x, 75 );

		// 		TWEEN.update( 200 );
		// 		test.equal( obj.x, 0 );

		// 		TWEEN.update( 225 );
		// 		test.equal( obj.x, 25 );
		// 		test.done();

		// 	},

		// 	'Test yoyo with repeat 1 happens once': function(test) {

		// 		TWEEN.removeAll();

		// 		var obj = { x: 0 },
		// 			t = new TWEEN.Tween( obj ).to( { x: 100 }, 100 ).repeat( 1 ).yoyo(true);

		// 		t.start( 0 );

		// 		TWEEN.update( 0 );
		// 		test.equal( obj.x, 0 );

		// 		TWEEN.update( 25 );
		// 		test.equal( obj.x, 25 );

		// 		TWEEN.update( 100 );
		// 		test.equal( obj.x, 100 );

		// 		TWEEN.update( 125 );
		// 		test.equal( obj.x, 75 );

		// 		TWEEN.update( 200 );
		// 		test.equal( obj.x, 0 );

		// 		TWEEN.update( 225 );
		// 		test.equal( obj.x, 0 );
		// 		test.done();
		// 	},


		// 	'Test TWEEN.Tween.stopChainedTweens()': function(test) {
		// 		var t = new TWEEN.Tween( {} ),
		// 			tStarted = false,
		// 			tCompleted = false,
		// 			t2 = new TWEEN.Tween( {} ),
		// 			t2Started = false;

		// 		TWEEN.removeAll();

		// 		t.to( {}, 1000 );
		// 		t2.delay(500).to( {}, 1000 );

		// 		t.chain( t2 );
		// 		t2.chain( t );

		// 		t.onStart(function() {
		// 			tStarted = true;
		// 		});

		// 		t.onComplete(function() {
		// 			tCompleted = true;
		// 		});

		// 		t2.onStart(function() {
		// 			test.equal( tStarted, true );
		// 			test.equal( tCompleted, true );
		// 			test.equal( t2Started, false );
		// 			t2Started = true;
		// 		});

		// 		test.equal( tStarted, false );
		// 		test.equal( t2Started, false );

		// 		t.start( 0 );
		// 		TWEEN.update( 1001 );
		// 		t.stop();
				
		// 		test.equal( tStarted, true );
		// 		test.equal( t2Started, false );
		// 		test.equal( TWEEN.getAll().length, 0 );
		// 		test.done();

		// 	},

		// 	'Test TWEEN.Tween.chain progressess into chained tweens': function(test) {

		// 		var obj = { t: 1000 };

		// 		// 1000 of nothing
		// 		var blank = new TWEEN.Tween({}).to({}, 1000);

		// 		// tween obj.t from 1000 -> 2000 (in time with update time)
		// 		var next  = new TWEEN.Tween(obj).to({ t: 2000 }, 1000);

		// 		blank.chain(next).start(0);

		// 		TWEEN.update(1500);
		// 		test.equal(obj.t, 1500);

		// 		TWEEN.update(2000);
		// 		test.equal(obj.t, 2000);

		// 		test.done();

		// 	},

		// };

// 		return tests;

// 	}

// 	if(typeof module !== 'undefined' && module.exports) {
// 		module.exports = getTests;
// 	} else {
// 		this.getTests = getTests;
// 	}
	
// }).call(this);
