function createStore (opts) {
  var { storeName, initialState, events } = opts || {}

  if (!storeName) throw new Error('storeName required')
  if (!initialState) throw new Error('initialState required')
  if (!events) throw new Error('events required')

  // API ref: https://github.com/choojs/choo#appusecallbackstate-emitter-app
  function store (state, emitter, app) {
    state[storeName] = Object.assign({}, initialState)
    state.events[storeName] = {}

    Object.keys(events).forEach(event => {
      var eventName = `${storeName}:${event}`

      // attach events to emitter
      emitter.on(eventName, data => {
        events[event]({ data, store: state[storeName], emitter, state, app })
      })

      // add event names to state.events
      state.events[storeName][event] = eventName
    })

    // add reset event to emitter
    emitter.on(`${storeName}:reset`, data => {
      data = data || {}
      state[storeName] = Object.assign({}, initialState)
      if (data.render) emitter.emit('render')
    })

    // add reset event to state.events
    state.events[storeName].reset = `${storeName}:reset`
  }

  Object.assign(store, opts)

  return store
}

module.exports = createStore
