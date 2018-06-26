var test = require('tape')
var choo = require('choo')
var html = require('choo/html')
var createStore = require('./')

test('errors', t => {
  t.throws(() => createStore(), /storeName required/, 'throws on empty call')
  t.throws(() => createStore({}), /storeName required/, 'throws on missing storeName')
  t.throws(() => createStore({ storeName: 'foo' }), /initialState required/, 'throws on missing initialState')
  t.throws(() => createStore({ storeName: 'foo', initialState: {} }), /events required/, 'throws on missing events')
  t.end()
})

test('storeName', t => {
  var storeName = 'demo'
  var store = createStore({ storeName, initialState: {}, events: {} })
  t.equals(store.storeName, storeName, 'has storeName prop')
  t.end()
})

test('integration', t => {
  var app, objStore, arrStore, resetStore

  t.test('instantiation', t => {
    t.doesNotThrow(() => {
      objStore = createStore({
        storeName: 'obj',
        initialState: { a: 1 },
        events: {
          increment: function ({ store }) {
            store.a++
          }
        }
      })
    }, 'create object store')

    t.doesNotThrow(() => {
      arrStore = createStore({
        storeName: 'arr',
        initialState: [1],
        events: {
          increment: function ({ data, store }) {
            store[0]++
          }
        }
      })
    }, 'create array store')

    t.doesNotThrow(() => {
      resetStore = createStore({
        storeName: 'reset',
        initialState: { a: 3 },
        events: {
          reset: function ({ store }) {
            store.a = store.a * store.a
          }
        }
      })
    }, 'create reset store')

    t.end()
  })

  t.test('registration', t => {
    t.doesNotThrow(() => {
      app = choo()
      app.use(objStore)
      app.use(arrStore)
      app.use(resetStore)
      app.route('/', (state, emit) => html`<body></body>`)
      app.toString('/')
    }, 'stores register')

    t.end()
  })

  t.test('initialState', t => {
    t.equals(app.state.obj.a, 1, 'objStore state is good')
    t.equals(app.state.arr[0], 1, 'arrStore state is good')
    t.equals(app.state.reset.a, 3, 'resetStore state is good')

    t.end()
  })

  t.test('events/actions', t => {
    t.doesNotThrow(objStore.actions.increment, 'object increment works')
    t.doesNotThrow(arrStore.actions.increment, 'array increment works')

    t.equals(app.state.obj.a, 2, 'arrStore state updated')
    t.equals(app.state.arr[0], 2, 'arrStore state updated')

    t.end()
  })

  t.test('reset', t => {
    t.doesNotThrow(objStore.actions.reset, 'object reset works')
    t.doesNotThrow(arrStore.actions.reset, 'array reset works')
    t.doesNotThrow(resetStore.actions.reset, 'custom reset works')

    t.equals(app.state.obj.a, 1, 'object reset state is good')
    t.equals(app.state.arr[0], 1, 'array reset state is good')
    t.equals(app.state.reset.a, 9, 'custom reset state is good')

    t.end()
  })

  t.test('reset with render', t => {
    t.doesNotThrow(() => objStore.actions.reset({ render: true }), 'object reset render works')
    t.doesNotThrow(() => arrStore.actions.reset({ render: true }), 'array reset render works')
    t.doesNotThrow(() => resetStore.actions.reset({ render: true }), 'custom reset render works')

    t.equals(app.state.obj.a, 1, 'object reset state is good')
    t.equals(app.state.arr[0], 1, 'array reset state is good')
    t.equals(app.state.reset.a, 81, 'custom reset state is good')

    t.end()
  })

  t.end()
})
