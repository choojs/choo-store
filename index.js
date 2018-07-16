var globals = [
  'DOMContentLoaded',
  'DOMTitleChange',
  'navigate',
  'popState',
  'pushState',
  'render',
  'replaceState'
]

function createStore (opts) {
  var { storeName, initialState, events } = opts || {}

  if (!storeName) throw new Error('storeName required')
  if (!initialState) throw new Error('initialState required')
  if (!events) throw new Error('events required')

  var props = Object.assign({}, opts, { actions: {} })

  // API ref: https://github.com/choojs/choo#appusecallbackstate-emitter-app
  function store (state, emitter, app) {
    state[storeName] = deepClone(initialState)
    state.events[storeName] = {}

    // add reset event if undefined
    if (!props.events.reset) {
      props.events.reset = ({ data, store, emitter }) => {
        var { render } = data || {}
        state[storeName] = deepClone(initialState)
        if (render) emitter.emit('render')
      }
    }

    Object.keys(events).forEach(event => {
      var eventName = globals.includes(event) ? event : `${storeName}:${event}`

      // attach events to emitter
      emitter.on(eventName, data => {
        events[event]({ data, store: state[storeName], emitter, state, app })
      })

      // don't create namespaced event hooks for global events
      if (!globals.includes(event)) {
        // add event names to state.events
        state.events[storeName][event] = eventName

        // add action method
        props.actions[event] = data => emitter.emit(eventName, data)
      }
    })
  }

  Object.assign(store, props)

  return store
}

function deepClone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

module.exports = createStore
