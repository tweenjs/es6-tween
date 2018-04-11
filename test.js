import test from 'ava'
const { Easing, Tween, update, getAll, removeAll } = require('./bundled/Tween')

test('Events', t => {
  let tween = new Tween({ x: 0 })
    .to({ x: 100 }, 100)
    .repeat(2)
    .yoyo(true)
    .start(0)

  t.plan(9)

  tween.on('start', () => {
    t.log('Event [Start]: Was called successfully')
    t.pass()
  })

  tween.on('update', () => {
    t.log('Event [Update]: Was called successfully')
    t.pass()
  })

  tween.on('repeat', () => {
    t.log('Event [Repeat]: Was called successfully')
    t.pass()
  })

  tween.on('reverse', () => {
    t.log('Event [Reverse]: Was called successfully')
    t.pass()
  })

  tween.on('complete', () => {
    t.log('Event [Complete]: Was called successfully')
    t.pass()
  })

  update(0)
  update(50)
  update(100)
  update(200)
  update(300)
})

test('Value Interpolation', t => {
  let obj = { a: 0, b: 'B value 1', c: { x: 2 }, d: [3], _e: 4, g: 5 }

  Object.defineProperty(obj, 'e', {
    get () { return obj._e },
    set (x) {
      obj._e = x
    }
  })

  new Tween(obj)
    .to({ a: 1, b: 'B value 2', c: { x: 3 }, d: [4], _e: 5, g: '+=1' }, 100)
    .start(0)

  update(0)

  t.is(obj.a, 0)
  t.is(obj.b, 'B value 1')
  t.is(obj.c.x, 2)
  t.is(obj.d[0], 3)
  t.is(obj.e, 4)
  t.is(obj.g, 5)

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

  update(100)

  t.is(obj.a, 1)
  t.is(obj.b, 'B value 2')
  t.is(obj.c.x, 3)
  t.is(obj.d[0], 4)
  t.is(obj.e, 5)
  t.is(obj.g, 6)
})

test('Value Array-based Interpolation', t => {
  let obj = { x: 0 }
  new Tween(obj)
    .to({ x: [1, 3, 5] }, 100)
    .start(0)

  t.is(obj.x, 0)

  update(50)

  t.is(obj.x, 2, 'Interpolation failed')
  t.log('End-value interpolation was done')

  t.log('Start-value interpolation was done')

  update(100)
})

test('Tweens List Controlling', t => {
  let tween = new Tween({ x: 0 })
    .to({ x: 100 }, 100)
    .repeat(2)
    .yoyo(true)
    .start(0)

  t.is(getAll()
    .length, 1, 'Tween added in tweens list')
  t.log('Tweens adding was done')

  tween.stop()

  t.is(getAll()
    .length, 0, 'Tween removed from tweens list')
  t.log('Tween removing was done')

  tween.restart()

  t.is(getAll()
    .length, 1, 'Tween added in tweens list')
  t.log('Tweens restart and re-add to tweens list was done')

  removeAll()

  t.is(getAll()
    .length, 0, 'All Tweens was removed from tweens list')
  t.log('Tween removeAll was worked fine')
})

test('Easing', t => {
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
