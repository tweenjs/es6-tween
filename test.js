/* global TWEEN */

import test from 'ava'

import { Easing, Tween, Timeline, update, getAll, removeAll } from './src'

import browserTestMiddleware from './withPage'

test('Events', (t) => {
  let tween = new Tween({ x: 0 })
    .to({ x: 100 }, 100)
    .repeat(2)
    .yoyo(true)
    .start(0)

  t.plan(9)

  tween.on('start', () => {
    t.log('on:start was called successfully')
    t.pass()
  })

  tween.on('update', () => {
    t.log('on:update was called successfully')
    t.pass()
  })

  tween.on('repeat', () => {
    t.log('on:repeat was called successfully')
    t.pass()
  })

  tween.on('reverse', () => {
    t.log('on:reverse was called successfully')
    t.pass()
  })

  tween.on('complete', () => {
    t.log('on:complete was called successfully')
    t.pass()
  })

  update(0)
  update(50)
  update(100)
  update(200)
  update(300)
})

test('Value Interpolation', (t) => {
  const m = ['rgb(', 0, ', 204, ', 255, ')']

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
    m
  }

  Object.defineProperty(obj, 'e', {
    get () {
      return obj._e
    },
    set (x) {
      obj._e = x
    }
  })

  const m2 = ['rgb(', 255, ', 204, ', 0, ')']
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
        m: m2
      },
      100
    )
    .start(0)

  update(0)

  t.is(obj.a, 0)
  t.is(obj.b, 'B value 1')
  t.is(obj.c.x, 2)
  t.is(obj.d[0], 3)
  t.is(obj.e, 4)
  t.is(obj.g, 5)
  t.is(obj.h, 0)
  t.is(obj.j, 0)
  t.is(obj.k, 'rgb(0, 0, 0)')
  t.is(obj.l, 'rgb(0, 204, 255)')
  t.deepEqual(obj.m, ['rgb(', 0, ', 204, ', 255, ')'])

  update(50)

  t.is(obj.a, 0.5, 'Number interpolation not worked as excepted')
  t.log('Number interpolation worked as excepted')

  t.is(obj.b, 'B value 1.5', 'String interpolation not worked as excepted')
  t.log('String interpolation worked as excepted')

  t.is(obj.c.x, 2.5, 'Object interpolation not worked as excepted')
  t.log('Object interpolation worked as excepted')

  t.is(obj.d[0], 3.5, 'Array interpolation not worked as excepted')
  t.log('Array interpolation worked as excepted')

  t.is(obj.e, 4.5, 'Getter/Setter interpolation not worked as excepted')
  t.log('Getter/Setter interpolation worked as excepted')

  t.is(obj.g, 5.5, 'Relative number interpolation not worked as excepted')
  t.log('Relative number interpolation worked as excepted')

  t.is(obj.h, 125000, 'Big number interpolation not worked as excepted')
  t.log('Big number interpolation worked as excepted')

  t.is(obj.j, 1, 'Multi-Interpolation not worked as excepted')
  t.log('Multi-Interpolation worked as excepted')

  t.is(obj.k, 'rgb(100, 100, 100)', 'Multi-Interpolation not worked as excepted')
  t.log('Multi-Interpolation worked as excepted')

  update(100)

  t.is(obj.a, 1)
  t.is(obj.b, 'B value 2')
  t.is(obj.c.x, 3)
  t.is(obj.d[0], 4)
  t.is(obj.e, 5)
  t.is(obj.g, 6)
  t.is(obj.h, 250000, 'Big number interpolation ending value not worked as excepted')
  t.is(obj.j, 2, 'Multi-Interpolation not worked as excepted')
  t.is(obj.k, 'rgb(200, 200, 200)', 'Multi-Interpolation not worked as excepted')
  t.is(obj.l, 'rgb(255, 204, 0)', 'String interpolation not worked as excepted')
  t.deepEqual(obj.m, m2, 'Array interpolation not worked as excepted')
})

test('Value Array-based Interpolation', (t) => {
  let obj = { x: 0 }
  new Tween(obj).to({ x: [1, 3, 5] }, 100).start(0)

  t.is(obj.x, 0)

  update(50)

  t.is(obj.x, 2, 'Interpolation failed')
  t.log('End-value interpolation was done')

  t.log('Start-value interpolation was done')

  update(100)
})

test('Tweens List Controlling', (t) => {
  let tween = new Tween({ x: 0 })
    .to({ x: 100 }, 100)
    .repeat(2)
    .yoyo(true)
    .start(0)

  t.is(getAll().length, 1, 'Tween added in tweens list')
  t.log('Tweens adding was done')

  tween.stop()

  t.is(getAll().length, 0, 'Tween removed from tweens list')
  t.log('Tween removing was done')

  tween.restart()

  t.is(getAll().length, 1, 'Tween added in tweens list')
  t.log('Tweens restart and re-add to tweens list was done')

  removeAll()

  t.is(getAll().length, 0, 'All Tweens was removed from tweens list')
  t.log('Tween removeAll was worked fine')
})

test('Easing', (t) => {
  const { Quadratic, Elastic, Linear } = Easing

  const { InOut: QuadraticInOut } = Quadratic
  const { InOut: ElasticInOut } = Elastic
  const { None } = Linear

  t.is(None(0.67), 0.67, 'Linear.None was not eased as excepted')
  t.log('Linear.None was eased as excepted')

  t.not(QuadraticInOut(0.77), 0.77, 'Quadratic.InOut was not eased as excepted')
  t.log('Quadratic.InOut was eased as excepted')

  t.not(ElasticInOut(0.6), 0.6, 'Elastic.InOut was not eased as excepted')
  t.log('Elastic.InOut was eased as excepted')
})

test('Tween update should be run against all tween each time', (t) => {
  const order = []

  new Tween({ x: 0 })
    .to({ x: 100 }, 100)
    .start(0)
    .on('complete', () => {
      order.push(0)
    })
  new Tween({ x: 0 })
    .to({ x: 100 }, 100)
    .delay(10)
    .start(0)
    .on('complete', () => {
      order.push(1)
    })
  new Tween({ x: 0 })
    .to({ x: 100 }, 100)
    .delay(20)
    .start(0)
    .on('complete', () => {
      order.push(2)
    })

  t.plan(1)

  update(0)
  update(200)

  t.deepEqual(order, [0, 1, 2])
})

test('Tween should work after recall when using power saving feature', (t) => {
  const init = (obj) =>
    new Tween(obj)
      .to({ z: 360 }, 1000)
      .on('complete', init)
      .start(0)

  const obj1 = { z: 0 }
  init(obj1)

  update(500)
  t.is(obj1.z, 180, 'Tweening update does not work as excepted')
  update(1000)
  t.is(obj1.z, 360, 'Tweening update does not work as excepted')

  update(0)

  const obj2 = { z: 0 }
  init(obj2)

  update(500)
  t.is(obj2.z, 180, 'Tweening update does not work as excepted')
  update(1000)
  t.is(obj2.z, 360, 'Tweening update does not work as excepted')
})

test('Headless tests', browserTestMiddleware, (t, page) => {
  return page
    .evaluate(() => {
      const deepArrayCopy = (arr) =>
        arr.map((child) =>
          Array.isArray(child)
            ? deepArrayCopy(child)
            : Object.keys(child) && Object.keys(child).length
              ? Object.assign({}, child)
              : child
        )

      const tests = []

      const obj = { x: 0, y: [50, 'String test 100'] }
      const obj2 = { x: 0 }
      const arr1 = [[100], { f: 200 }]

      const tween1 = new TWEEN.Tween(obj)
        .to({ x: 200, y: [100, 'String test 200'] }, 2000)
        .on('start', () => {
          tests.push({
            method: 'log',
            successMessage: 'on:start event works as excepted'
          })
        })
        .on('update', (obj, elapsed) => {
          tests.push({
            method: 'log',
            successMessage: 'on:update event works as excepted with elapsed ' + elapsed
          })
        })
        .on('complete', () => {
          tests.push({
            method: 'log',
            successMessage: 'on:complete event works as excepted'
          })
        })
      const tween2 = new TWEEN.Tween(obj2).to({ x: 200 }, 4000).easing(TWEEN.Easing.Elastic.InOut)
      const tween3 = new TWEEN.Tween(arr1).to([[0], { f: 100 }], 2000)

      tween1.start(0)
      tween2.start(0)
      tween3.start(0)

      tests.push({
        method: 'is',
        a: obj.x,
        b: 0,
        failMessage: 'ID: ObjX_24U'
      })
      tests.push({
        method: 'is',
        a: obj.y[0],
        b: 50,
        failMessage: 'ID: ObjY_25C'
      })
      tests.push({
        method: 'is',
        a: obj.y[1],
        b: 'String test 100',
        failMessage: 'ID: ObjY_26G'
      })
      tests.push({
        method: 'is',
        a: obj2.x,
        b: 0,
        failMessage: 'ID: ObjX_26Z'
      })
      tests.push({
        method: 'is',
        a: arr1[0][0],
        b: 100,
        failMessage: 'ID: ObjA_27L'
      })
      tests.push({
        method: 'is',
        a: arr1[1].f,
        b: 200,
        failMessage: 'ID: ObjF_27X'
      })

      TWEEN.update(1000)

      tests.push({
        method: 'is',
        a: obj.x,
        b: 100,
        failMessage: 'There something wrong with number interpolation',
        successMessage: 'Number interpolation works as excepted'
      })
      tests.push({
        method: 'is',
        a: obj.y[0],
        b: 75,
        failMessage: 'There something wrong with Array number interpolation',
        successMessage: 'Array Number interpolation works as excepted'
      })
      tests.push({
        method: 'is',
        a: obj.y[1],
        b: 'String test 150',
        failMessage: 'There something wrong with Array string interpolation',
        successMessage: 'Array string interpolation works as excepted'
      })
      tests.push({
        method: 'not',
        a: obj2.x,
        b: 50,
        failMessage: 'Easing not works properly or tween instance not handles easing function properly',
        successMessage: 'Easing function works properly'
      })
      tests.push({
        method: 'deepEqual',
        a: deepArrayCopy(arr1),
        b: [[50], { f: 150 }],
        failMessage: 'Array-based tween failed due of internal processor/instance and/or something failed within core',
        successMessage: 'Array-based tweens works properly'
      })

      TWEEN.update(2000)

      tests.push({
        method: 'is',
        a: obj.x,
        b: 200,
        failMessage: 'ID: ObjX_32R'
      })
      tests.push({
        method: 'is',
        a: obj.y[0],
        b: 100,
        failMessage: 'ID: ObjY_33V'
      })
      tests.push({
        method: 'is',
        a: obj.y[1],
        b: 'String test 200',
        failMessage: 'ID: ObjY_33S'
      })
      tests.push({
        method: 'not',
        a: obj2.x,
        b: 200,
        failMessage: 'ID: ObjY_34I'
      })
      tests.push({
        method: 'is',
        a: arr1[0][0],
        b: 0,
        failMessage: 'ID: ObjA_34P'
      })
      tests.push({
        method: 'is',
        a: arr1[1].f,
        b: 100,
        failMessage: 'ID: ObjF_35T'
      })

      TWEEN.update(4000)

      tests.push({
        method: 'is',
        a: obj2.x,
        b: 200,
        failMessage: 'ID: ObjY_36K'
      })

      return tests
    })
    .then((tests) => {
      tests.map(({ method, a, b, failMessage, successMessage }) => {
        if (method === 'log') {
          t.log(successMessage)
        } else {
          t[method](a, b, failMessage)
          successMessage && t.log(successMessage)
        }
      })
    })
})

test('Timeline', (t) => {
  const obj = { x: 0 }
  const obj2 = { x: 0 }
  const obj3 = { x: 0 }

  const from = [obj, obj2, obj3]
  const to = { x: 200 }

  const tl = new Timeline({ duration: 1000, startTime: 0, stagger: 1000 }).to(from, to)

  tl.on('start', () => {
    t.pass()
    t.log('on:start event works as excepted')
  })
  tl.on('update', (elapsed) => {
    t.pass()
    t.log('on:update event works as excepted with elapsed ' + elapsed)
  })
  tl.on('complete', () => {
    t.pass()
    t.log('on:complete event works as excepted')
  })

  tl.start(0)

  t.is(obj.x, 0)
  t.is(obj2.x, 0)
  t.is(obj3.x, 0)

  update(1000)

  t.is(obj.x, 200)
  t.is(obj2.x, 0)
  t.is(obj3.x, 0)

  update(2000)

  t.is(obj.x, 200)
  t.is(obj2.x, 200)
  t.is(obj3.x, 0)

  update(3000)

  t.is(obj.x, 200)
  t.is(obj2.x, 200)
  t.is(obj3.x, 200)

  update(4000)

  t.is(obj.x, 200)
  t.is(obj2.x, 200)
  t.is(obj3.x, 200)

  t.log('All values interpolation works as excepted')
})
