var createStore = require('../')

module.exports = createStore({
  storeName: 'clicks',
  initialState: { count: 0 },
  events: {
    increment: ({ data, store, emitter }) => {
      store.count += data
      emitter.emit('render')
    }
  }
})
