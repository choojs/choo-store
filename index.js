function createStore (opts) {
  var { namespace, initialState, events } = opts || {}

  if (!opts.namespace) throw new Error('namespace required')
  if (!opts.initialState) throw new Error('initialState required')
  if (!opts.events) throw new Error('events required')

  function store (state, emitter) {
    state[namespace] = Object.assign({}, initialState)
    state.events[namespace] = {}

    Object.keys(events).forEach(event => {
      var eventName = `${namespace}:${event}`

      // attach events to emitter
      emitter.on(eventName, action(opts => {
        events[event](opts, state[namespace], emitter, state)
      }))

      // add event names to state.events
      state.events[namespace][event] = eventName
    })

    // add reset event to emitter
    emitter.on(`${namespace}:reset`, action(opts => {
      state[namespace] = Object.assign({}, initialState)
    }))

    // add reset event to state.events
    state.events[namespace].reset = `${namespace}:reset`

    function action (fn) {
      return opts => {
        opts = opts || {}
        fn(opts)
        if (opts.render) emitter.emit('render')
      }
    }
  }

  Object.assign(store, opts)

  return store
}

module.exports = createStore
