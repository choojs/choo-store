class Store {
  constructor (opts) {
    opts = opts || {}
    if (!opts.namespace) throw new Error('namespace required')
    if (!opts.initialState) throw new Error('initialState required')
    if (!opts.events) throw new Error('events required')
    Object.assign(this, opts)
    this.connect = this.connect.bind(this)
  }

  connect (state, emitter) {
    const { namespace, initialState, events } = this

    state[namespace] = initialState

    Object.keys(events).forEach(event => {
      emitter.on(`${namespace}:${event}`, action(opts => {
        events[event](opts, state[namespace], emitter, state)
      }))
    })

    emitter.on(`${namespace}:reset`, action(opts => {
      state[namespace] = initialState
    }))

    function action (fn) {
      return opts => {
        opts = opts || {}
        fn(opts)
        if (opts.render) emitter.emit('render')
      }
    }
  }
}

module.exports = Store
