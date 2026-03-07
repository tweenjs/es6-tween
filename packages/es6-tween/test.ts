import { describe } from 'node:test';
import assert from 'node:assert/strict';

import { Easing, Tween, Timeline, update, getAll, removeAll } from './src/index.js';
import withPage from './withPage.ts';

await describe('Events', async () => {
  const { promise, resolve } = Promise.withResolvers();
  let tween = new Tween({ x: 0 }).to({ x: 100 }, 100).repeat(2).yoyo(true).start(0);

  tween.on('start', () => {
    assert.ok(true, 'on:start was called successfully');
  });

  tween.on('update', () => {
    assert.ok(true, 'on:update was called successfully');
  });

  tween.on('repeat', () => {
    assert.ok(true, 'on:repeat was called successfully');
  });

  tween.on('reverse', () => {
    assert.ok(true, 'on:reverse was called successfully');
  });

  tween.on('complete', () => {
    assert.ok(true, 'on:complete was called successfully');
    resolve(true);
  });

  update(0);
  update(50);
  update(100);
  update(200);
  update(300);

  await promise;
});

await describe('Value Interpolation', async () => {
  const m = ['rgb(', 0, ', 204, ', 255, ')'];

  let obj = {
    a: 0,
    b: 'B value 1',
    c: { x: 2 },
    d: [3],
    _e: 4,
    g: 5,
    h: 0,
    j: 0,
    k: '#000',
    l: '#0cf',
    m,
  };
  type ExtendedObj = typeof obj & { e: number };

  Object.defineProperty(obj, 'e', {
    get() {
      return obj._e;
    },
    set(x) {
      obj._e = x;
    },
  });

  const m2 = ['rgb(', 255, ', 204, ', 0, ')'];
  new Tween(obj)
    .to(
      {
        a: 1,
        b: 'B value 2',
        c: { x: 3 },
        d: [4],
        _e: 5,
        g: '+=1',
        h: 250000,
        j: [1, 2],
        k: ['rgb(100, 100, 100)', 'rgb(200, 200, 200)'],
        l: '#fc0',
        m: m2,
      },
      100
    )
    .start(0);

  update(0);

  assert.equal(obj.a, 0);
  assert.equal(obj.b, 'B value 1');
  assert.equal(obj.c.x, 2);
  assert.equal(obj.d[0], 3);
  assert.equal((obj as ExtendedObj).e, 4);
  assert.equal(obj.g, 5);
  assert.equal(obj.h, 0);
  assert.equal(obj.j, 0);
  assert.equal(obj.k, 'rgb(0, 0, 0)');
  assert.equal(obj.l, 'rgb(0, 204, 255)');
  assert.deepEqual(obj.m, ['rgb(', 0, ', 204, ', 255, ')']);

  update(50);

  assert.equal(obj.a, 0.5, 'Number interpolation not worked as excepted');
  assert.ok(true, 'Number interpolation worked as excepted');

  assert.equal(obj.b, 'B value 1.5', 'String interpolation not worked as excepted');
  assert.ok(true, 'String interpolation worked as excepted');

  assert.equal(obj.c.x, 2.5, 'Object interpolation not worked as excepted');
  assert.ok(true, 'Object interpolation worked as excepted');

  assert.equal(obj.d[0], 3.5, 'Array interpolation not worked as excepted');
  assert.ok(true, 'Array interpolation worked as excepted');

  assert.equal((obj as ExtendedObj).e, 4.5, 'Getter/Setter interpolation not worked as excepted');
  assert.ok(true, 'Getter/Setter interpolation worked as excepted');

  assert.equal(obj.g, 5.5, 'Relative number interpolation not worked as excepted');
  assert.ok(true, 'Relative number interpolation worked as excepted');

  assert.equal(obj.h, 125000, 'Big number interpolation not worked as excepted');
  assert.ok(true, 'Big number interpolation worked as excepted');

  assert.equal(obj.j, 1, 'Multi-Interpolation not worked as excepted');
  assert.ok(true, 'Multi-Interpolation worked as excepted');

  assert.equal(obj.k, 'rgb(100, 100, 100)', 'Multi-Interpolation not worked as excepted');
  assert.ok(true, 'Multi-Interpolation worked as excepted');

  update(100);

  assert.equal(obj.a, 1);
  assert.equal(obj.b, 'B value 2');
  assert.equal(obj.c.x, 3);
  assert.equal(obj.d[0], 4);
  assert.equal((obj as ExtendedObj).e, 5);
  assert.equal(obj.g, 6);
  assert.equal(obj.h, 250000, 'Big number interpolation ending value not worked as excepted');
  assert.equal(obj.j, 2, 'Multi-Interpolation not worked as excepted');
  assert.equal(obj.k, 'rgb(200, 200, 200)', 'Multi-Interpolation not worked as excepted');
  assert.equal(obj.l, 'rgb(255, 204, 0)', 'String interpolation not worked as excepted');
  assert.deepEqual(obj.m, m2, 'Array interpolation not worked as excepted');
});

await describe('Value Array-based Interpolation', () => {
  let obj = { x: 0 };
  new Tween(obj).to({ x: [1, 3, 5] }, 100).start(0);

  assert.equal(obj.x, 0);

  update(50);

  assert.equal(obj.x, 2, 'Interpolation failed');
  assert.ok(true, 'End-value interpolation was done');

  assert.ok(true, 'Start-value interpolation was done');

  update(100);
});

await describe('Tweens List Controlling', () => {
  let tween = new Tween({ x: 0 }).to({ x: 100 }, 100).repeat(2).yoyo(true).start(0);

  assert.equal(getAll().length, 1, 'Tween added in tweens list');
  assert.ok(true, 'Tweens adding was done');

  tween.stop();

  assert.equal(getAll().length, 0, 'Tween removed from tweens list');
  assert.ok(true, 'Tween removing was done');

  tween.restart();

  assert.equal(getAll().length, 1, 'Tween added in tweens list');
  assert.ok(true, 'Tweens restart and re-add to tweens list was done');

  removeAll();

  assert.equal(getAll().length, 0, 'All Tweens was removed from tweens list');
  assert.ok(true, 'Tween removeAll was worked fine');
});

await describe('Easing', () => {
  const { Quadratic, Elastic, Linear } = Easing;

  const { InOut: QuadraticInOut } = Quadratic;
  const { InOut: ElasticInOut } = Elastic;
  const { None } = Linear;

  assert.equal(None(0.67), 0.67, 'Linear.None was not eased as excepted');
  assert.ok(true, 'Linear.None was eased as excepted');

  assert.notEqual(QuadraticInOut(0.77), 0.77, 'Quadratic.InOut was not eased as excepted');
  assert.ok(true, 'Quadratic.InOut was eased as excepted');

  assert.notEqual(ElasticInOut(0.6), 0.6, 'Elastic.InOut was not eased as excepted');
  assert.ok(true, 'Elastic.InOut was eased as excepted');
});

await describe('Tween update should be run against all tween each time', () => {
  const order: number[] = [];

  new Tween({ x: 0 })
    .to({ x: 100 }, 100)
    .start(0)
    .on('complete', () => {
      order.push(0);
    });
  new Tween({ x: 0 })
    .to({ x: 100 }, 100)
    .delay(10)
    .start(0)
    .on('complete', () => {
      order.push(1);
    });
  new Tween({ x: 0 })
    .to({ x: 100 }, 100)
    .delay(20)
    .start(0)
    .on('complete', () => {
      order.push(2);
    });

  update(0);
  update(200);

  assert.deepEqual(order, [0, 1, 2]);
});

await describe('Tween should work after recall when using power saving feature', () => {
  const init = <T>(obj: T) => new Tween(obj).to({ z: 360 }, 1000).on('complete', init).start(0);

  const obj1 = { z: 0 };
  init(obj1);

  update(500);
  assert.equal(obj1.z, 180, 'Tweening update does not work as excepted');
  update(1000);
  assert.equal(obj1.z, 360, 'Tweening update does not work as excepted');

  update(0);

  const obj2 = { z: 0 };
  init(obj2);

  update(500);
  assert.equal(obj2.z, 180, 'Tweening update does not work as excepted');
  update(1000);
  assert.equal(obj2.z, 360, 'Tweening update does not work as excepted');
});

await describe('Headless tests', async () => {
  const tests = await withPage((page) => {
    return page.evaluate(() => {
      const deepArrayCopy = <T>(arr: T) =>
        // @ts-expect-error: Inferable types
        arr.map((child) =>
          Array.isArray(child)
            ? deepArrayCopy(child)
            : Object.keys(child) && Object.keys(child).length
              ? Object.assign({}, child)
              : child
        );

      const tests: Array<
        | {
            method: 'log';
            successMessage: string;
          }
        | {
            method: 'equal' | 'deepEqual' | 'notEqual';
            successMessage?: string;
            failMessage?: string;
            a: unknown;
            b: unknown;
          }
      > = [];

      const obj = { x: 0, y: [50, 'String test 100'] } as const;
      const obj2 = { x: 0 } as const;
      const arr1 = [[100], { f: 200 }] as const;

      const tween1 = new Tween(obj)
        .to({ x: 200, y: [100, 'String test 200'] }, 2000)
        .on('start', () => {
          tests.push({
            method: 'log',
            successMessage: 'on:start event works as excepted',
          });
        })
        .on('update', (_: typeof obj, elapsed: number) => {
          tests.push({
            method: 'log',
            successMessage: 'on:update event works as excepted with elapsed ' + elapsed,
          });
        })
        .on('complete', () => {
          tests.push({
            method: 'log',
            successMessage: 'on:complete event works as excepted',
          });
        });
      const tween2 = new Tween(obj2).to({ x: 200 }, 4000).easing(Easing.Elastic.InOut);
      const tween3 = new Tween(arr1).to([[0], { f: 100 }], 2000);

      tween1.start(0);
      tween2.start(0);
      tween3.start(0);

      tests.push({
        method: 'equal',
        a: obj.x,
        b: 0,
        failMessage: 'ID: ObjX_24U',
      });
      tests.push({
        method: 'equal',
        a: obj.y[0],
        b: 50,
        failMessage: 'ID: ObjY_25C',
      });
      tests.push({
        method: 'equal',
        a: obj.y[1],
        b: 'String test 100',
        failMessage: 'ID: ObjY_26G',
      });
      tests.push({
        method: 'equal',
        a: obj2.x,
        b: 0,
        failMessage: 'ID: ObjX_26Z',
      });
      tests.push({
        method: 'equal',
        a: arr1[0][0],
        b: 100,
        failMessage: 'ID: ObjA_27L',
      });
      tests.push({
        method: 'equal',
        a: arr1[1].f,
        b: 200,
        failMessage: 'ID: ObjF_27X',
      });

      update(1000);

      tests.push({
        method: 'equal',
        a: obj.x,
        b: 100,
        failMessage: 'There something wrong with number interpolation',
        successMessage: 'Number interpolation works as excepted',
      });
      tests.push({
        method: 'equal',
        a: obj.y[0],
        b: 75,
        failMessage: 'There something wrong with Array number interpolation',
        successMessage: 'Array Number interpolation works as excepted',
      });
      tests.push({
        method: 'equal',
        a: obj.y[1],
        b: 'String test 150',
        failMessage: 'There something wrong with Array string interpolation',
        successMessage: 'Array string interpolation works as excepted',
      });
      tests.push({
        method: 'notEqual',
        a: obj2.x,
        b: 50,
        failMessage: 'Easing not works properly or tween instance not handles easing function properly',
        successMessage: 'Easing function works properly',
      });
      tests.push({
        method: 'deepEqual',
        a: deepArrayCopy(arr1),
        b: [[50], { f: 150 }],
        failMessage: 'Array-based tween failed due of internal processor/instance and/or something failed within core',
        successMessage: 'Array-based tweens works properly',
      });

      update(2000);

      tests.push({
        method: 'equal',
        a: obj.x,
        b: 200,
        failMessage: 'ID: ObjX_32R',
      });
      tests.push({
        method: 'equal',
        a: obj.y[0],
        b: 100,
        failMessage: 'ID: ObjY_33V',
      });
      tests.push({
        method: 'equal',
        a: obj.y[1],
        b: 'String test 200',
        failMessage: 'ID: ObjY_33S',
      });
      tests.push({
        method: 'notEqual',
        a: obj2.x,
        b: 200,
        failMessage: 'ID: ObjY_34I',
      });
      tests.push({
        method: 'equal',
        a: arr1[0][0],
        b: 0,
        failMessage: 'ID: ObjA_34P',
      });
      tests.push({
        method: 'equal',
        a: arr1[1].f,
        b: 100,
        failMessage: 'ID: ObjF_35T',
      });

      update(4000);

      tests.push({
        method: 'equal',
        a: obj2.x,
        b: 200,
        failMessage: 'ID: ObjY_36K',
      });

      return tests;
    });
  });

  tests.forEach((test) => {
    if (test.method === 'log') {
      assert.ok(true, test.successMessage);
    } else {
      assert[test.method](test.a, test.b, test.failMessage);
      test.successMessage && assert.ok(true, test.successMessage);
    }
  });
});

await describe('Timeline', () => {
  const obj = { x: 0 };
  const obj2 = { x: 0 };
  const obj3 = { x: 0 };

  const from = [obj, obj2, obj3];
  const to = { x: 200 };

  const tl = new Timeline({ duration: 1000, startTime: 0, stagger: 1000 }).to(from, to);

  tl.on('start', () => {
    assert.ok(true, 'on:start event works as excepted');
  });
  tl.on('update', (elapsed: number) => {
    assert.ok(true, 'on:update event works as excepted with elapsed ' + elapsed);
  });
  tl.on('complete', () => {
    assert.ok(true, 'on:complete event works as excepted');
  });

  tl.start(0);

  assert.equal(obj.x, 0);
  assert.equal(obj2.x, 0);
  assert.equal(obj3.x, 0);

  update(1000);

  assert.equal(obj.x, 200);
  assert.equal(obj2.x, 0);
  assert.equal(obj3.x, 0);

  update(2000);

  assert.equal(obj.x, 200);
  assert.equal(obj2.x, 200);
  assert.equal(obj3.x, 0);

  update(3000);

  assert.equal(obj.x, 200);
  assert.equal(obj2.x, 200);
  assert.equal(obj3.x, 200);

  update(4000);

  assert.equal(obj.x, 200);
  assert.equal(obj2.x, 200);
  assert.equal(obj3.x, 200);

  assert.ok(true, 'All values interpolation works as excepted');
});
