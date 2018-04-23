function createStore (opts) {
  var { namespace, initialState, events } = opts || {}

  if (!namespace) throw new Error('namespace required')
  if (!initialState) throw new Error('initialState required')
  if (!events) throw new Error('events required')

  function store (state, emitter) {
    state[namespace] = Object.assign({}, initialState)
    state.events[namespace] = {}

    Object.keys(events).forEach(event => {
      var eventName = `${namespace}:${event}`

      // attach events to emitter
      emitter.on(eventName, opts => {
        events[event](opts, state[namespace], emitter, state)
      })

      // add event names to state.events
      state.events[namespace][event] = eventName
    })

    // add reset event to emitter
    emitter.on(`${namespace}:reset`, opts => {
      opts = opts || {}
      state[namespace] = Object.assign({}, initialState)
      if (opts.render) emitter.emit('render')
    })

    // add reset event to state.events
    state.events[namespace].reset = `${namespace}:reset`
  }

  Object.assign(store, opts)

  return store
}

module.exports = createStore
